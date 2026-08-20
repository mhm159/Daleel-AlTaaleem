const newsRepo = require('../db/newsRepo');

exports.list = async (req, res) => {
  try {
    const { category, page = 1, limit = 12, search } = req.query;
    const { news, total } = newsRepo.list({ status: 'published', category, search, limit: parseInt(limit), offset: (page - 1) * limit });
    news.forEach(n => newsRepo.incrementViews(n.id));
    res.json({
      success: true,
      news: news.map(format),
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching news' });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const news = newsRepo.findBySlug(req.params.slug);
    if (!news || news.status !== 'published') return res.status(404).json({ success: false, message: 'News not found' });
    newsRepo.incrementViews(news.id);
    res.json({ success: true, news });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching news' });
  }
};

exports.adminList = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const { news, total } = newsRepo.list({ status, limit: parseInt(limit), offset: (page - 1) * limit });
    res.json({
      success: true, news,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching news' });
  }
};

exports.createOrUpdate = async (req, res) => {
  try {
    const { id, title, content, excerpt, author, category, image, images, tags, status } = req.body;
    let news;
    if (id) news = newsRepo.update(id, req.body);
    else news = newsRepo.create({ title, content, excerpt, author, authorId: req.user.id, category, image, images, tags, status });
    res.status(id ? 200 : 201).json({ success: true, news });
  } catch (err) {
    console.error('News save error:', err);
    res.status(500).json({ success: false, message: 'Error saving news' });
  }
};

exports.delete = async (req, res) => {
  try {
    newsRepo.delete(req.params.id);
    res.json({ success: true, message: 'News deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting news' });
  }
};

function format(n) {
  return {
    id: n.id, title: n.title, slug: n.slug,
    excerpt: n.excerpt || n.content.substring(0, 200) + '...',
    content: n.content, author: n.author, category: n.category,
    image: n.image, images: n.images, tags: n.tags,
    publishedAt: n.publishedAt, views: n.views, createdAt: n.createdAt,
  };
}
