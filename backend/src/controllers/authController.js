import bcrypt from 'bcryptjs';
import { store } from '../data/store.js';
import { generateToken } from '../middleware/authMiddleware.js';

export const register = (req, res) => {
  try {
    const { name, email, password, role = 'customer', phone, address, vehicle_type } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existingUser = store.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const user = store.createUser({
      name,
      email,
      password_hash,
      role,
      phone,
      address,
      vehicle_type
    });

    const token = generateToken(user);
    const { password_hash: _, ...safeUser } = user;

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: safeUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = store.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    const token = generateToken(user);
    const { password_hash: _, ...safeUser } = user;

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: safeUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = (req, res) => {
  const { password_hash: _, ...safeUser } = req.user;
  res.json({
    success: true,
    user: safeUser
  });
};

export const restaurantLogin = (req, res) => {
  try {
    const {
      restaurant_id,
      email,
      password,
      remember_me = false,
      fssai_license_no,
      fssai_doc_name,
      bank_account_no,
      bank_ifsc,
      bank_name,
      account_holder,
      gstin,
      pan_number,
      pan_doc_name
    } = req.body;

    let targetRest = null;
    if (restaurant_id) {
      targetRest = store.restaurants.find(
        (r) => r.id === restaurant_id || r.restaurant_id === restaurant_id
      );
    }

    if (!targetRest && email) {
      const user = store.findUserByEmail(email);
      if (user) {
        targetRest = store.getRestaurantByOwnerId(user.id);
      }
    }

    // Default fallback to first demo restaurant if testing
    if (!targetRest) {
      targetRest = store.restaurants[0];
    }

    // Update compliance credentials if provided
    const complianceUpdates = {};
    if (fssai_license_no) complianceUpdates.fssai_license_no = fssai_license_no;
    if (fssai_doc_name) complianceUpdates.fssai_doc_name = fssai_doc_name;
    if (bank_account_no) complianceUpdates.bank_account_no = bank_account_no;
    if (bank_ifsc) complianceUpdates.bank_ifsc = bank_ifsc;
    if (bank_name) complianceUpdates.bank_name = bank_name;
    if (account_holder) complianceUpdates.account_holder = account_holder;
    if (gstin) complianceUpdates.gstin = gstin;
    if (pan_number) complianceUpdates.pan_number = pan_number;
    if (pan_doc_name) complianceUpdates.pan_doc_name = pan_doc_name;
    complianceUpdates.is_verified = true;

    store.updateRestaurant(targetRest.id, complianceUpdates);
    const updatedRest = store.getRestaurantById(targetRest.id);

    const ownerUser = store.findUserById(updatedRest.owner_id) || store.users.find(u => u.role === 'restaurant');
    const token = generateToken(ownerUser);
    const { password_hash: _, ...safeUser } = ownerUser;

    res.json({
      success: true,
      message: `Authenticated restaurant partner: ${updatedRest.name}`,
      token,
      remember_me: Boolean(remember_me),
      user: safeUser,
      restaurant: updatedRest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDemoUsers = (req, res) => {
  // Returns demo credentials and quick access tokens for all 4 roles
  const demoUsers = store.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatar_url: u.avatar_url,
    demoPassword: 'password123',
    token: generateToken(u)
  }));

  res.json({
    success: true,
    demoUsers
  });
};
