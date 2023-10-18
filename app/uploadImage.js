const { Readable } = require('stream');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const s3 = require('../aws/aws')
const upload = require('../multer/multer')

const uploadToS3 = async (file) => {
  const { originalname, buffer } = file;
  const stream = Readable.from(buffer);
  const key = `${uuidv4()}${path.extname(originalname)}`;

  const params = {
    Bucket: 'teste1999',
    Key: key,
    Body: stream,
  };

  await s3.upload(params).promise();

  return `https://teste1999.s3.sa-east-1.amazonaws.com/${key}`;
};

module.exports = {
  upload,
  uploadToS3,
};




