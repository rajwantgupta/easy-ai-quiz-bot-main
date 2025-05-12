import { prisma } from './db';

async function testConnection() {
  try {
    // Test the connection by creating a test user
    const testUser = await prisma.user.create({
      data: {
        id: 'test-user-1',
        email: 'test@example.com',
        name: 'Test User',
      },
    });
    console.log('Database connection successful!');
    console.log('Created test user:', testUser);

    // Clean up test data
    await prisma.user.delete({
      where: { id: 'test-user-1' },
    });
    console.log('Test data cleaned up');
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 