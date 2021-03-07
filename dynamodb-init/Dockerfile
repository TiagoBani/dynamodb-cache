FROM alpine:3.13.2

RUN apk add --no-cache \
        python3 \
        py3-pip \
    && pip3 install --upgrade pip \
    && pip3 install \
        awscli \
    && rm -rf /var/cache/apk/*

ADD ./aws /root/.aws

ENTRYPOINT [ "aws", "dynamodb", "--endpoint-url", "http://dynamodb:8000", "--region", "us-east-1", "create-table", "--table-name", "patients", "--attribute-definitions", "AttributeName=id,AttributeType=N", "--key-schema", "AttributeName=id,KeyType=HASH", "--provisioned-throughput", "ReadCapacityUnits=5,WriteCapacityUnits=5" ] 
    
    # aws dynamodb --endpoint-url http://localhost:8000 --region=us-east-1 \
    # create-table \
    # --table-name patients \
    # --attribute-definitions AttributeName=id,AttributeType=N \
    # --key-schema AttributeName=id,KeyType=HASH \
    # --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
