import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Project Management API",
    description: "API Documentation for the Project Management Tool (MERN)",
  },
  host: "localhost:5000",
  basePath: "",
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description:
        'JWT authorization token using the Bearer scheme. Example: "Bearer <token>"',
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
