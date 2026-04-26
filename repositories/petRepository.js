// repositories/PetRepository.js
import IStorageStrategy from "./IStorageStrategy.js";
import SQLiteStorageStrategy from "./SQLiteStorageStrategy.js";

class PetRepository extends IStorageStrategy {
  #strategy;

  constructor(strategy = new SQLiteStorageStrategy()) {
    super();
    this.#strategy = strategy;
  }

  save(data) {
    return this.#strategy.save("pet", data);
  }
  findById(id) {
    return this.#strategy.findById("pet", id);
  }
  findAll() {
    return this.#strategy.findAll("pet");
  }
  findByField(field, val) {
    return this.#strategy.findByField("pet", field, val);
  }
  update(id, data) {
    return this.#strategy.update("pet", id, data);
  }
  delete(id) {
    return this.#strategy.delete("pet", id);
  }
  exists(id) {
    return this.#strategy.exists("pet", id);
  }

  // pet-specific
  findByOwner(owner_id) {
    return this.#strategy.findByField("pet", "owner_id", owner_id);
  }
  findBySpecies(species) {
    return this.#strategy.findByField("pet", "species", species);
  }
}

export default PetRepository;
