import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import pool from "../../database/postgres/pool.js";
import AddThread from "../../../Domains/threads/entities/AddThread.js";
import ThreadRepositoryPostgres from "../ThreadRepositoryPostgres.js";
import NotFoundError from "../../../Commons/exceptions/NotFoundError.js";

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

  describe("getThread function", () => {
    it("should persist get thread", async () => {
      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      /** Add thread */
      const addThread = {
        id: "thread-123",
        title: "New Thread 123",
        body: "New thread body 123.",
        owner: "user-123",
        created_at: "2024-05-10T17:14:31.573Z",
        updated_at: "2024-05-10T17:14:31.573Z",
      };
      await ThreadsTableTestHelper.addThread(addThread);

      // Action
      const thread = await threadRepositoryPostgres.getThread(addThread.id);
      const user = await UsersTableTestHelper.findUsersById(addThread.owner);

      // Assert
      expect(thread).toHaveLength(1);
      expect(thread[0].id).toBe(addThread.id);
      expect(thread[0].title).toBe(addThread.title);
      expect(thread[0].body).toBe(addThread.body);
      expect(thread[0].created_at).toBe(addThread.created_at);
      expect(thread[0].username).toBe(user[0].username);
    });
  });

  describe("verifyThreadIsExist function", () => {
    it("should throw error when thread not found", async () => {
      // const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action
      const verifyThreadIsExist = async () =>
        threadRepositoryPostgres.verifyThreadIsExist("thread-001");

      // Assert
      await expect(verifyThreadIsExist).rejects.toThrowError(
        new NotFoundError("thread tidak ditemukan"),
      );
    });

    it("should not throw error when thread found", async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      /** Add thread */
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        title: "New Thread 123",
        body: "New thread body 123.",
        owner: "user-123",
        created_at: "2024-05-10T17:14:31.573Z",
        updated_at: "2024-05-10T17:14:31.573Z",
      });

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadIsExist("thread-123"),
      ).resolves.not.toThrowError(new NotFoundError("thread tidak ditemukan"));
    });
  });
});
