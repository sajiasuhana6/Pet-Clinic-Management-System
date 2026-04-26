// models/Appointment.js
class Appointment {
  constructor({ appt_id = null, pet_id, date, time, status = "scheduled" }) {
    this.appt_id = appt_id;
    this.pet_id = pet_id;
    this.date = date;
    this.time = time;
    this.status = status;
  }

  getApptId() {
    return this.appt_id;
  }
  updateStatus(s) {
    this.status = s;
  }

  toMap() {
    return {
      appt_id: this.appt_id,
      pet_id: this.pet_id,
      date: this.date,
      time: this.time,
      status: this.status,
    };
  }
}

export default Appointment;
