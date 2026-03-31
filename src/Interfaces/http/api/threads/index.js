import ThreadsController from "./controller.js";
import createThreadsRouter from "./routes.js";

export default (container) => {
  const threadsController = new ThreadsController(container);

  return createThreadsRouter(threadsController);
};
