import CommentRepository from "../../Domains/comments/CommentRepository.js";
import NotFoundError from "../../Commons/exceptions/NotFoundError.js";
import AuthorizationError from "../../Commons/exceptions/AuthorizationError.js";

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
  async getComments(thread) {
    const query = {
      text: `SELECT c.id, c.owner, c.updated_at, c.content, c.is_delete, u.username 
            FROM comments as c
            INNER JOIN users as u ON c.owner = u.id
            WHERE thread = $1`,
      values: [thread],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }

  async verifyCommentIsExist(comment) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [comment],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("komentar tidak ditemukan");
    }
  }

  async verifyCommentOwner(comment, owner) {
    const query = {
      text: "SELECT 1 FROM comments WHERE id = $1 AND owner = $2",
      values: [comment, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError("tidak berhak menghapus komentar");
    }
  }

  async addComment(comment, thread, owner) {
    const id = `comment-${this._idGenerator()}`;
    const { content } = comment;
    const createdAt = new Date().toISOString();

    const query = {
      text: `INSERT INTO comments(id, content, thread, owner, created_at, updated_at)
             VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner`,
      values: [id, content, thread, owner, createdAt, createdAt],
    };

    const { rows } = await this._pool.query(query);
    return rows[0];
  }

  async deleteComment(comment) {
    const query = {
      text: "UPDATE comments SET is_delete = TRUE WHERE id = $1",
      values: [comment],
    };
    return this._pool.query(query);
  }
}

export default CommentRepositoryPostgres;
