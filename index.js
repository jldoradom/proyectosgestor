const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// crear el servidor
const app = express();

// Conectar a la bbdd
conectarDB();

// Habilitar cors
app.use(cors());

// Habilitar express.json
app.use( express.json({ extend: true }) );

// puerto del servidor (el cliente  usara el 3000) el nombre PORT es
// por Heroku que lo pide asi
const PORT = process.env.PORT || 4000;

// Definir la pagina principal
app.get('/', (req,res) =>{
    res.send('Hola mundo')
});

// Hacemos que la app use las rutas y las importamos
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));




// arrancar la app o servidor
app.listen(PORT, () =>{
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});



