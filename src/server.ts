import { envs } from './config/env';
import app from './app';
import { connectDB } from './database/db';

await connectDB();

app.listen(envs.PORT, async () => {
  console.log(`Server is running on port ${envs.PORT}`);
});
