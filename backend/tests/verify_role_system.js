import { store } from '../src/data/store.js';
import { initialRestaurants, initialUsers, initialDrivers } from '../src/config/seedData.js';

console.log('======================================================');
console.log('🧪 VERIFYING UPDATED FOODIE AUTH & ROLE SYSTEM');
console.log('======================================================\n');

// 1. Verify Seed Data & Single Admin
console.log('1. Checking Admin Account:');
const admins = store.users.filter(u => u.role === 'admin');
console.log(`   - Admin accounts count: ${admins.length} (Expected: 1)`);
if (admins.length !== 1 || admins[0].email !== 'admin@foodsystem.com') {
  throw new Error('Only 1 Admin account should exist with email admin@foodsystem.com');
}
console.log(`   ✅ Exactly 1 Admin verified: ${admins[0].name} (${admins[0].email})\n`);

// 2. Checking Existing 10 Restaurants & PIN/Password
console.log('2. Checking 10 Existing Restaurants & Manager PIN/Passwords:');
console.log(`   - Total restaurants: ${store.restaurants.length} (Expected: 10)`);
if (store.restaurants.length !== 10) {
  throw new Error(`Expected 10 restaurants, found ${store.restaurants.length}`);
}

store.restaurants.forEach((r, idx) => {
  const authTest = store.findRestaurantByPinOrPassword(r.id, r.manager_pin);
  if (!authTest) {
    throw new Error(`Authentication failed for ${r.name} with PIN ${r.manager_pin}`);
  }
  const wrongPinTest = store.findRestaurantByPinOrPassword(r.id, 'wrongpin9999');
  if (wrongPinTest) {
    throw new Error(`Wrong PIN should fail for ${r.name}`);
  }
  console.log(`   ✅ Restaurant #${idx + 1}: ${r.name} | PIN: ${r.manager_pin} | Password: ${r.manager_password}`);
});
console.log('');

// 3. Checking Delivery Partners
console.log('3. Checking Delivery Partners:');
const drivers = store.drivers;
console.log(`   - Total delivery partners: ${drivers.length}`);
drivers.forEach((d, idx) => {
  const user = store.findUserById(d.id);
  console.log(`   ✅ Driver #${idx + 1}: ${d.name} | Email: ${user?.email} | Vehicle: ${d.vehicle_type} | Online: ${d.is_online}`);
});
console.log('');

// 4. Checking Customer Restriction & Order Blocking
console.log('4. Checking Customer Governance & Account Restriction:');
const customer = store.users.find(u => u.role === 'customer');
console.log(`   - Testing customer: ${customer.name} (${customer.email}) - Initial is_restricted: ${!!customer.is_restricted}`);

const toggled = store.toggleCustomerRestriction(customer.id);
console.log(`   - Toggled restriction: ${toggled.is_restricted}`);
if (!toggled.is_restricted) {
  throw new Error('Customer should be restricted after toggle');
}

// Untoggle back
store.toggleCustomerRestriction(customer.id);
console.log(`   - Restored customer restriction to: ${customer.is_restricted}`);
console.log('   ✅ Customer restriction toggle verified.\n');

// 5. Checking Driver Management for Admin (Add & Delete)
console.log('5. Checking Admin Driver Management (Add & Delete):');
const initialDriverCount = store.drivers.length;
const newDriverResult = store.addDriver({
  name: 'Test Partner',
  email: 'test.driver@foodsystem.com',
  password: 'password123',
  phone: '+91 99999 88888',
  vehicle_type: 'Scooter'
});
console.log(`   - Added new delivery partner: ${newDriverResult.driver.name} (ID: ${newDriverResult.driver.id})`);
if (store.drivers.length !== initialDriverCount + 1) {
  throw new Error('Driver count should increase by 1');
}

const deleted = store.deleteDriver(newDriverResult.driver.id);
console.log(`   - Deleted test delivery partner: ${deleted}`);
if (store.drivers.length !== initialDriverCount) {
  throw new Error('Driver count should return to original');
}
console.log('   ✅ Add and delete delivery partner verified.\n');

console.log('======================================================');
console.log('🎉 ALL ROLE SYSTEM REQUIREMENTS VERIFIED SUCCESSFULLY!');
console.log('======================================================');
