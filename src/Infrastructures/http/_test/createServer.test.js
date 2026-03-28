import request from "supertest";
import pool from "../../database/postgres/pool.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import container from "../../container.js";
import createServer from "../createServer.js";

describe("HTTP server", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe("when POST /users", () => {
    it("should response 201 and persisted user", async () => {
      // Arrange
      const requestPayload = {
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post("/users").send(requestPayload);

      // Assert
      // const responseJson = JSON.parse(response.payload);
      // expect(response.statusCode).toEqual(201);
      // expect(responseJson.status).toEqual("success");
      // expect(responseJson.data.addedUser).toBeDefined();
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual("success");
      expect(response.body.data.addedUser).toBeDefined();
    });
  });
});
