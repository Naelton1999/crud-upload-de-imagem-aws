const s3 = require("../aws/aws");

const deleteImage = async (filename) => {
    try {
      const params = {
        Bucket: 'teste1999',
        Key: filename,
      };
  
      await s3.deleteObject(params).promise();
    } catch (error) {
      throw error;
    }
  };
  
  module.exports = {
    deleteImage,
  };