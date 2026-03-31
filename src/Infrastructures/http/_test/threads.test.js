import pool from "../../database/postgres/pool.js";
import createServer from "../createServer.js";
import request from "supertest";
import container from "../../container.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import AuthenticationsTableTestHelper from "../../../../tests/AuthenticationsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";

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

      // Arrange
      const requestPayload = {
        title: "New Thread",
        body: "New thread body.",
      };

      // Action
      const response = await request(app)
        .post("/threads")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual("success");
      expect(response.body.data.addedThread).toBeDefined();
    });
  });
});
