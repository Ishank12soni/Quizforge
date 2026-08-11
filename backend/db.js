const { Pool } = require("pg");

const pool = new Pool({
  database: "quizforge",
  host: "localhost",
  port: 5432,
});

module.exports = pool;
