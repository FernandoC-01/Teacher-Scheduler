const mongoose = require(`mongoose`);
const DB_URL = process.env.DB_URL

const dbConnect = async () => {
    try {
        mongoose.set("strictQuery", true)
        await mongoose.connect(DB_URL);
        console.log(`[db] connected to: ${DB_URL}`)
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
};

module.exports = { dbConnect, mongoose }