
const router = require("express").Router()
const jwt = require("jsonwebtoken")
const Event = require("../models/event")

router.get("/", async (req, res) => {
    try {
        const allEvents = await Event.find({ createdBy: req.user.userID })

        res.status(200).json(allEvents)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: `${err}`
        })
    }
})

router.post("/create", async (req, res) => {
    try {
        const {
            title,
            startDate
        } = req.body
        console.log(req.body)
        if (
            !title
        ) {
            throw new Error("Please provide all properties")
        }

        const newEvent = new Event({ title, startDate, createdBy: req.body.user.userID })

        await newEvent.save()

        res.status(201).json({
            message: "New event created",
            newEvent
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: `${err}`
        })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params

        const foundEvent = await Event.findOne({ _id: id })

        if (!foundEvent) throw new Error("Event not found")

            res.status(200).json(foundEvent)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: `${err}`
        })
    }
})

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params

        const updatedEvent = await Event.findByIdAndUpdate(id, {
            eventName : req.body.eventName ?? eventName,
            startTime : req.body.startTime ?? startTime,
            eventLength : req.body.eventLength ?? eventLength,
            createdBy : req.body.createdBy ?? createdBy
        })

        await updatedEvent.save()

        res.status(200).json({
            message: "Event modified",
            updatedEvent
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: `${err}`
        })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params

        const deletedEvent = await Event.findByIdAndDelete(id)

        if (!deletedEvent) throw new Error("Event not found")

        res.status(200).json({
            message: `${id} removed from the db`,
            deletedEvent
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: `${err}`
        })
    }
})

module.exports = router
