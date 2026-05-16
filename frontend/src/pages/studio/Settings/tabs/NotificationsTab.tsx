import { useState } from 'react';
import { Bell, Mail, Zap, Shield, AlertCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const NotificationsTab: React.FC = () => {
  const [config, setConfig] = useState({
    email_alerts: true,
    push_notifications: true,
    system_updates: true,
    marketing: false,
    security_alerts: true,
    realtime_sync: true
  });

  const toggle = (key: keyof typeof config) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { key: 'email_alerts', label: 'Email Protocols', desc: 'Receive production summaries via neural mail', icon: Mail },
          { key: 'push_notifications', label: 'Push Signals', desc: 'Direct desktop alerts for critical events', icon: Bell },
          { key: 'system_updates', label: 'Engine Updates', desc: 'Get notified about new synthesis features', icon: Zap },
          { key: 'security_alerts', label: 'Security Watch', desc: 'Immediate alerts for unauthorized access', icon: Shield },
          { key: 'realtime_sync', label: 'Real-time Sync', desc: 'Synchronize signal feed across all nodes', icon: AlertCircle },
        ].map((item) => (
          <Card key={item.key} className="settings-card border-none rounded-3xl overflow-hidden group">
            <CardContent className="p-8 flex items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl group-hover:border-[#bd4a4a]/30 transition-colors">
                  <item.icon className="w-5 h-5 text-[#bd4a4a]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">{item.label}</h3>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
              <Switch 
                checked={config[item.key as keyof typeof config]} 
                onCheckedChange={() => toggle(item.key as keyof typeof config)}
                className="data-[state=checked]:bg-[#bd4a4a]"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-[#bd4a4a]/5 border border-[#bd4a4a]/20 rounded-[2rem] p-8 flex items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-[#bd4a4a]/20 rounded-2xl">
            <Zap className="w-6 h-6 text-[#bd4a4a]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Global Signal Mute</h3>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Temporarily silence all incoming neural transmissions</p>
          </div>
        </div>
        <Button variant="outline" className="rounded-xl px-8 h-12 border-[#bd4a4a]/30 hover:bg-[#bd4a4a]/10 text-[#bd4a4a] font-black uppercase tracking-widest">
          Enable Focus Mode
        </Button>
      </div>
    </div>
  );
};

export default NotificationsTab;
