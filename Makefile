start-client:
	cd client && yarn start
cf-init:
	aws cloudformation create-stack --stack-name practice-file-upload-template --template-body file://`pwd`/cf/practice-file-upload.yaml