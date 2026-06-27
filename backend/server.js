const express = require('express');
const cors = require('cors');
require('dotenv').config();

const superAdminRoutes = require('./routes/superAdmin');
const orgAdminRoutes = require('./routes/orgAdmin');
const endUserRoutes = require('./routes/endUser');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/org-admin', orgAdminRoutes);
app.use('/api/end-user', endUserRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});