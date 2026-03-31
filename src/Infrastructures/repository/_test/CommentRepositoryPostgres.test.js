import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import pool from "../../database/postgres/pool.js";
import AddComment from "../../../Domains/comments/entities/AddComment.js";
import CommentRepositoryPostgres from "../CommentRepositoryPostgres.js";

describe("CommentRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: "user-123",
      username: "dicoding",
      password: "secret",
      fullname: "Dicoding Indonesia",
    });

    await UsersTableTestHelper.addUser({
      id: "user-456",
      username: "fakhry",
      password: "rahasia",
      fullname: "Fakhry Dicoding",
    });

    await ThreadsTableTestHelper.addThread({
      id: "thread-123",
      title: "New Thread 123",
      body: "New thread body 123.",
      owner: "user-123",
      created_at: "2024-06-10T17:14:31.573Z",
      updated_at: "2024-06-10T17:14:31.573Z",
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist add comment", async () => {
      // Arrange
      const addComment = new AddComment({ content: "New Comment" });
      const fakeIdGenerator = () => "456";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.addComment(
        addComment,
        "thread-123",
        "user-456",
      );

      // Assert
      const comment =
        await CommentsTableTestHelper.findCommentById("comment-456");
      expect(comment).toHaveLength(1);
      expect(comment[0].id).toBe("comment-456");
      expect(comment[0].content).toBe("New Comment");
      expect(comment[0].owner).toBe("user-456");
    });
  });
});
