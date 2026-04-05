import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import router from './routes/inventory.routes'
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/healthz', (_req, res) => {
    res.json({status: 'ok'});
});

app.use('/api/v1/inventory', router);
app.use(notFound);
app.use(errorHandler);

export default app;