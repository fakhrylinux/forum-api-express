import LikeUseCase from "../../../../Applications/use_case/LikeUseCase.js";

class LikeController {
  constructor(container) {
    this._container = container;
  }

  toggleLike = async (req, res) => {
    const { id: userId } = req.user;
    const { threadId, commentId } = req.params;
    const likeUseCase = this._container.getInstance(LikeUseCase.name);
    await likeUseCase.toggleLikeUseCase(userId, threadId, commentId);

    return res.json({
      status: "success",
    });
  };
}

export default LikeController;
