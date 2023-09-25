const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const { Readable } = require('stream');

const server = express();
server.use(express.json());

const s3 = new AWS.S3({
  region: 'sa-east-1', 
  credentials: {
    accessKeyId: 'AKIAZOFDIGJ6WXTBJEXJ',
    secretAccessKey: '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',
  },
});

const upload = multer({
  storage: multer.memoryStorage(),
});

server.post('/file', upload.single('imagem'), async (req, res) => {
  try {
    const { originalname } = req.file;
    const stream = Readable.from(req.file.buffer);
    const key = `${uuidv4()}${path.extname(originalname)}`;

    const params = {
      Bucket: 'crud-multer', 
      Key: key,
      Body: stream,
    };
    await s3.upload(params).promise();

    res.send('Upload feito com sucesso. URL: ' + `https://crud-multer.s3.sa-east-1.amazonaws.com/${key}`);
  } catch (error) {
    console.error('Erro ao fazer o upload para o S3:', error);
    res.status(500).send('Erro ao fazer o upload para o S3');
  }
});

server.get('/images/:filename', (req, res) => {
  try {
    const { filename } = req.params;

    const params = {
      Bucket: 'crud-multer', 
      Key: filename,
    };

    const signedUrl = s3.getSignedUrl('getObject', params);

    res.redirect(signedUrl);
  } catch (error) {
    console.error('Erro ao obter a imagem do S3:', error);
    res.status(500).send('Erro ao obter a imagem do S3');
  }
});

server.put('/file/:filename', upload.single('imagem'), async (req, res) => {
  try {
    const { filename } = req.params;
    const { originalname } = req.file;
    const stream = Readable.from(req.file.buffer);

    const params = {
      Bucket: 'crud-multer',
      Key: filename,
      Body: stream,
    };

    await s3.putObject(params).promise();

    res.send('Imagem atualizada com sucesso. URL: ' + `https://crud-multer.s3.sa-east-1.amazonaws.com/${filename}`);
  } catch (error) {
    console.error('Erro ao atualizar a imagem no S3:', error);
    res.status(500).send('Erro ao atualizar a imagem no S3');
  }
});

server.delete('/file/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    const params = {
      Bucket: 'crud-multer', 
      Key: filename,
    };

    await s3.deleteObject(params).promise();

    res.send('Imagem excluída com sucesso.');
  } catch (error) {
    console.error('Erro ao excluir a imagem no S3:', error);
    res.status(500).send('Erro ao excluir a imagem no S3');
  }
});

server.listen(3332, () => console.log('Servidor rodando na porta 3332'));