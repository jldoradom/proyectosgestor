// creamnos el objeto del ORM de mongo
const mongoose = require('mongoose');
// Objeto para la libreria dotenv para leer las variables de entorno
require('dotenv').config({ path: 'variables.env' });
// creamos la conexion a la db con esta funcion y al objeto mongoose y a la 
// libreria dotenv para poder usar la variable de entorno DB_MONGO
const conectarDB = async() => {
    try {
       await mongoose.connect("mongodb+srv://dbuser:12345@cluster0-qpgzc.mongodb.net/merntasks", {
           useNewUrlParser: true,
           useUnifiedTopology: true,
           useFindAndModify: false 

       });
       console.log('DB Conectada');
    } catch (error) {
        console.log(error);
        process.exit(1); // Detener la app
    }
}

module.exports = conectarDB;

