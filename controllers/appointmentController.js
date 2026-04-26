// controllers/appointmentController.js
import ClinicSystem from "../facade/clinicSystem.js";

const clinic = ClinicSystem.getInstance();

export const scheduleAppointment = async (req, res, next) => {
  try {
    const appointment = await clinic.scheduleAppointment(req.body);
    res.status(201).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

export const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await clinic.getAllAppointments();
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    next(err);
  }
};

export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await clinic.getAppointmentById(Number(req.params.id));
    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

export const getAppointmentsByPet = async (req, res, next) => {
  try {
    const appointments = await clinic.getAppointmentsByPet(
      Number(req.params.pet_id),
    );
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    next(err);
  }
};

export const getAppointmentsByDate = async (req, res, next) => {
  try {
    const appointments = await clinic.getAppointmentsByDate(req.query.date);
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    next(err);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await clinic.updateAppointment(
      Number(req.params.id),
      req.body,
    );
    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await clinic.cancelAppointment(Number(req.params.id));
    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};
