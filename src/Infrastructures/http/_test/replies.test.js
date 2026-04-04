import pool from "../../database/postgres/pool.js";
import RepliesTableTestHelper from "../../../../tests/RepliesTableTestHelper.js";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import AuthenticationsTableTestHelper from "../../../../tests/AuthenticationsTableTestHelper.js";
import container from "../../container.js";
import request from "supertest";
import createServer from "../createServer.js";
import { getAccessToken } from "./helper.js";

describe("HTTP server", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe("when POST replies", () => {
    it("should response 200 and reply deleted async", async () => {
      const app = await createServer(container);
      // Add user for adding thread
      await request(app).post("/users").send({
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      });

      const loginResponse = await request(app).post("/authentications").send({
        username: "dicoding",
        password: "secret",
      });

      const {
        data: { accessToken },
      } = loginResponse.body;

      // Add thread
      const addThreadPayload = {
        title: "New Thread 123",
        body: "New Thread body.",
      };
      const addThreadResponse = await request(app)
        .post("/threads")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(addThreadPayload);

      const threadId = addThreadResponse.body.data.addedThread.id;

      // Add user for adding comment
      await request(app).post("/users").send({
        username: "fakhry",
        password: "secret123",
        fullname: "Fakhry Linux",
      });

      const loginUserTwoResponse = await request(app)
        .post("/authentications")
        .send({
          username: "fakhry",
          password: "secret123",
        });

      const {
        data: { accessToken: accessTokenUserTwo },
      } = loginUserTwoResponse.body;

      // Add comment
      const addCommentResponse = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set("Authorization", `Bearer ${accessTokenUserTwo}`)
        .send({ content: "New Comment 123" });

      const commentId = addCommentResponse.body.data.addedComment.id;

      // Add user for adding reply
      await request(app).post("/users").send({
        username: "arsene",
        password: "rahasia123",
        fullname: "Arsene Tsaqeev",
      });

      const loginUserThreeResponse = await request(app)
        .post("/authentications")
        .send({
          username: "arsene",
          password: "rahasia123",
        });

      const { accessToken: accessTokenUserThree } =
        loginUserThreeResponse.body.data;
      console.log(
        "resource path",
        `/threads/${threadId}/comments/${commentId}`,
      );

      // Add reply
      const addReplyResponse = await request(app)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set("Authorization", `Bearer ${accessTokenUserThree}`)
        .send({ content: "New Reply for Comment 123" });

      const replyId = addReplyResponse.body.data.addedReply.id;

      const deleteReplyResponse = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/${replyId}`)
        .set("Authorization", `Bearer ${accessTokenUserThree}`)
        .send();

      const responseJson = deleteReplyResponse.body;
      expect(deleteReplyResponse.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 201 and persistent reply", async () => {
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
      const addedCommentResponse = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set("Authorization", `Bearer ${commentOwnerToken}`)
        .send({ content: "New comment 123" });
      console.log(addedCommentResponse.body);
      const commentId = addedCommentResponse.body.data.addedComment.id;

      // Add user for adding reply
      const replyOwnerToken = await getAccessToken(
        app,
        "arsene",
        "rahasia123",
        "Arsene Tsaqeev",
      );

      // Action
      const response = await request(app)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set("Authorization", `Bearer ${replyOwnerToken}`)
        .send({ content: "New Reply for Comment 123" });

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual("success");
      expect(response.body.data.addedReply).toBeDefined();
    });
  });
});
