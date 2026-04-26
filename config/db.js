import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabaseManager {
  static #instance = null;
  #db = null;

  constructor() {
    if (DatabaseManager.#instance) {
      return DatabaseManager.#instance;
    }

    const dataDir = path.join(__dirname, "..", "data");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

    this.#db = new sqlite3.Database(path.join(dataDir, "clinic.db"));
    this.#db.run("PRAGMA journal_mode = WAL");
    this.#db.run("PRAGMA foreign_keys = ON");

    DatabaseManager.#instance = this;
  }

  static getInstance() {
    if (!DatabaseManager.#instance) {
      new DatabaseManager();
    }
    return DatabaseManager.#instance;
  }

  getConnection() {
    return this.#db;
  }

  executeQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      const sqlTrimmed = sql.trim().toUpperCase();

      if (sqlTrimmed.startsWith("SELECT")) {
        this.#db.all(sql, params, (err, rows) => {
          if (err) reject(new Error(`Database query failed: ${err.message}`));
          else resolve(rows);
        });
      } else {
        this.#db.run(sql, params, function (err) {
          if (err) reject(new Error(`Database query failed: ${err.message}`));
          else resolve({ lastID: this.lastID, changes: this.changes });
        });
      }
    });
  }

  initTables() {
    return new Promise((resolve, reject) => {
      this.#db.exec(
        `
        CREATE TABLE IF NOT EXISTS owners (
          owner_id    INTEGER PRIMARY KEY AUTOINCREMENT,
          name        TEXT    NOT NULL,
          phone       TEXT    NOT NULL,
          email       TEXT    NOT NULL UNIQUE
        );

        CREATE TABLE IF NOT EXISTS pets (
          pet_id      INTEGER PRIMARY KEY AUTOINCREMENT,
          owner_id    INTEGER NOT NULL,
          name        TEXT    NOT NULL,
          species     TEXT    NOT NULL,
          age         INTEGER NOT NULL,
          FOREIGN KEY (owner_id) REFERENCES owners(owner_id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS appointments (
          appt_id     INTEGER PRIMARY KEY AUTOINCREMENT,
          pet_id      INTEGER NOT NULL,
          date        TEXT    NOT NULL,
          time        TEXT    NOT NULL,
          status      TEXT    NOT NULL DEFAULT 'scheduled',
          FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS invoices (
          invoice_id      INTEGER PRIMARY KEY AUTOINCREMENT,
          appt_id         INTEGER NOT NULL,
          total_amount    REAL    NOT NULL DEFAULT 0,
          payment_status  TEXT    NOT NULL DEFAULT 'unpaid',
          created_date    TEXT    NOT NULL,
          FOREIGN KEY (appt_id) REFERENCES appointments(appt_id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS medical_visits (
          visit_id          INTEGER PRIMARY KEY AUTOINCREMENT,
          appt_id           INTEGER NOT NULL,
          visit_date        TEXT    NOT NULL,
          diagnosis         TEXT,
          treatment_notes   TEXT,
          FOREIGN KEY (appt_id) REFERENCES appointments(appt_id) ON DELETE CASCADE
        );
      `,
        (err) => {
          if (err) reject(new Error(`Table init failed: ${err.message}`));
          else resolve();
        },
      );
    });
  }
}

export default DatabaseManager;
