const { Pool } = require('pg');
const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config();

const port = process.env.PORT;

//usando variables de entorno
const pool = new Pool ({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE
})

app.use(morgan('common'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>crud-nodejs-postgresql</title>
    <style>
    
    #Titulo {
        color: rgb(31, 31, 196);
        font-family: Georgia, Verdana, sans-serif;
        font-size: 250%;
        text-align: center;
        
    }
    
    .red-button {
        font-family: Arial, Helvetica, sans-serif;
        background-color: #882018; 
        border-radius: 12px;
        color: white;
        padding: 13px 12px;
        text-align: center;
        font-size: 16px;
        position: relative;
        
        margin: 4px 2px;
        opacity: 0.6;
        transition: 0.3s;
        display: inline-block;
        text-decoration: none;
        cursor: pointer;
        
    }
    
    .red-button:hover {opacity: 1}
    
    .green-button {
        text-align: center;
        font-family: Arial, Helvetica, sans-serif;
        background-color: #236f26; 
        border-radius: 12px;
        color: white;
        padding: 13px 12px;
        text-align: center;
        font-size: 16px;
        position: relative;
        
        margin: 4px 2px;
        opacity: 0.6;
        transition: 0.3s;
        display: inline-block;
        text-decoration: none;
        cursor: pointer;
        
    }
    
    .green-button:hover {opacity: 1}
    
    .db-button {
        position: absolute;
        top: 35%;
        width: 100%;
        text-align: center;
        font-size: 25px;
    }
    
    .top-left-sided {
        position: absolute;
        top: 130px;
        left: 16px;
        font-size: 18px;
        background-color: silver;
    }
    
    .top-right-sided {
        position: absolute;
        top: 100px;
        right: 16px;
        font-size: 18px;
        background-color: silver;
    }
    
    .above-delete {
        position: absolute;
        bottom: 180px;
        left: 20px;
        font-size: 18px;
        background-color: silver;
    }
    
    .left-side {
        position: absolute;
        bottom: 75px;
        left: 20px;
        font-size: 18px;
        background-color: silver;
    }
    
    </style>
    </head>
    <body>
    
    <h1 id="Titulo">IU para hacer uso de un CRUD</h1>
    
    <div class="top-left-sided">
    <form action="/personas/create" method="POST">
    <label for="create">AGREGAR PERSONA A LA TABLA:</label>
    <input placeholder="Nombre" type="text" name="nom" id="nom">
    <input placeholder="Apellido" type="text" name="ap" id="ap">
    <input placeholder="Cedula" type="text" name="ci" id="ci">
    <input placeholder="Edad" type="text" name="age" id="age">
    <input placeholder="Genero" type="text"name="gender" id="gender">
    <input class="red-button" type="submit" value="CREATE">
    </form>
    </div>
    
    
    <div class="db-button">
    <form action="/personas/get" method="GET">
    <input class="green-button" type="submit" value="VER DATOS DE LA TABLA (READ)">
    </form>
    </div>
    
    
    <div class="above-delete">
    <form action="/personas/update" method="POST">
    <label for="oldCI">EDITAR DATOS DE UNA PERSONA:</label>
    <input placeholder="Introducir Cedula actual" type="text" name="oldCI" id="oldCI">
    <p>&nbsp;</p> 
    <label for="newData">NUEVOS DATOS DE PERSONA:</label>
    <input placeholder="Nuevo Nombre" type="text" name="newNom" id="newNom">
    <input placeholder="Nuevo Apellido" type="text" name="newAp" id="newAp">
    <input placeholder="Nueva Cedula" type="text" name="newCI" id="newCI">
    <input placeholder="Nueva Edad" type="text" name="newAge" id="newAge">
    <input placeholder="Nuevo Genero" type="text" name="newGen" id="newGen">
    <input class="red-button" type="submit" value="UPDATE">
    </form>
    </div>
    
    
    <div class="left-side">
    <form action="/personas/delete" method="POST">
    <label for="delete">ELIMINAR PERSONA DE LA TABLA:</label>
    <input placeholder="Introducir Cedula" type="text" name="delete" id="delete">
    <input class="red-button" type="submit" value="DELETE">
    </form>
    </div>
    
    
    </body>
    </html>`);
});


app.listen(port, () => {
    console.log('Server started on port '+ port);
});



app.post('/personas/create', (req, res) => {
    try {
        pool.connect(async (error, client, release) => {
            let resp = await client.query(`INSERT INTO personas (Nombre, Apellido, Cedula, Edad, Sexo) VALUES ('${req.body.nom}', '${req.body.ap}', '${req.body.ci}', '${req.body.age}', '${req.body.gender}')`);
            release();
            res.redirect('/personas/get');
        });
    } catch (error) {
        console.log(error)
    }
});

app.get('/personas/get', (req, res) => {
    try {
        pool.connect(async (error, client, release) => {
            let resp = await client.query(`SELECT * FROM personas`);
            release();
            res.json(resp.rows);
        });
    } catch (error) {
        console.log(error)
    }
});



app.post('/personas/update', (req, res) => {
    try {
        pool.connect(async (error, client, release) => {
            let resp = await client.query(`UPDATE personas SET Nombre = '${req.body.newNom}', Apellido = '${req.body.newAp}', Cedula = '${req.body.newCI}', Edad = '${req.body.newAge}', Sexo = '${req.body.newGen}' WHERE Cedula = '${req.body.oldCI}'`);
            release();
            res.redirect('/personas/get');
        });
    } catch (error) {
        console.log(error)
    }
});


app.post('/personas/delete', (req, res) => {
    try {
        pool.connect(async (error, client, release) => {
            let resp = await client.query(`DELETE FROM personas WHERE Cedula = '${req.body.delete}'`);
            release();
            res.redirect('/personas/get');
        });
    } catch (error) {
        console.log(error)
    }
});




//--------------------------------------- funciones de js usando sql (esto no se usa en la app del crud) -----------------------------------------------------------------------------------
const getPersonas = async () => {
    try {
        const res = await pool.query('select * from personas');
        // console.log(res)
        console.log(res.rows);
        //termina y devuelve la consola
        pool.end();
    } catch (e) {
        console.log(e);
    }
};

const insertPersona = async () => {
    try {
        const text = 'INSERT INTO personas(Nombre, Apellido, Cedula, Edad, Sexo) VALUES ($1, $2, $3, $4, $5)';
        const values = ['Luis', 'Pina', 14582713, 42, 'Masculino'];
        
        const res = await pool.query(text, values);
        console.log(res)
        pool.end();
    } catch (e) {
        console.log(e);
    }
};

const editPersona = async () => {
    const text = 'UPDATE personas SET Nombre = $1 WHERE Nombre = $2';;
    const values = ['Luigi', 'Luis'];
    const res = await pool.query(text, values);
    console.log(res)
    pool.end();
};

const deletePersona = async () => {
    try {
        const text = 'DELETE FROM personas WHERE Nombre = $1';
        const value = ['Luigi'];
        const res = await pool.query(text, value);
        console.log(res)
        pool.end();
    } catch (e) {
        console.log(e);
    }
};