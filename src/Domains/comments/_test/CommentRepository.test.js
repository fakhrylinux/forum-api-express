import CommentRepository from "../CommentRepository.js";

describe("CommentRepository interface", () => {
  it("should throw error invoke abstract behaviour", async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action and Assert
    await expect(commentRepository.verifyCommentIsExist({})).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(commentRepository.getComments({})).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(commentRepository.addComment({})).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(commentRepository.verifyCommentOwner({})).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(commentRepository.deleteComment({})).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
  });
});
