import AddThread from "../../Domains/threads/entities/AddThread.js";
import AddedThread from "../../Domains/threads/entities/AddedThread.js";
import NotFoundError from "../../Commons/exceptions/NotFoundError.js";
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
      return replies.map((reply) => ({
        id: reply.id,
        content: reply.is_delete ? "**balasan telah dihapus**" : reply.content,
        date: reply.updated_at,
        username: reply.username,
      }));
    };

    const comments = await Promise.all(
      getComments.map(async (comment) => ({
        id: comment.id,
        username: comment.username,
        date: comment.updated_at,
        content: comment.is_delete
          ? "**komentar telah dihapus**"
          : comment.content,
        replies: await getReplies(comment.id),
      })),
    );

    return {
      id: thread[0].id,
      title: thread[0].title,
      body: thread[0].body,
      date: thread[0].created_at,
      username: thread[0].username,
      comments,
    };

    // const getComments = await this._commentRepository.getComments(threadId);
    // const getReplies = async (comment) => {
    //   const replies = await this._replyRepository.getReplies(comment);
    //   return mapRepliesDBToResponseModel(replies);
    // };
    // // const commentReplies = await Promise.all(
    // //   getComments.map(async (comment) => getReplies(comment)),
    // // );
    // const comments = await Promise.all(
    //   getComments.map(async (comment) =>
    //     mapCommentDBToResponseModel(comment, getReplies),
    //   ),
    // );
    //
    // return {
    //   id: thread[0].id,
    //   title: thread[0].title,
    //   body: thread[0].body,
    //   date: thread[0].created_at,
    //   username: thread[0].username,
    //   // comments: mapCommentsDBToResponseModel(comments),
    //   comments,
    // };
  }
}

export default ThreadUseCase;
