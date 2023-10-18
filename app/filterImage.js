const s3 = require('../aws/aws');

const getImageSignedUrl = async (filename) => {
  try {
    const params = {
      Bucket: 'teste1999',
      Key: filename,
    };

    const signedUrl = s3.getSignedUrl('getObject', params);

    return signedUrl;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getImageSignedUrl,
};