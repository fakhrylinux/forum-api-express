import AddThread from "../../../Domains/threads/entities/AddThread.js";
import AddedThread from "../../../Domains/threads/entities/AddedThread.js";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import ThreadUseCase from "../ThreadUseCase.js";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import ReplyRepository from "../../../Domains/replies/ReplyRepository.js";

describe("ThreadUseCase", () => {
  describe("addTHread", () => {
    it("should orchestrating the add thread action correctly", async () => {
      // Arrange
      const threadPayload = {
        title: "New Thread",
        body: "New Thread body",
      };
      const mockAddedThread = {
        id: "thread-123",
        title: threadPayload.title,
        owner: "user-123",
      };

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();

      /** mocking needed function */
      mockThreadRepository.addThread = vi
        .fn()
        .mockImplementation(() => Promise.resolve(mockAddedThread));

      /** creating use case instance */
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
      });

      // Action
      const addedThread = await threadUseCase.addThread(
        threadPayload,
        "user-123",
      );

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: threadPayload.title,
          owner: "user-123",
        }),
      );
      expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
        new AddThread({
          title: threadPayload.title,
          body: threadPayload.body,
        }),
        "user-123",
      );
    });
  });

  describe("GetThreadUseCase", () => {
    it("should throw error when thread not found", async () => {
      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();

      /** mocking needed function */
      mockThreadRepository.getThread = vi
        .fn()
        .mockImplementation(() => Promise.resolve([]));

      /** creating use case instance */
      const getThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
      });

      // Action & Assert
      await expect(
        getThreadUseCase.getThread("thread-h_2FkLZhtgBKY2kh4CC02"),
      ).rejects.toThrow("Thread tidak ditemukan");
    });

    it("should orchestrating the get thread action correctly", async () => {
      const threadId = "thread-h_2FkLZhtgBKY2kh4CC02";
      const commentId = "comment-_pby2_tmXV6bcvcdev8xk";
      const mockCommentedThread = {
        id: "thread-h_2FkLZhtgBKY2kh4CC02",
        title: "sebuah thread",
        body: "sebuah body thread",
        created_at: "2021-08-08T07:19:09.775Z",
        username: "dicoding",
      };

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      /** mocking needed function */
      mockThreadRepository.getThread = vi
        .fn()
        .mockImplementation(() => Promise.resolve([mockCommentedThread]));
      mockCommentRepository.getComments = vi.fn().mockImplementation(() =>
        Promise.resolve([
          {
            id: "comment-_pby2_tmXV6bcvcdev8xk",
            username: "johndoe",
            updated_at: "2021-08-08T07:22:33.555Z",
            content: "sebuah comment",
          },
        ]),
      );
      mockReplyRepository.getReplies = vi.fn().mockImplementation(() =>
        Promise.resolve([
          {
            id: "reply-xNBtm9HPR-492AeiimpfN",
            content: "sebuah balasan",
            updated_at: "2021-08-08T08:07:01.522Z",
            username: "dicoding",
          },
        ]),
      );

      /** creating use case instance */
      const getThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      // Action
      const commentedThread = await getThreadUseCase.getThread(
        "thread-h_2FkLZhtgBKY2kh4CC02",
      );

      // Assert
      expect(commentedThread).toStrictEqual({
        id: "thread-h_2FkLZhtgBKY2kh4CC02",
        title: "sebuah thread",
        body: "sebuah body thread",
        date: "2021-08-08T07:19:09.775Z",
        username: "dicoding",
        comments: [
          {
            id: "comment-_pby2_tmXV6bcvcdev8xk",
            username: "johndoe",
            date: "2021-08-08T07:22:33.555Z",
            content: "sebuah comment",
            replies: [
              {
                id: "reply-xNBtm9HPR-492AeiimpfN",
                content: "sebuah balasan",
                date: "2021-08-08T08:07:01.522Z",
                username: "dicoding",
              },
            ],
          },
        ],
      });
      expect(mockThreadRepository.getThread).toHaveBeenCalledWith(threadId);
      expect(mockCommentRepository.getComments).toHaveBeenCalledWith(threadId);
      expect(mockReplyRepository.getReplies).toHaveBeenCalledWith(commentId);
    });

    it("should orchestrating the get thread action correctly with comment and reply deleted", async () => {
      const threadId = "thread-h_2FkLZhtgBKY2kh4CC02";
      const commentId = "comment-_pby2_tmXV6bcvcdev8xk";
      const mockCommentedThread = {
        id: "thread-h_2FkLZhtgBKY2kh4CC02",
        title: "sebuah thread",
        body: "sebuah body thread",
        created_at: "2021-08-08T07:19:09.775Z",
        username: "dicoding",
      };

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      /** mocking needed function */
      mockThreadRepository.getThread = vi
        .fn()
        .mockImplementation(() => Promise.resolve([mockCommentedThread]));
      mockCommentRepository.getComments = vi.fn().mockImplementation(() =>
        Promise.resolve([
          {
            id: commentId,
            username: "johndoe",
            updated_at: "2021-08-08T07:22:33.555Z",
            content: "sebuah comment",
            is_delete: true,
          },
        ]),
      );
      mockReplyRepository.getReplies = vi.fn().mockImplementation(() =>
        Promise.resolve([
          {
            id: "reply-xNBtm9HPR-492AeiimpfN",
            content: "sebuah balasan",
            updated_at: "2021-08-08T08:07:01.522Z",
            username: "dicoding",
            is_delete: true,
          },
        ]),
      );

      /** creating use case instance */
      const getThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      // Action
      const commentedThread = await getThreadUseCase.getThread(threadId);

      // Assert
      expect(commentedThread).toStrictEqual({
        id: "thread-h_2FkLZhtgBKY2kh4CC02",
        title: "sebuah thread",
        body: "sebuah body thread",
        date: "2021-08-08T07:19:09.775Z",
        username: "dicoding",
        comments: [
          {
            id: "comment-_pby2_tmXV6bcvcdev8xk",
            username: "johndoe",
            date: "2021-08-08T07:22:33.555Z",
            content: "**komentar telah dihapus**",
            replies: [
              {
                id: "reply-xNBtm9HPR-492AeiimpfN",
                content: "**balasan telah dihapus**",
                date: "2021-08-08T08:07:01.522Z",
                username: "dicoding",
              },
            ],
          },
        ],
      });
      expect(mockThreadRepository.getThread).toHaveBeenCalledWith(threadId);
      expect(mockCommentRepository.getComments).toHaveBeenCalledWith(threadId);
      expect(mockReplyRepository.getReplies).toHaveBeenCalledWith(commentId);
    });
  });
});
