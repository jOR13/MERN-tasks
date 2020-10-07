const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //Exraer proyecto y comprobar si existe
    const { proyecto } = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);

    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //revisar si el poryecto actual pertenece al user auth
    if (existeProyecto.creador.toString() !== req.usuario.id)
      return res.status(401).json({ msg: "No autorizado" });

    //crear nueva tarea
    const tarea = new Tarea(req.body);
    //Guardamos la tarea
    await tarea.save();
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error al crear la tarea");
  }
};

//Obtener tareas por proyecto ID

exports.obtenerTareas = async (req, res) => {
  try {
    //Exraer proyecto y comprobar si existe
    const { proyecto } = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);

    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //revisar si el poryecto actual pertenece al user auth
    if (existeProyecto.creador.toString() !== req.usuario.id)
      return res.status(401).json({ msg: "No autorizado" });

    //Obtener las tareas del proyecto
    const tareas = await Tarea.find({ proyecto });

    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error al obtener las tareas");
  }
};

//Actualizar tarea
exports.actualizarTarea = async (req, res) => {
  try {
    //Exraer proyecto y comprobar si existe
    const { proyecto, nombre, estado } = req.body;

    //Si la tarea existe o no

    let tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({ msg: "No existe la tarea" });
    }

    //extraer proyecto
    const existeProyecto = await Proyecto.findById(proyecto);

    //revisar si el poryecto actual pertenece al user auth
    if (existeProyecto.creador.toString() !== req.usuario.id)
      return res.status(401).json({ msg: "No autorizado" });

    //Crear un objeto para enviar la ingo

    const nuevaTarea = {};

    if (nombre) {
      nuevaTarea.nombre = nombre;
    }

    if (estado) {
      nuevaTarea.estado = estado;
    }

    //Guardar la tarea
    tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, {
      new: true,
    });

    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error al actualizar la tarea");
  }
};

//Elimina una tarea por su ID
exports.eliminarTarea = async (req, res) => {
  try {
    //Exraer proyecto y comprobar si existe
    const { proyecto } = req.body;

    //Si la tarea existe o no

    let tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({ msg: "No existe la tarea" });
    }

    //extraer proyecto
    const existeProyecto = await Proyecto.findById(proyecto);

    //revisar si el poryecto actual pertenece al user auth
    if (existeProyecto.creador.toString() !== req.usuario.id)
      return res.status(401).json({ msg: "No autorizado" });

    //Eliminar
    await Tarea.findOneAndRemove({ _id: req.params.id });

    res.json({ msg: "Tarea eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error al eliminar la tarea");
  }
};
