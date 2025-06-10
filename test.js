import bcrypt from 'bcrypt'; // Import bcrypt

const plainTextPassword = '123'; // The password you want to set
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
    console.log(`Hashing password "${plainTextPassword}"...`);
    console.log(`Hashed password: ${hashedPassword}`);