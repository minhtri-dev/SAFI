import express from 'express';
import cors from 'cors';
import routes from './routes';

import { errorHandler } from './middlewares/errorHandler';
import { connectDatabase } from './services/dbService';

const app = express();

// Connect to the database before starting the server
(async () => {
  try {
    await connectDatabase();
    console.log('Database connected successfully');
    
    // Middlewares
    app.use(express.json());
    
    app.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    
    // Prefix routes with /api
    app.use('/api', routes);

    // Error handling middleware
    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('Could not connect to database:', error);
    process.exit(1); // Exit process with failure if database connection fails
  }
})();

export default app;