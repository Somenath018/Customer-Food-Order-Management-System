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

export const updateMe = (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, avatar_url, vehicle_type } = req.body;
    const updatedUser = store.updateUser(userId, { name, phone, address, avatar_url, vehicle_type });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser
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

export const restaurantLogin = (req, res) => {
  try {
    const { restaurantId, pin } = req.body;
    if (!restaurantId || !pin) {
      return res.status(400).json({ success: false, message: 'Restaurant ID and owner PIN or password are required.' });
    }

    const authResult = store.findRestaurantByPinOrPassword(restaurantId, pin);
    if (!authResult) {
      return res.status(401).json({ success: false, message: 'Invalid owner/manager PIN or password for this restaurant.' });
    }

    const { restaurant, owner } = authResult;
    const sessionUser = {
      ...owner,
      role: 'restaurant',
      restaurant_id: restaurant.id,
      restaurant_name: restaurant.name
    };

    const token = generateToken(sessionUser);
    const { password_hash: _, ...safeUser } = sessionUser;

    res.json({
      success: true,
      message: `Authenticated as ${restaurant.name} Partner`,
      token,
      user: safeUser,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        image_url: restaurant.image_url,
        address: restaurant.address
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
