const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

module.exports = () => {
    const connectionParams = { useNewUrlParser: true, useUnifiedTopology: true };
    mongoose.connect(process.env.MONGO_URI, connectionParams)
        .then(() => console.log("Connected to database successfully"))
        .catch((error) => {
            console.error("Database connection failed:", error);
            process.exit(1);
        });
};
