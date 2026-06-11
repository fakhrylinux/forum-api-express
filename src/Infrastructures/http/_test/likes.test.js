import pool from "../../database/postgres/pool.js";
import container from "../../container.js";
import createServer from "../createServer.js";
import UserCommentLikesTableTestHelper from "../../../../tests/UserCommentLikesTableTestHelper.js";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import AuthenticationsTableTestHelper from "../../../../tests/AuthenticationsTableTestHelper.js";
import request from "supertest";
import { getAccessToken } from "./helper.js";

describe("HTTP server", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UserCommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe("when PUT likes", () => {
    it("should response 200 when add like", async () => {
      const app = await createServer(container);

      // Add user for adding thread
      const threadOwnerToken = await getAccessToken(
        app,
        "dicoding",
        "secret",
        "Dicoding Indonesia",
      );

      // Add thread
      const addThreadResponse = await request(app)
        .post("/threads")
        .set("Authorization", `Bearer ${threadOwnerToken}`)
        .send({
          title: "New Thread 123",
          body: "New Thread body.",
        });

      const threadId = addThreadResponse.body.data.addedThread.id;

      // Add user for adding comment
      const commentOwnerToken = await getAccessToken(
        app,
        "fakhry",
        "secret123",
        "Fakhry Linux",
      );

      // Add comment
      const addCommentResponse = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set("Authorization", `Bearer ${commentOwnerToken}`)
        .send({
          content: "New comment 123",
        });

      const commentId = addCommentResponse.body.data.addedComment.id;

      // Add like
      const addLikeResponse = await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set("Authorization", `Bearer ${threadOwnerToken}`);

      const responseJson = addLikeResponse.body;
      expect(addLikeResponse.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 200 when delete like", async () => {
      const app = await createServer(container);

      // Add user for adding thread
      const threadOwnerToken = await getAccessToken(
        app,
        "dicoding",
        "secret",
        "Dicoding Indonesia",
      );

      // Add thread
      const addThreadResponse = await request(app)
        .post("/threads")
        .set("Authorization", `Bearer ${threadOwnerToken}`)
        .send({
          title: "New Thread 123",
          body: "New Thread body.",
        });

      const threadId = addThreadResponse.body.data.addedThread.id;

      // Add user for adding comment
      const commentOwnerToken = await getAccessToken(
        app,
        "fakhry",
        "secret123",
        "Fakhry Linux",
      );

      // Add comment
      const addCommentResponse = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set("Authorization", `Bearer ${commentOwnerToken}`)
        .send({
          content: "New comment 123",
        });

      const commentId = addCommentResponse.body.data.addedComment.id;

      // Add like
      await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set("Authorization", `Bearer ${threadOwnerToken}`);

      // Delete like
      const deleteLikeResponse = await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set("Authorization", `Bearer ${threadOwnerToken}`);

      const responseJson = deleteLikeResponse.body;
      expect(deleteLikeResponse.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});
