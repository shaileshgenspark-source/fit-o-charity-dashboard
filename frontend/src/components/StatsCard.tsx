import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  unit: string;
  delay?: number;
}

const StatsCard = ({ icon: Icon, title, value, unit, delay = 0 }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="industrial-panel p-4 md:p-6 border-l-2 md:border-l-4 border-l-[#FF6B35]"
    >
      <div className="flex flex-col h-full justify-between gap-2 md:gap-4">
        <div className="flex justify-between items-start">
          <div className="tech-label text-[8px] md:text-[10px]">{title}</div>
          <Icon size={16} className="text-[#4A4A4A] md:w-5 md:h-5" />
        </div>
        
        <div className="space-y-0.5 md:space-y-1">
          <div className="text-2xl md:text-4xl font-black text-white tracking-tighter truncate">
            {value}
          </div>
          <div className="text-[8px] md:text-[10px] font-bold text-[#FF6B35] tracking-[0.2em]">
            {unit}
          </div>
        </div>

        <div className="w-full h-[1px] bg-[#3F3F3F]" />
        
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 bg-[#FF6B35] rounded-full" />
          <span className="text-[8px] md:text-[9px] font-bold text-[#8C8C8C] tracking-widest uppercase truncate">REALTIME_SYNC</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
