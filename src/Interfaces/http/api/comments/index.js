import CommentsController from "./controller.js";
import createCommentsRouter from "./routes.js";

export default (container) => {
  const commentsController = new CommentsController(container);

  return createCommentsRouter(commentsController);
};
