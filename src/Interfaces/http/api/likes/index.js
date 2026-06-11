import LikeController from "./controller.js";
import createLikesRouter from "./routes.js";

export default (container) => {
  const likeController = new LikeController(container);

  return createLikesRouter(likeController);
};
