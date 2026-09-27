const express = require("express"); // MODULES the (express) give you express framworks
const axios = require("axios"); // axios give HTTP requests
const fs = require("fs"); // save every calcu in a cvs file

const app = express(); //CREATING EXPRESS SERVER that youll store on (app)
app.use(express.json()); // MIDDLEWARE
app.use(express.static('.')); // MIDDLEWARE to connect to html

const PORT = 3000; // NODE SERVER 
const PYTHON_URL = "http://localhost:5001";

// Route 1: Simple test endpoint
// THE /hello,/api/calculate and /api/status ARE ENDPOINT/PATH
//(req, res) ARE REQUEST AND RESPONSE (coming IN , coming OUT)
app.get("/hello", (req, res) => {
  res.json({ message: "Hello from Node.js Gateway!" });
});

// Route 2: Main integration endpoint
app.post("/api/calculate", async (req, res) => {
  console.log(" Node.js received:", req.body); // req.body COMES FROM USER DATA

  try {
    // Forward to Python
    const pythonResponse = await axios.post(
      `${PYTHON_URL}/calculate`,
      req.body,
    );

    //history
    const history = {
      num1: req.body.num1,
      num2: req.body.num2,
      operation: req.body.operation,
      result: pythonResponse.data.result,
    };

    fs.appendFileSync(
      "history.csv",
      `${history.num1},${history.num2},${history.operation},${history.result}\n`,
    );

    // Enrich and return response
    // res.json RESPONSE THE INFO BACK TO CLIENT
    res.json({
      gateway_message: "Node.js successfully aggregated the data!",
      python_result: pythonResponse.data,
    });
  } catch (error) {
    console.error(" Error:", error.message);
    res.status(500).json({
      error: "Failed to reach Python service. Is it running on port 5001?",
    });
  }
});

// Route 3: System status check
app.get("/api/status", async (req, res) => {
  try {
    const ping = await axios.get(`${PYTHON_URL}/ping`);
    res.json({
      gateway: "Node.js is running",
      python: ping.data,
    });
  } catch (error) {
    res.status(500).json({
      gateway: "Node.js is running",
      python: "Python is NOT reachable",
    });
  }
});


//START THE SERVER
app.listen(PORT, () => {
  console.log(`Node.js Gateway: http://localhost:${PORT}`);
  console.log(`Python URL: ${PYTHON_URL}`);
});
