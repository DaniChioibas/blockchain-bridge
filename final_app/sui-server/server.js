const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mint tokens endpoint
app.post("/mint", (req, res) => {
  const { account, amount } = req.body;

  // Replace with your actual mint command
  const mintCommand = `sui client call --function mint --module itb --package 0x3d9c22b536e38cb5cbe198cd22c1bf71b421de215be3383c633580e5bf792245 --args 0xcbeb6a18e14a27f78dd60fd0220dac2c51f784d5f05a7501b6ed0e5257a7bafc ${amount}000000000 ${account} --gas-budget 10000000`;

  exec(mintCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ error: stderr });
    }
    console.log(`stdout: ${stdout}`);
    res.json({ message: "Mint successful", output: stdout });
  });
});

// Burn tokens endpoint
app.post("/burn", (req, res) => {
    const { amount } = req.body;
  
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }
    const modifiedAmount = `${amount}000000000`;
    // Replace with the actual path to your burn_sui.sh script
    const scriptPath = "/home/dani/sui\\ react\\ test/sui-test/src/burn_sui.sh";
  
    // Command to execute the script with the amount as an argument
    const burnCommand = `${scriptPath} ${modifiedAmount}`;
  
    exec(burnCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return res.status(500).json({ error: error.message });
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(500).json({ error: stderr });
      }
      console.log(`stdout: ${stdout}`);
      res.json({ message: "Burn successful", output: stdout });
    });
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
