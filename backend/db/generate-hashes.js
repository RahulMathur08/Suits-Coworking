/**
 * Script to generate bcrypt hashes for seed data
 * Run: node backend/db/generate-hashes.js
 */

const bcrypt = require('bcryptjs');

async function generateHashes() {
  console.log('Generating bcrypt hashes...\n');
  
  const adminHash = await bcrypt.hash('admin123', 10);
  const memberHash = await bcrypt.hash('member123', 10);
  
  console.log('Admin password (admin123):');
  console.log(adminHash);
  console.log('\nMember password (member123):');
  console.log(memberHash);
  console.log('\nCopy these hashes to backend/db/seed.sql');
}

generateHashes().catch(console.error);

