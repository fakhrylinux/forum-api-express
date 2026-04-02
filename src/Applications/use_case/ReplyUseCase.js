import AddedReply from "../../Domains/replies/entities/AddedReply.js";
import AddReply from "../../Domains/replies/entities/AddReply.js";

class ReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async addReply(reply, threadId, commentId, owner) {
    const addReply = new AddReply(reply);
    await this._threadRepository.verifyThreadIsExist(threadId);
    await this._commentRepository.verifyCommentIsExist(commentId);

    const addedReply = await this._replyRepository.addReply(
      addReply,
      commentId,
      owner,
    );
    return new AddedReply({ ...addedReply[0] });
  }
}

export default ReplyUseCase;
