import AddThread from "../../Domains/threads/entities/AddThread.js";
import AddedThread from "../../Domains/threads/entities/AddedThread.js";
import NotFoundError from "../../Commons/exceptions/NotFoundError.js";
import {
  mapCommentDBToResponseModel,
  mapRepliesDBToResponseModel,
} from "./utils.js";
// import {
//   mapCommentDBToResponseModel,
//   mapCommentsDBToResponseModel,
//   mapRepliesDBToResponseModel,
// } from "./utils.js";

class ThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
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

    const getComments = await this._commentRepository.getComments(threadId);

    const getReplies = async (commentId) => {
      const replies = await this._replyRepository.getReplies(commentId);
      return mapRepliesDBToResponseModel(replies);
    };

    const comments = await Promise.all(
      getComments.map(async (comment) =>
        mapCommentDBToResponseModel(comment, getReplies),
      ),
    );

    return {
      id: thread[0].id,
      title: thread[0].title,
      body: thread[0].body,
      date: thread[0].created_at,
      username: thread[0].username,
      comments,
    };
  }
}

export default ThreadUseCase;
