const S3 = require("aws-sdk/clients/s3");
const { FILE } = require("dns");

const s3 = new S3();

exports.handler = async (event, context) => {
  const params = event.queryStringParameters;
  const { FILES_BUCKET } = process.env;
  const listObjectsRes = await s3
    .listObjects({
      Bucket: FILES_BUCKET,
      ...(params && params.username ? { Prefix: params.username } : {}),
    })
    .promise();
  return {
    statusCode: 200,
    body: JSON.stringify({
      items: listObjectsRes.Contents.map((it) => it.Key),
    }),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};

const errorRes = (code, message) => {
  return {
    statusCode: code,
    body: JSON.stringify({ code, message }),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};

exports.readFileHandler = async (event, context) => {
  const params = event.queryStringParameters;
  if (!params.fileKey) {
    return errorRes(400, "fileKey is required");
  }
  const { FILES_BUCKET } = process.env;
  return {
    statusCode: 200,
    body: JSON.stringify({
      url: await s3.getSignedUrlPromise("getObject", {
        Bucket: FILES_BUCKET,
        Key: params.fileKey,
      }),
    }),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
