// services/InvoiceBuilder.js
import Invoice from "../models/invoice.js";

class InvoiceBuilder {
  #appointment_id;
  #services;
  #payment_status;
  #created_date;

  constructor() {
    this.#appointment_id = null;
    this.#services = [];
    this.#payment_status = "unpaid";
    this.#created_date = new Date().toISOString().split("T")[0];
  }

  setAppointment(appointment_id) {
    if (!appointment_id) throw new Error("appointment_id is required to build an invoice");
    this.#appointment_id = appointment_id;
    return this;
  }

  addServiceItem(serviceName, price) {
    if (!serviceName || serviceName.trim() === "") {
      throw new Error("Service name cannot be empty");
    }
    if (typeof price !== "number" || price < 0) {
      throw new Error(`Invalid price for service "${serviceName}"`);
    }

    this.#services.push({ serviceName: serviceName.trim(), price });
    return this;
  }

  setPaymentStatus(status) {
    const allowed = ["unpaid", "paid", "pending"];
    if (!allowed.includes(status)) {
      throw new Error(`Invalid payment status. Allowed: ${allowed.join(", ")}`);
    }
    this.#payment_status = status;
    return this;
  }

  calculateTotal() {
    return parseFloat(
      this.#services.reduce((sum, item) => sum + item.price, 0).toFixed(2),
    );
  }

  build() {
    if (!this.#appointment_id) {
      throw new Error("Cannot build invoice: appointment ID is not set");
    }
    if (this.#services.length === 0) {
      throw new Error("Cannot build invoice: no service items added");
    }

    const total = this.calculateTotal();

    return new Invoice({
      appointment_id: this.#appointment_id,
      total_amount: total,
      payment_status: this.#payment_status,
      created_date: this.#created_date,
    });
  }

  // reset builder for reuse
  reset() {
    this.#appointment_id = null;
    this.#services = [];
    this.#payment_status = "unpaid";
    this.#created_date = new Date().toISOString().split("T")[0];
    return this;
  }

  // read-only snapshot of current state — useful for debugging
  getSummary() {
    return {
      appointment_id: this.#appointment_id,
      services: [...this.#services],
      total_amount: this.calculateTotal(),
      payment_status: this.#payment_status,
      created_date: this.#created_date,
    };
  }
}

export default InvoiceBuilder;
