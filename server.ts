import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { dbService } from './server-db';
import { r2Service } from './server-r2';
import { ttsService } from './server-tts';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'urhlabs-jwt-super-secret-key-2026';

app.use(express.json());

// Pure cookies parser helper middleware
app.use((req: any, res, next) => {
  const cookieHeader = req.headers.cookie;
  req.cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach((cookie: string) => {
      const parts = cookie.split('=');
      const name = parts.shift()?.trim();
      if (name) {
        req.cookies[name] = decodeURIComponent(parts.join('='));
      }
    });
  }
  next();
});

// Pure Node.js HS256 JWT Helpers
function base64url(buf: Buffer): string {
  return buf.toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function signJWT(payload: any): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const h64 = base64url(Buffer.from(JSON.stringify(header)));
  const p64 = base64url(Buffer.from(JSON.stringify(payload)));
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${h64}.${p64}`)
    .digest();
  const s64 = base64url(signature);
  return `${h64}.${p64}.${s64}`;
}

function verifyJWT(token: string): any {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h64, p64, s64] = parts;
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${h64}.${p64}`)
    .digest();
  const expectedS64 = base64url(signature);
  if (expectedS64 !== s64) return null;
  
  try {
    return JSON.parse(Buffer.from(p64, 'base64').toString('utf8'));
  } catch (err) {
    return null;
  }
}

// Global Auth Middleware
const authenticateUser = async (req: any, res: any, next: any) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const decoded = verifyJWT(token);
  if (!decoded || !decoded.userId) {
    return res.status(401).json({ error: "Invalid or expired session token" });
  }
  const user = await dbService.getUser(decoded.userId);
  if (!user) {
    return res.status(401).json({ error: "User session not found" });
  }
  req.user = user;
  next();
};

// Admin Only Middleware
const authenticateAdmin = async (req: any, res: any, next: any) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ error: "Admin authentication required" });
  }
  const decoded = verifyJWT(token);
  if (!decoded || decoded.email !== 'hananirfan91@gmail.com') {
    return res.status(403).json({ error: "Access denied. Hanan Irfan Only." });
  }
  const user = await dbService.getUser(decoded.userId);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied. Requires Admin role." });
  }
  req.user = user;
  next();
};

// ============================================
// PUBLIC & VISITOR RELEVANT ENDPOINTS
// ============================================

// Register
app.post('/api/auth/signup', async (req: any, res: any) => {
  const { name, email, password, confirmPassword, captchaQuestion, captchaAnswer } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "All account fields are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  // Verify Captcha
  const savedCaptcha = req.body._captchaExpected; // passed from schema validation client-side
  if (savedCaptcha !== undefined && String(captchaAnswer) !== String(savedCaptcha)) {
    return res.status(400).json({ error: "Incorrect Captcha protection answer" });
  }

  try {
    const user = await dbService.registerUser(email, name, password);
    const token = signJWT({ userId: user.id, email: user.email, role: user.role });
    
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 365 * 24 * 3600 * 1000 // 1 year session duration
    });

    return res.status(201).json({ user });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Sign up failed" });
  }
});

// Login
app.post('/api/auth/login', async (req: any, res: any) => {
  const { email, password, captchaAnswer } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Verify code Captcha
  const savedCaptcha = req.body._captchaExpected;
  if (savedCaptcha !== undefined && String(captchaAnswer) !== String(savedCaptcha)) {
    return res.status(400).json({ error: "Incorrect Captcha answer" });
  }

  try {
    const user = await dbService.authenticateUser(email, password);
    const token = signJWT({ userId: user.id, email: user.email, role: user.role });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 3600 * 1000 // 30 days
    });

    return res.json({ user });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Invalid credentials" });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token');
  return res.json({ success: true });
});

// GET Current User (Me)
app.get('/api/auth/me', async (req: any, res) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.json({ user: null });
  }
  const decoded = verifyJWT(token);
  if (!decoded) {
    res.clearCookie('auth_token');
    return res.json({ user: null });
  }
  const user = await dbService.getUser(decoded.userId);
  return res.json({ user });
});

// Subscribe submission endpoint
app.post('/api/subscribe', async (req: any, res) => {
  const { name, email, phone, plan, message } = req.body;
  if (!name || !email || !plan) {
    return res.status(400).json({ error: "Name, email, and subscription plan are required" });
  }
  try {
    const request = await dbService.createSubscriptionRequest(name, email, phone || '', plan, message || '');
    return res.status(201).json({
      success: true,
      request,
      message: "Request received. Admin will activate your plan within 24 hours."
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to submit subscription request" });
  }
});

// Get user history logs
app.get('/api/logs', authenticateUser, async (req: any, res) => {
  try {
    const logs = await dbService.getUserLogs(req.user.id);
    return res.json({ logs });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch logs" });
  }
});

// ============================================
// FEATURE ENDPOINT: AUDIO TEXT-TO-SPEECH
// ============================================
app.post('/api/tts', async (req: any, res) => {
  const { text, language, voice, speed, pitch, format } = req.body;

  if (!text || !language || !voice) {
    return res.status(400).json({ error: "Missing required query parameters: text, language, and voice" });
  }

  // Check Maintenance mode first
  const settings = await dbService.getSettings();
  const token = req.cookies.auth_token;
  const decoded = token ? verifyJWT(token) : null;
  const isAdmin = decoded?.email === 'hananirfan91@gmail.com';

  if (settings.maintenance_mode && !isAdmin) {
    return res.status(503).json({ error: "URH LABS is currently undergoing scheduled maintenance. Please try again soon." });
  }

  // Session & User verification
  let user = decoded ? await dbService.getUser(decoded.userId) : null;
  const wordCount = text.trim().split(/\s+/).length;

  // Enforce visitor rules
  if (!user) {
    // Free preview without registration
    if (text.length > settings.max_text_length_free) {
      return res.status(403).json({ error: `Anonymous previews are capped at ${settings.max_text_length_free} characters. Please register a free account.` });
    }
  } else {
    // Logged in user rules
    const isPaidCustomer = user.role === 'customer';
    
    if (isPaidCustomer) {
      // Deduct credits or verify limit
      if (user.credits <= 0) {
        return res.status(402).json({ error: "You have used all monthly generation credits. Please submit a subscription top-up request." });
      }
      if (text.length > settings.max_text_length_customer) {
        return res.status(403).json({ error: `Premium inputs are capped at ${settings.max_text_length_customer} characters per generation.` });
      }
    } else if (user.role === 'admin') {
      // Bypass limits
    } else {
      // Free User Limits
      const dailyGeneratedCount = await dbService.getFreeUserDailyUsageToday(user.id);
      if (dailyGeneratedCount >= settings.free_user_daily_limit) {
        return res.status(429).json({ error: `Daily limit reached. Free users are limited to ${settings.free_user_daily_limit} generations per day. Upgrade to bypass.` });
      }
      if (text.length > settings.max_text_length_free) {
        return res.status(403).json({ error: `Free tier inputs are capped at ${settings.max_text_length_free} characters per generation.` });
      }
    }
  }

  try {
    // Generate Buffer audio stream
    const audioBuffer = await ttsService.generateSpeech(text, language, voice);

    // Default User IDs for logs
    const activeUserId = user ? user.id : '00000000-0000-0000-0000-000000000000';
    
    // Upload speech audio to storage
    const { relativePath, playUrl, downloadUrl } = await r2Service.uploadAudio(
      activeUserId,
      audioBuffer,
      voice,
      language,
      format || 'mp3'
    );

    // Calculate simulated vocalization timing
    const approxSec = Math.max(1, Math.round(wordCount * 0.45));

    // Deduct credits if paid customer
    if (user && user.role === 'customer') {
      await dbService.updateUserRoleAndCredits(user.id, user.role, user.credits - 1);
    }

    // Save generation transaction state log
    const savedLog = await dbService.createUsageLog(
      activeUserId,
      text,
      language,
      voice,
      downloadUrl, // saved download URL pointer
      approxSec,
      format || 'mp3'
    );

    return res.json({
      success: true,
      audioUrl: playUrl,
      downloadUrl: downloadUrl,
      duration: approxSec,
      log: savedLog,
      remainingCredits: user && user.role === 'customer' ? user.credits - 1 : null
    });
  } catch (err: any) {
    console.error("Audio generation route failed:", err);
    return res.status(500).json({ error: err.message || "Failed to synthesize speech" });
  }
});

// ============================================
// ADMINISTRATIVE ROUTINGS (/api/admin/*)
// ============================================

// Overview counts
app.get('/api/admin/overview', authenticateAdmin, async (req: any, res) => {
  try {
    const users = await dbService.getAllUsers();
    const logs = await dbService.getAllLogs();
    const requests = await dbService.getSubscriptionRequests();
    const settings = await dbService.getSettings();

    // Stats
    const totalUsers = users.length;
    const pendingSubs = requests.filter(r => r.status === 'pending').length;
    const totalGenerations = logs.length;

    // Daily generations today
    const todayStr = new Date().toISOString().substring(0, 10);
    const generationsToday = logs.filter(l => l.created_at.startsWith(todayStr)).length;

    return res.json({
      totalUsers,
      totalGenerations,
      generationsToday,
      pendingSubs,
      settings,
      recentLogs: logs.slice(0, 20)
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to load admin overview" });
  }
});

// Users admin
app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await dbService.getAllUsers();
    return res.json({ users });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/users', authenticateAdmin, async (req, res) => {
  const { userId, role, credits, plan } = req.body;
  if (!userId || !role) {
    return res.status(400).json({ error: "user ID and role are required fields" });
  }
  try {
    const user = await dbService.updateUserRoleAndCredits(userId, role, parseInt(credits) || 0, plan);
    return res.json({ success: true, user });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/users/:id', authenticateAdmin, async (req, res) => {
  try {
    await dbService.deleteUser(req.params.id);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Subscriptions requests administration
app.get('/api/admin/subscriptions', authenticateAdmin, async (req, res) => {
  try {
    const subscriptions = await dbService.getSubscriptionRequests();
    return res.json({ subscriptions });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/subscriptions/approve', authenticateAdmin, async (req: any, res) => {
  const { requestId, status } = req.body;
  if (!requestId || !status) {
    return res.status(400).json({ error: "Missing required request parameters" });
  }
  try {
    const request = await dbService.reviewSubscriptionRequest(requestId, status, req.user.email);
    return res.json({ success: true, request });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// System general settings update
app.post('/api/admin/settings', authenticateAdmin, async (req, res) => {
  const { maintenance_mode, free_user_daily_limit, max_text_length_free, max_text_length_customer, auto_delete_days } = req.body;
  
  try {
    if (maintenance_mode !== undefined) await dbService.updateSetting('maintenance_mode', String(maintenance_mode));
    if (free_user_daily_limit !== undefined) await dbService.updateSetting('free_user_daily_limit', String(free_user_daily_limit));
    if (max_text_length_free !== undefined) await dbService.updateSetting('max_text_length_free', String(max_text_length_free));
    if (max_text_length_customer !== undefined) await dbService.updateSetting('max_text_length_customer', String(max_text_length_customer));
    if (auto_delete_days !== undefined) await dbService.updateSetting('auto_delete_days', String(auto_delete_days));

    const settings = await dbService.getSettings();
    return res.json({ success: true, settings });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// Maintenance Mode status query
app.get('/api/status', async (req, res) => {
  const settings = await dbService.getSettings();
  return res.json({
    maintenance_mode: settings.maintenance_mode,
    free_user_daily_limit: settings.free_user_daily_limit
  });
});

// ============================================
// SERVER INTEGRATION WITH ENGINES
// ============================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode: Mount Vite's HMR static files middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode: Compile and serve files from /dist build folder
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[URH LABS PORTAL] Full stack server online at http://localhost:${PORT}`);
  });
}

startServer();
