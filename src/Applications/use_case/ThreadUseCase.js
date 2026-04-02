import AddThread from "../../Domains/threads/entities/AddThread.js";
import AddedThread from "../../Domains/threads/entities/AddedThread.js";
import NotFoundError from "../../Commons/exceptions/NotFoundError.js";
import { mapCommentsDBToResponseModel } from "./utils.js";

class ThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async addThread(thread, owner) {
    const addThread = new AddThread(thread);
    const addedThread = await this._threadRepository.addThread(
      addThread,
      owner,
    );

    return new AddedThread({ ...addedThread });
  }

  async getThread(threadId) {
    const thread = await this._threadRepository.getThread(threadId);

    if (thread.length === 0) {
      throw new NotFoundError("Thread tidak ditemukan");
    }

    const comments = await this._commentRepository.getComments(threadId);

    return {
      id: thread[0].id,
      title: thread[0].title,
      body: thread[0].body,
      date: thread[0].created_at,
      username: thread[0].username,
      comments: mapCommentsDBToResponseModel(comments),
    };
  }
}

export default ThreadUseCase;
