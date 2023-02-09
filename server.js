const app = require('./app')
require('dotenv').config();
const { connectMongo } = require('./db/connection')
const port = process.env.PORT;
const start = async () => {
  try {
    const connectTomongo = await connectMongo();
    if (connectTomongo) {
      console.log("Database connection successful");
    }
    app.listen(port, () => {
      console.log(`Server running. Use our API on port:${port} `)
    })
  } catch (error) {

  }
}
start();