import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import AuthenticationsTableTestHelper from "../../../../tests/AuthenticationsTableTestHelper.js";
import pool from "../../database/postgres/pool.js";
import createServer from "../createServer.js";
import request from "supertest";
import container from "../../container.js";
import { getAccessToken } from "./helper.js";

describe("HTTP server", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("when POST comment", () => {
    it("should response 201 and persistent comment", async () => {
      // Add User for adding thread
      const app = await createServer(container);

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

      // Action
      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set("Authorization", `Bearer ${threadOwnerToken}`)
        .send({
          content: "New Comment 456",
        });

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual("success");
      expect(response.body.data.addedComment).toBeDefined();
    });
  });

  describe("when delete comment", () => {
    it("should response 200 and comment is deleted", async () => {
      const app = await createServer(container);

      // Add User for adding thread
      const userToken = await getAccessToken(
        app,
        "dicoding",
        "secret",
        "Dicoding Indonesia",
      );

      // Add thread
      const addThreadResponse = await request(app)
        .post("/threads")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          title: "New Thread 123",
          body: "New Thread body.",
        });
      const threadId = addThreadResponse.body.data.addedThread.id;

      // Add Comment
      const addedCommentResponse = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ content: "New comment" });
      const commentId = addedCommentResponse.body.data.addedComment.id;

      // Assert
      const deleteCommentResponse = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set("Authorization", `Bearer ${userToken}`);
      console.log(deleteCommentResponse.body);
      expect(deleteCommentResponse.status).toEqual(200);
      expect(deleteCommentResponse.body.status).toEqual("success");
    });
  });
});
