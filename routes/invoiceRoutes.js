// routes/invoiceRoutes.js
import express from "express";
import {
  generateInvoice,
  getAllInvoices,
  getInvoiceById,
  getInvoiceByAppointment,
  markInvoicePaid,
  deleteInvoice,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/", generateInvoice);
router.get("/", getAllInvoices);
router.get("/appointment/:appointment_id", getInvoiceByAppointment);
router.get("/:id", getInvoiceById);
router.patch("/:id/pay", markInvoicePaid);
router.delete("/:id", deleteInvoice);

export default router;
