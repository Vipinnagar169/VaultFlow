require("dotenv").config();

const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = require("./src/app")
const connectToDB = require("./src/config/db")

connectToDB()

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000")
})