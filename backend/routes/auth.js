import express from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Token storage file path
const TOKENS_FILE = path.join(__dirname, '../data/tokens.json');

// Ensure data directory exists
const dataDir = path.dirname(TOKENS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load tokens from file
const loadTokens = () => {
  try {
    if (fs.existsSync(TOKENS_FILE)) {
      const data = fs.readFileSync(TOKENS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading tokens:', error);
  }
  return {};
};

// Save tokens to file
const saveTokens = (tokens) => {
  try {
    // Clean expired tokens before saving
    const now = Date.now();
    const activeTokens = {};
    for (const [token, expiry] of Object.entries(tokens)) {
      if (expiry > now) {
        activeTokens[token] = expiry;
      }
    }
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(activeTokens, null, 2));
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};

// Initialize tokens from file
let tokenStore = loadTokens();

// Clean expired tokens on startup
const now = Date.now();
tokenStore = Object.fromEntries(
  Object.entries(tokenStore).filter(([_, expiry]) => expiry > now)
);
saveTokens(tokenStore);

// Simple token generation
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Check if token is valid
const isTokenValid = (token) => {
  const expiry = tokenStore[token];
  if (!expiry) return false;
  if (expiry < Date.now()) {
    delete tokenStore[token];
    saveTokens(tokenStore);
    return false;
  }
  return true;
};

// Add token with expiry
const addToken = (token, expiryTime) => {
  tokenStore[token] = expiryTime;
  saveTokens(tokenStore);
};

// Remove token
const removeToken = (token) => {
  delete tokenStore[token];
  saveTokens(tokenStore);
};

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, passwordHash } = req.body;

    // Get credentials from .env
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return res.status(500).json({
        error: 'Admin credentials not configured',
        success: false,
      });
    }

    // Hash the password from .env to compare
    const envPasswordHash = crypto
      .createHash('sha256')
      .update(adminPassword)
      .digest('hex');

    // Compare email and password hash
    if (email.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) {
      return res.status(401).json({
        error: 'Invalid credentials',
        success: false,
      });
    }

    if (passwordHash !== envPasswordHash) {
      return res.status(401).json({
        error: 'Invalid credentials',
        success: false,
      });
    }

    // Generate token
    const token = generateToken();
    
    // Set token expiry (configurable from .env, default 24 hours)
    const expiryHours = parseInt(process.env.TOKEN_EXPIRY_HOURS || '24', 10);
    const expiryTime = Date.now() + (expiryHours * 60 * 60 * 1000);
    
    // Store token with expiry time
    addToken(token, expiryTime);

    res.json({
      success: true,
      token,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      success: false,
    });
  }
});

// Verify token middleware
export const verifyAdminToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                  req.body.token || 
                  req.query.token;

    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        success: false,
      });
    }

    if (!isTokenValid(token)) {
      return res.status(401).json({
        error: 'Invalid or expired token',
        success: false,
      });
    }
    
    // Extend token expiry on successful verification (refresh token)
    const expiryHours = parseInt(process.env.TOKEN_EXPIRY_HOURS || '24', 10);
    const newExpiryTime = Date.now() + (expiryHours * 60 * 60 * 1000);
    addToken(token, newExpiryTime);

    req.adminToken = token;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Token verification failed',
      success: false,
    });
  }
};

// Logout endpoint
router.post('/logout', verifyAdminToken, (req, res) => {
  try {
    const token = req.adminToken;
    removeToken(token);
    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Logout failed',
      success: false,
    });
  }
});

// Verify token endpoint (public, no middleware needed)
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                  req.query.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    if (!isTokenValid(token)) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }

    // Extend token expiry on successful verification
    const expiryHours = parseInt(process.env.TOKEN_EXPIRY_HOURS || '24', 10);
    const newExpiryTime = Date.now() + (expiryHours * 60 * 60 * 1000);
    addToken(token, newExpiryTime);

    res.json({
      success: true,
      message: 'Token is valid',
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token verification failed',
    });
  }
});

export default router;

