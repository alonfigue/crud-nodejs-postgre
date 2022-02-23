const { Pool } = require('pg');
const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config();

const port = process.env.PORT;

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
    <title>CRUD</title>
    </head>
    <body>
    
    <form action="/info/add" method="POST">
    <label for="add">AGREGAR PERSONA:</label>
    <input type="text" name="nom" id="nom">
    <input type="text" name="ap" id="ap">
    <input type="text" name="ci" id="ci">
    <input type="text" name="age" id="age">
    <input type="text" name="gender" id="gender">
    <input type="submit" value="CREATE">
    </form>
    
    <form action="/info/get" method="GET">
    <input type="submit" value="VER DATOS DE LA BD (READ)">
    </form>
    
    
    <form action="/info/update" method="POST">
    <label for="oldCI">EDITAR DATOS DE UNA PERSONA (C.I.):</label>
    <input type="text" name="oldCI" id="oldCI">
    <label for="newData">NUEVOS DATOS DE PERSONA:</label>
    <input type="text" name="newNom" id="newNom">
    <input type="text" name="newAp" id="newAp">
    <input type="text" name="newCI" id="newCI">
    <input type="text" name="newAge" id="newAge">
    <input type="text" name="newGen" id="newGen">
    <input type="submit" value="UPDATE">
    </form>
    
    
    <form action="/info/delete" method="POST">
    <label for="delete">ELIMINAR PERSONA (C.I.):</label>
    <input type="text" name="delete" id="delete">
    <input type="submit" value="DELETE">
    </form>
    
    
    </body>
    </html>`);
});


app.listen(port, () => {
    console.log('Server started on port '+ port);
});



app.post('/info/add', (req, res) => {
    try {
        pool.connect(async (error, client, release) => {
            let resp = await client.query(`INSERT INTO personas (Nombre, Apellido, Cedula, Edad, Sexo) VALUES ('${req.body.nom}', '${req.body.ap}', '${req.body.ci}', '${req.body.age}', '${req.body.gender}')`);
            release();
            res.redirect('/info/get');
        });
    } catch (error) {
        console.log(error)
    }
});

app.get('/info/get', (req, res) => {
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



app.post('/info/update', (req, res) => {
    try {
        pool.connect(async (error, client, release) => {
            let resp = await client.query(`UPDATE personas SET Nombre = '${req.body.newNom}', Apellido = '${req.body.newAp}', Cedula = '${req.body.newCI}', Edad = '${req.body.newAge}', Sexo = '${req.body.newGen}' WHERE Cedula = '${req.body.oldCI}'`);
            release();
            res.redirect('/info/get');
        });
    } catch (error) {
        console.log(error)
    }
});


app.post('/info/delete', (req, res) => {
    try {
        pool.connect(async (error, client, release) => {
            let resp = await client.query(`DELETE FROM personas WHERE Cedula = '${req.body.delete}'`);
            release();
            res.redirect('/info/get');
        });
    } catch (error) {
        console.log(error)
    }
});




//--------------------------------------- funciones de la db en código -----------------------------------------------------------------------------------
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