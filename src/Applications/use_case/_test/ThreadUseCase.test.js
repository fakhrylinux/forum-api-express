import AddThread from "../../../Domains/threads/entities/AddThread.js";
import AddedThread from "../../../Domains/threads/entities/AddedThread.js";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import ThreadUseCase from "../ThreadUseCase.js";

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
      expect(mockThreadRepository.addThread).toBeCalledWith(
        new AddThread({
          title: threadPayload.title,
          body: threadPayload.body,
        }),
        "user-123",
      );
    });
  });
});
