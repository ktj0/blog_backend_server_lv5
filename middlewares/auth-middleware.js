const jwt = require("jsonwebtoken");

const { User } = require("../models");
const { secretKey } = require("../config/secret_key.json");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    const [tokenType, token] = (authorization ?? "").split(" ");

    if (tokenType !== "Bearer") {
      return res
        .status(400)
        .json({ errorMessage: "토큰 타입이 일치하지 않습니다." });
    }

    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;

    const user = await User.findOne({ whrer: { userId } });

    if (!user) {
      res.clearCookie("authorization");

      return res
        .status(400)
        .json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
    }

    res.locals.user = user;

    next();
  } catch (error) {
    console.error(error);

    res.clearCookie("authorization");

    return res
      .status(400)
      .json({ errorMessage: "로그인이 필요한 기능입니다." });
  }
};
