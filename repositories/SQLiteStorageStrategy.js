// repositories/SQLiteStorageStrategy.js
import DatabaseManager from "../config/db.js";

class SQLiteStorageStrategy {
  #db;

  constructor() {
    this.#db = DatabaseManager.getInstance().getConnection();
  }

  // map entity type to table name and primary key
  #getMeta(type) {
    const map = {
      owner: { table: "owners", pk: "owner_id" },
      pet: { table: "pets", pk: "pet_id" },
      appointment: { table: "appointments", pk: "appt_id" },
      invoice: { table: "invoices", pk: "invoice_id" },
    };

    const meta = map[type];
    if (!meta) throw new Error(`Unknown entity type: ${type}`);
    return meta;
  }

  save(type, data) {
    const { table } = this.#getMeta(type);
    const fields = Object.keys(data).filter(
      (k) => data[k] !== null && data[k] !== undefined,
    );
    const values = fields.map((f) => data[f]);
    const placeholders = fields.map(() => "?").join(", ");
    const sql = `INSERT INTO ${table} (${fields.join(", ")}) VALUES (${placeholders})`;

    return new Promise((resolve, reject) => {
      this.#db.run(sql, values, function (err) {
        if (err) reject(new Error(`save() failed: ${err.message}`));
        else resolve({ id: this.lastID });
      });
    });
  }

  findById(type, id) {
    const { table, pk } = this.#getMeta(type);
    const sql = `SELECT * FROM ${table} WHERE ${pk} = ?`;

    return new Promise((resolve, reject) => {
      this.#db.get(sql, [id], (err, row) => {
        if (err) reject(new Error(`findById() failed: ${err.message}`));
        else resolve(row || null);
      });
    });
  }

  findAll(type) {
    const { table } = this.#getMeta(type);
    const sql = `SELECT * FROM ${table}`;

    return new Promise((resolve, reject) => {
      this.#db.all(sql, [], (err, rows) => {
        if (err) reject(new Error(`findAll() failed: ${err.message}`));
        else resolve(rows);
      });
    });
  }

  findByField(type, field, val) {
    const { table } = this.#getMeta(type);
    const sql = `SELECT * FROM ${table} WHERE ${field} = ?`;

    return new Promise((resolve, reject) => {
      this.#db.all(sql, [val], (err, rows) => {
        if (err) reject(new Error(`findByField() failed: ${err.message}`));
        else resolve(rows);
      });
    });
  }

  update(type, id, data) {
    const { table, pk } = this.#getMeta(type);
    const fields = Object.keys(data).filter((k) => data[k] !== undefined);
    const values = fields.map((f) => data[f]);
    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${pk} = ?`;

    return new Promise((resolve, reject) => {
      this.#db.run(sql, [...values, id], function (err) {
        if (err) reject(new Error(`update() failed: ${err.message}`));
        else resolve({ changes: this.changes });
      });
    });
  }

  delete(type, id) {
    const { table, pk } = this.#getMeta(type);
    const sql = `DELETE FROM ${table} WHERE ${pk} = ?`;

    return new Promise((resolve, reject) => {
      this.#db.run(sql, [id], function (err) {
        if (err) reject(new Error(`delete() failed: ${err.message}`));
        else resolve({ changes: this.changes });
      });
    });
  }

  exists(type, id) {
    const { table, pk } = this.#getMeta(type);
    const sql = `SELECT 1 FROM ${table} WHERE ${pk} = ? LIMIT 1`;

    return new Promise((resolve, reject) => {
      this.#db.get(sql, [id], (err, row) => {
        if (err) reject(new Error(`exists() failed: ${err.message}`));
        else resolve(!!row);
      });
    });
  }
}

export default SQLiteStorageStrategy;
