const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const accountController = require("../controllers/account.controller")


const router = express.Router()



/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected Route
 */
router.post("/", authMiddleware.authMiddleware, accountController.createAccountController)


/**
 * - GET /api/accounts/
 * - Get all accounts of the logged-in user
 * - Protected Route
 */
router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountController)


/**
 * - GET /api/accounts/total-balance
 * - Get total aggregated balance across all user accounts
 * - Protected Route
 */
router.get("/total-balance", authMiddleware.authMiddleware, accountController.getTotalBalanceController)

/**
 * - GET /api/accounts/balance/:accountId
 */
router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController)

/**
 * - GET /api/accounts/:accountId/ledger
 * - Get ledger entries for an account (immutable audit trail)
 * - Protected Route
 */
router.get("/:accountId/ledger", authMiddleware.authMiddleware, accountController.getLedgerByAccount)



module.exports = router