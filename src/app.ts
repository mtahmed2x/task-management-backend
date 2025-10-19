import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";
import routes from "./routes";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.status(StatusCodes.OK).json({ message: "API is healthy 🚀" });
});

app.get("/health", (_req, res) => {
  res.status(StatusCodes.OK).json({ message: "API is healthy 🚀" });
});

app.use("/api/v1", routes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
