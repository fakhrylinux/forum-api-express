import ReplyRepository from "../../Domains/replies/ReplyRepository.js";
import NotFoundError from "../../Commons/exceptions/NotFoundError.js";
import AuthorizationError from "../../Commons/exceptions/AuthorizationError.js";

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getReplies(comment) {
    const query = {
      text: `SELECT r.id, r.content, r.updated_at, r.owner, r.is_delete, u.username
            FROM replies as r
            INNER JOIN users as u ON r.owner = u.id
            WHERE comment = $1
            ORDER BY r.updated_at ASC`,
      values: [comment],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }

  async addReply(reply, comment, owner) {
    const id = `reply-${this._idGenerator()}`;
    const { content } = reply;
    const createdAt = new Date().toISOString();

    const query = {
      text: `INSERT INTO replies(id, content, comment, owner, created_at, updated_at) 
            VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner`,
      values: [id, content, comment, owner, createdAt, createdAt],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }

  async verifyReplyIsExist(reply) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1",
      values: [reply],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("balasan tidak ditemukan");
    }
  }

  async verifyReplyOwner(reply, owner) {
    const query = {
      text: "SELECT 1 FROM replies WHERE id = $1 AND owner = $2",
      values: [reply, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError("tidak berhak menghapus balasan");
    }
  }

  async deleteReply(reply) {
    const query = {
      text: "UPDATE replies SET is_delete = TRUE WHERE id = $1",
      values: [reply],
    };

    return this._pool.query(query);
  }
}

export default ReplyRepositoryPostgres;
