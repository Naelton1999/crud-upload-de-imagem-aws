const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  region: 'sa-east-1',
  credentials: {
    accessKeyId: 'AKIAZOFDIGJ6ZILJPF7W',
    secretAccessKey: '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',
  },
});

module.exports = s3;