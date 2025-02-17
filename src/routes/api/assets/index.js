const express = require("express");

/**
 * The entry-point for /assets endpoints
 */

// Create a stricter rate limiter for POST /assets
const { rateLimit } = require("express-rate-limit");

const assetGenerationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minute window
  limit: 10, // 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

router.post(`/`, assetGenerationLimiter, require("./post"));

router.get(`/`, require("./get"));

router.get(`/:assetId`, require("./getById"));

router.patch(`/:assetId`, require("./patchById"));

router.delete(`/:assetId`, require("./deleteById"));

module.exports = router;
