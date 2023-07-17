const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware');

const PostController = require('../controllers/posts.controller');
const postController = new PostController();

//게시글 작성
router.post('/posts', authMiddleware, postController.createPost);

//게시글 전체 조회
router.get('/posts', postController.findAllPosts);

//게시글 상세 조회
router.get('/posts/:postId', postController.findPost);

// //게시글 수정
router.patch('/posts/:postId', authMiddleware, postController.updatePost);

// //게시글 삭제
router.delete('/posts/:postId', authMiddleware, postController.deletePost);

module.exports = router;
