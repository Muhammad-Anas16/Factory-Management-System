import {
    registerWorker,
    findWorkerById,
    getAllWorkers,
    updateWorker,
} from "../../model/worker/worker.model.js";
import { successResponse, errorResponse } from "../../helper/response.helper.js";

export const createWorker = (req, res) => {
    try {
        const {
            name,
            category,
            workerType,
            phone,
            address,
            joiningDate,
            salaryType,
            salaryAmount,
            perPieceRate,
            notes,
        } = req.body;

        if (!name) {
            return errorResponse(res, "Worker name is required.", null, 400);
        }

        const result = registerWorker({
            name,
            category,
            workerType,
            phone,
            address,
            joiningDate,
            salaryType,
            salaryAmount,
            perPieceRate,
            notes,
        });

        return successResponse(res, "Worker created successfully.", result, 201);
    } catch (err) {
        return errorResponse(res, "Failed to create worker.", err.message, 500);
    }
};

export const getWorkers = (req, res) => {
    try {
        const workers = getAllWorkers();
        return successResponse(res, "Workers fetched successfully.", workers);
    } catch (err) {
        return errorResponse(res, "Failed to fetch workers.", err.message, 500);
    }
};

export const getSingleWorker = (req, res) => {
    try {
        const worker = findWorkerById(req.params.id);
        if (!worker) return errorResponse(res, "Worker not found.", null, 404);
        return successResponse(res, "Worker fetched successfully.", worker);
    } catch (err) {
        return errorResponse(res, "Failed to fetch worker.", err.message, 500);
    }
};

export const editWorker = (req, res) => {
    try {
        const { id } = req.params;
        const existing = findWorkerById(id);
        if (!existing) return errorResponse(res, "Worker not found.", null, 404);

        const {
            name = existing.name,
            category = existing.category,
            workerType = existing.workerType,
            phone = existing.phone,
            address = existing.address,
            joiningDate = existing.joiningDate,
            salaryType = existing.salaryType,
            salaryAmount = existing.salaryAmount,
            perPieceRate = existing.perPieceRate,
            notes = existing.notes,
            status = existing.status,
        } = req.body;

        updateWorker({
            id,
            name,
            category,
            workerType,
            phone,
            address,
            joiningDate,
            salaryType,
            salaryAmount,
            perPieceRate,
            notes,
            status,
        });

        return successResponse(res, "Worker updated successfully.");
    } catch (err) {
        return errorResponse(res, "Failed to update worker.", err.message, 500);
    }
};