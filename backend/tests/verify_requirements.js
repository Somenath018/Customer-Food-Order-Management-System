import { store } from '../src/data/store.js';
import bcrypt from 'bcryptjs';

console.log('==================================================');
console.log('VERIFYING CATEGORY & DISHES SYSTEM FOR ALL CUISINES');
console.log('==================================================');

const testCategories = [
  'Biryani',
  'Pizza',
  'Burgers',
  'North Indian',
  'Chinese',
  'Rolls',
  'Desserts',
  'Healthy',
  'Beverages',
  'All'
];

let allPassed = true;

for (const cat of testCategories) {
  const restaurants = store.getRestaurants({ cuisine: cat });
  const dishes = store.getDishes({ category: cat });

  console.log(`\n📌 Category: "${cat}"`);
  console.log(`   - Verified Kitchens (${restaurants.length}): ${restaurants.map(r => r.name).join(' | ')}`);
  console.log(`   - Menu Items (${dishes.length}): ${dishes.slice(0, 3).map(d => `${d.name} (₹${d.price})`).join(', ')}${dishes.length > 3 ? '...' : ''}`);

  if (restaurants.length === 0) {
    console.error(`❌ FAILED: No restaurants found for category "${cat}"!`);
    allPassed = false;
  }
  if (dishes.length === 0) {
    console.error(`❌ FAILED: No dishes found for category "${cat}"!`);
    allPassed = false;
  }
}

console.log('\n==================================================');
console.log('VERIFYING MULTI-CUSTOMER REGISTRATION & PERSISTENCE');
console.log('==================================================');

const salt = bcrypt.genSaltSync(10);
const cust1 = store.createUser({
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  password_hash: bcrypt.hashSync('aaravPass123', salt),
  role: 'customer',
  phone: '+91 91234 56789',
  address: 'Flat 302, Palm Heights, HSR Layout'
});

const cust2 = store.createUser({
  name: 'Diya Patel',
  email: 'diya.patel@example.com',
  password_hash: bcrypt.hashSync('diyaPass456', salt),
  role: 'customer',
  phone: '+91 99887 76655',
  address: 'Villa 14, Prestige Green, Koramangala'
});

console.log(`Customer 1 created: ID=${cust1.id}, Name=${cust1.name}, Email=${cust1.email}, Address=${cust1.address}`);
console.log(`Customer 2 created: ID=${cust2.id}, Name=${cust2.name}, Email=${cust2.email}, Address=${cust2.address}`);

const foundCust1 = store.findUserByEmail('aarav.sharma@example.com');
const cust1PassMatch = bcrypt.compareSync('aaravPass123', foundCust1.password_hash);
console.log(`Customer 1 login credential check: ${cust1PassMatch ? '✅ MATCH' : '❌ FAILED'}`);

const foundCust2 = store.findUserByEmail('diya.patel@example.com');
const cust2PassMatch = bcrypt.compareSync('diyaPass456', foundCust2.password_hash);
console.log(`Customer 2 login credential check: ${cust2PassMatch ? '✅ MATCH' : '❌ FAILED'}`);

const updatedCust1 = store.updateUser(cust1.id, {
  phone: '+91 90000 11111',
  address: 'Updated Penthouse, HSR Sector 2'
});
console.log(`Customer 1 updated profile preserved: Phone=${updatedCust1.phone}, Address=${updatedCust1.address}`);

if (!allPassed || !cust1PassMatch || !cust2PassMatch) {
  console.error('\n❌ SOME VERIFICATIONS FAILED');
  process.exit(1);
} else {
  console.log('\n🎉 ALL REQUIREMENTS VERIFIED SUCCESSFULLY!');
  process.exit(0);
}
