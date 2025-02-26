//imports
const express = require('express');
const cors = require('cors');
const mysql = require("mysql2/promise");

//crear el servidor
const server = express();


// configurar el servidor
server.use(cors());
server.use(express.json());
server.set('view engine', 'ejs');
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


const books = [
  {nombreLibro: 'Señoras que se empotraron hace mucho', nombreAutora: 'Cristina Domenech', editorial: 'Plan B', tematica: 'Lesbianismo -- historia', añoPublicacion: '2019', idioma: 'Español', imagen: 'https://imagessl3.casadellibro.com/a/l/s7/33/9788417001933.webp'},
  {nombreLibro: 'Corazones perdidos', nombreAutora: 'Celeste Ng', editorial: 'Alba Editorial', tematica: 'Novela distópipca', añoPublicacion: '2022', idioma: 'Español', imagen: 'https://imagessl3.casadellibro.com/a/l/s7/43/9788490659243.webp'},
  {nombreLibro: 'Canto jo i la muntanya balla', nombreAutora: 'Irene Solà', editorial: 'Editorial Anagrama', tematica: 'Lesbianismo -- historia', añoPublicacion: '2019', idioma: 'Catalán', imagen: 'https://imagessl9.casadellibro.com/a/l/s7/89/9788433915689.webp'},
  {nombreLibro: 'Manifest SCUM', nombreAutora: 'Valerie Solanas', editorial: 'Virus Editorial', tematica: 'Manifiesto político -- feminismo radical', añoPublicacion: '2020', idioma: 'Catalán', imagen: 'https://imagessl8.casadellibro.com/a/l/s7/58/9788417870058.webp'},
  {nombreLibro: 'Cuando te llaman terrorista: una memoria del Black Lives Matter', nombreAutora: 'Patrisse Khan-Cullors, Asha Bandele', editorial: 'Capitán Swing', tematica: 'Historia -- feminismo', añoPublicacion: '2021', idioma: 'Español', imagen: 'https://imagessl6.casadellibro.com/a/l/s7/16/9788412390216.webp'}
]


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

    const insertSQL = "INSERT INTO libros (nombreLibro, nombreAutora, editorial, tematica, añoPublicacion, idioma, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [resultBook] = await connection.query(insertSQL, [
      newBook.nombreLibro, 
      newBook.nombreAutora, 
      newBook.editorial, 
      newBook.tematica, 
      newBook.añoPublicacion, 
      newBook.idioma,
      newBook.imagen,
    ]);
    connection.end();

    if(resultBook.insertId) {
      books.push(newBook);
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
  const {nombre, autora, editorial, tematica, año, idioma, imagen} = req.body;
  const updateSQL = "UPDATE libros SET nombreLibro = ?, nombreAutora = ?, editorial = ?, tematica = ?, añoPublicacion = ?, idioma = ?, imagen = ? WHERE id = ?"
  const [result] = await connection.query(updateSQL, [nombre, autora, editorial, tematica, año, idioma, imagen, id]);

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


//Puerto del navegador
const apiURL = process.env.URL_SERVER;
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running ${apiURL}`);
});


//servidor estaticos
server.use(express.static("./css"));