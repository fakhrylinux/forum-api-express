import express from "express";
import authenticateToken from "../../../middlewares/auth.js";

const createCommentsRouter = (controller) => {
  const router = express.Router({ mergeParams: true });

  router.post("/", authenticateToken, controller.postComment);
  router.delete("/:commentId", authenticateToken, controller.deleteComment);

  return router;
};

export default createCommentsRouter;
