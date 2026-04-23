const mongoose = require("mongoose");

const connectDBForCLI = async () => {
    try {
        // connection string construct karte waqt process.env ka use
        const conn = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`, {
            dbName: process.env.DB_NAME,
        });

        console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    } 
    catch (error) {
        console.log(`❌ Error during establishing connection to MongoDB for CLI - ${error.message}`);
        process.exit(1); // Connection fail hone par process stop kar dena chahiye
    }
}

// CommonJS export
module.exports = connectDBForCLI;