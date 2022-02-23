const { Pool } = require('pg');
const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config();

const port = 3000;

app.use(morgan('common'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.listen(port, {
    console.log('Server started on port ${port}')
})



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



//funciones
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


