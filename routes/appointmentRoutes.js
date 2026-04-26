// routes/appointmentRoutes.js
import express from "express";
import {
  scheduleAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByPet,
  getAppointmentsByDate,
  updateAppointment,
  cancelAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", scheduleAppointment);
router.get("/", getAllAppointments);
router.get("/date", getAppointmentsByDate);
router.get("/pet/:pet_id", getAppointmentsByPet);
router.get("/:id", getAppointmentById);
router.put("/:id", updateAppointment);
router.patch("/:id/cancel", cancelAppointment);

export default router;
