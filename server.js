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
    else if (budget.includes("1l"))
      score += 25;
    else if (budget.includes("50k"))
      score += 15;
    else
      score += 5;
  }

  // Timeline scoring
  if (data.timeline) {
    const timeline = data.timeline.toLowerCase();

    if (timeline.includes("urgent"))
      score += 30;
    else if (timeline.includes("1 month"))
      score += 20;
    else if (timeline.includes("3 month"))
      score += 10;
  }

  // Service scoring
  if (data.service) {
    const service = data.service.toLowerCase();

    if (service.includes("website"))
      score += 20;
    if (service.includes("ai"))
      score += 30;
  }

  return score;
}

/* ============================
   API Route
============================ */

app.post("/chat", (req, res) => {

  const score = calculateLeadScore(req.body);

  let priority = "Cold";

  if (score >= 80) priority = "HOT";
  else if (score >= 50) priority = "Warm";

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

Recommendation: ${
priority === "Hot"
? "Schedule consultation immediately."
: priority === "Warm"
? "Follow up within 24 hours."
: "Add to nurture list."
}

Next Step: Book a strategy call to discuss project details.
`;

/* ============================
   Start Server
============================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});