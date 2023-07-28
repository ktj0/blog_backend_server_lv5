import PostService from '../services/posts.service.js';

class PostController {
  postService = new PostService();

  //게시글 생성
  createPost = async (req, res) => {
    try {
      const userId = req.user;
      const { title, content } = req.body;

      if (!title || !content) {
        return res
          .status(412)
          .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
      }

      await this.postService.createPost(userId, title, content);

      return res.status(200).json({ message: '게시글 작성에 성공하였습니다.' });
    } catch (error) {
      console.error(error);

      return res.status(400).json({
        errorMessage: '게시글 작성에 실패하였습니다.',
      });
    }
  };

  //게시글 전체 조회
  findAllPosts = async (req, res) => {
    try {
      const posts = await this.postService.findAllPosts();

      return res.status(200).json({ posts });
    } catch (error) {
      console.error(error);

      return res.status(400).json({
        errorMessage: '게시글 조회에 실패하였습니다.',
      });
    }
  };

  //게시글 상세 조회
  findPost = async (req, res) => {
    try {
      const { postId } = req.params;

      const post = await this.postService.findPost(postId);

      return res.status(200).json({ post });
    } catch (error) {
      console.error(error);

      return res.status(400).json({
        errorMessage: '게시글 조회에 실패하였습니다.',
      });
    }
  };

  //게시글 수정
  updatePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user;
      const { title, content } = req.body;

      if (!title || !content) {
        return res
          .status(412)
          .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
      }

      const post = await this.postService.findPost(postId);

      if (!post) {
        return res
          .status(404)
          .json({ errorMessage: '게시글이 존재하지 않습니다.' });
      } else if (post.userId !== userId) {
        return res
          .status(403)
          .json({ errorMessage: '게시글 수정 권한이 존재하지 않습니다.' });
      }

      await this.postService.updatePost(postId, title, content);

      return res.status(200).json({ message: '게시글을 수정하였습니다.' });
    } catch (error) {
      console.error(error);

      return res.status(400).json({
        errorMessage: '게시글 수정에 실패하였습니다.',
      });
    }
  };

  //게시글 삭제
  deletePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user;

      const post = await this.postService.findPost(postId);

      if (!post) {
        return res
          .status(404)
          .json({ errorMessage: '게시글이 존재하지 않습니다.' });
      } else if (post.userId !== userId) {
        return res
          .status(403)
          .json({ errorMessage: '게시글 삭제 권한이 존재하지 않습니다.' });
      }

      await this.postService.deletePost(postId);

      return res.status(200).json({ message: '게시글을 삭제하였습니다.' });
    } catch (error) {
      console.error(error);

      return res.status(400).json({
        errorMessage: '게시글 삭제에 실패하였습니다.',
      });
    }
  };
}

export default PostController;
