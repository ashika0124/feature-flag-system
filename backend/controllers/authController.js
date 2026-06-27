const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Super Admin Login (using static credentials)
exports.superAdminLogin = async (req, res) => {
  const { email, password } = req.body;
  
  // Static credentials
  const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'admin@system.com';
  const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'admin123';

  if (email !== SUPER_ADMIN_EMAIL || password !== SUPER_ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: 'super_admin', email, role: 'super_admin' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token, role: 'super_admin' });
};

// Organization Admin Signup
exports.orgAdminSignup = async (req, res) => {
  const { email, password, organizationId } = req.body;

  if (!email || !password || !organizationId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if org exists
    const orgResult = await pool.query(
      'SELECT id FROM organizations WHERE id = \$1',
      [organizationId]
    );

    if (orgResult.rows.length === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Check if user exists
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = \$1',
      [email]
    );

    if (userResult.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await pool.query(
      'INSERT INTO users (id, email, password_hash, role, organization_id) VALUES (\$1, \$2, \$3, \$4, \$5)',
      [userId, email, passwordHash, 'org_admin', organizationId]
    );

    res.status(201).json({ message: 'Signup successful', userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Signup failed' });
  }
};

// Organization Admin Login
exports.orgAdminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, password_hash, organization_id, role FROM users WHERE email = \$1 AND role = \$2',
      [email, 'org_admin']
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email, role: 'org_admin', organizationId: user.organization_id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, role: 'org_admin', organizationId: user.organization_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// End User Login
exports.endUserLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, password_hash, organization_id FROM users WHERE email = \$1 AND role = \$2',
      [email, 'end_user']
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email, role: 'end_user', organizationId: user.organization_id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, role: 'end_user', organizationId: user.organization_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};