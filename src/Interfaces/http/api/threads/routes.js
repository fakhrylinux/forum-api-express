import express from "express";
import authenticateToken from "../../../middlewares/auth.js";

const createThreadsRouter = (controller) => {
  const router = express.Router();

  router.post("/", authenticateToken, controller.postThread);
  router.get("/:threadId", controller.getThread);
  router.post("/:threadId/comments", authenticateToken, controller.postComment);
  router.delete(
    "/:threadId/comments/:commentId",
    authenticateToken,
    controller.deleteComment,
  );

  return router;
};

export default createThreadsRouter;
