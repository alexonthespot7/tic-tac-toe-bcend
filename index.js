const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const e = require('express');
const port = process.env.PORT || 3001;

const db = mysql.createPool({
  host: 'eu-cdbr-west-02.cleardb.net',
  user: 'b75db4e37d2345',
  password: 'a32a7f29',
  database: 'heroku_3eceb6f9eb175a2',
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/register', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  const sqlInsert = "INSERT INTO users (login, password) VALUES (?, ?)";
  db.query(sqlInsert, [login, password], (err, results) => {
    res.send(err);
  });
});

app.post('/api/login', (req, res) => {
  const login = req.body.login;

  const sqlSelect = "SELECT password FROM users WHERE BINARY login=?";
  db.query(sqlSelect, [login], (err, results) => {
    res.send(results);
  });
});

app.post('/api/addResult', (req, res) => {
  const login = req.body.login;
  const resultT = req.body.resultT;
  let sqlUpdate;
  
  if (resultT === 'Crosses') {
    sqlUpdate = "UPDATE users SET cross_wins = cross_wins + 1 WHERE login = ?";
  } else if (resultT === 'Noughts') {
    sqlUpdate = "UPDATE users SET nought_wins = nought_wins + 1 WHERE login = ?";
  } else {
    sqlUpdate = "UPDATE users SET draws = draws + 1 WHERE login = ?";
  }

  db.query(sqlUpdate, [login], (err, results) => {
    res.send(results);
  });  
});

app.post('/api/addBotResult', (req, res) => {
  const login = req.body.login;
  const result = req.body.result;
  let sqlUpdateBot;

  if (result === 'Bot') {
    sqlUpdateBot = "UPDATE users SET bot_wins = bot_wins + 1 WHERE login = ?";
  } else if (result === 'User') {
    sqlUpdateBot = "UPDATE users SET user_wins = user_wins + 1 WHERE login = ?";
  } else {
    sqlUpdateBot = "UPDATE users SET bot_draws = bot_draws + 1 WHERE login = ?";
  };

  db.query(sqlUpdateBot, [login], (err, results) => {
    res.send(results);
  });
});

app.post('/api/getResultsByLogin', (req, res) => {
  const login = req.body.login;

  const sqlSelectById = "SELECT cross_wins, nought_wins, draws, bot_wins, user_wins, bot_draws FROM users WHERE login = ?";
  db.query(sqlSelectById, [login], (err, results) => {
    res.send(results);
  });
});

app.post('/api/resetStat', (req, res) => {
  const login = req.body.login;

  const sqlResetStat = "UPDATE users SET cross_wins=0, nought_wins=0, draws=0, bot_wins=0, user_wins=0, bot_draws=0 WHERE login=?";
  db.query(sqlResetStat, [login], (err, result) => {
    res.send(result);
  });
});

app.get('/api/get', (req, res) => {
  const sqlGet = "SELECT * FROM users";
  db.query(sqlGet, (err, result) => {
    res.send(result);
  });
});

app.listen(port, () => {
    console.log('running on port 3001');
});
