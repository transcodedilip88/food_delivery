const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const mongoose = require("mongoose");
const app = express();
const { dbUrl, port } = require("./src/config");
const  router = require('./src/api/routes')
const swagger = require('swagger-ui-express')
const swaggerDocument = require('./src/swagger/swagger.json');
const { socketService } = require("./src/api/services");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger("dev"));
app.use('/api',router);
app.use('/swagger',swagger.serve,swagger.setup(swaggerDocument))

app.use((err, req, res, next) => {
  let { code, message, status } = err;

  if (!status || status === 500) {
    (status = 500),
      (code = "Internal Server Error"),
      (message = "Oops Something Went Wrong");
  }

  res.status(status).json(code, message);
});

async function connectToDatabase() {
  try {
    await mongoose.connect(dbUrl, {});
    const server = app.listen(port, () => {
      console.log(`Database connected and server started port on ${port}`);
    });
    socketService.socket(server);
  } catch (err) {
    console.log("database connection error : ",err);
  }
}

connectToDatabase();
