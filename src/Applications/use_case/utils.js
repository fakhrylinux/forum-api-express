// const mapCommentsDBToResponseModel = (comments) =>
//   comments.map((comment) => ({
//     id: comment.id,
//     username: comment.username,
//     date: comment.updated_at,
//     content: comment.is_delete ? "**komentar telah dihapus**" : comment.content,
//   }));

const mapCommentDBToResponseModel = async (comment, getReplies) => ({
  id: comment.id,
  username: comment.username,
  date: comment.updated_at,
  content: comment.is_delete ? "**komentar telah dihapus**" : comment.content,
  replies: await getReplies(comment.id),
});

const mapRepliesDBToResponseModel = (replies) =>
  replies.map((reply) => ({
    id: reply.id,
    content: reply.is_delete ? "**balasan telah dihapus**" : reply.content,
    date: reply.updated_at,
    username: reply.username,
  }));

export {
  // mapCommentsDBToResponseModel,
  mapCommentDBToResponseModel,
  mapRepliesDBToResponseModel,
};
