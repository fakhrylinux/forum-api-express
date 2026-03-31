import ThreadRepository from "../../Domains/threads/ThreadRepository.js";
import NotFoundError from "../../Commons/exceptions/NotFoundError.js";

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyThreadIsExist(threadId) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError("thread tidak ditemukan");
    }
  }

  async addThread(thread, owner) {
    const id = `thread-${this._idGenerator()}`;
    const { title, body } = thread;
    const createdAt = new Date().toISOString();

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title, owner",
      values: [id, title, body, owner, createdAt, createdAt],
    };

    const { rows } = await this._pool.query(query);

    return rows[0];
  }
}

export default ThreadRepositoryPostgres;
