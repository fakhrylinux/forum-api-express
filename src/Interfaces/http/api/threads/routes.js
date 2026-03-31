import express from "express";
import authenticateToken from "../../../middlewares/auth.js";

const createThreadsRouter = (controller) => {
  const router = express.Router();

  router.post("/", authenticateToken, controller.postThread);
  router.post("/:threadId/comments", authenticateToken, controller.postComment);

  return router;
};

export default createThreadsRouter;
