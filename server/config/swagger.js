import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Project Management Tool API",
      version: "1.0.0",
      description:
        "Swagger-API documentation for the Project Management Tool Backend Assignement",
    },

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // API paths
  apis: ["./routes/*.js", "./controllers/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
