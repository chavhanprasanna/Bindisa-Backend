const mongoose = require('mongoose');

const knowledgeArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  video_url: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KnowledgeArticle', knowledgeArticleSchema); 