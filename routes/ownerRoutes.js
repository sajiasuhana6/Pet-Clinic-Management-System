// routes/ownerRoutes.js
import express from "express";
import {
  addOwner,
  getAllOwners,
  getOwnerById,
  searchOwnerByName,
  updateOwner,
  deleteOwner,
} from "../controllers/ownerController.js";

const router = express.Router();

router.post("/", addOwner);
router.get("/", getAllOwners);
router.get("/search", searchOwnerByName);
router.get("/:id", getOwnerById);
router.put("/:id", updateOwner);
router.delete("/:id", deleteOwner);

export default router;
