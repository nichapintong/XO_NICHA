const express = require("express");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// MySQL connection config
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // XAMPP default
  password: "", // No password by default
  database: "tic_tac_toe_base", // Your DB name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

const getCurDate = () => {
  const now = new Date();
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok",
  };
  const formattedDate = now
    .toLocaleString("en-US", options)
    .slice(0, 19)
    .replace(/, /g, " ");

  return formattedDate;
};

// Example route
app.get("/call_history", (req, res) => {
  db.query("SELECT * FROM history_game", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post("/save_round", (req, res) => {
  const qry = `INSERT INTO game_round () VALUES ()`;

  db.query(qry, (err, result) => {
    if (err) {
      console.error("Error saving round:", err);
      return res.status(500).send("Error saving round");
    }

    // MySQL returns the insertId in the result object
    res.status(200).json({ id: result.insertId });
  });
});

app.post("/save_history", (req, res) => {
  // console.log(req.body);
  const { id, position } = req.body;
  const qry = `INSERT INTO history_game (idgameround, position) VALUES (?, ?)`;

  if (!id || !position) {
    return res.status(400).send("Missing required fields: id or position");
  }

  db.query(qry, [id, position], (err, result) => {
    if (err) {
      console.error("Error saving round:", err);
      return res.status(500).send("Error saving round");
    }

    // MySQL returns the insertId in the result object
    res.status(200).json({ id: result.insertId });
  });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
