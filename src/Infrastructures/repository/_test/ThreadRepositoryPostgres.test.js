import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import pool from "../../database/postgres/pool.js";
import AddThread from "../../../Domains/threads/entities/AddThread.js";
import ThreadRepositoryPostgres from "../ThreadRepositoryPostgres.js";

describe("ThreadRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ username: "dicoding" });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist add thread", async () => {
      // Arrange
      const addThread = new AddThread({
        title: "New Thread",
        body: "New Thread body",
      });
      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await threadRepositoryPostgres.addThread(addThread, "user-123");

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById("thread-123");
      expect(thread).toHaveLength(1);
      expect(thread[0].id).toBe("thread-123");
      expect(thread[0].title).toBe(addThread.title);
      expect(thread[0].body).toBe(addThread.body);
      expect(thread[0].owner).toBe("user-123");
      expect(thread[0].created_at).toBeDefined();
      expect(thread[0].updated_at).toBeDefined();
    });
  });
});
