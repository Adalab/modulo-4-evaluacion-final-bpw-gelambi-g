//imports
const express = require('express');
const cors = require('cors');
const mysql = require("mysql2/promise");

//crear el servidor
const server = express();
require("dotenv").config();

// configurar el servidor
server.use(cors());
server.use(express.json());

//función de connexión con la BD
async function connectionBD() {
  const connection = await mysql.createConnection({
    host: process.env.HOST || '127.0.0.1',
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.DATABASE,
    // host: "localhost",
    // user: "root",
    // password: "Vilaamish3840",
    // database: "biblioteca",
  })
  connection.connect();
  return connection;
};
connectionBD();

const apiURL = process.env.URL_SERVER;

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running ${apiURL}`);
});