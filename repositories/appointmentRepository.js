// repositories/AppointmentRepository.js
import IStorageStrategy from "./IStorageStrategy.js";
import SQLiteStorageStrategy from "./SQLiteStorageStrategy.js";

class AppointmentRepository extends IStorageStrategy {
  #strategy;

  constructor(strategy = new SQLiteStorageStrategy()) {
    super();
    this.#strategy = strategy;
  }

  save(data) {
    return this.#strategy.save("appointment", data);
  }
  findById(id) {
    return this.#strategy.findById("appointment", id);
  }
  findAll() {
    return this.#strategy.findAll("appointment");
  }
  findByField(field, val) {
    return this.#strategy.findByField("appointment", field, val);
  }
  update(id, data) {
    return this.#strategy.update("appointment", id, data);
  }
  delete(id) {
    return this.#strategy.delete("appointment", id);
  }
  exists(id) {
    return this.#strategy.exists("appointment", id);
  }

  // appointment-specific
  findByPet(pet_id) {
    return this.#strategy.findByField("appointment", "pet_id", pet_id);
  }
  findByStatus(status) {
    return this.#strategy.findByField("appointment", "status", status);
  }
  findByDate(date) {
    return this.#strategy.findByField("appointment", "date", date);
  }
}

export default AppointmentRepository;
