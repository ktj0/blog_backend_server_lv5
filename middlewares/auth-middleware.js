const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { secretKey } = require('../config/secret_key.json');

//사용자 인증 미들웨어
module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;

    if (!authorization) {
      return res
        .status(403)
        .json({ errorMessage: '로그인이 필요한 기능입니다.' });
    }

    const [tokenType, token] = (authorization ?? '').split(' ');

    if (tokenType !== 'Bearer') {
      return res
        .status(403)
        .json({ errorMessage: '토큰 타입이 일치하지 않습니다.' });
    }

    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;

    req.user = userId;

    next();
  } catch (error) {
    console.error(error);

    res.clearCookie('authorization');

    return res
      .status(403)
      .json({ errorMessage: '전달된 쿠키에서 오류가 발생하였습니다.' });
  }
};
