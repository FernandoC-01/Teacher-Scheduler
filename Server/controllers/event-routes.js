const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/event");

const router = express.Router();
// Function to generate a random color
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Get all events with search functionality
router.get("/events", async (req, res) => {
  try {
    const { search } = req.query;
    let events;
    if (search) {
      events = await Event.find({ title: new RegExp(search, "i") });
    } else {
      events = await Event.find();
    }
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
});

// Create a new event with a random color
router.post("/events", async (req, res) => {
  try {
    const newEvent = new Event({
      title: req.body.title,
      startDate: req.body.startDate,
      end: req.body.end,
      createdBy: req.body.createdBy,
      color: req.body.color || generateRandomColor(),
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Error adding event", error });
  }
});

// Update an event
router.put("/events/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
});

// Delete an event
router.delete("/events/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
});

module.exports = router;
