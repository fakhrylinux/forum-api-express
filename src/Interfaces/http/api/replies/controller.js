import ReplyUseCase from "../../../../Applications/use_case/ReplyUseCase.js";

class ReplyController {
  constructor(container) {
    this._container = container;
  }

  postReply = async (req, res) => {
    const { id: owner } = req.user;
    const { threadId, commentId } = req.params;
    const replyUseCase = this._container.getInstance(ReplyUseCase.name);
    const addedReply = await replyUseCase.addReply(
      req.body,
      threadId,
      commentId,
      owner,
    );

    res.status(201).json({
      status: "success",
      data: {
        addedReply,
      },
    });
  };

  deleteReply = async (req, res) => {
    const { id: owner } = req.user;
    const { threadId, commentId, replyId } = req.params;
    const replyUseCase = this._container.getInstance(ReplyUseCase.name);
    await replyUseCase.deleteReply(threadId, commentId, replyId, owner);

    res.json({
      status: "success",
    });
  };
}

export default ReplyController;
