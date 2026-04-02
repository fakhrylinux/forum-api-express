import CommentUseCase from "../../../../Applications/use_case/CommentUseCase.js";

class CommentController {
  constructor(container) {
    this._container = container;
  }

  postComment = async (req, res) => {
    const { id: owner } = req.user;
    const { threadId } = req.params;
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    const addedComment = await commentUseCase.addComment(
      req.body,
      threadId,
      owner,
    );

    res.status(201).json({
      status: "success",
      data: {
        addedComment,
      },
    });
  };

  deleteComment = async (req, res) => {
    const { id: owner } = req.user;
    const { threadId, commentId } = req.params;
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    await commentUseCase.deleteComment(threadId, commentId, owner);

    res.json({
      status: "success",
    });
  };
}

export default CommentController;
