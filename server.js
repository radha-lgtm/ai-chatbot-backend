const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/* ============================
   Lead Scoring Function
============================ */

function calculateLeadScore(data) {

  let score = 0;

  // Budget scoring
  if (data.budget) {
    const budget = data.budget.toLowerCase();

    if (budget.includes("5l") || budget.includes("10l") || budget.includes("1cr"))
      score += 40;
    else if (budget.includes("2l") || budget.includes("1l"))
      score += 30;
    else if (budget.includes("50k"))
      score += 20;
    else
      score += 10;
  }

  // Timeline scoring
  if (data.timeline) {
    const timeline = data.timeline.toLowerCase();

    if (timeline.includes("1 week") || timeline.includes("urgent"))
      score += 30;
    else if (timeline.includes("2 week") || timeline.includes("3 week"))
      score += 20;
    else
      score += 10;
  }

  // Service scoring
  if (data.service) {
    const service = data.service.toLowerCase();

    if (service.includes("website") || service.includes("web"))
      score += 15;
    else if (service.includes("app"))
      score += 20;
    else
      score += 10;
  }

  // Industry scoring
  if (data.industry) {
    score += 10;
  }

  return score;
}

/* ============================
   API Route
============================ */

app.post("/chat", (req, res) => {

  const score = calculateLeadScore(req.body);

  let priority = "Cold";

if (score >= 70) {
  priority = "Hot";
}
else if (score >= 40) {
  priority = "Warm";
}

 const reply = `
Service Request: ${req.body.service}
Industry: ${req.body.industry}
Estimated Budget: ${req.body.budget}
Timeline Requirement: ${req.body.timeline}

Service Recommendation
Suggested Package: Professional Business Website

Estimated Price Range: ₹80,000 – ₹1,20,000
Estimated Timeline: 3–4 weeks

Lead Score: ${score}
Lead Priority: ${priority}

Basic Project Proposal
Features Included
• Responsive Design
• SEO Setup
• Contact Form
• Google Analytics
• Admin Dashboard

Recommendation: ${
priority === "Hot"
? "Immediate consultation recommended."
: priority === "Warm"
? "Follow up within 24 hours."
: "Add to nurture list."
}

Next Step:
Book a strategy call to finalize the project scope.
`;

res.json({ reply });

});

/* ============================
   Start Server
============================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});