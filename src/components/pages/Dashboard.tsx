import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Calendar, Clock, LayoutDashboard, History, Sparkles, 
  HelpCircle, Volume2, Download, ClipboardList, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { UserProfile, UsageLog } from '../../types';

interface DashboardProps {
  user: UserProfile | null;
}

export default function Dashboard({ user }: DashboardProps) {
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Custom playout node hooks
  const [playingLogId, setPlayingLogId] = useState<string | null>(null);
  const audioPlayersRef = useRef<Record<string, HTMLAudioElement>>({});

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    fetch('/api/logs')
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load history logs");
        setLogs(data.logs || []);
        setError(null);
      })
      .catch((err: any) => {
        setError(err.message || "Failed to sync historical databases");
      })
      .finally(() => {
        setLoading(false);
      });

    // Cleanup players on navigation
    return () => {
      Object.keys(audioPlayersRef.current).forEach(key => {
        audioPlayersRef.current[key]?.pause();
      });
    };
  }, [user]);

  const toggleInlinePlay = (log: UsageLog) => {
    const activePlayer = audioPlayersRef.current[log.id];

    if (playingLogId === log.id && activePlayer) {
      activePlayer.pause();
      setPlayingLogId(null);
    } else {
      // Pause other players
      if (playingLogId && audioPlayersRef.current[playingLogId]) {
        audioPlayersRef.current[playingLogId].pause();
      }

      // Initialize or reuse HTMLAudio node
      let player = activePlayer;
      if (!player) {
        player = new Audio(log.audio_url);
        player.crossOrigin = 'anonymous';
        player.addEventListener('ended', () => {
          setPlayingLogId(null);
        });
        audioPlayersRef.current[log.id] = player;
      }

      player.play()
        .then(() => {
          setPlayingLogId(log.id);
        })
        .catch(err => {
          console.warn("Inline player stream blocked (Safeguard):", err);
          // Redirect the browser window to play natively
          window.open(log.audio_url, '_blank');
        });
    }
  };

  if (!user) return null;

  return (
    <article id="dashboard-root" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 transition-colors animate-in fade-in duration-200">
      
      {/* Upper header section */}
      <section id="dashboard-header" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-8 border-b border-border-custom pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary w-fit rounded-2xl border border-primary/20">
            <LayoutDashboard className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-text-primary leading-none">
              User Console Dashboard
            </h1>
            <h2 className="text-xs text-text-muted mt-2 font-display">
              Audit credits status, profile logs metadata and generated MP3 audio history.
            </h2>
          </div>
        </div>

        {/* Dynamic button actions */}
        <Link
          to="/tools"
          className="px-5 py-2.5 bg-primary hover:bg-[#574feb] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 transition-all font-sans"
        >
          <Sparkles className="h-3.5 w-3.5 fill-white" />
          Create New Speech
        </Link>
      </section>

      {/* Stats Cards indicators */}
      <section id="dashboard-stats" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Card 1: User details */}
        <div className="p-5 bg-card-bg border border-border-custom rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div className="flex flex-col overflow-hidden text-xs">
            <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Active Workspace Profile</span>
            <span className="text-sm font-bold text-text-primary mt-1 truncate">{user.name || user.email}</span>
            <span className="text-text-muted mt-0.5 truncate">{user.email}</span>
          </div>
        </div>

        {/* Card 2: Subscription plan stats */}
        <div className="p-5 bg-card-bg border border-border-custom rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-secondary/15 text-secondary rounded-xl shrink-0 border border-secondary/20">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="flex flex-col text-xs">
            <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Account Subscription Tier</span>
            <span className="text-sm font-extrabold text-secondary mt-1 flex items-center gap-1.5 leading-none">
              {user.role === 'customer' ? `Premium customer (${user.plan || 'Advanced'})` : user.role === 'admin' ? 'Administrative Owner' : 'Basic Free Tier'}
            </span>
            <span className="text-text-muted mt-1 leading-normal">
              {user.role === 'customer' ? `Anniversary resets` : 'Generations capped at 3 per day.'}
            </span>
          </div>
        </div>

        {/* Card 3: Account vocal credits remnants */}
        <div className="p-5 bg-card-bg border border-border-custom rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div className="flex flex-col text-xs">
            <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Conversion Credits Available</span>
            <span className="text-sm font-extrabold text-text-primary mt-1 leading-none font-mono">
              {user.role === 'customer' ? `${user.credits} Monthly Left` : user.role === 'admin' ? 'Unlimited Generations' : '3 Runs Assigned Daily'}
            </span>
            <Link to="/pricing" className="text-[10px] text-primary hover:underline font-bold mt-1 max-w-fit block">
              Upgrade Subscription Plan &rarr;
            </Link>
          </div>
        </div>

      </section>

      {/* Audits history logs list tables */}
      <section id="historical-logs-table" className="border border-border-custom bg-card-bg/25 rounded-2xl p-4 sm:p-6 shadow-md">
        <div className="flex items-center gap-2 border-b border-border-custom/50 pb-4 mb-4 justify-between">
          <h3 className="font-display text-sm font-extrabold text-text-primary leading-none flex items-center gap-2">
            <History className="h-4.5 w-4.5 text-primary" />
            Generation Histology Logs audit
          </h3>
          <span className="font-mono text-[10px] bg-border-custom px-2 py-0.5 rounded text-text-muted">
            {logs.length} Speech Files Recorded
          </span>
        </div>

        {loading ? (
          /* Skeletons */
          <div className="flex flex-col gap-3 py-10 items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="font-mono text-xs text-text-muted mt-1">loading account transaction logs...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center justify-center">
            <ClipboardList className="h-10 w-10 text-text-muted mb-4 opacity-75" />
            <h4 className="font-display font-bold text-text-primary text-sm">No Conversations Found Yet</h4>
            <p className="text-xs text-text-muted max-w-sm mt-1 mb-4 leading-relaxed">
              When you submit vocal paragraphs inside the generator tools workspace, your processed MP3 outputs are safely stored here for playback triggers.
            </p>
            <Link to="/tools" className="px-4 py-2 bg-primary hover:bg-[#574feb] text-xs font-semibold text-white rounded-lg">
              Launch Free AI Speech Tool
            </Link>
          </div>
        ) : (
          /* Table details grid */
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[650px] leading-relaxed">
              <thead>
                <tr className="border-b border-border-custom/80 font-mono tracking-wider text-text-muted uppercase text-[10px]">
                  <th className="py-2.5 px-2">Timestamp</th>
                  <th className="py-2.5 px-2">Vocal Profile</th>
                  <th className="py-2.5 px-2">Text Excerpt snippet</th>
                  <th className="py-2.5 px-2">Duration</th>
                  <th className="py-2.5 px-2 text-center">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom/15 text-text-muted">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-card-bg/40 transition-colors">
                    
                    {/* Timestamp */}
                    <td className="py-3 px-2 font-mono text-[11px] text-text-muted">
                      {new Date(log.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    {/* Gender actors and Languages chosen */}
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.language === 'ur' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-secondary/15 text-secondary border border-secondary/20'}`}>
                          {log.language === 'ur' ? 'Urdu' : 'English'}
                        </span>
                        <span className="text-[11px] text-text-primary font-medium capitalize">
                          {log.voice_type} Vocal
                        </span>
                      </div>
                    </td>

                    {/* Excerpt input text preview */}
                    <td className="py-3 px-2 max-w-[280px] truncate font-sans text-xs text-text-primary px-3" dir={log.language === 'ur' ? 'rtl' : 'ltr'}>
                      {log.text_input}
                    </td>

                    {/* Approximated duration */}
                    <td className="py-3 px-2 font-mono font-medium text-[11px] text-text-muted">
                      ~{log.duration_sec} secs
                    </td>

                    {/* Control parameters download & inline playout */}
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleInlinePlay(log)}
                          className="px-2.5 py-1.5 bg-dark-bg border border-border-custom text-text-muted hover:text-text-primary rounded-lg cursor-pointer font-semibold flex items-center gap-1 hover:border-text-muted/40 transition-colors text-[10px]"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                          {playingLogId === log.id ? 'Pause' : 'Playout'}
                        </button>
                        
                        <a
                          href={log.audio_url}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-lg cursor-pointer flex items-center justify-center"
                          title="Download Audio MP3"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </article>
  );
}
