// const express = require("express");
// const axios = require("axios");

// const router = express.Router();

// // Define the proxy route
// router.post("/summarize", async (req, res) => {
//   const { content } = req.body;

//   if (!content) {
//     return res.status(400).json({ message: "Content is required" });
//   }

//   try {
//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             parts: [
//               {
//                 text: `Summarize the following content in under 125 words:\n\n${content}`,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const summary = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated.";
//     res.json({ summary });
//   } catch (error) {
//     console.error("Error communicating with Gemini API:", error.response?.data || error.message);
//     res.status(500).json({ message: "Failed to generate summary" });
//   }
// });

// module.exports = router;

const express = require("express");
const axios = require("axios");
const router = express.Router();

// Route to summarize content using Gemini API
router.post("/summarize", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;


  try {
    const response = await axios.post(
      `${apiUrl}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `As an expert writer with more than a decade of experience please summarize the following in under 125 words words. : ${content}`,
              },
            ],
          },
        ],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const summary =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No summary generated.";
    res.json({ summary });
  } catch (error) {
    console.error("Error communicating with Gemini API:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to generate summary",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
