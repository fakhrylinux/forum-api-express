export const up = (pgm) => {
  pgm.createTable("replies", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    comment: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "comments",
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
  pgm.dropTable("replies");
};
