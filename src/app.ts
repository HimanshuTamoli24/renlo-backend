import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorhandler.middleware';
import userRoutes from './module/user/user.route';
import authRoutes from './module/auth/auth.route';
import listingRoutes from './module/listing/listing.route';
import visitRoutes from './module/visit/visit.route';
import leaseRoutes from './module/lease/lease.route';
import { envs } from './config/env';
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:7007",
      "https://www.himanshutamoli.me",
      "https://himanshutamoli.me"
    ],
    credentials: true,
  })
);app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/listings', listingRoutes);
app.use('/api/v1/visits', visitRoutes);
app.use('/api/v1', leaseRoutes);

app.get('/api/v1', (req, res) => {
  res.send('Hello World!');
});

app.use(errorHandler);
export default app;
