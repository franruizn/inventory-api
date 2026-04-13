import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import router from './routes/inventory.routes'
import authRouter from "./routes/auth.routes";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimiter";

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(rateLimiter);
app.use(express.json());

app.get('/healthz', (_req, res) => {
    res.json({status: 'ok'});
});

app.use('/api/v1/inventory', router);
app.use('/api/v1/auth', authRouter);
app.use(notFound);
app.use(errorHandler);

export default app;