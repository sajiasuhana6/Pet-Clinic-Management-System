// repositories/InvoiceRepository.js
import IStorageStrategy from "./IStorageStrategy.js";
import SQLiteStorageStrategy from "./SQLiteStorageStrategy.js";

class InvoiceRepository extends IStorageStrategy {
  #strategy;

  constructor(strategy = new SQLiteStorageStrategy()) {
    super();
    this.#strategy = strategy;
  }

  save(data) {
    return this.#strategy.save("invoice", data);
  }
  findById(id) {
    return this.#strategy.findById("invoice", id);
  }
  findAll() {
    return this.#strategy.findAll("invoice");
  }
  findByField(field, val) {
    return this.#strategy.findByField("invoice", field, val);
  }
  update(id, data) {
    return this.#strategy.update("invoice", id, data);
  }
  delete(id) {
    return this.#strategy.delete("invoice", id);
  }
  exists(id) {
    return this.#strategy.exists("invoice", id);
  }

  // invoice-specific
  findByAppointment(appointment_id) {
    return this.#strategy.findByField("invoice", "appointment_id", appointment_id);
  }
  findByPaymentStatus(status) {
    return this.#strategy.findByField("invoice", "payment_status", status);
  }
}

export default InvoiceRepository;
