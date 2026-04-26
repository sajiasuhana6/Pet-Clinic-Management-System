// factory/EntityFactory.js
import Owner from "../models/owner.js";
import Pet from "../models/pet.js";
import Appointment from "../models/appointment.js";
import Invoice from "../models/invoice.js";

class EntityFactory {
  createOwner(data) {
    this.#validateFields(data, ["name", "phone"]);
    return new Owner(data);
  }

  createPet(data) {
    this.#validateFields(data, ["owner_id", "name", "species"]);
    return new Pet(data);
  }

  createAppointment(data) {
    this.#validateFields(data, ["pet_id", "date", "time"]);
    return new Appointment(data);
  }

  createInvoice(data) {
    this.#validateFields(data, ["appt_id"]);
    return new Invoice(data);
  }

  #validateFields(data, requiredFields) {
    const missing = requiredFields.filter(
      (field) =>
        data[field] === undefined || data[field] === null || data[field] === "",
    );

    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }
  }
}

export default EntityFactory;
