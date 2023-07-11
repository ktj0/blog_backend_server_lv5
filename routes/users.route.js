const express = require("express");
const jwt = require("jsonwebtoken");

const { User } = require("../models");
const { secretKey } = require("../config/secret_key.json");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const pattern = /^[a-zA-Z0-9]+$/;

    const { nickname, password, confirm } = req.body;

    if (!nickname || !password || !confirm) {
      return res
        .status(412)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    } else if (nickname.length < 3 || !pattern.test(nickname)) {
      return res
        .status(412)
        .json({ errorMessage: "닉네임 형식이 올바르지 않습니다." });
    } else if (password.length < 4) {
      return res
        .status(412)
        .json({ errorMessage: "비밀번호 형식이 올바르지 않습니다." });
    } else if (password.includes(nickname)) {
      return res
        .status(412)
        .json({ errorMessage: "비밀번호에 닉네임이 포함되어 있습니다." });
    } else if (password !== confirm) {
      return res
        .status(412)
        .json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    const isExistUser = await User.findOne({ where: { nickname } });

    if (isExistUser) {
      return res
        .status(412)
        .json({ errorMessage: "이미 존재하는 닉네임입니다." });
    }

    await User.create({ nickname, password });

    return res.status(200).json({ message: "회원가입이 완료되었습니다." });
  } catch (error) {
    console.error(error);

    return res
      .status(400)
      .json({ errorMessage: "예기치 못한 오류로 회원가입이 실패하였습니다." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { nickname, password } = req.body;

    const user = await User.findOne({ where: { nickname, password } });

    console.log(user.userId);

    if (!user) {
      return res
        .status(412)
        .json({ errorMessage: "닉네임 또는 비밀번호를 확인해주세요" });
    }

    const token = jwt.sign({ userId: user.userId }, secretKey);

    res.cookie("authorization", `Bearer ${token}`);

    return res.status(200).json({ message: "로그인 성공" });
  } catch (error) {
    console.error(error);

    return res
      .status(400)
      .json({ errorMessage: "예기치 못한 오류로 로그인이 실패하였습니다." });
  }
});

module.exports = router;
