/**
 * News repository — SQLite queries for news & blog articles
 */
const { db, parseJson, newId } = require('./index');

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const newsRepo = {
  create({ title, content, excerpt, author, authorId, category = 'news', image, images = [], tags = [], status = 'draft' }) {
    const id = newId();
    const slug = slugify(title) + '-' + id.slice(0, 6);
    const publishedAt = status === 'published' ? new Date().toISOString() : null;
    db.prepare(`
      INSERT INTO news (id, title, slug, content, excerpt, author, authorId, category, image, images, tags, status, publishedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, slug, content, excerpt || null, author, authorId || null, category,
      image || null, JSON.stringify(images), JSON.stringify(tags), status, publishedAt);
    return this.findById(id);
  },

  update(id, data) {
    const current = this.findById(id);
    if (!current) return null;
    const publishedAt = data.status === 'published' && !current.publishedAt
      ? new Date().toISOString() : current.publishedAt;
    db.prepare(`
      UPDATE news SET title = ?, slug = ?, content = ?, excerpt = ?, author = ?, category = ?,
      image = ?, images = ?, tags = ?, status = ?, publishedAt = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.title || current.title,
      data.slug || current.slug,
      data.content || current.content,
      data.excerpt !== undefined ? data.excerpt : current.excerpt,
      data.author || current.author,
      data.category || current.category,
      data.image !== undefined ? data.image : current.image,
      JSON.stringify(data.images || parseJson(current.images)),
      JSON.stringify(data.tags || parseJson(current.tags)),
      data.status || current.status,
      publishedAt,
      id
    );
    return this.findById(id);
  },

  findById(id) {
    const row = db.prepare('SELECT * FROM news WHERE id = ?').get(id);
    return this._format(row);
  },

  findBySlug(slug) {
    const row = db.prepare('SELECT * FROM news WHERE slug = ?').get(slug);
    return this._format(row);
  },

  _format(row) {
    if (!row) return null;
    return {
      ...row,
      images: parseJson(row.images),
      tags: parseJson(row.tags),
    };
  },

  list({ status, category, search, limit = 12, offset = 0 } = {}) {
    let where = '1=1';
    const params = [];
    if (status) { where += ' AND status = ?'; params.push(status); }
    if (category) { where += ' AND category = ?'; params.push(category); }
    if (search) { where += ' AND (title LIKE ? OR content LIKE ? OR tags LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

    const rows = db.prepare(`SELECT * FROM news WHERE ${where} ORDER BY COALESCE(publishedAt, createdAt) DESC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset);
    const total = db.prepare(`SELECT COUNT(*) as c FROM news WHERE ${where}`).get(...params).c;

    return {
      news: rows.map(r => this._format(r)),
      total,
    };
  },

  incrementViews(id) {
    db.prepare('UPDATE news SET views = views + 1 WHERE id = ?').run(id);
  },

  delete(id) {
    return db.prepare('DELETE FROM news WHERE id = ?').run(id).changes > 0;
  },
};

module.exports = newsRepo;
