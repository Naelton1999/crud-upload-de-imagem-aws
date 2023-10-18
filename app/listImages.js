const s3 = require("../aws/aws");

const listImages = async () => {
    try {
      const params = {
        Bucket: 'teste1999',
      };
  
      const data = await s3.listObjectsV2(params).promise();
      return data.Contents.map((object) => object.Key);
    } catch (error) {
      throw error;
    }
  };
  
  module.exports = {
    listImages,
  };