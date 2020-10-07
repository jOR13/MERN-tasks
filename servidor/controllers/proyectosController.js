const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

exports.crearProyecto = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //crear nuevo proyecto
    const proyecto = new Proyecto(req.body);

    //Guardar creadro via JWT
    proyecto.creador = req.usuario.id;

    //Guardamos el poryecto
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error al crear");
  }
};

//Obtiene todos los poryectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creado: -1,
    });
    res.json({ proyectos });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error al buscar");
  }
};
//ACTUALIZA UN PORYECTO
exports.actualizarProyecto = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //Extraer la info del poryecto
  const { nombre } = req.body;
  const nuevoProyecto = {};
  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }
  try {
    //Revisar el ID
    let proyecto = await Proyecto.findById(req.params.id);
    //Revisar si el poryecto existe
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    //Verificar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id)
      return res.status(401).json({ msg: "No autorizado" });
    //actualizar
    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );
    res.json({ proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error al actualizar");
  }
};

//Elimina un proyecto por su ID
exports.eliminarProyecto = async (req, res) => {
  try {
    //Revisar el ID
    let proyecto = await Proyecto.findById(req.params.id);
    //Revisar si el poryecto existe
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    //Verificar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id)
      return res.status(401).json({ msg: "No autorizado" });

    //Eliminar el proyecto
    proyecto = await Proyecto.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Proyecto eliminado: "+req.params.id });

    } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error al eliminar");
  }
};
