const { Pool } = require('pg');
const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config();

const port = 3000;



const pool = new Pool ({
    host: 'localhost',
    user: 'postgres',
    password: '28536894af',
    port: '5433',
    database: 'datos'
})

/*
o también válido:
//todo se guarda en la constante llamada config

const config = {
    host: 'localhost',
    user: 'postgres',
    password: '28536894af',
    port: '5433',
    database: 'datos'
};

//conexión 
const pool = new Pool(config);
*/

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
        
        <form action="/info/get" method="GET">
            <input type="submit" value="GET">
        </form>
        
        
        <form action="/info/add" method="POST">
            <label for="add">ADD:</label>
            <input type="text" name="add" id="add">
            <input type="submit" value="ADD">
        </form>
        
        
        <form action="/info/delete" method="POST">
            <label for="delete">DELETE:</label>
            <input type="text" name="delete" id="delete">
            <input type="submit" value="DELETE">
        </form>
        
        
        <form action="/info/update" method="POST">
            <label for="oldValue">OLD VALUE:</label>
            <input type="text" name="oldValue" id="oldValue">
            <label for="newValue">NEW VALUE:</label>
            <input type="text" name="newValue" id="newValue">
            <input type="submit" value="UPDATE">
        </form>
        
    </body>
    </html>`);
});


app.listen(port, () => {
    console.log('Server started on port '+ port);
});

app.get('/info/get', (req, res) => {
    try {
        pool.connect(async (error, client, release) => {
            let resp = await client.query('SELECT * FROM personas');
            release();
            res.json(resp.rows);
        });
    } catch (error) {
        console.log(error)
    }
})












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


