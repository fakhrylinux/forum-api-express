import ThreadUseCase from "../../../../Applications/use_case/ThreadUseCase.js";
import CommentUseCase from "../../../../Applications/use_case/CommentUseCase.js";

class ThreadController {
  constructor(container) {
    this._container = container;
  }

  postThread = async (req, res) => {
    const { id: owner } = req.user;
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const addedThread = await threadUseCase.addThread(req.body, owner);

    res.status(201).json({
      status: "success",
      data: {
        addedThread,
      },
    });
  };

  getThread = async (req, res) => {
    const { threadId } = req.params;
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const thread = await threadUseCase.getThread(threadId);

    res.json({
      status: "success",
      data: {
        thread,
      },
    });
  };

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

export default ThreadController;
