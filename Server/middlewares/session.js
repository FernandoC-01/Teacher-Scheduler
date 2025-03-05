
const jwt = require("jsonwebtoken")
const User = require("../models/userData")
const JWT_KEY = process.env.JWT_KEY


const sessionValidation = async (req, res, next) => {
    try {
        if (req.method === "OPTIONS") next()
        if (!req.headers.authorization) throw new Error("Forbidden")
        const authToken = req.headers.authorization.includes("Bearer")
            ? req.headers.authorization.split(" ")[1]
            : req.headers.authorization
        const payload = jwt.verify(authToken, JWT_KEY)

        const foundUser = await User.findById(payload.id)

        req.body.user = { userID: foundUser._id, firstName: foundUser.firstName }

        next()
    } catch(err) {
        console.error(err)
        res.status(500).json({
            message: `${err.message}`
        })
    }
}

module.exports = sessionValidation
