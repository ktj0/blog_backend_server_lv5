import {Post, User} from '../models';

class PostRepository {
  //게시글 생성
  createPost = async (userId, title, content) => {
    await Post.create({ userId, title, content });

    return;
  };

  //게시글 전체 조회
  findAllPosts = async () => {
    await Post.findAll({
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

    return;
  };

  //게시글 상세 조회
  findPost = async (postId) => {
    await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['nickname'],
        },
      ],
    });

    return;
  };

  //게시글 수정
  updatePost = async (postId, modifiedInfo) => {
    await Post.update(modifiedInfo, {
      where: { id: postId },
    });

    return;
  };

  //게시글 삭제
  deletePost = async (postId) => {
    await Post.destroy({
      where: { id: postId },
    });

    return;
  };
}

export default PostRepository;
