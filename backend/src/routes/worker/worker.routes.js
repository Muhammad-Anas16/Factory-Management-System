import express from "express";
import {
    createWorker,
    getWorkers,
    getSingleWorker,
    editWorker,
} from "../../controller/worker/worker.controller.js";
import {
    protect,
    checkPageAccess,
    checkCanAdd,
    checkCanEdit,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, checkPageAccess("workers"), checkCanAdd, createWorker);
router.get("/", protect, checkPageAccess("workers"), getWorkers);
router.get("/:id", protect, checkPageAccess("workers"), getSingleWorker);
router.put("/:id", protect, checkPageAccess("workers"), checkCanEdit, editWorker);

export default router;