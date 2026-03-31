import AddComment from "../../Domains/comments/entities/AddComment.js";
import AddedComment from "../../Domains/comments/entities/AddedComment.js";

class CommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async addComment(useCasePayload, threadId, ownerId) {
    const addComment = new AddComment(useCasePayload);

    await this._threadRepository.verifyThreadIsExist(threadId);

    const addedComment = await this._commentRepository.addComment(
      addComment,
      threadId,
      ownerId,
    );

    return new AddedComment({ ...addedComment });
  }

  async deleteComment(thread, comment, owner) {
    await this._threadRepository.verifyThreadIsExist(thread);
    await this._commentRepository.verifyCommentIsExist(comment);
    await this._commentRepository.verifyCommentOwner(comment, owner);
    await this._commentRepository.deleteComment(comment);
  }
}

export default CommentUseCase;
