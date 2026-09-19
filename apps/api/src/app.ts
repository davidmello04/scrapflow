import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { materialsRouter } from './routes/materials.js';
import { purchasesRouter } from './routes/purchases.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_request, response) => response.json({ status: 'ok' }));
app.use('/api/materials', materialsRouter);
app.use('/api/purchases', purchasesRouter);
app.use(errorHandler);
