import AddThread from "../../Domains/threads/entities/AddThread.js";
import AddedThread from "../../Domains/threads/entities/AddedThread.js";
class ThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async addThread(thread, owner) {
    const addThread = new AddThread(thread);
    const addedThread = await this._threadRepository.addThread(
      addThread,
      owner,
    );

    return new AddedThread({ ...addedThread });
  }
}

export default ThreadUseCase;
