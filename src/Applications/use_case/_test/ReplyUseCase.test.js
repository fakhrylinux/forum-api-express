import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import NotFoundError from "../../../Commons/exceptions/NotFoundError.js";
import ReplyUseCase from "../ReplyUseCase.js";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import AddedReply from "../../../Domains/replies/entities/AddedReply.js";
import ReplyRepository from "../../../Domains/replies/ReplyRepository.js";
import AddReply from "../../../Domains/replies/entities/AddReply.js";
import AuthorizationError from "../../../Commons/exceptions/AuthorizationError.js";

describe("ReplyUseCase", () => {
  describe("addReply", () => {
    it("should throw error when thread not available", async () => {
      // Arrange
      const useCasePayload = {
        content: "New reply",
      };

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadIsExist = vi
        .fn()
        .mockImplementation(async () => {
          throw new NotFoundError("thread tidak ditemukan");
        });

      /** creating use case instance */
      const addReplyUseCase = new ReplyUseCase({
        threadRepository: mockThreadRepository,
      });

      // Action & Assert
      await expect(
        addReplyUseCase.addReply(
          useCasePayload,
          "thread-123",
          "comment-123",
          "user-123",
        ),
      ).rejects.toThrow("thread tidak ditemukan");
    });

    it("should throw error when comment not available", async () => {
      // Arrange
      const useCasePayload = {
        content: "New reply",
      };

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      // const mockReplyRepository = new ReplyRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadIsExist = vi
        .fn()
        .mockImplementation(async () => Promise.resolve());
      mockCommentRepository.verifyCommentIsExist = vi
        .fn()
        .mockImplementation(async () => {
          throw new NotFoundError("komentar tidak ditemukan");
        });

      /** creating use case instance */
      const addReplyUseCase = new ReplyUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Action & Assert
      await expect(
        addReplyUseCase.addReply(
          useCasePayload,
          "thread-123",
          "comment-123",
          "user-123",
        ),
      ).rejects.toThrow("komentar tidak ditemukan");
    });

    it("should orchestrating the add reply action correctly", async () => {
      // Arrange
      const useCasePayload = {
        content: "New reply",
      };
      const threadId = "thread-123";
      const commentId = "comment-123";
      const ownerId = "user-123";
      const mockAddedReply = new AddedReply({
        id: "reply-123",
        content: useCasePayload.content,
        owner: "user-123",
      });

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadIsExist = vi
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentIsExist = vi
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.addReply = vi
        .fn()
        .mockImplementation(() => Promise.resolve([mockAddedReply]));

      /** creating use case instance */
      const addReplyUseCase = new ReplyUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      // Action
      const addedReply = await addReplyUseCase.addReply(
        useCasePayload,
        threadId,
        commentId,
        ownerId,
      );

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: "reply-123",
          content: useCasePayload.content,
          owner: "user-123",
        }),
      );
      expect(mockThreadRepository.verifyThreadIsExist).toHaveBeenCalledWith(
        threadId,
      );
      expect(mockCommentRepository.verifyCommentIsExist(commentId));
      expect(mockReplyRepository.addReply).toHaveBeenCalledWith(
        new AddReply({
          content: useCasePayload.content,
        }),
        "comment-123",
        "user-123",
      );
    });
  });

  describe("deleteReply", () => {
    it("should throw error when thread not found", async () => {
      // Arrange
      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadIsExist = vi
        .fn()
        .mockImplementation(() => {
          throw new NotFoundError("thread tidak ditemukan");
        });

      /** creating use case */
      const deleteReplyUseCase = new ReplyUseCase({
        threadRepository: mockThreadRepository,
      });

      // Action
      await expect(
        deleteReplyUseCase.deleteReply(
          "user-123",
          "thread-123",
          "comment-123",
          "reply-123",
        ),
      ).rejects.toThrow("thread tidak ditemukan");
    });

    it("should throw error when comment not found", async () => {
      // Arrange
      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      // const mockReplyRepository = new ReplyRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadIsExist = vi
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentIsExist = vi
        .fn()
        .mockImplementation(() => {
          throw new NotFoundError("komentar tidak ditemukan");
        });

      /** creating use case */
      const deleteReplyUseCase = new ReplyUseCase({
        threadRepository: mockThreadRepository,
        // replyRepository: mockReplyRepository,
        commentRepository: mockCommentRepository,
      });

      // Action & Assert
      await expect(
        deleteReplyUseCase.deleteReply(
          "user-123",
          "thread-123",
          "comment-123",
          "reply-123",
        ),
      ).rejects.toThrow("komentar tidak ditemukan");
    });

    it("should throw error when reply not found", async () => {
      // Arrange
      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadIsExist = vi
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentIsExist = vi
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.verifyReplyIsExist = vi
        .fn()
        .mockImplementation(() => {
          throw new NotFoundError("balasan tidak ditemukan");
        });

      /** creating use case */
      const deleteReplyUseCase = new ReplyUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      // Action & Assert
      await expect(
        deleteReplyUseCase.deleteReply(
          "user-123",
          "thread-123",
          "comment-123",
          "reply-123",
        ),
      ).rejects.toThrow("balasan tidak ditemukan");
    });

    it("should throw error when user have no rights", async () => {
      // Arrange
      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadIsExist = vi
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentIsExist = vi
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.verifyReplyIsExist = vi
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.verifyReplyOwner = vi.fn().mockImplementation(() => {
        throw new AuthorizationError("tidak berhak menghapus balasan");
      });

      /** creating use case */
      const deleteReplyUseCase = new ReplyUseCase({
        threadRepository: mockThreadRepository,
        replyRepository: mockReplyRepository,
        commentRepository: mockCommentRepository,
      });

      // Action & Assert
      await expect(
        deleteReplyUseCase.deleteReply(
          "user-123",
          "thread-123",
          "comment-123",
          "reply-123",
        ),
      ).rejects.toThrow("tidak berhak menghapus balasan");
    });

    it("should orchestrating the delete reply action correctly", async () => {
      // Arrange
      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadIsExist = vi
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentIsExist = vi
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.verifyReplyIsExist = vi
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.verifyReplyOwner = vi
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.deleteReply = vi
        .fn()
        .mockImplementation(() => Promise.resolve());

      /** creating use case */
      const deleteReplyUseCase = new ReplyUseCase({
        threadRepository: mockThreadRepository,
        replyRepository: mockReplyRepository,
        commentRepository: mockCommentRepository,
      });

      // Action
      await deleteReplyUseCase.deleteReply(
        "thread-123",
        "comment-123",
        "reply-123",
        "user-123",
      );

      // Assert
      expect(mockThreadRepository.verifyThreadIsExist).toHaveBeenCalledWith(
        "thread-123",
      );
      expect(mockCommentRepository.verifyCommentIsExist).toHaveBeenCalledWith(
        "comment-123",
      );
      expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(
        "reply-123",
        "user-123",
      );
      expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith("reply-123");
    });
  });
});
