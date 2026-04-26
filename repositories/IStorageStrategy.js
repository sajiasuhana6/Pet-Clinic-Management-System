// repositories/IStorageStrategy.js

class IStorageStrategy {
  save(type, data) {
    throw new Error("save() not implemented");
  }
  findById(type, id) {
    throw new Error("findById() not implemented");
  }
  findAll(type) {
    throw new Error("findAll() not implemented");
  }
  findByField(type, field, val) {
    throw new Error("findByField() not implemented");
  }
  update(type, id, data) {
    throw new Error("update() not implemented");
  }
  delete(type, id) {
    throw new Error("delete() not implemented");
  }
  exists(type, id) {
    throw new Error("exists() not implemented");
  }
}

export default IStorageStrategy;
