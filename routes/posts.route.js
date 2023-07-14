const express = require('express');

const authMiddleware = require('../middlewares/auth-middleware');
const { Post, User } = require('../models');

const router = express.Router();

//게시글 작성
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const userId = req.user;
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(412)
        .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }

    await Post.create({ userId, title, content });

    return res.status(200).json({ message: '게시글 작성에 성공하였습니다.' });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      errorMessage: '예기치 못한 오류로 게시글 작성에 실패하였습니다.',
    });
  }
});

//게시글 전체 조회
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ['id', 'userId', 'title', 'likes', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['nickname'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ posts: posts });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      errorMessage: '예기치 못한 오류로 게시글 전체 조회에 실패하였습니다.',
    });
  }
});

//게시글 상세 조회
router.get('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({
      where: { id: postId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['nickname'],
        },
      ],
    });

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      errorMessage: '예기치 못한 오류로 게시글 상세 조회에 실패하였습니다.',
    });
  }
});

//게시글 수정
router.patch('/posts/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user;
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(412)
        .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }

    const post = await Post.findOne({ where: { id: postId } });

    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ errorMessage: '게시글 수정 권한이 존재하지 않습니다.' });
    }

    await Post.update({ title, content }, { where: { id: postId } });

    return res.status(200).json({ message: '게시글을 수정하였습니다.' });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      errorMessage: '예기치 못한 오류로 게시글 수정에 실패하였습니다.',
    });
  }
});

//게시글 삭제
router.delete('/posts/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user;

    const post = await Post.findOne({ where: { id: postId } });

    if (!post) {
      return res
        .status(404)
        .json({ errorMessage: '게시글이 존재하지 않습니다.' });
    } else if (post.userId !== userId) {
      return res
        .status(403)
        .json({ errorMessage: '게시글 삭제 권한이 존재하지 않습니다.' });
    }

    await Post.destroy({
      where: { id: postId },
    });

    return res.status(200).json({ message: '게시글을 삭제하였습니다.' });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      errorMessage: '예기치 못한 오류로 게시글 삭제에 실패하였습니다.',
    });
  }
});

module.exports = router;
