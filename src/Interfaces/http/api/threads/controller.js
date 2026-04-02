import ThreadUseCase from "../../../../Applications/use_case/ThreadUseCase.js";

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
}

export default ThreadController;
