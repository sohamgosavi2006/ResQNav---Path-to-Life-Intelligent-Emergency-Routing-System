const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = 'soham@gmail.com';
  const password = '123456';
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(`Creating test user: ${email}...`);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists. Updating password...');
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
      });
      console.log('User password updated successfully!');
    } else {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Soham',
          role: 'commuter',
          verified: true
        }
      });
      console.log('User created successfully!');
    }
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
