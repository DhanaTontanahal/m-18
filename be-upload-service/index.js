const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;
const multer = require("multer");

const { Storage } = require("@google-cloud/storage");

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.json({ status: "Bark bark v1 Jan 28" });
});
// Endpoint to get account balance based on email
app.get("/api/account-balance", (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const getUserQuery = "SELECT user_id FROM users WHERE user_email = ?";
  const getBalanceQuery =
    "SELECT account_number, balance FROM account_balance WHERE user_id = ?";

  // Fetch user ID based on email
  db.query(getUserQuery, [email], (err, userResults) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed" });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userResults[0].user_id;

    // Fetch account balance based on user ID
    db.query(getBalanceQuery, [userId], (err, balanceResults) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to fetch account balance" });
      }

      if (balanceResults.length === 0) {
        return res.status(404).json({ error: "Account balance not found" });
      }

      console.log(balanceResults);
      res.json({
        accountNumber: balanceResults[0].account_number,
        balance: balanceResults[0].balance,
      });
    });
  });
});

const ELIGIBILITY_CRITERIA = {
  minAge: 18,
  minIncome: 30000,
  allowedNationalities: ["US", "Canada", "India"],
};

// Set up Google Cloud Storage
const storage = new Storage({
  keyFilename: "test.json", // Replace with your service account key file
});
const bucketName = "menu_logger_bucket"; // Ensure this matches your actual bucket

// Multer Middleware for handling file uploads in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files are allowed." });
    }

    const fileName = `uploads/${Date.now()}-${req.file.originalname.replace(
      /\s+/g,
      "_"
    )}`;
    const file = storage.bucket(bucketName).file(fileName);

    console.log(`Uploading file: ${fileName}`);

    // Upload the file
    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
    });

    console.log("Skipping makePublic due to uniform bucket-level access");

    // Generate file URL
    const fileUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    console.log(`File uploaded successfully: ${fileUrl}`);

    return res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: fileUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
