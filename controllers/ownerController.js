// controllers/ownerController.js
import ClinicSystem from "../facade/clinicSystem.js";

const clinic = ClinicSystem.getInstance();

export const addOwner = async (req, res, next) => {
  try {
    const owner = await clinic.addOwner(req.body);
    res.status(201).json({ success: true, data: owner });
  } catch (err) {
    next(err);
  }
};

export const getAllOwners = async (req, res, next) => {
  try {
    const owners = await clinic.getAllOwners();
    res.status(200).json({ success: true, data: owners });
  } catch (err) {
    next(err);
  }
};

export const getOwnerById = async (req, res, next) => {
  try {
    const owner = await clinic.getOwnerById(Number(req.params.id));
    res.status(200).json({ success: true, data: owner });
  } catch (err) {
    next(err);
  }
};

export const searchOwnerByName = async (req, res, next) => {
  try {
    const owners = await clinic.searchOwnerByName(req.query.name);
    res.status(200).json({ success: true, data: owners });
  } catch (err) {
    next(err);
  }
};

export const updateOwner = async (req, res, next) => {
  try {
    const owner = await clinic.updateOwner(Number(req.params.id), req.body);
    res.status(200).json({ success: true, data: owner });
  } catch (err) {
    next(err);
  }
};

export const deleteOwner = async (req, res, next) => {
  try {
    const result = await clinic.deleteOwner(Number(req.params.id));
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
