start:
	cd client && nohup yarn start &
	cd lambda && nohup sam local start-api &
	@exit
cf-init:
	aws cloudformation create-stack --stack-name practice-file-upload-template --template-body file://`pwd`/lambda/template.yaml --capabilities CAPABILITY_AUTO_EXPAND




# debug lambda
# sam local invoke --debug-port 5858

# lsof -i tcp:3001
# kill -9 3001