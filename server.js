// server.js
import express from "express";
import cors from "cors";
import ownerRoutes from "./routes/ownerRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import DatabaseManager from "./config/db.js";
import NotificationService, { EVENTS } from "./services/notificationService.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────────────────────────
app.use("/api/owners", ownerRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/invoices", invoiceRoutes);

// ── Health check ─────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Pet Clinic API is running" });
});

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
});

// ── Error handler ────────────────────────────────────────────
// must be last — after all routes
app.use(errorHandler);

// ── Bootstrap ────────────────────────────────────────────────
const bootstrap = () => {
  // init Singleton DB — creates tables on first run
  DatabaseManager.getInstance();
  console.log("[Database] SQLite connected and tables initialized");

  // register system-wide Observer listeners
  const notifier = NotificationService.getInstance();

  notifier.subscribe(EVENTS.OWNER_REGISTERED, "logger", (d) =>
    console.log(`[Event] Owner registered:`, d),
  );
  notifier.subscribe(EVENTS.PET_REGISTERED, "logger", (d) =>
    console.log(`[Event] Pet registered:`, d),
  );
  notifier.subscribe(EVENTS.APPOINTMENT_CREATED, "logger", (d) =>
    console.log(`[Event] Appointment created:`, d),
  );
  notifier.subscribe(EVENTS.APPOINTMENT_UPDATED, "logger", (d) =>
    console.log(`[Event] Appointment updated:`, d),
  );
  notifier.subscribe(EVENTS.APPOINTMENT_CANCELLED, "logger", (d) =>
    console.log(`[Event] Appointment cancelled:`, d),
  );
  notifier.subscribe(EVENTS.INVOICE_GENERATED, "logger", (d) =>
    console.log(`[Event] Invoice generated:`, d),
  );
  notifier.subscribe(EVENTS.INVOICE_PAID, "logger", (d) =>
    console.log(`[Event] Invoice paid:`, d),
  );

  app.listen(PORT, () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
    console.log(`[Server] Health check → http://localhost:${PORT}/health`);
  });
};

bootstrap();
