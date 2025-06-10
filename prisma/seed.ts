// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // Import bcrypt

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // 1. Create a default Admin user with a hashed password
  const plainTextPassword = '123'; // The password you want to set
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
  console.log(`Hashing password "${plainTextPassword}"...`);


  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@solarschools.dev' },
    update: {
      // You could update the password here if the user already exists
      password: hashedPassword,
    },
    create: {
      email: 'admin@solarschools.dev',
      name: 'Admin User',
      password: hashedPassword, // Store the hashed password
      role: 'ADMIN',
    },
  });
  console.log(`Created admin user: ${adminUser.email}`);

  // 2. Create sample schools
  const schoolsData = [
    {
      id: 1,
      name: 'Greenfield Elementary',
      address: '123 Oak Street, Springfield, IL',
      logo: '🏫',
      goal: 50000,
      description: 'Greenfield Elementary is dedicated to providing a nurturing environment...',
      panelGridConfigs: [
        { gridId: 'section_A', gridTitle: 'Main Array - Section A', rows: 4, cols: 6 },
        { gridId: 'section_B', gridTitle: 'Main Array - Section B', rows: 4, cols: 6 },
        { gridId: 'roof_top', gridTitle: 'Rooftop Annex', rows: 3, cols: 8 },
      ],
    },
    {
      id: 2,
      name: 'Riverside High School',
      address: '456 River Road, Riverside, CA',
      logo: '🎓',
      goal: 100000,
      description: 'Riverside High aims to equip students with the knowledge...',
      panelGridConfigs: [
        { gridId: 'main_field', gridTitle: 'Field Installation', rows: 10, cols: 10 },
        { gridId: 'gym_roof', gridTitle: 'Gymnasium Roof', rows: 5, cols: 8 },
      ],
    },
  ];

  for (const school of schoolsData) {
    const newSchool = await prisma.school.upsert({
      where: { id: school.id },
      update: {},
      create: {
        id: school.id,
        name: school.name,
        address: school.address,
        logo: school.logo,
        description: school.description,
        goal: school.goal,
        panelGridConfigs: school.panelGridConfigs,
      },
    });
    console.log(`Created/updated school: ${newSchool.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });