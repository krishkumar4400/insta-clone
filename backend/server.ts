import "dotenv/config";
import app from "./src/app.js";
import http from "http";
import ApiError from "./src/utils/api-error.js";

const server = http.createServer(app);

if (!process.env?.PORT) {
    throw new ApiError({ statusCode: 404, message: "Port is Missing from environment variables" });
}

const port = process.env?.PORT || 3000;


server.listen(port, () => {
    console.log(`Server is up and running on http://localhost:${port}`);
});
