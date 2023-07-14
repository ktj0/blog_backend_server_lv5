const express = require('express');

const { Post, Comment, User } = require('../models');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();

//댓글 작성
router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user;
    const { comment } = req.body;

    if (!comment) {
      return res.status(412).json({
        errormMessage: '데이터 형식이 올바르지 않습니다.',
      });
    }

    const post = await Post.findOne({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({
        errormMessage: '게시글이 존재하지 않습니다.',
      });
    }

    await Comment.create({ postId, userId, comment });

    return res.status(200).json({ message: '댓글을 작성하였습니다.' });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      errormMessage: '예기치 못한 오류로 댓글 작성에 실패하였습니다.',
    });
  }
});

//댓글 조회
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({
        errormMessage: '게시글이 존재하지 않습니다.',
      });
    }

    const comments = await Comment.findAll({
      attributes: ['id', 'userId', 'comment', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['nickname'],
        },
      ],
      where: { postId },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ comments });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      errormMessage: '예기치 못한 오류로 댓글 조회에 실패하였습니다.',
    });
  }
});

//댓글 수정
router.patch(
  '/posts/:postId/comments/:commentId',
  authMiddleware,
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const userId = req.user;
      const { comment } = req.body;

      if (!comment) {
        return res.status(412).json({
          errormMessage: '데이터 형식이 올바르지 않습니다.',
        });
      }

      const post = await Post.findOne({ where: { id: postId } });
      const commentDb = await Comment.findOne({
        where: { id: commentId, postId },
      });

      if (!post) {
        return res.status(404).json({
          errormMessage: '게시글이 존재하지 않습니다.',
        });
      } else if (!commentDb) {
        return res.status(404).json({
          errormMessage: '댓글이 존재하지 않습니다.',
        });
      } else if (commentDb.userId !== userId) {
        return res.status(403).json({
          errormMessage: '댓글의 수정 권한이 존재하지 않습니다.',
        });
      }

      await Comment.update({ comment }, { where: { id: commentId } });

      return res.status(200).json({ message: '댓글을 수정하였습니다.' });
    } catch (error) {
      console.error(error);

      return res.status(400).json({
        errormMessage: '예기치 못한 오류로 댓글 수정에 실패하였습니다.',
      });
    }
  }
);

//댓글 삭제
router.delete(
  '/posts/:postId/comments/:commentId',
  authMiddleware,
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const userId = req.user;

      const post = await Post.findOne({ where: { id: postId } });
      const comment = await Comment.findOne({
        where: { id: commentId, postId },
      });

      if (!post) {
        return res
          .status(404)
          .json({ errormMessage: '게시글이 존재하지 않습니다.' });
      } else if (!comment) {
        return res
          .status(404)
          .json({ errormMessage: '댓글이 존재하지 않습니다.' });
      } else if (comment.userId !== userId) {
        return res
          .status(403)
          .json({ errormMessage: '댓글의 삭제 권한이 존재하지 않습니다.' });
      }

      await Comment.destroy({ where: { id: commentId } });

      return res.status(200).json({ message: '댓글을 삭제하였습니다.' });
    } catch (error) {
      console.error(error);

      return res.status(400).json({
        errormMessage: '예기치 못한 오류로 댓글 삭제에 실패하였습니다.',
      });
    }
  }
);

module.exports = router;
