const { mongoose } = require("../db")

const Event = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        },
        createdBy: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: "#000000"
        }
    }
)

module.exports = mongoose.model("event", Event)