CREATE DATABASE biblioteca;
USE biblioteca;

CREATE TABLE libros (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombreLibro VARCHAR(50) NOT NULL,
    nombreAutora VARCHAR (50) NOT NULL,
    editorial VARCHAR(50),
    tematica VARCHAR(50),
    publicacion SMALLINT, 
    idioma VARCHAR(30),
    imagen TEXT
);
SELECT * FROM libros;
DESCRIBE libros;


INSERT INTO libros (nombreLibro, nombreAutora, editorial, tematica, publicacion, idioma, imagen) VALUES 
("Señoras que se empotraron hace mucho", "Cristina Domenech", "Plan B", "Lesbianismo -- historia", "2019", "Español", "https://imagessl3.casadellibro.com/a/l/s7/33/9788417001933.webp"),
("Corazones perdidos", "Celeste Ng", "Alba Editorial", "Novela distópipca", "2022", "Español", "https://imagessl3.casadellibro.com/a/l/s7/43/9788490659243.webp"),
("Canto jo i la muntanya balla", "Irene Solà", "Editorial Anagrama", "Literatura -- mitos", "2019", "Catalán", "https://imagessl9.casadellibro.com/a/l/s7/89/9788433915689.webp"),
("Manifest SCUM", "Valerie Solanas", "Virus Editorial", "Manifiesto político -- feminismo radical", "2020", "Catalán", "https://imagessl8.casadellibro.com/a/l/s7/58/9788417870058.webp"),
("Cuando te llaman terrorista: una memoria del Black Lives Matter", "Patrisse Khan-Cullors, Asha Bandele", "Capitán Swing", "Historia -- feminismo", "2021", "Español", "https://imagessl6.casadellibro.com/a/l/s7/16/9788412390216.webp");
