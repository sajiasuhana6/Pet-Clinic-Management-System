// models/Invoice.js
class Invoice {
  constructor({
    invoice_id = null,
    appointment_id,
    total_amount = 0,
    payment_status = "unpaid",
    created_date,
  }) {
    this.invoice_id = invoice_id;
    this.appointment_id = appointment_id;
    this.total_amount = total_amount;
    this.payment_status = payment_status;
    this.created_date = created_date || new Date().toISOString().split("T")[0];
  }

  getTotal() {
    return this.total_amount;
  }
  markPaid() {
    this.payment_status = "paid";
  }

  toMap() {
    return {
      invoice_id: this.invoice_id,
      appointment_id: this.appointment_id,
      total_amount: this.total_amount,
      payment_status: this.payment_status,
      created_date: this.created_date,
    };
  }
}

export default Invoice;
