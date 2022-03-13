--Comandos para postgresql--

-- BD Creada llamada "datos"
create database datos;

--Creada la tabla "Personas", perteneciente a la BD "datos"
create table Personas (
ID serial, 
Nombre varchar(255) NOT NULL, 
Apellido varchar(255) NOT NULL, 
Cedula integer PRIMARY KEY, 
Edad smallint NOT NULL CHECK (Edad > 0 AND Edad < 125), 
Sexo varchar(255) NOT NULL
);

-- listar la data de la tabla "personas"
select * from personas;