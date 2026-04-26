// controllers/invoiceController.js
import ClinicSystem from "../facade/clinicSystem.js";

const clinic = ClinicSystem.getInstance();

export const generateInvoice = async (req, res, next) => {
  try {
    const { appt_id, services } = req.body;
    const invoice = await clinic.generateInvoice(appt_id, services);
    res.status(201).json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};

export const getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await clinic.getAllInvoices();
    res.status(200).json({ success: true, data: invoices });
  } catch (err) {
    next(err);
  }
};

export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await clinic.getInvoiceById(Number(req.params.id));
    res.status(200).json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};

export const getInvoiceByAppointment = async (req, res, next) => {
  try {
    const invoice = await clinic.getInvoiceByAppointment(
      Number(req.params.appt_id),
    );
    res.status(200).json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};

export const markInvoicePaid = async (req, res, next) => {
  try {
    const invoice = await clinic.markInvoicePaid(Number(req.params.id));
    res.status(200).json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};

export const deleteInvoice = async (req, res, next) => {
  try {
    const result = await clinic.deleteInvoice(Number(req.params.id));
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
