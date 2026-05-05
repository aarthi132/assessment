const Document = require('../models/Document');

// @desc    Create a new document
// @route   POST /api/documents
// @access  Public
const createDocument = async (req, res) => {
  try {
    const { title, content, owner, sharedWith } = req.body;

    const document = new Document({
      title,
      content,
      owner,
      sharedWith
    });

    const createdDocument = await document.save();
    res.status(201).json(createdDocument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all documents
// @route   GET /api/documents
// @access  Public
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get document by ID
// @route   GET /api/documents/:id
// @access  Public
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (document) {
      res.json(document);
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Public
const updateDocument = async (req, res) => {
  try {
    const { title, content, sharedWith } = req.body;

    const document = await Document.findById(req.params.id);

    if (document) {
      document.title = title !== undefined ? title : document.title;
      document.content = content !== undefined ? content : document.content;
      
      if (sharedWith) {
        document.sharedWith = sharedWith;
      }

      const updatedDocument = await document.save();
      res.json(updatedDocument);
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload document
// @route   POST /api/documents/upload
// @access  Public
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const title = req.file.originalname.replace(/\.txt$/, '');
    const content = req.file.buffer.toString('utf-8');
    const owner = req.body.owner;

    const document = new Document({
      title,
      content,
      owner,
    });

    const createdDocument = await document.save();
    res.status(201).json(createdDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user documents
// @route   GET /api/documents/user/:email
// @access  Public
const getUserDocuments = async (req, res) => {
  try {
    const { email } = req.params;
    const myDocuments = await Document.find({ owner: email }).sort({ updatedAt: -1 });
    const sharedWithMe = await Document.find({ sharedWith: email }).sort({ updatedAt: -1 });
    
    res.json({ myDocuments, sharedWithMe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Share document
// @route   POST /api/documents/:id/share
// @access  Public
const shareDocument = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    if (!document.sharedWith.includes(email) && document.owner !== email) {
      document.sharedWith.push(email);
      await document.save();
    }
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  uploadDocument,
  getUserDocuments,
  shareDocument
};
