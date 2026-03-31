import CommentRepository from "../../Domains/comments/CommentRepository.js";

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment, threadId, owner) {
    const id = `comment-${this._idGenerator()}`;
    const { content } = addComment;
    const createdAt = new Date().toISOString();

    const query = {
      text: `INSERT INTO comments(id, content, thread, owner, created_at, updated_at)
             VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner`,
      values: [id, content, threadId, owner, createdAt, createdAt],
    };

    const { rows } = await this._pool.query(query);
    return rows[0];
  }
}

export default CommentRepositoryPostgres;
