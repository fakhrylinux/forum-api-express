import ThreadUseCase from "../../../../Applications/use_case/ThreadUseCase.js";

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
}

export default ThreadController;
