// models/Pet.js
class Pet {
  constructor({ pet_id = null, owner_id, name, species, age }) {
    this.pet_id = pet_id;
    this.owner_id = owner_id;
    this.name = name;
    this.species = species;
    this.age = age;
  }

  getPetId() {
    return this.pet_id;
  }
  getOwner() {
    return this.owner_id;
  }

  toMap() {
    return {
      pet_id: this.pet_id,
      owner_id: this.owner_id,
      name: this.name,
      species: this.species,
      age: this.age,
    };
  }
}

export default Pet;
