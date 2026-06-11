export const up = (pgm) => {
  pgm.createTable("user_comment_likes", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      references: "users",
      onDelete: "CASCADE",
      notNull: true,
    },
    comment_id: {
      type: "VARCHAR(50)",
      references: "comments",
      onDelete: "CASCADE",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "user_comment_likes",
    "unique_user_id_and_comment_id",
    "UNIQUE(user_id, comment_id)",
  );
};

export const down = (pgm) => {
  pgm.dropTable("user_comment_likes");
};
