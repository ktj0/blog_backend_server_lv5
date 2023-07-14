const express = require('express');

const authmiddleware = require('../middlewares/auth-middleware');
const { sequelize } = require('../models');

const { User, Post, Like } = sequelize.models;

const router = express.Router();

//게시글 좋아요
router.patch('/posts/:postId/like', authmiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user;

    const user = await User.findOne({ where: { id: userId } });
    const post = await Post.findOne({ where: { id: postId } });

    if (!post) {
      return res
        .status(404)
        .json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }

    //user와 post 테이블이 n:m관계이기 때문에 like라는 테이블에 각 id값을 insert
    const isExistLikedUser = await user.addLiked(post, { through: Like });

    if (!isExistLikedUser[0]) {
      //like테이블에 해당 값이 존재하면 반환값은 배열로 감싸진 0이다. 따라서 이미 좋아요를 눌렀다면 0이 반환이 된다.
      await Post.update({ likes: post.likes - 1 }, { where: { id: postId } });

      await user.removeLiked(post, { through: Like });

      return res
        .status(200)
        .json({ message: '게시글의 좋아요를 취소하였습니다.' });
    }

    await Post.update({ likes: post.likes + 1 }, { where: { id: postId } });

    return res
      .status(200)
      .json({ message: '게시글의 좋아요를 등록하였습니다.' });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      errorMessage: '예기치 못한 오류로 게시글 좋아요에 실패하였습니다.',
    });
  }
});

//좋아요한 게시글 조회
router.get('/post/like', authmiddleware, async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findOne({ where: { id: userId } });

    const likedPost = await user.getLiked({
      attributes: ['id', 'userId', 'title', 'likes', 'createdAt', 'updatedAt'],
      include: [
        {
          where: { id: userId },
          model: User,
          as: 'liker',
          attributes: ['nickname'],
          through: {
            attributes: [],
          },
        },
      ],
      joinTableAttributes: [],
      order: [
        ['likes', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });

    return res.status(200).json({ posts: likedPost });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      errorMessage: '예기치 못한 오류로 좋아요 게시글 조회에 실패하였습니다',
    });
  }
});

module.exports = router;
