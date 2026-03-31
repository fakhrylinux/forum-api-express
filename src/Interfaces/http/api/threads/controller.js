import ThreadUseCase from "../../../../Applications/use_case/ThreadUseCase.js";
import CommentUseCase from "../../../../Applications/use_case/CommentUseCase.js";

class ThreadController {
  constructor(container) {
    this._container = container;
  }

  postThread = async (req, res) => {
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const { id: owner } = req.user;
    const addedThread = await threadUseCase.addThread(req.body, owner);

    res.status(201).json({
      status: "success",
      data: {
        addedThread,
      },
    });
  };

  postComment = async (req, res) => {
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    const { id: owner } = req.user;
    const { threadId } = req.params;
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
}

export default ThreadController;
