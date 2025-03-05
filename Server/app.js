require("dotenv").config()
console.log(".env variables working")
const express = require("express")
const cors = require("cors")
const app = express()
const PORT = process.env.PORT
const HOST = process.env.HOST

const { dbConnect } = require("./db")
const sessionValidation = require("./middlewares/session");
const eventsController = require("./controllers/eventRoutes")
const authController = require("./controllers/user-routes.js");

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use("/user-routes", authController);
app.use("/eventRoutes", sessionValidation, eventsController)

app.listen(PORT, HOST, () => {
    dbConnect(),
    console.log(`[server] listening on ${HOST}:${PORT}`)
})