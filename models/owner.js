// models/Owner.js
class Owner {
  constructor({ owner_id = null, name, phone, email }) {
    this.owner_id = owner_id;
    this.name = name;
    this.phone = phone;
    this.email = email;
  }

  getId() {
    return this.owner_id;
  }
  getName() {
    return this.name;
  }

  toMap() {
    return {
      owner_id: this.owner_id,
      name: this.name,
      phone: this.phone,
      email: this.email,
    };
  }
}

export default Owner;
