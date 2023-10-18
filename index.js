const express = require('express');
const uploadToS3 = require('./app/uploadImage');
const upload = require('./multer/multer');
const { getImageSignedUrl } = require('./app/filterImage');
const { listImages } = require('./app/listImages');
const { deleteImage } = require('./app/deleteImage');

const server = express();
server.use(express.json());

server.post('/file', upload.single('imagem'), async (req, res) => {
  try {
    const url = await uploadToS3(req.file);
    res.send('Upload feito com sucesso. URL: ' + url);
  } catch (error) {
    console.error('Erro ao fazer o upload para o S3:', error);
    res.status(500).send('Erro ao fazer o upload para o S3');
  }
});

server.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const signedUrl = await getImageSignedUrl(filename);

    res.redirect(signedUrl);
  } catch (error) {
    console.error('Erro ao obter a imagem do S3:', error);
    res.status(500).send('Erro ao obter a imagem do S3');
  }
});

server.get('/', async (req, res) => {
  try {
    const imageKeys = await listImages();
    res.json({ images: imageKeys });
  } catch (error) {
    console.error('Erro ao listar imagens no S3:', error);
    res.status(500).send('Erro ao listar imagens no S3');
  }
});

server.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    await deleteImage(filename);
    res.json({ message: 'Imagem excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir a imagem do S3:', error);
    res.status(500).send('Erro ao excluir a imagem do S3');
  }
});

server.listen(3332, () => console.log('Servidor rodando na porta 3332'));