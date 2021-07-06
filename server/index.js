const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

require("dotenv").config();

// =============================================================================
// Test routes
// =============================================================================
const testRouter = require("./routes/Test");
app.use("/test", testRouter);



// =============================================================================
// Lobby routes
// =============================================================================
const signUpInRouter = require("./routes/Lobby");
app.use("/lobby", signUpInRouter);



// =============================================================================
// User routes
// =============================================================================
const userRouter = require("./routes/User");
app.use("/user", userRouter);



// =============================================================================
// Sequelize Stuff
// =============================================================================
const dbTables = require("./models");
dbTables.sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log("Server running on port 3001");
    });
  })
  .catch((err) => {
    console.log(err);
  });
