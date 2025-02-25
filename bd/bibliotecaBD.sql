CREATE DATABASE biblioteca;
USE biblioteca;

CREATE TABLE libros (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombreLibro VARCHAR(50) NOT NULL,
    nombreAutora VARCHAR (50) NOT NULL,
    editorial VARCHAR(50),
    tematica VARCHAR(50),
    añoPublicacion SMALLINT, 
    idioma VARCHAR(30)
);
SELECT * FROM libros;

ALTER TABLE libros RENAME COLUMN añoPublicación TO añoPublicacion;
ALTER TABLE libros MODIFY nombreLibro VARCHAR (100);
ALTER TABLE libros RENAME COLUMN genero TO tematica;

INSERT INTO libros (nombreLibro, nombreAutora, editorial, tematica, añoPublicacion, idioma) VALUES 
("Señoras que se empotraron hace mucho", "Cristina Domenech", "Plan B", "Lesbianismo -- historia", "2019", "Español"),
("Corazones perdidos", "Celeste Ng", "Alba Editorial", "Novela distópipca", "2022", "Español"),
("Canto jo i la muntanya balla", "Irene Solà", "Editorial Anagrama", "Literatura -- mitos", "2019", "Catalán"),
("Manifest SCUM", "Valerie Solanas", "Virus Editorial", "Manifiesto político -- feminismo radical", "2020", "Catalán"),
("Cuando te llaman terrorista: una memoria del Black Lives Matter", "Patrisse Khan-Cullors, Asha Bandele", "Capitán Swing", "Historia -- feminismo", "2021", "Español");
