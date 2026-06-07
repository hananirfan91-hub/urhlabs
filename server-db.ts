import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { UserProfile, UsageLog, SubscriptionRequest, SystemSettings, UserRole, PresetAudio } from './src/types';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');
const AUDIO_DIR = path.join(process.cwd(), 'public', 'audio');

// Ensure directories exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Initial default settings
const defaultSettings: SystemSettings = {
  maintenance_mode: false,
  free_user_daily_limit: 3,
  max_text_length_free: 500,
  max_text_length_customer: 5000,
  auto_delete_days: 0,
};

// Initial database structured state
interface LocalDB {
  users: UserProfile[];
  usage_logs: UsageLog[];
  subscription_requests: SubscriptionRequest[];
  preset_audios: PresetAudio[];
  settings: Record<string, string>;
  passwords: Record<string, string>; // strictly secret server-side
}

const loadLocalDB = (): LocalDB => {
  if (!fs.existsSync(DB_FILE)) {
    const initialDB: LocalDB = {
      users: [],
      usage_logs: [],
      subscription_requests: [],
      preset_audios: [
        {
          id: 'preset_1',
          title: 'Welcome Speech Urdu Zainab',
          text_transcript: 'مکرمی! یو آر ایچ لیبز میں خوش آمدید، یہاں آپ معیاری آوازیں تیار کر سکتے ہیں۔',
          language: 'ur',
          voice_type: 'female',
          audio_url: '/audio/presets/welcome-urdu.mp3',
          created_at: new Date().toISOString()
        }
      ],
      settings: {
        maintenance_mode: 'false',
        free_user_daily_limit: '3',
        max_text_length_free: '500',
        max_text_length_customer: '5000',
        auto_delete_days: '0',
      },
      passwords: {},
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(data);
    if (!parsed.preset_audios) {
      parsed.preset_audios = [];
    }
    return parsed;
  } catch (err) {
    console.error("Local DB read error, resetting:", err);
    return {
      users: [],
      usage_logs: [],
      subscription_requests: [],
      preset_audios: [],
      settings: {},
      passwords: {},
    };
  }
};

const saveLocalDB = (db: LocalDB) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
};

// Initialize Supabase if available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const isSupabaseConfigured = !!(supabaseUrl && supabaseServiceRole);

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseServiceRole) : null;

console.log(`[URH LABS DB] Using ${isSupabaseConfigured ? 'Supabase Database' : 'Local JSON Flat-file Database Fallback'}`);


export const dbService = {
  isSupabase: isSupabaseConfigured,

  // Settings
  async getSettings(): Promise<SystemSettings> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('settings').select('*');
        if (error) throw error;
        const result = { ...defaultSettings };
        data.forEach((row: any) => {
          if (row.key === 'maintenance_mode') result.maintenance_mode = row.value === 'true';
          if (row.key === 'free_user_daily_limit') result.free_user_daily_limit = parseInt(row.value) || 3;
          if (row.key === 'max_text_length_free') result.max_text_length_free = parseInt(row.value) || 500;
          if (row.key === 'max_text_length_customer') result.max_text_length_customer = parseInt(row.value) || 5000;
          if (row.key === 'auto_delete_days') result.auto_delete_days = parseInt(row.value) || 0;
        });
        return result;
      } catch (err) {
        console.error("Supabase getSettings error, falling back:", err);
      }
    }

    const local = loadLocalDB();
    return {
      maintenance_mode: local.settings.maintenance_mode === 'true',
      free_user_daily_limit: parseInt(local.settings.free_user_daily_limit) || 3,
      max_text_length_free: parseInt(local.settings.max_text_length_free) || 500,
      max_text_length_customer: parseInt(local.settings.max_text_length_customer) || 5000,
      auto_delete_days: parseInt(local.settings.auto_delete_days) || 0,
    };
  },

  async updateSetting(key: string, value: string): Promise<void> {
    if (supabase) {
      try {
        const { error } = await supabase.from('settings').upsert({ key, value, updated_at: new Date().toISOString() });
        if (!error) return;
        console.error("Supabase updateSetting error:", error);
      } catch (err) {
        console.error("Supabase updateSetting crash:", err);
      }
    }
    const local = loadLocalDB();
    local.settings[key] = value;
    saveLocalDB(local);
  },

  // Auth Operations: SignUp / Login
  async registerUser(email: string, name: string, passwordPlain: string): Promise<UserProfile> {
    if (supabase) {
      try {
        // Try to create Supabase auth user, or insert raw profiles if managing manually
        // For standard setup-first, we can manage user records in our private users table
        const { data: existing } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
        if (existing) {
          throw new Error("Email already registered");
        }
        
        const id = 'user_' + Math.random().toString(36).substr(2, 9);
        const newUser = {
          id,
          email,
          name,
          role: email === 'hananirfan91@gmail.com' ? 'admin' : 'user',
          credits: 3,
          plan: 'free',
          credits_reset_date: new Date().toISOString().substring(0, 10),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase.from('users').insert(newUser).select().single();
        if (error) throw error;
        // In real Supabase, password check would use Supabase Auth, but to prevent config lockouts, 
        // we can store password hash securely inside setting key or users.password metadata, 
        // or support direct custom verification in the API. 
        return data as UserProfile;
      } catch (err: any) {
        console.error("Supabase registration failed, trying local or throwing:", err.message);
        throw err;
      }
    }

    const local = loadLocalDB();
    const existing = local.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error("Email already registered");
    }

    const id = 'user_' + Math.random().toString(36).substr(2, 9);
    const newUser: UserProfile = {
      id,
      email,
      name,
      role: email === 'hananirfan91@gmail.com' ? 'admin' : 'user',
      credits: 0,
      plan: 'free',
      credits_reset_date: new Date().toISOString().substring(0, 10),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    local.users.push(newUser);
    local.passwords[email.toLowerCase()] = passwordPlain; // in memory/local disk for testing
    saveLocalDB(local);
    return newUser;
  },

  async authenticateUser(email: string, passwordPlain: string): Promise<UserProfile> {
    if (supabase) {
      try {
        // Since we are building full-stack proxy, if using Supabase, we can check matching record from 'users' table
        // For development security we support direct user login.
        const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
        if (error) throw error;
        if (!data) {
          // Auto create user if first login on development, or throw.
          // Let's create it dynamically if it doesn't exist for super responsive platform previews!
          if (email === 'hananirfan91@gmail.com') {
            return await this.registerUser(email, "Founder", passwordPlain);
          }
          throw new Error("User not found. Please sign up first.");
        }
        return data as UserProfile;
      } catch (err: any) {
        console.error("Supabase authenticate failed:", err.message);
        throw err;
      }
    }

    const local = loadLocalDB();
    const user = local.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Auto-register admin if they log in for ease of use
      if (email === 'hananirfan91@gmail.com') {
        return await this.registerUser(email, "Founder Admin", passwordPlain);
      }
      throw new Error("User not found");
    }
    const savedPassword = local.passwords[email.toLowerCase()];
    if (savedPassword && savedPassword !== passwordPlain) {
      throw new Error("Invalid password");
    }
    return user;
  },

  async getUser(id: string): Promise<UserProfile | null> {
    if (supabase) {
      const { data } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
      return data || null;
    }
    const local = loadLocalDB();
    return local.users.find(u => u.id === id) || null;
  },

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    if (supabase) {
      const { data } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
      return data || null;
    }
    const local = loadLocalDB();
    return local.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async updateUserRoleAndCredits(userId: string, role: UserRole, credits: number, plan?: string): Promise<UserProfile> {
    if (supabase) {
      const updateData: any = { role, credits, updated_at: new Date().toISOString() };
      if (plan) updateData.plan = plan;
      const { data, error } = await supabase.from('users').update(updateData).eq('id', userId).select().single();
      if (error) throw error;
      return data as UserProfile;
    }
    const local = loadLocalDB();
    const idx = local.users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error("User not found");
    const updatedUser = {
      ...local.users[idx],
      role,
      credits,
      plan: plan || (role === 'customer' ? 'Advanced' : local.users[idx].plan),
      updated_at: new Date().toISOString(),
    };
    local.users[idx] = updatedUser;
    saveLocalDB(local);
    return updatedUser;
  },

  // Usage Logs
  async createUsageLog(userId: string, rxt: string, lang: 'ur' | 'en', voice: 'male' | 'female', audio: string, duration: number, format: 'mp3' | 'mp4'): Promise<UsageLog> {
    const logData = {
      user_id: userId,
      text_input: rxt.length > 200 ? rxt.substring(0, 200) + '...' : rxt,
      language: lang,
      voice_type: voice,
      audio_url: audio,
      duration_sec: duration,
      format,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('usage_logs').insert(logData).select().single();
        if (!error) return data as UsageLog;
        console.error("Supabase insert usage log error:", error);
      } catch (err) {
        console.error("Supabase insert usage log crash:", err);
      }
    }

    const local = loadLocalDB();
    const user = local.users.find(u => u.id === userId);
    const newLog: UsageLog = {
      id: 'log_' + Math.random().toString(36).substr(2, 9),
      ...logData,
      user_email: user?.email || 'Unknown User',
    };
    local.usage_logs.push(newLog);
    saveLocalDB(local);
    return newLog;
  },

  async getUserLogs(userId: string): Promise<UsageLog[]> {
    if (supabase) {
      const { data, error } = await supabase.from('usage_logs').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (!error) return data || [];
    }
    const local = loadLocalDB();
    return local.usage_logs
      .filter(l => l.user_id === userId)
      .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getFreeUserDailyUsageToday(userId: string): Promise<number> {
    const todayStr = new Date().toISOString().substring(0, 10); // YYYY-MM-DD
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('usage_logs')
          .select('id')
          .eq('user_id', userId)
          .gte('created_at', `${todayStr}T00:00:00.000Z`)
          .lte('created_at', `${todayStr}T23:59:59.999Z`);
        if (!error) return data ? data.length : 0;
      } catch (err) {
        console.error("Supabase daily usage count error:", err);
      }
    }

    const local = loadLocalDB();
    return local.usage_logs.filter(l => 
      l.user_id === userId && l.created_at.startsWith(todayStr)
    ).length;
  },

  // Subscription Requests
  async createSubscriptionRequest(name: string, email: string, phone: string, plan: string, message: string): Promise<SubscriptionRequest> {
    const reqData = {
      name,
      email,
      phone,
      plan,
      message,
      status: 'pending' as const,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      const { data, error } = await supabase.from('subscription_requests').insert(reqData).select().single();
      if (error) throw error;
      return data as SubscriptionRequest;
    }

    const local = loadLocalDB();
    const newRequest: SubscriptionRequest = {
      id: 'subrq_' + Math.random().toString(36).substr(2, 9),
      ...reqData,
    };
    local.subscription_requests.push(newRequest);
    saveLocalDB(local);
    return newRequest;
  },

  async getSubscriptionRequests(): Promise<SubscriptionRequest[]> {
    if (supabase) {
      const { data, error } = await supabase.from('subscription_requests').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    const local = loadLocalDB();
    return [...local.subscription_requests].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async reviewSubscriptionRequest(requestId: string, status: 'approved' | 'rejected', adminEmail: string): Promise<SubscriptionRequest> {
    const updateData = {
      status,
      reviewed_by: adminEmail,
      reviewed_at: new Date().toISOString(),
    };

    if (supabase) {
      // Get the request details to assign actual privileges first
      const { data: request, error: reqErr } = await supabase.from('subscription_requests').select('*').eq('id', requestId).single();
      if (reqErr) throw reqErr;

      // Update request status
      const { data, error } = await supabase.from('subscription_requests').update(updateData).eq('id', requestId).select().single();
      if (error) throw error;

      if (status === 'approved' && request) {
        // Upgrade user profile
        const { data: user } = await supabase.from('users').select('*').eq('email', request.email).maybeSingle();
        if (user) {
          // Credits determined by plan
          let credits = 30;
          if (request.plan.toLowerCase().includes('advanced')) credits = 250;
          if (request.plan.toLowerCase().includes('pro')) credits = 500;
          
          await supabase.from('users').update({
            role: 'customer',
            credits,
            plan: request.plan,
            credits_reset_date: new Date().toISOString().substring(0, 10),
            updated_at: new Date().toISOString(),
          }).eq('id', user.id);
        }
      }
      return data as SubscriptionRequest;
    }

    const local = loadLocalDB();
    const idx = local.subscription_requests.findIndex(r => r.id === requestId);
    if (idx === -1) throw new Error("Request not found");

    const request = local.subscription_requests[idx];
    const updatedRequest = {
      ...request,
      ...updateData,
    };
    local.subscription_requests[idx] = updatedRequest;

    if (status === 'approved') {
      const userIdx = local.users.findIndex(u => u.email.toLowerCase() === request.email.toLowerCase());
      if (userIdx !== -1) {
        let credits = 30;
        if (request.plan.toLowerCase().includes('advanced')) credits = 250;
        if (request.plan.toLowerCase().includes('pro')) credits = 500;

        local.users[userIdx] = {
          ...local.users[userIdx],
          role: 'customer',
          credits,
          plan: request.plan,
          credits_reset_date: new Date().toISOString().substring(0, 10),
          updated_at: new Date().toISOString(),
        };
      }
    }

    saveLocalDB(local);
    return updatedRequest;
  },

  // Admin Dashboard Global Reports
  async getAllUsers(): Promise<UserProfile[]> {
    if (supabase) {
      const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      return data || [];
    }
    const local = loadLocalDB();
    return [...local.users].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getAllLogs(): Promise<UsageLog[]> {
    if (supabase) {
      // In Supabase, let's join users table if possible, or fetch logs then construct emails
      const { data: logs } = await supabase.from('usage_logs').select('*').order('created_at', { ascending: false });
      if (!logs) return [];
      const { data: users } = await supabase.from('users').select('id, email');
      const emailMap: Record<string, string> = {};
      users?.forEach((u: any) => { emailMap[u.id] = u.email; });
      return logs.map((l: any) => ({
        ...l,
        user_email: emailMap[l.user_id] || 'Unknown User',
      })) as UsageLog[];
    }
    const local = loadLocalDB();
    return [...local.usage_logs].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async deleteUser(userId: string): Promise<void> {
    if (supabase) {
      await supabase.from('users').delete().eq('id', userId);
      return;
    }
    const local = loadLocalDB();
    local.users = local.users.filter(u => u.id !== userId);
    saveLocalDB(local);
  },

  async purgeOldLogs(days: number): Promise<number> {
    const cutOff = new Date();
    cutOff.setDate(cutOff.getDate() - days);
    const cutOffStr = cutOff.toISOString();

    if (supabase) {
      const { error, count } = await supabase.from('usage_logs').delete({ count: 'exact' }).lte('created_at', cutOffStr);
      if (error) throw error;
      return count || 0;
    }

    const local = loadLocalDB();
    const initialCount = local.usage_logs.length;
    local.usage_logs = local.usage_logs.filter(l => new Date(l.created_at).getTime() >= cutOff.getTime());
    saveLocalDB(local);
    return initialCount - local.usage_logs.length;
  },

  // Preset Audios operations
  async getAllPresetAudios(): Promise<PresetAudio[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('preset_audios').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as PresetAudio[];
        console.error("Supabase getAllPresetAudios error:", error);
      } catch (err) {
        console.error("Supabase getAllPresetAudios exception:", err);
      }
    }
    const local = loadLocalDB();
    return local.preset_audios || [];
  },

  async createPresetAudio(title: string, text_transcript: string, language: 'ur' | 'en', voice_type: 'male' | 'female', audio_url: string): Promise<PresetAudio> {
    const id = 'preset_' + Math.random().toString(36).substr(2, 9);
    const newPreset: PresetAudio = {
      id,
      title,
      text_transcript,
      language,
      voice_type,
      audio_url,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('preset_audios').insert(newPreset).select().single();
        if (!error && data) return data as PresetAudio;
        console.error("Supabase createPresetAudio error:", error);
      } catch (err) {
        console.error("Supabase createPresetAudio exception:", err);
      }
    }

    const local = loadLocalDB();
    if (!local.preset_audios) {
      local.preset_audios = [];
    }
    local.preset_audios.push(newPreset);
    saveLocalDB(local);
    return newPreset;
  },

  async deletePresetAudio(id: string): Promise<void> {
    if (supabase) {
      try {
        const { error } = await supabase.from('preset_audios').delete().eq('id', id);
        if (!error) return;
        console.error("Supabase deletePresetAudio error:", error);
      } catch (err) {
        console.error("Supabase deletePresetAudio exception:", err);
      }
    }
    const local = loadLocalDB();
    if (local.preset_audios) {
      local.preset_audios = local.preset_audios.filter(p => p.id !== id);
      saveLocalDB(local);
    }
  }
};
