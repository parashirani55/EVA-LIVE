// routes/dashboard.js
import express from "express";
import pool from "../db.js"; // Your DB connection

const router = express.Router();

router.get("/dashboard-stats", async (req, res) => {
  try {
    // 1️⃣ Fetch stats
    const [totalCalls] = await pool.query(
      "SELECT COUNT(*) AS value FROM calls"
    );
    const [totalDuration] = await pool.query(
      "SELECT SEC_TO_TIME(SUM(duration)) AS value FROM calls"
    );
    const [answered] = await pool.query(
      "SELECT COUNT(*) AS value FROM calls WHERE status IN ('completed', 'Answered')"
    );
    const [missed] = await pool.query(
      "SELECT COUNT(*) AS value FROM calls WHERE status = 'missed'"
    );

    const stats = [
      {
        title: "Total Calls",
        value: totalCalls[0].value,
        change: "+5%",
        icon: "Phone",
        color: "from-blue-500 to-blue-600"
      },
      {
        title: "Total Duration",
        value: totalDuration[0].value,
        change: "+3%",
        icon: "Clock",
        color: "from-green-500 to-green-600"
      },
      {
        title: "Answered Calls",
        value: answered[0].value,
        change: "+2%",
        icon: "CheckCircle",
        color: "from-purple-500 to-purple-600"
      },
      {
        title: "Missed Calls",
        value: missed[0].value,
        change: "-1%",
        icon: "XCircle",
        color: "from-red-500 to-red-600"
      }
    ];

    // 2️⃣ Fetch chart data — calls per day for the last 7 days
    const [chartRows] = await pool.query(`
      SELECT 
        DATE(call_time) AS call_date,
        DATE_FORMAT(call_time, '%a') AS name,
        COUNT(*) AS calls
      FROM calls
      WHERE call_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(call_time)
      ORDER BY DATE(call_time)
    `);

    res.json({
      stats,
      callData: chartRows
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
