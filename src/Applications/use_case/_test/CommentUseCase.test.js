import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import AddedComment from "../../../Domains/comments/entities/AddedComment.js";
import AddComment from "../../../Domains/comments/entities/AddComment.js";
import CommentUseCase from "../CommentUseCase.js";

describe("CommentUseCase", () => {
  describe("addComment function", () => {
    it("should orchestrating the add comment action correctly", async () => {
      // Arrange
      const useCasePayload = {
        content: "New comment",
      };
      const threadId = "thread-123";
      const ownerId = "user-123";
      const mockAddedComment = {
        id: "comment-123",
        content: useCasePayload.content,
        owner: "user-123",
      };

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadIsExist = vi
        .fn()
        .mockImplementation(async () => Promise.resolve());
      mockCommentRepository.addComment = vi
        .fn()
        .mockImplementation(() => Promise.resolve(mockAddedComment));

      /** creating use case instance */
      const addCommentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Action
      const addedComment = await addCommentUseCase.addComment(
        useCasePayload,
        threadId,
        ownerId,
      );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: useCasePayload.content,
          owner: "user-123",
        }),
      );
      expect(mockThreadRepository.verifyThreadIsExist).toHaveBeenCalledWith(
        threadId,
      );
      expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
        new AddComment({
          content: useCasePayload.content,
        }),
        threadId,
        ownerId,
      );
    });
  });

  describe("deleteComment function", () => {
    it("should orchestrating the delete comment action correctly", async () => {
      const ownerId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

      // Arrange
      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadIsExist = vi
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentIsExist = vi
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentOwner = vi
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.deleteComment = vi
        .fn()
        .mockImplementation(() => Promise.resolve());

      /** creating use case instance */
      const deleteCommentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Action
      await deleteCommentUseCase.deleteComment(threadId, commentId, ownerId);

      // Assert
      expect(mockThreadRepository.verifyThreadIsExist).toHaveBeenCalledWith(
        threadId,
      );
      expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(
        commentId,
        ownerId,
      );
      expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
        commentId,
      );
    });
  });
});
