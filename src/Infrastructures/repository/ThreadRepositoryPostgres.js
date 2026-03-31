import ThreadRepository from "../../Domains/threads/ThreadRepository.js";

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
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
