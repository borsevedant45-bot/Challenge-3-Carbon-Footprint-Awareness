import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_access_secret_key_change_me_in_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key_change_me_in_production';

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Exclude password hash from response
  const { passwordHash, ...userData } = user;

  // Access Token Cookie (15 mins)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  // Refresh Token Cookie (7 days)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return res.status(statusCode).json({
    success: true,
    user: userData,
    accessToken // Also send in body so front-end has it for Axios header if preferred
  });
};
