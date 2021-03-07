const AWS = require('aws-sdk')

const patientRepository = require('./repository/patient')
const examRepository = require('./repository/exam')
const medicineRepository = require('./repository/medicine')

AWS.config.update({region: process.env.AWS_REGION})

const configDynamoClient = process.env.AWS_DYNAMODB_ENDPOINT ? { endpoint: `http://${process.env.AWS_DYNAMODB_ENDPOINT}` }: {}

const dynamoClient = new AWS.DynamoDB.DocumentClient(configDynamoClient)

const dynamoPatientsTable = 'patients'

const now = _ => Math.round(new Date().getTime() / 1000)

const addPatientToCache = patient => {
  const params = {
    TableName: dynamoPatientsTable,
    Item: {...patient, expiresAt: now() + 3600 }
  }
  return dynamoClient.put(params).promise()
}

const getPatientToCache = patientId => {
  const params = {
    TableName: dynamoPatientsTable,
    Key: { id: Number(patientId) },
    KeyConditionExpression: 'expiresAt >= :expiresAt',
    ExpressionAttributeValues: {
      ':expiresAt': now()
    }
  }
  return dynamoClient.get(params).promise()
    .then(result => result.Item)
    .catch(e => {
      console.error(e)
      return
    })
}

const getPatientInfo = async patientId => {
    const patientDataCache = await getPatientToCache(patientId)

    if(patientDataCache) {
      console.log(`result of cache patients ${patientId}`)
      return patientDataCache
    }

    const patient = await patientRepository.findById(patientId)
    const exams = await examRepository.findAllByPatientId(patientId)
    const medicines = await medicineRepository.findAllByPatientId(patientId)

    const patientData = {
        ...patient.dataValues,
        createdAt: patient.createdAt.toISOString(),
        updatedAt: patient.updatedAt.toISOString(),
        exams: exams.map(exam => ({
                name: exam.name,
                result: exam.result,
                date: exam.date.toISOString()
            })
        ),
        medicines: medicines.map(medicine =>({
                name: medicine.name,
                date: medicine.date.toISOString()
            })
        ),
      }

    await addPatientToCache(patientData)

    console.log(`result of database patients ${patientId}`)
    return patientData
}

module.exports = {
    getPatientInfo
}
