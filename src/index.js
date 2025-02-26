//imports
const express = require('express');
const cors = require('cors');
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//crear el servidor
const server = express();


// configurar el servidor
server.use(cors());
server.use(express.json());
require("dotenv").config();

//función de connexión con la BD
async function connectionBD() {
  const connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.DATABASE,
  })
  connection.connect();
  return connection;
};


//ENDPOINTS
//Lista de todos los libros
server.get('/books', async (req, res) => {
  try {
    const connection = await connectionBD();
    const select = "SELECT * FROM libros";
    const [result] = await connection.query(select); 
    res.status(200).json(result);
    connection.end();

  } catch (error) {
    res.status(500).json({
      success : false,
      data : error
   })}
})

//Añadir libro a la biblioteca
server.post("/books/newBook", async (req, res) => {
  try {
    const connection = await connectionBD();
    const newBook = req.body;
    console.log(newBook)
    if(!newBook) {
      return res.status(400).json({
        success: false,
        message: "No se ha encontrado ningún libro",
      })
    };

    const insertSQL = "INSERT INTO libros (nombreLibroLibro, nombreAutora, editorial, tematica, publicacion, idioma, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [resultBook] = await connection.query(insertSQL, [
      newBook.nombreLibro, 
      newBook.nombreAutora, 
      newBook.editorial, 
      newBook.tematica, 
      newBook.publicacion, 
      newBook.idioma,
      newBook.imagen,
    ]);
    connection.end();

    if(resultBook.insertId) {
      res.status(201).json({
        success: true,
        id: resultBook.insertId,
      });
      
    } else {
      res.status(400).json({
        success: false,
        message: "No se ha podido añadir el libro",
      })};
      connection.end();

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success : false,
      data : error
    });
  }
})

//Actulizar o modificar un libro ya existente
server.put("/books/:id", async (req, res) => {
  try {
  const connection = await connectionBD();
  const {id} = req.params;
  const {nombreLibro, nombreAutora, editorial, tematica, publicacion, idioma, imagen} = req.body;
  const updateSQL = "UPDATE libros SET nombreLibro = ?, nombreAutora = ?, editorial = ?, tematica = ?, publicacion = ?, idioma = ?, imagen = ? WHERE id = ?"
  const [result] = await connection.query(updateSQL, [nombreLibro, nombreAutora, editorial, tematica, publicacion, idioma, imagen, id]);

  if(result.affectedRows > 0) {
    res.status(200).json({success: true});
  }else {
    res.status(400).json({success: false, message: "Ha ocurrido un error"});
  }
  connection.end();

  } catch (error) {
    res.status(500).json({
      success : false,
      data : error
    });
    console.log(error)
  }
  
});

//Eliminar un libro 
server.delete("/books/:id", async (req, res) => {
  try {
    const connection = await connectionBD();
  const {id} = req.params;
  const deleteSQL = "DELETE FROM libros WHERE id = ?"
  const [result] = await connection.query(deleteSQL, [id]);
  connection.end();

  if (result.affectedRows > 0) {
    res.status(200).json({success: true});
  } else {
    res
    .status(400)
    .json({
      success:true,
      message: "Ha ocurrido un error al eliminar"
    })
  }
  } catch (error) {
    res.status(500).json({
      success : false,
      data : error
  })};
});

//Registro usuaria
server.post("/register", async (req, res) => {
  try {
  const connection = await connectionBD();
  const {email, pass} = req.body;
  const selectEmail = "SELECT email FROM usuarios_db WHERE email = ?";
  const [emailResult] = await connection.query(selectEmail, [email]);
  connection.end();


  if(emailResult.length === 0) {
    const passwordHased = await bcrypt.hash(pass, 10);
    const insertUser = "INSERT INTO usuarios_db (email, password) VALUES (?, ?)";
    const [resultUser] = await connection.query(insertUser, [email, passwordHased]);

    res.status(200).json({
        "success": true,
        "id": resultUser.insertId
    })
  } else {
    res.status(400).json({
      "success": false,
      "error": error
    })
  }
  } catch (error) {
    res.status(500).json({
      success : false,
      data : error
    });
  }
  
})

//Inicio de sesión
server.post("/login", async (req, res) => {
  try {
    const connection = await connectionBD();
    const {email, pass} = req.body;

    const selectSQL = "SELECT email, hashed_pasword, id FROM usuarios_db WHERE email = ?";
    const [emailResult] = await connection.query(selectSQL, [email]);
    
    if(emailResult.length !== 0) {
      const passDB = emailResult[0].hashed_password;
      const isSamePassword = await bcrypt.compare(pass, passDB);
      
      if(isSamePassword) {
        const infoToken = {email: emailResult[0].email, id: emailResult[0].id};
        const token = jwt.sign(infoToken, "pepino", {expiresIn: "2h"});

        res.status(201).json({
          success: true,
          token: token
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Contraseña incorrecta"
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Correo electrónico incorrecto"
      });
    }
    connection.end();

  } catch (error) {
    res.status(500).json({
      success : false,
      message: "No existe usuario con este correo"
    });
  }
});

function auth(req, res, next) {
  try {
    const tokenString = req.headers.authorization;
  
  if(!tokenString) {
    res.status(400).json({
      success: false,
      message: "No se ha podido autorizar la entrada"
    }); 
  } else {
      try {
      const token = tokenString.split(" ") [1];
      const verifyToken = jwt.verify(token, "pepino");
      req.dataUser = verifyToken;  
      next();
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error,
        });
      }
  }
  } catch (error) {
    res.status(500).json({
      success : false,
      data : error
    });
  }

}

//Import de la función auth
server.use("/login/porfile", auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Has accedido a tu perfil",
    dataUser: req.dataUser
  });
});

//Puerto del navegador
const apiURL = process.env.URL_SERVER;
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running ${apiURL}`);
});
