import express from "express";
import authenticateToken from "../../../middlewares/auth.js";

const createLikesRouter = (controller) => {
  const router = express.Router({ mergeParams: true });

  router.put("/", authenticateToken, controller.toggleLike);

  return router;
};

export default createLikesRouter;
