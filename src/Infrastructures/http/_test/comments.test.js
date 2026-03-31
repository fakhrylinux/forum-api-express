import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import AuthenticationsTableTestHelper from "../../../../tests/AuthenticationsTableTestHelper.js";
import pool from "../../database/postgres/pool.js";
import createServer from "../createServer.js";
import request from "supertest";
import container from "../../container.js";

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

  describe("when POST comemnt", () => {
    it("should response 201 and persistent comment", async () => {
      // Add User for adding thread
      const app = await createServer(container);
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

      // Arrange
      const requestPayload = {
        content: "New Comment 456",
      };

      // Action
      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(requestPayload);

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual("success");
      expect(response.body.data.addedComment).toBeDefined();
    });
  });
});
