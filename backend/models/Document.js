const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: 'Untitled Document'
    },
    content: {
      type: String,
      default: ''
    },
    owner: {
      type: String,
      required: false
    },
    sharedWith: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true
  }
);

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
