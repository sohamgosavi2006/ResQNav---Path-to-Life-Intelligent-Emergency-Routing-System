import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  await prisma.payment.deleteMany();
  await prisma.route.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.ambulance.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding new data...');

  const user = await prisma.user.create({
    data: {
      name: 'Aditya Nair',
      email: 'aditya@resqnav.test',
      role: 'CITIZEN',
      credits: 2840,
      badge: 'platinum',
    },
  });

  const ambulances = [
    { callSign: 'AMB-001', driver: 'Ravi Kumar', status: 'EN_ROUTE', phone: '+91 98765 43210' },
    { callSign: 'AMB-002', driver: 'Priya Sharma', status: 'AVAILABLE', phone: '+91 87654 32109' },
    { callSign: 'AMB-003', driver: 'Arun Singh', status: 'EN_ROUTE', phone: '+91 76543 21098' },
    { callSign: 'AMB-004', driver: 'Meena Patel', status: 'STANDBY', phone: '+91 65432 10987' },
  ];

  for (const amb of ambulances) {
    await prisma.ambulance.create({ data: amb });
  }

  await prisma.incident.create({
    data: {
      type: 'ACCIDENT',
      severity: 'HIGH',
      location: 'MG Road & Brigade Junction',
      lat: 12.9716,
      lng: 77.5946,
      verified: true,
      reporterId: user.id,
    },
  });

  await prisma.incident.create({
    data: {
      type: 'CONGESTION',
      severity: 'MEDIUM',
      location: 'Outer Ring Road, Marathahalli',
      lat: 12.9580,
      lng: 77.6200,
      verified: true,
      reporterId: user.id,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
