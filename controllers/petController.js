// controllers/petController.js
import ClinicSystem from "../facade/clinicSystem.js";

const clinic = ClinicSystem.getInstance();

export const addPet = async (req, res, next) => {
  try {
    const pet = await clinic.addPet(req.body);
    res.status(201).json({ success: true, data: pet });
  } catch (err) {
    next(err);
  }
};

export const getAllPets = async (req, res, next) => {
  try {
    const pets = await clinic.getAllPets();
    res.status(200).json({ success: true, data: pets });
  } catch (err) {
    next(err);
  }
};

export const getPetById = async (req, res, next) => {
  try {
    const pet = await clinic.getPetById(Number(req.params.id));
    res.status(200).json({ success: true, data: pet });
  } catch (err) {
    next(err);
  }
};

export const getPetsByOwner = async (req, res, next) => {
  try {
    const pets = await clinic.getPetsByOwner(Number(req.params.owner_id));
    res.status(200).json({ success: true, data: pets });
  } catch (err) {
    next(err);
  }
};

export const updatePet = async (req, res, next) => {
  try {
    const pet = await clinic.updatePet(Number(req.params.id), req.body);
    res.status(200).json({ success: true, data: pet });
  } catch (err) {
    next(err);
  }
};

export const deletePet = async (req, res, next) => {
  try {
    const result = await clinic.deletePet(Number(req.params.id));
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
