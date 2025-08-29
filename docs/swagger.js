const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "URL Shortener API",
      version: "1.0.0",
      description: "A simple URL shortener service",
      contact: {
        name: "API Support",
        email: "support@urlshortener.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "URLs",
        description: "URL shortening operations",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #667eea }
  `,
  customSiteTitle: "URL Shortener API Docs",
};

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, swaggerOptions),
};
