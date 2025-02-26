**Módulo 4: Evaluación final Gemma Gelambí**


Este es el proyecto de avaluación del módulo 4: Backend.

El proyecto consiste en crear una base de datos y hacer interacciones con esta.

En el proyecto se ha trabajado en el lado del back, se ha utilizado el MySQL Workbench para la creación de la base de datos. Se han utilizado las dependencias express, cors, MySQL, jwl, bcrypt y dotenv. Al trabajar con una base de datos, la conexión y los endpoints se han hecho con funciones asíncronas. Se han utilizado las variables de entorno para garantir la conexión cada programadora desde su usuario, también para el puerto por donde se escucha al navegador.



**Endpoints:**

  - GET: que nos muestra la lista de los libros que tenemos en la BD
  - POST: para añadir nuevos libros a la BD
  - PUT: para modificar o actualizar la información de un libro de la BD
  - DELETE: para eliminar un libro de la BD



**Hacer el registro e inicio de sesión:**

  - Endpoint POST (/register): para hacer el registro de la usuaria y crear una nueva usuaria
  - Endpoint POST (/login): para poder iniciar sesión con tu usuario y contraseña
  - Función auth (función middleware)
  - Import de la función auth

Este último proceso está en desarrollo, aún hay fallos.
