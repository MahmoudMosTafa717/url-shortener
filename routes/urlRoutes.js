const express = require("express");
const router = express.Router();
const { validateUrl } = require("../middleware/validation");
const {
  getHomepage,
  createShortUrl,
  redirectToUrl,
  getAllUrls,
} = require("../controllers/urlController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Url:
 *       type: object
 *       required:
 *         - originalUrl
 *       properties:
 *         originalUrl:
 *           type: string
 *           description: The original long URL
 *         shortUrl:
 *           type: string
 *           description: The shortened URL
 *         urlCode:
 *           type: string
 *           description: The unique code for the URL
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get homepage with recent URLs
 *     tags: [URLs]
 *     responses:
 *       200:
 *         description: Homepage rendered successfully
 */
router.get("/", getHomepage);

/**
 * @swagger
 * /api/urls:
 *   get:
 *     summary: Get all URLs with pagination
 *     tags: [URLs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of URLs retrieved successfully
 */
router.get("/api/urls", getAllUrls);

/**
 * @swagger
 * /shorten:
 *   post:
 *     summary: Create a new shortened URL
 *     tags: [URLs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 description: The URL to shorten
 *     responses:
 *       201:
 *         description: URL shortened successfully
 *       400:
 *         description: Invalid URL provided
 */
router.post("/shorten", validateUrl, createShortUrl);

/**
 * @swagger
 * /{code}:
 *   get:
 *     summary: Redirect to original URL
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The URL code
 *     responses:
 *       302:
 *         description: Redirect to original URL
 *       404:
 *         description: URL not found
 */
router.get("/:code", redirectToUrl);

module.exports = router;
