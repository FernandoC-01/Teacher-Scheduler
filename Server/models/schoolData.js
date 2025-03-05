const { mongoose } = require("../db")
//isAdmin must be present in auth
// const isAdmin = require("../middlewares/isAdmin")
const schoolData = mongoose.Schema(
    
    {
        schoolName: {
            type: String,
            enum: ["Misty Mountain", "Bikini Bottom", "Avengers", "Stark Tower"]
        }
    },
)
    module.exports = mongoose.model("School", schoolData)
