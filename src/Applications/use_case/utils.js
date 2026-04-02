const mapCommentsDBToResponseModel = (comments) =>
  comments.map((comment) => ({
    id: comment.id,
    username: comment.username,
    date: comment.updated_at,
    content: comment.is_delete ? "**komentar telah dihapus**" : comment.content,
  }));

export { mapCommentsDBToResponseModel };
