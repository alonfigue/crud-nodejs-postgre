// Basic connection

const { Pool } = require('pg');

/*
también es válido solo:

new Pool ({
    host: 'localhost',
    user: 'postgres',
    password: '',
    database: 'library'
})
*/

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


//funcion para obtener las tablas. Se usa el async await
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

//para llamar una función es: getPersonas(); 

//insertar a las tablas
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


getPersonas();
