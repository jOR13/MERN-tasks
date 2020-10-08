const express = require('express');
const conectarDB= require ('./config/db');
const cors = require('cors')

//crear el server
const app = express();


//COnectar a la base de datos
conectarDB();

//habilitar cors
app.use(cors());

//Habilitar express.json
app.use(express.json({extended: true}));


//puerto de la app
const PORT = process.env.PORT || 4000;

//Importar rutas

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));


//Definir la pagina principal
// app.get('/', (req, res)=>{
//     res.send('Hola mundo')
// })



//arrancar la app
// app.listen(port, '0.0.0.0', () => {
//     console.log(`El servidor esta funcionando en el puerto ${port}`);
// })

app.listen(5000, function(){
    console.log('listening on *:5000');
  });