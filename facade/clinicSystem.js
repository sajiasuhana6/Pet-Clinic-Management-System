// facade/ClinicSystem.js
import EntityFactory from "../factory/EntityFactory.js";
import OwnerRepository from "../repositories/ownerRepository.js";
import PetRepository from "../repositories/petRepository.js";
import AppointmentRepository from "../repositories/appointmentRepository.js";
import InvoiceRepository from "../repositories/invoiceRepository.js";
import InvoiceBuilder from "../services/invoiceBuilder.js";
import NotificationService, {
  EVENTS,
} from "../services/notificationService.js";

class ClinicSystem {
  static #instance = null;

  #factory;
  #ownerRepo;
  #petRepo;
  #appointmentRepo;
  #invoiceRepo;
  #invoiceBuilder;
  #notifier;

  constructor() {
    if (ClinicSystem.#instance) {
      return ClinicSystem.#instance;
    }

    this.#factory = new EntityFactory();
    this.#ownerRepo = new OwnerRepository();
    this.#petRepo = new PetRepository();
    this.#appointmentRepo = new AppointmentRepository();
    this.#invoiceRepo = new InvoiceRepository();
    this.#invoiceBuilder = new InvoiceBuilder();
    this.#notifier = NotificationService.getInstance();

    ClinicSystem.#instance = this;
  }

  static getInstance() {
    if (!ClinicSystem.#instance) {
      new ClinicSystem();
    }
    return ClinicSystem.#instance;
  }

  // ============================================================
  // OWNER MANAGEMENT
  // ============================================================

  async addOwner(data) {
    const owner = this.#factory.createOwner(data);

    // check duplicate email
    const existing = data.email ? await this.#ownerRepo.findByEmail(data.email) : [];
    if (existing.length > 0) {
      throw new Error(`Owner with email "${data.email}" already exists`);
    }

    const result = await this.#ownerRepo.save(owner.toMap());
    const saved = await this.#ownerRepo.findById(result.id);

    this.#notifier.notify(EVENTS.OWNER_REGISTERED, saved);
    return saved;
  }

  async getAllOwners() {
    return await this.#ownerRepo.findAll();
  }

  async getOwnerById(id) {
    const owner = await this.#ownerRepo.findById(id);
    if (!owner) throw new Error(`Owner with ID ${id} not found`);
    return owner;
  }

  async searchOwnerByName(name) {
    const owners = await this.#ownerRepo.findByName(name);
    if (owners.length === 0)
      throw new Error(`No owners found with name "${name}"`);
    return owners;
  }

  async updateOwner(id, data) {
    await this.#assertExists("owner", id);
    await this.#ownerRepo.update(id, data);
    return await this.#ownerRepo.findById(id);
  }

  async deleteOwner(id) {
    await this.#assertExists("owner", id);
    await this.#ownerRepo.delete(id);
    return { message: `Owner ${id} deleted successfully` };
  }

  // ============================================================
  // PET MANAGEMENT
  // ============================================================

  async addPet(data) {
    // owner must exist before registering a pet
    await this.#assertExists("owner", data.owner_id);

    const pet = this.#factory.createPet(data);
    const result = await this.#petRepo.save(pet.toMap());
    const saved = await this.#petRepo.findById(result.id);

    this.#notifier.notify(EVENTS.PET_REGISTERED, saved);
    return saved;
  }

  async getAllPets() {
    return await this.#petRepo.findAll();
  }

  async getPetById(id) {
    const pet = await this.#petRepo.findById(id);
    if (!pet) throw new Error(`Pet with ID ${id} not found`);
    return pet;
  }

  async getPetsByOwner(owner_id) {
    await this.#assertExists("owner", owner_id);
    return await this.#petRepo.findByOwner(owner_id);
  }

  async updatePet(id, data) {
    await this.#assertExists("pet", id);
    await this.#petRepo.update(id, data);
    return await this.#petRepo.findById(id);
  }

  async deletePet(id) {
    await this.#assertExists("pet", id);
    await this.#petRepo.delete(id);
    return { message: `Pet ${id} deleted successfully` };
  }

  // ============================================================
  // APPOINTMENT SCHEDULING
  // ============================================================

  async scheduleAppointment(data) {
    // pet must exist before scheduling
    await this.#assertExists("pet", data.pet_id);

    const appointment = this.#factory.createAppointment(data);
    const result = await this.#appointmentRepo.save(appointment.toMap());
    const saved = await this.#appointmentRepo.findById(result.id);

    this.#notifier.notify(EVENTS.APPOINTMENT_CREATED, saved);
    return saved;
  }

  async getAllAppointments() {
    return await this.#appointmentRepo.findAll();
  }

  async getAppointmentById(id) {
    const appt = await this.#appointmentRepo.findById(id);
    if (!appt) throw new Error(`Appointment with ID ${id} not found`);
    return appt;
  }

  async getAppointmentsByPet(pet_id) {
    await this.#assertExists("pet", pet_id);
    return await this.#appointmentRepo.findByPet(pet_id);
  }

  async getAppointmentsByDate(date) {
    return await this.#appointmentRepo.findByDate(date);
  }

  async updateAppointment(id, data) {
    await this.#assertExists("appointment", id);
    await this.#appointmentRepo.update(id, data);
    const updated = await this.#appointmentRepo.findById(id);

    this.#notifier.notify(EVENTS.APPOINTMENT_UPDATED, updated);
    return updated;
  }

  async cancelAppointment(id) {
    await this.#assertExists("appointment", id);
    await this.#appointmentRepo.update(id, { status: "cancelled" });
    const updated = await this.#appointmentRepo.findById(id);

    this.#notifier.notify(EVENTS.APPOINTMENT_CANCELLED, updated);
    return updated;
  }

  // ============================================================
  // BILLING AND INVOICE MANAGEMENT
  // ============================================================

  async generateInvoice(appt_id, services) {
    // appointment must exist
    await this.#assertExists("appointment", appt_id);

    // one invoice per appointment
    const existing = await this.#invoiceRepo.findByAppointment(appt_id);
    if (existing.length > 0) {
      throw new Error(`Invoice already exists for appointment ${appt_id}`);
    }

    // build invoice step by step using Builder
    this.#invoiceBuilder.reset();
    this.#invoiceBuilder.setAppointment(appt_id);

    for (const { serviceName, price } of services) {
      this.#invoiceBuilder.addServiceItem(serviceName, price);
    }

    const invoice = this.#invoiceBuilder.build();
    const result = await this.#invoiceRepo.save(invoice.toMap());
    const saved = await this.#invoiceRepo.findById(result.id);

    this.#notifier.notify(EVENTS.INVOICE_GENERATED, saved);
    return saved;
  }

  async getAllInvoices() {
    return await this.#invoiceRepo.findAll();
  }

  async getInvoiceById(id) {
    const invoice = await this.#invoiceRepo.findById(id);
    if (!invoice) throw new Error(`Invoice with ID ${id} not found`);
    return invoice;
  }

  async getInvoiceByAppointment(appt_id) {
    await this.#assertExists("appointment", appt_id);
    return await this.#invoiceRepo.findByAppointment(appt_id);
  }

  async markInvoicePaid(id) {
    await this.#assertExists("invoice", id);
    await this.#invoiceRepo.update(id, { payment_status: "paid" });
    const updated = await this.#invoiceRepo.findById(id);

    this.#notifier.notify(EVENTS.INVOICE_PAID, updated);
    return updated;
  }

  async deleteInvoice(id) {
    await this.#assertExists("invoice", id);
    await this.#invoiceRepo.delete(id);
    return { message: `Invoice ${id} deleted successfully` };
  }

  // ============================================================
  // PRIVATE HELPERS
  // ============================================================

  async #assertExists(type, id) {
    const repoMap = {
      owner: this.#ownerRepo,
      pet: this.#petRepo,
      appointment: this.#appointmentRepo,
      invoice: this.#invoiceRepo,
    };

    const repo = repoMap[type];
    if (!repo) throw new Error(`Unknown entity type: ${type}`);

    const exists = await repo.exists(id);
    if (!exists) throw new Error(`${type} with ID ${id} not found`);
  }
}

export default ClinicSystem;
