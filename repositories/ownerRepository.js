// repositories/OwnerRepository.js
import IStorageStrategy from "./IStorageStrategy.js";
import SQLiteStorageStrategy from "./SQLiteStorageStrategy.js";

class OwnerRepository extends IStorageStrategy {
  #strategy;

  constructor(strategy = new SQLiteStorageStrategy()) {
    super();
    this.#strategy = strategy;
  }

  save(data) {
    return this.#strategy.save("owner", data);
  }
  findById(id) {
    return this.#strategy.findById("owner", id);
  }
  findAll() {
    return this.#strategy.findAll("owner");
  }
  findByField(field, val) {
    return this.#strategy.findByField("owner", field, val);
  }
  update(id, data) {
    return this.#strategy.update("owner", id, data);
  }
  delete(id) {
    return this.#strategy.delete("owner", id);
  }
  exists(id) {
    return this.#strategy.exists("owner", id);
  }

  // owner-specific
  findByEmail(email) {
    return this.#strategy.findByField("owner", "email", email);
  }
  findByName(name) {
    return this.#strategy.findByField("owner", "name", name);
  }
}

export default OwnerRepository;
