const CommentRepository = require('../repositories/comments.repository');

class CommentService {
  commentRepository = new CommentRepository();

  //댓글 작성
  createComment = async (postId, userId, comment) => {
    await this.commentRepository.createComment(postId, userId, comment);

    return;
  };
}
