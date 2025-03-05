const { mongoose } = require("../db")
//isAdmin must be present in auth
const isAdmin = require("../middlewares/isAdmin")
const studentData = mongoose.Schema(
    
    
        {
            firstName: {
                type: String,
                require: true
            },
            lastName: {
                type: String,
                require: true
            },
            mtgType: { //drop down menu, in person/virtual
                type: String,
                require: true,
            },
            mtgLocation: {
                type: String,
                require: true
            },
            beginTime: {
                type: String,
                require: true
            },
            endTime: {
                type: String,
                require: true
            },

            
        }
    )
//enter parameters when established
    module.exports = mongoose.model("", )