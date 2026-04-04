import ReplyRepository from "../ReplyRepository.js";

describe("ReplyRepository interface", () => {
  it("should throw error invoke abstract behaviour", async () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action and Assert
    await expect(replyRepository.getReplies({})).rejects.toThrow(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(replyRepository.addReply({})).rejects.toThrow(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(replyRepository.verifyReplyIsExist({})).rejects.toThrow(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(replyRepository.verifyReplyOwner({})).rejects.toThrow(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(replyRepository.deleteReply({})).rejects.toThrow(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
  });
});
