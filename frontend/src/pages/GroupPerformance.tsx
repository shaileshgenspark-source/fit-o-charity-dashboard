import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Users, 
  Search, 
  Activity as ActivityIcon, 
  TrendingUp, 
  Clock, 
  LayoutGrid,
  Zap,
  ArrowLeft,
  ChevronRight,
  Target,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { groupsApi, Activity } from '../services/api';
import { format } from 'date-fns';

const CHART_COLORS = ['#FF6B35', '#FF8C5A', '#CC4E14', '#E0E0E0', '#4A4A4A'];

const GroupPerformance = () => {
  const [code, setCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return toast.error('SQUADRON_CODE_REQUIRED');

    setLoading(true);
    try {
      const [lRes, aRes] = await Promise.all([
        groupsApi.getGroupLeaderboard(code),
        groupsApi.getGroupActivities(code)
      ]);
      
      if (!lRes.data.leaderboard || lRes.data.leaderboard.length === 0) {
        throw new Error('EMPTY_SQUADRON');
      }

      setStats(lRes.data);
      setActivities(aRes.data);
      setIsAuthenticated(true);
      toast.success(`UPLINK_SECURED: GROUP_${code}`);
    } catch (err: any) {
      toast.error(err.message === 'EMPTY_SQUADRON' ? 'SQUADRON_FOUND_BUT_EMPTY' : 'SQUADRON_NOT_FOUND_IN_LOGS');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setStats(null);
    setActivities([]);
    setCode('');
  };

  const dailyData = activities.slice(0, 10).reverse().map(a => ({
    date: format(new Date(a.createdAt), 'dd/MM'),
    distance: a.distance || 0,
    participant: a.participantName
  }));

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="industrial-panel p-8 md:p-12 max-w-md w-full border-r-4 border-r-[#FF6B35]"
        >
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-full shadow-[0_0_20px_rgba(255,107,53,0.2)]">
                <Users size={48} className="text-[#FF6B35]" />
              </div>
            </div>
            <div>
              <div className="tech-label text-[#FF6B35] mb-1">UNIT_PORTAL: SQUADRON_SYNC</div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase italic">GROUP_PERFORMANCE</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="tech-label text-white">GROUP_RANGE_ID</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g. 1000"
                  className="w-full bg-[#050505] border-2 border-[#2D2D2D] p-5 md:p-6 text-white text-center text-3xl md:text-4xl font-black tracking-[0.3em] focus:border-[#FF6B35] outline-none transition-all uppercase placeholder:text-[#1A1A1A]"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                />
                <p className="text-[10px] text-[#444] font-bold text-center uppercase tracking-widest mt-2">
                  Enter the base series (e.g. 1000 for users 1000-1999)
                </p>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-safety w-full py-5 flex items-center justify-center gap-4 text-xl shadow-[8px_8px_0px_0px_#000]"
              >
                {loading ? 'RETRIVING...' : 'ACCESS_INTEL'}
                {!loading && <Search size={24} />}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 md:py-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#FF6B35] pb-6 gap-4 px-2">
        <div className="space-y-1">
          <div className="tech-label text-[#FF6B35]">UNIT_DESIGNATION: SQUADRON_{stats?.groupCode}</div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase truncate">
            SQUAD_OVERVIEW
          </h1>
        </div>
        <button 
          onClick={logout} 
          className="flex items-center justify-center gap-2 px-4 py-2 border border-[#3F3F3F] text-[10px] font-black text-[#8C8C8C] hover:text-white hover:border-[#FF6B35] transition-all uppercase tracking-widest bg-[#1A1A1A]/50"
        >
          <ArrowLeft size={14} />
          DETACH_SQUADRON
        </button>
      </header>

      {/* Group Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'SQUAD_STRENGTH', val: stats?.totalMembers, icon: Users, highlight: true },
          { label: 'NET_DISTANCE', val: `${stats?.totalDistance.toFixed(1)} KM`, icon: TrendingUp },
          { label: 'NET_DURATION', val: `${stats?.totalDuration} MIN`, icon: Clock },
          { label: 'NET_POINTS', val: `${stats?.totalPoints.toLocaleString()}`, icon: Zap },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`industrial-panel p-4 md:p-6 border-l-2 md:border-l-4 ${stat.highlight ? 'border-l-[#FF6B35] bg-[#FF6B35]/5' : 'border-l-[#3F3F3F]'}`}
          >
            <div className="flex justify-between items-start mb-2 md:mb-4">
              <div className="tech-label text-[8px] md:text-[10px]">{stat.label}</div>
              <stat.icon size={16} className={stat.highlight ? 'text-[#FF6B35]' : 'text-[#4A4A4A]'} />
            </div>
            <div className="text-xl md:text-3xl font-black text-white tracking-tighter truncate">{stat.val}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Squadron Trend */}
        <div className="lg:col-span-8 industrial-panel p-4 md:p-8">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <ActivityIcon size={18} className="text-[#FF6B35]" />
            <div className="tech-label text-[#FF6B35]">SQUADRON_ACTIVITY_LOG: RECENT_10</div>
          </div>
          <div className="h-[250px] md:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                <XAxis dataKey="date" stroke="#444" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#444" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 107, 53, 0.05)' }}
                  contentStyle={{ backgroundColor: '#0D0D0D', border: '1px solid #FF6B3533', borderRadius: '0px' }}
                  itemStyle={{ color: '#FF6B35', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Bar dataKey="distance" fill="#FF6B35" name="KM" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Operatives Mini Leaderboard */}
        <div className="lg:col-span-4 industrial-panel p-0 overflow-hidden flex flex-col">
          <div className="p-4 md:p-6 bg-[#1A1A1A] border-b border-[#2D2D2D] flex items-center justify-between">
            <div className="tech-label text-[#FF6B35]">ELITE_OPERATIVES</div>
            <Target size={16} className="text-[#4A4A4A]" />
          </div>
          <div className="flex-1 divide-y divide-[#1A1A1A] max-h-[400px] overflow-y-auto">
            {stats?.leaderboard?.slice(0, 8).map((p: any, i: number) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-[#0D0D0D] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-6 text-sm font-black text-[#262626] group-hover:text-[#FF6B35]">{(i + 1).toString().padStart(2, '0')}</div>
                  <div>
                    <div className="text-xs font-black text-white uppercase truncate max-w-[120px]">{p.name}</div>
                    <div className="text-[9px] text-[#4A4A4A] font-mono">{p.individualCode}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-[#FF6B35]">{p.totalPoints.toLocaleString()}</div>
                  <div className="text-[8px] text-[#4A4A4A] font-bold uppercase tracking-tighter">PTS</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Combined Squadron Logs */}
      <div className="industrial-panel border-l-2 md:border-l-4 border-l-[#FF6B35] overflow-hidden">
        <div className="p-4 bg-[#1A1A1A] border-b border-[#2D2D2D] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LayoutGrid className="text-[#FF6B35]" size={18} />
            <h3 className="text-xs font-black tracking-widest uppercase">SQUADRON_RAW_FEED</h3>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-bold text-[#2ECC71]">
            <ShieldCheck size={12} />
            LIVE_DATA_STREAM
          </div>
        </div>
        
        {/* Table for larger screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#2D2D2D] text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <th className="p-4">TIMESTAMP</th>
                <th className="p-4">OPERATIVE</th>
                <th className="p-4">MODALITY</th>
                <th className="p-4 text-right">METRICS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {activities.map((a, i) => (
                <tr key={i} className="hover:bg-[#0D0D0D] transition-colors">
                  <td className="p-4 font-mono text-xs text-white">
                    {format(new Date(a.createdAt), 'MM/dd HH:mm')}
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-black text-white uppercase">{a.participantName}</div>
                    <div className="text-[9px] text-[#4A4A4A] font-mono">{a.participantCode}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-[#1A1A1A] border border-[#2D2D2D] text-[9px] font-black text-[#FF6B35] uppercase">
                      {a.activityType}
                    </span>
                  </td>
                  <td className="p-4 text-right text-xs font-black text-gray-400">
                    {a.distance > 0 ? `${a.distance}KM` : `${a.duration}MIN`}
                    <div className="text-[9px] text-[#2ECC71]">+{a.points} PTS</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Feed View */}
        <div className="md:hidden divide-y divide-[#1A1A1A]">
          {activities.map((a, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-[10px] font-black text-white uppercase">
                  {a.participantName}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-[#FF6B35] border border-[#FF6B35]/20 px-1">{a.activityType.toUpperCase()}</span>
                  <span className="text-[8px] font-bold text-[#4A4A4A]">{format(new Date(a.createdAt), 'HH:mm')}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-white">
                  {a.distance > 0 ? `${a.distance}KM` : `${a.duration}MIN`}
                </div>
                <div className="text-[8px] font-black text-[#2ECC71]">+{a.points} PTS</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupPerformance;