const { Router } = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const transactionController = require("../controllers/transaction.controller")

const transactionRoutes = Router();

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */
transactionRoutes.post("/", authMiddleware.authMiddleware, transactionController.createTransaction)

/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transaction from system user
 */
transactionRoutes.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction)

/**
 * - GET /api/transactions/account/:accountId
 * - Get all transactions for a given account (paginated)
 */
transactionRoutes.get("/account/:accountId", authMiddleware.authMiddleware, transactionController.getTransactionsByAccount)

/**
 * - GET /api/transactions/:transactionId
 * - Get a single transaction by ID (with ledger entries)
 */
transactionRoutes.get("/:transactionId", authMiddleware.authMiddleware, transactionController.getTransactionById)

module.exports = transactionRoutes;