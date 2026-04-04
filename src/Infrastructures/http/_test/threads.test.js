import pool from "../../database/postgres/pool.js";
import createServer from "../createServer.js";
import request from "supertest";
import container from "../../container.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import AuthenticationsTableTestHelper from "../../../../tests/AuthenticationsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import { getAccessToken } from "./helper.js";

describe("HTTP server", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe("when POST thread", () => {
    it("should response 201 and persisted thread", async () => {
      // Add user
      const app = await createServer(container);
      const accessToken = await getAccessToken(
        app,
        "dicoding",
        "secret",
        "Dicoding Indonesia",
      );

      // Action
      const response = await request(app)
        .post("/threads")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          title: "New Thread",
          body: "New thread body.",
        });

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual("success");
      expect(response.body.data.addedThread).toBeDefined();
    });
  });

  describe("when GET thread by ID", () => {
    it("should response 200 return commented thread", async () => {
      const app = await createServer(container);

      // Add User
      const accessToken = await getAccessToken(
        app,
        "dicoding",
        "secret",
        "Dicoding Indonesia",
      );

      // Add thread
      const addThreadResponse = await request(app)
        .post("/threads")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          title: "New Thread",
          body: "New thread body.",
        });
      const threadId = addThreadResponse.body.data.addedThread.id;

      // Action
      const response = await request(app).get(`/threads/${threadId}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("success");
      expect(response.body.data.thread).toBeDefined();
      expect(response.body.data.thread.id).toBeDefined();
      expect(response.body.data.thread.comments).toBeDefined();
    });
  });
});
