const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  uploadDocument,
  getUserDocuments,
  shareDocument
} = require('../controllers/documentController');

router.route('/').post(createDocument).get(getDocuments);
router.post('/upload', upload.single('file'), uploadDocument);
router.get('/user/:email', getUserDocuments);
router.route('/:id').get(getDocumentById).put(updateDocument);
router.post('/:id/share', shareDocument);

module.exports = router;
