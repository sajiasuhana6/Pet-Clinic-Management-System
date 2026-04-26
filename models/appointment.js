// models/Appointment.js
class Appointment {
  constructor({ appointment_id = null, pet_id, date, time, status = "scheduled" }) {
    this.appointment_id = appointment_id;
    this.pet_id = pet_id;
    this.date = date;
    this.time = time;
    this.status = status;
  }

  getApptId() {
    return this.appointment_id;
  }
  updateStatus(s) {
    this.status = s;
  }

  toMap() {
    return {
      appointment_id: this.appointment_id,
      pet_id: this.pet_id,
      date: this.date,
      time: this.time,
      status: this.status,
    };
  }
}

export default Appointment;
