import express from "express";
import authenticateToken from "../../../middlewares/auth.js";

const createRepliesRouter = (controller) => {
  const router = express.Router({ mergeParams: true });

  router.post("/", authenticateToken, controller.postReply);

  return router;
};

export default createRepliesRouter;
