import 'dotenv/config'; // Make sure to npm i dotenv
import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 MeetO backend running on http://localhost:${PORT}`);
  });
});
