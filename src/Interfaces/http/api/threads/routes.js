import express from "express";
import authenticateToken from "../../../middlewares/auth.js";

const createThreadsRouter = (controller) => {
  const router = express.Router();

  router.post("/", authenticateToken, controller.postThread);

  return router;
};

export default createThreadsRouter;
