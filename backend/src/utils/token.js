const jwt = require('jsonwebtoken');

/**
 * Generate both access and refresh tokens for a user
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Object} { accessToken, refreshToken }
 */
function generateTokens(userId) {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const refreshToken = jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
}

module.exports = { generateTokens };
