const S3 = require("aws-sdk/clients/s3");
const s3 = new S3();
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, context) => {
  const reqBody = JSON.parse(event.body);
  const { FILES_BUCKET } = process.env;
  if (!reqBody.username || !reqBody.files.length) {
    return errorResponse(400, "Username & files is required");
  }
  try {
    const bucketList = await s3.listBuckets().promise();
    if (!bucketList.Buckets.find((b) => b.Name === FILES_BUCKET)) {
      const newS3BucketRequest = await s3
        .createBucket({ Bucket: FILES_BUCKET })
        .promise();
      if (newS3BucketRequest.$response.error) {
        return errorResponse(400, `${newS3BucketRequest.$response.error}`);
      }
    }
    const resBody = await Promise.all(
      reqBody.files.map(async (f) => {
        const putRequest = {
          Bucket: FILES_BUCKET,
          Key: `${reqBody.username}/${f.name}`,
          ContentType: f.type,
        };
        const signedUrl = await s3.getSignedUrlPromise("putObject", putRequest);
        return {
          name: f.name,
          url: signedUrl,
        };
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ files: resBody }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    return errorResponse(400, error);
  }
};

const errorResponse = (code, message) => {
  return {
    statusCode: code,
    body: JSON.stringify({ message }),
  };
};
