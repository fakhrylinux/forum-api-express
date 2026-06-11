/* istanbul ignore file */
import pool from "../src/Infrastructures/database/postgres/pool.js";

const UserCommentLikesTableTestHelper = {
  async addLike({ id, user_id, comment_id }) {
    const query = {
      text: "INSERT INTO user_comment_likes VALUES($1, $2, $3)",
      values: [id, user_id, comment_id],
    };

    await pool.query(query);
  },

  async deleteLike({ user_id, comment_id }) {
    const query = {
      text: "DELETE FROM user_comment_likes WHERE user_id = $1 AND comment_id = $2",
      values: [user_id, comment_id],
    };

    await pool.query(query);
  },

  async findLike(user_id, comment_id) {
    const query = {
      text: "SELECT * FROM user_comment_likes WHERE user_id = $1 AND comment_id = $2",
      values: [user_id, comment_id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM user_comment_likes WHERE 1=1");
  },
};

export default UserCommentLikesTableTestHelper;
