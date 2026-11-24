import app from './app';
import { connectDB } from './config/db';
import { ENV } from './config/env';
import { User } from './models/User';
import { seedDatabase } from './seed/seedData';

const startServer = async () => {
  try {
    await connectDB();

    // Check if database needs seeding
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Server] Database is empty. Auto-seeding initial realistic mock data...');
      await seedDatabase();
    } else {
      console.log(`[Server] Database contains ${userCount} users. Ready.`);
    }

    const server = app.listen(ENV.PORT, () => {
      console.log('=================================================================');
      console.log(`  SalonFlow Backend running on http://localhost:${ENV.PORT}`);
      console.log(`  Environment: ${ENV.NODE_ENV}`);
      console.log(`  Health Check: http://localhost:${ENV.PORT}/api/health`);
      console.log('=================================================================');
    });

    const shutdown = async () => {
      console.log('\n[Server] Shutting down gracefully...');
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('[Server] Fatal startup error:', error);
    process.exit(1);
  }
};

startServer();
