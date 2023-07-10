const express = require("express");

const authMiddleware = require("../middlewares/auth-middleware");
const { Post, User } = require("../models");

const router = express.Router();

router.post("/posts", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { title, content } = req.body;

    await Post.create({ userId, title, content });

    return res.status(200).json({ message: "게시글 작성에 성공하였습니다." });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      errorMessage: "예기치 못한 오류로 게시글 작성에 실패하였습니다.",
    });
  }
});

router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ["postId", "userId", "title", "createdAt", "updatedAt"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nickname"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ posts: posts });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      errorMessage: "예기치 못한 오류로 게시글 전체 조회에 실패하였습니다.",
    });
  }
});

router.get("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({
      where: { postId },
    });

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      errorMessage: "예기치 못한 오류로 게시글 상세 조회에 실패하였습니다.",
    });
  }
});

router.patch("/posts/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const { title, content } = req.body;

    const post = await Post.findOne({ where: { postId } });

    if (post.userId !== userId) {
      return res
        .status(400)
        .json({ errorMessage: "게시글 수정 권한이 존재하지 않습니다." });
    }

    await Post.update({ title, content }, { where: { postId, userId } });

    return res.status(200).json({ message: "게시글을 수정하였습니다." });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      errorMessage: "예기치 못한 오류로 게시글 수정에 실패하였습니다.",
    });
  }
});

router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    const post = await Post.findOne({ where: { postId } });

    if (post.userId !== userId) {
      return res
        .status(400)
        .json({ errorMessage: "게시글 삭제 권한이 존재하지 않습니다." });
    }

    await Post.destroy({
      where: { postId, userId },
    });

    return res.status(200).json({ message: "게시글을 삭제하였습니다." });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      errorMessage: "예기치 못한 오류로 게시글 삭제에 실패하였습니다.",
    });
  }
});

module.exports = router;