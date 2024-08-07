import jwt from 'jsonwebtoken';

const maxAge = 3 * 24 * 60 * 60;
export const createToken = (id) => {
  return jwt.sign({ id }, 'jwt-secret', {
    expiresIn: maxAge,
  });
};

export const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'jwt-secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.status(500).json({
          success: false,
          message: 'Internal server error, Try again',
        });
      } else {
        next();
      }
    });
  } else {
    res
      .status(500)
      .json({ success: false, message: 'Internal server error, Try again' });
  }
};

export const getUserData = async (accessToken) => {
  try {
    const response = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to get user data');
  }
};
