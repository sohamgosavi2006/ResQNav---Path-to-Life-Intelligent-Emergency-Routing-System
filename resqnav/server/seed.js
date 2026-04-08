const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo data for ResQNav Verification Hub...');

  // Clear existing data (optional but good for clean demo)
  await prisma.verificationLog.deleteMany({});
  await prisma.sMSLog.deleteMany({});

  // CASE 1: No Internet + No Public (Offline Detection Logic)
  // Simulation: Car sensors detect crash, but no signal.
  const incident1Id = 101;
  
  await prisma.sMSLog.create({
    data: {
      incidentId: incident1Id,
      phoneNumber: '+91 98765 43210',
      message: 'URGENT: Crash detected at Nanganallur. System in Store-and-Forward mode (Low Signal).',
      status: 'queued',
      provider: 'Telephony-Layer-1',
    }
  });

  await prisma.verificationLog.create({
    data: {
      incidentId: incident1Id,
      status: 'pending',
      blockchainHash: '0x3a4b9c1d2e3f4g5h6i7j8k9l0m1n2o3p',
      confidenceScore: 0.72,
      consensusCount: 1, // Only the car detected it
    }
  });


  // CASE 2: Public is Present (Crowd Consensus Verification)
  // Simulation: Multiple users report, AI validates image, Blockchain confirms.
  const incident2Id = 202;

  await prisma.sMSLog.create({
    data: {
      incidentId: incident2Id,
      phoneNumber: '+1 555 123 4567',
      message: 'ACCIDENT REPORTED: Multiple witnesses confirmed at Tambaram junction. Verified via Blockchain Hub.',
      status: 'sent',
      provider: 'Twilio Live Gateway',
    }
  });

  await prisma.verificationLog.create({
    data: {
      incidentId: incident2Id,
      status: 'validated',
      blockchainHash: '0x8f7e6d5c4b3a210987654321fedcba98',
      confidenceScore: 0.98, // High confidence due to crowd consensus
      consensusCount: 12, // 12 nearby people confirmed
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
