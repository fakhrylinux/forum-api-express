import LikeRepository from "../LikeRepository.js";

describe("LikeRepository interface", () => {
  it("should throw error invoke abstract behaviour", async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action and Assert
    await expect(likeRepository.verifyLikeIsExist({})).rejects.toThrow(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(likeRepository.addLike({})).rejects.toThrow(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(likeRepository.deleteLike({})).rejects.toThrow(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(likeRepository.countLike()).rejects.toThrow(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
  });
});
