import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import LikeRepository from "../../../Domains/likes/LikeRepository.js";
import LikeUseCase from "../LikeUseCase.js";

describe("ToggleUserCommentLikesUseCase", () => {
  it("should orchestrating the delete user comment like action correctly", async () => {
    const ownerId = "owner-123";
    const threadId = "thread-123";
    const commentId = "comment-123";

    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadIsExist = vi
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsExist = vi
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyLikeIsExist = vi
      .fn()
      .mockImplementation(() => Promise.resolve(1));
    mockLikeRepository.deleteLike = vi
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.addLike = vi
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeUseCase = new LikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeUseCase.toggleLikeUseCase(ownerId, threadId, commentId);

    // Assert
    expect(mockThreadRepository.verifyThreadIsExist).toHaveBeenCalledWith(
      threadId,
    );
    expect(mockCommentRepository.verifyCommentIsExist).toHaveBeenCalledWith(
      commentId,
    );
    expect(mockLikeRepository.verifyLikeIsExist).toHaveBeenCalledWith(
      commentId,
      ownerId,
    );
    expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith(
      commentId,
      ownerId,
    );
    expect(mockLikeRepository.addLike).not.toHaveBeenCalled();
  });

  it("should orchestrating the add user comment like action correctly", async () => {
    const ownerId = "owner-123";
    const threadId = "thread-123";
    const commentId = "comment-123";

    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadIsExist = vi
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsExist = vi
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyLikeIsExist = vi
      .fn()
      .mockImplementation(() => Promise.resolve("0"));
    mockLikeRepository.deleteLike = vi.fn().mockImplementation(() => {});
    mockLikeRepository.addLike = vi
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeUseCase = new LikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeUseCase.toggleLikeUseCase(ownerId, threadId, commentId);

    // Assert
    expect(mockThreadRepository.verifyThreadIsExist).toHaveBeenCalledWith(
      threadId,
    );
    expect(mockCommentRepository.verifyCommentIsExist).toHaveBeenCalledWith(
      commentId,
    );
    expect(mockLikeRepository.verifyLikeIsExist).toHaveBeenCalledWith(
      commentId,
      ownerId,
    );
    expect(mockLikeRepository.deleteLike).not.toHaveBeenCalled();
    expect(mockLikeRepository.addLike).toHaveBeenCalledWith(commentId, ownerId);
  });
});
