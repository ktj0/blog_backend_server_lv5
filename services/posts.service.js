import PostRepository from '../repositories/posts.repository.js';

class PostService {
  postRepository = new PostRepository();

  //게시글 생성
  createPost = async (userId, title, content) => {
    await this.postRepository.createPost(userId, title, content);

    return;
  };

  //게시글 전체 조회
  findAllPosts = async () => {
    const posts = await this.postRepository.findAllPosts();

    return posts;
  };

  //게시글 상세 조회
  findPost = async (postId) => {
    const post = await this.postRepository.findPost(postId);

    return post;
  };

  //게시글 수정
  updatePost = async (postId, title, content) => {
    await this.postRepository.updatePost(postId, { title, content });

    return;
  };

  //게시글 삭제
  deletePost = async (postId) => {
    await this.postRepository.deletePost(postId);

    return;
  };
}

export default PostService;
