const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const  { validationResult } = require('express-validator');

// Crear una nueva tarea
exports.crearTarea = async (req, res) => {
     // revisar si hay errores
     const errores = validationResult(req);
     if( !errores.isEmpty() ){
         return res.status(400).json({ errores: errores.array() });
     }

     
     try {
         // Extraer proyecto y revisar que exista
        const { proyecto } = req.body;

         const existePoyecto = await Proyecto.findById(proyecto);
         if(!existePoyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
         }

         // Revisar si pertenece al usuario autenticado
         if(existePoyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado'})
        }

        // Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });




         
     } catch (error) {
         console.log(error);
         res.status(500).json({ msg: 'Hubo un error' });
     }

 

}

// Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
     // revisar si hay errores
     const errores = validationResult(req);
     if( !errores.isEmpty() ){
         return res.status(400).json({ errores: errores.array() });
     }


     try {
        // Extraer proyecto y revisar que exista
        const { proyecto } = req.query;

        

        const existePoyecto = await Proyecto.findById(proyecto);
        if(!existePoyecto) {
           return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Revisar si pertenece al usuario autenticado
        if(existePoyecto.creador.toString() !== req.usuario.id) {
           return res.status(401).json({ msg: 'No autorizado'})
       }

       // Obtener las tareas por proyecto
       const tareas =  await Tarea.find({ proyecto }).sort({ creado: -1});
       res.json({ tareas })
         
     } catch (error) {
         console.log(error);
         res.status(500).json({ msg: 'Hubo un error en el servidor' })
         
     }

}
// Actualizar tarea
exports.actualizarTarea = async (req, res) => {
       // revisar si hay errores
       const errores = validationResult(req);
       if( !errores.isEmpty() ){
           return res.status(400).json({ errores: errores.array() });
       }

    try {
        // Extraer proyecto y revisar que exista
        const { proyecto, nombre, estado } = req.body;
        // Si existe la tarea
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea) {
           return res.status(401).json({ msg: 'No existe la tarea'});
        }
       
        // extraer el proyecto
        const existePoyecto = await Proyecto.findById(proyecto);
        
        // Revisar si pertenece al usuario autenticado
        if(existePoyecto.creador.toString() !== req.usuario.id) {
           return res.status(401).json({ msg: 'No autorizado'});
       }

     
     
       // Crear un objeto con la nueva info de la tarea
       const nuevaTarea = {};
       // si se envia un nombre por la requiest
        // Se cambia el nombre de la tarea
        nuevaTarea.nombre = nombre;
        // Se cambio el estado de la tarea
        nuevaTarea.estado = estado;
       

        // Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({ _id : req.params.id }, nuevaTarea, {new: true} ); 
        res.json({ tarea });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' })
        
    }

}

// Elimnar una tarea
exports.eliminarTarea = async (req, res) =>{

    // revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        // Extraer proyecto y revisar que exista
        const { proyecto } = req.query;
        // Si existe la tarea
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea) {
            return res.status(401).json({ msg: 'No existe la tarea'});
        }
        
        // extraer el proyecto
        const existePoyecto = await Proyecto.findById(proyecto);

        
        
        // Revisar si pertenece al usuario autenticado
        if(existePoyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado'});
        }

        // Eliminar 
        await Tarea.findOneAndRemove({ _id : req.params.id });
        res.json({ msg: "Tarea Eliminada" })

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' })
        
    }


}
 

