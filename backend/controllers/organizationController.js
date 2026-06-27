const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

exports.createOrganization = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Organization name required' });
  }

  try {
    const orgId = uuidv4();
    const result = await pool.query(
      'INSERT INTO organizations (id, name) VALUES (\$1, \$2) RETURNING *',
      [orgId, name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create organization' });
  }
};

exports.getOrganizations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM organizations ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
};