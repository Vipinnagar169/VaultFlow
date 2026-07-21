const accountModel = require("../models/account.model")
const ledgerModel = require("../models/ledger.model")
const transactionModel = require("../models/transaction.model")


async function createAccountController(req,res){
    const user = req.user;

    const account = await accountModel.create({
        user : user._id
    })

    // Auto deposit default 500 INR initial balance
    const initialTransaction = await transactionModel.create({
        fromAccount: account._id,
        toAccount: account._id,
        amount: 500,
        status: "COMPLETED",
        idempotencyKey: `INITIAL_DEPOSIT_${account._id}`
    })

    await ledgerModel.create({
        account: account._id,
        amount: 500,
        transaction: initialTransaction._id,
        type: "CREDIT"
    })

    res.status(201).json({
        account,
        message: "Account created successfully with default balance of 500 INR"
    })
}

async function getUserAccountController(req,res){
    const accounts = await accountModel.find({ user: req.user._id});

    res.status(200).json ({
        accounts
    })
}

async function getAccountBalanceController(req,res){
    const { accountId } = req.params;

    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized access"
        })
    }

    const account = await accountModel.findOne({
        _id : accountId,
        user: req.user._id
    })
    if(!account){
        return res.status(404).json({
            message: "Account not found"
        })
    }
    const balance = await account.getBalance();

    res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}


async function getLedgerByAccount(req, res) {
    const { accountId } = req.params;
    const { page = 1, limit = 30 } = req.query;

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if (!account) {
        return res.status(404).json({
            message: "Account not found or access denied"
        })
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const entries = await ledgerModel.find({ account: accountId })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("transaction", "status createdAt fromAccount toAccount amount")

    const total = await ledgerModel.countDocuments({ account: accountId })

    return res.status(200).json({
        entries,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit))
        }
    })
}

module.exports = {
    createAccountController,
    getUserAccountController,
    getAccountBalanceController,
    getLedgerByAccount
}