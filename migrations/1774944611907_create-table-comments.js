export const up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    thread: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "threads",
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users",
    },
    is_delete: {
      type: "BOOLEAN",
      default: "FALSE",
      notNull: true,
    },
    created_at: {
      type: "TEXT",
      notNull: true,
    },
    updated_at: {
      type: "TEXT",
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("comments");
};
