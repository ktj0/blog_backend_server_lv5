const { Comment } = require('../models');

class CommentRepository {
  //댓글 작성
  createComment = async (postId, userId, comment) => {
    await Comment.create({ postId, userId, comment });

    return;
  };
}
