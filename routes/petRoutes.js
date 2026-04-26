// routes/petRoutes.js
import express from "express";
import {
  addPet,
  getAllPets,
  getPetById,
  getPetsByOwner,
  updatePet,
  deletePet,
} from "../controllers/petController.js";

const router = express.Router();

router.post("/", addPet);
router.get("/", getAllPets);
router.get("/owner/:owner_id", getPetsByOwner);
router.get("/:id", getPetById);
router.put("/:id", updatePet);
router.delete("/:id", deletePet);

export default router;
