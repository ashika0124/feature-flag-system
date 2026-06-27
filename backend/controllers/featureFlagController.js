const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

exports.createFlag = async (req, res) => {
  const { key, description, enabled } = req.body;
  const organizationId = req.user.organizationId;

  if (!key) {
    return res.status(400).json({ error: 'Feature key required' });
  }

  try {
    const flagId = uuidv4();
    const result = await pool.query(
      'INSERT INTO feature_flags (id, organization_id, key, enabled, description) VALUES (\$1, \$2, \$3, \$4, \$5) RETURNING *',
      [flagId, organizationId, key, enabled || false, description || '']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Feature key already exists for this organization' });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create feature flag' });
  }
};

exports.getFlags = async (req, res) => {
  const organizationId = req.user.organizationId;

  try {
    const result = await pool.query(
      'SELECT * FROM feature_flags WHERE organization_id = \$1 ORDER BY created_at DESC',
      [organizationId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch flags' });
  }
};

exports.updateFlag = async (req, res) => {
  const { flagId } = req.params;
  const { enabled, description } = req.body;
  const organizationId = req.user.organizationId;

  try {
    // Verify flag belongs to user's org
    const checkResult = await pool.query(
      'SELECT id FROM feature_flags WHERE id = \$1 AND organization_id = \$2',
      [flagId, organizationId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Feature flag not found' });
    }

    const result = await pool.query(
      'UPDATE feature_flags SET enabled = COALESCE(\$1, enabled), description = COALESCE(\$2, description) WHERE id = \$3 RETURNING *',
      [enabled !== undefined ? enabled : null, description || null, flagId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update flag' });
  }
};

exports.deleteFlag = async (req, res) => {
  const { flagId } = req.params;
  const organizationId = req.user.organizationId;

  try {
    const result = await pool.query(
      'DELETE FROM feature_flags WHERE id = \$1 AND organization_id = \$2 RETURNING id',
      [flagId, organizationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feature flag not found' });
    }

    res.json({ message: 'Feature flag deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete flag' });
  }
};

exports.checkFlag = async (req, res) => {
  const { key } = req.body;
  const organizationId = req.user.organizationId;

  if (!key) {
    return res.status(400).json({ error: 'Feature key required' });
  }

  try {
    const result = await pool.query(
      'SELECT enabled FROM feature_flags WHERE organization_id = \$1 AND key = \$2',
      [organizationId, key]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feature flag not found' });
    }

    res.json({ key, enabled: result.rows[0].enabled });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check flag' });
  }
};