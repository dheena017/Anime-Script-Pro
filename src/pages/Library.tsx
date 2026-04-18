import React from 'react';
import { 
  History, 
  Search, 
  Filter, 
  MoreVertical, 
  Play, 
  Download, 
  Trash2,
  FileText,
  Clock,
  Calendar,
  Sparkles,
  GitCommit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, Timestamp, deleteDoc, doc, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export function LibraryPage() {
  const [user] = useAuthState(auth);
  const [scripts, setScripts] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Versions state
  const [selectedScriptForVersions, setSelectedScriptForVersions] = React.useState<any | null>(null);
  const [scriptVersions, setScriptVersions] = React.useState<any[]>([]);
  const [isVersionsModalOpen, setIsVersionsModalOpen] = React.useState(false);
  const [isLoadingVersions, setIsLoadingVersions] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'scripts'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setScripts(docs);
    });

    return () => unsubscribe();
  }, [user]);

  const fetchVersions = async (scriptId: string) => {
    setIsLoadingVersions(true);
    try {
      const q = query(
        collection(db, 'script_versions'), 
        where('scriptId', '==', scriptId), 
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const versions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setScriptVersions(versions);
    } catch (error) {
      console.error("Fetch versions error:", error);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const handleOpenVersions = (script: any) => {
    setSelectedScriptForVersions(script);
    setIsVersionsModalOpen(true);
    fetchVersions(script.id);
  };

  const handleRevertVersion = async (version: any) => {
    if (!selectedScriptForVersions) return;
    if (window.confirm('Are you sure you want to revert to this version?')) {
      try {
        await updateDoc(doc(db, 'scripts', selectedScriptForVersions.id), {
          script: version.script,
          updatedAt: Timestamp.now()
        });
        
        // Also add a new snapshot for the revert action
        await addDoc(collection(db, 'script_versions'), {
          uid: user?.uid,
          scriptId: selectedScriptForVersions.id,
          script: version.script,
          createdAt: Timestamp.now()
        });

        setIsVersionsModalOpen(false);
      } catch (error) {
        console.error("Revert error:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this script?')) {
      try {
        await deleteDoc(doc(db, 'scripts', id));
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const filteredScripts = scripts.filter(s => 
    s.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.script?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <History className="w-16 h-16 text-zinc-800 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sign in to view your library</h2>
        <p className="text-zinc-500 max-w-md">
          Your saved scripts and production history will appear here once you're logged in.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase text-cyan-50 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">My Library</h1>
          <p className="text-cyan-500/60 font-bold uppercase tracking-widest text-xs">Manage and organize your generated anime scripts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
            <Input 
              placeholder="Search scripts..." 
              className="pl-10 bg-[#0a0a0a] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-700 focus-visible:ring-cyan-500/50 rounded-full h-10 shadow-[inner_0_2px_10px_rgba(0,0,0,0.8)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-cyan-500/30 bg-[#0a0a0a] text-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-300 rounded-full">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredScripts.map((script, idx) => (
          <motion.div
            key={script.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="bg-gradient-to-br from-[#111318] to-[#0a0b0e] border-zinc-800 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all group overflow-hidden h-full flex flex-col rounded-2xl relative">
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none z-0" />
              
              <div className="aspect-video bg-[#0a0a0a] relative overflow-hidden z-10 border-b border-zinc-800/50">
                <img 
                  src={`https://picsum.photos/seed/${script.id}/600/400`} 
                  alt="Preview" 
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-[#0a0b0e]/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                      {script.tone || 'Action'}
                    </span>
                    {(script.session || script.episode) && (
                      <span className="px-2.5 py-1 bg-[#0a0a0a]/80 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-cyan-500/30 backdrop-blur-md shadow-[0_0_10px_rgba(6,182,212,0.15)] flex gap-1.5 items-center">
                        {script.session && <span><span className="text-zinc-500">S</span>{script.session}</span>} 
                        {script.episode && <span><span className="text-zinc-500">E</span>{script.episode}</span>}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono tracking-widest bg-black/50 px-2 py-1 rounded-full backdrop-blur-md border border-zinc-800">
                    <Clock className="w-3 h-3 text-cyan-500" />
                    5:00
                  </div>
                </div>
              </div>
              
              <CardHeader className="p-5 pb-2 z-10 relative">
                <CardTitle className="text-lg line-clamp-1 group-hover:text-cyan-400 transition-colors font-bold text-zinc-100 drop-shadow-md">
                  {script.prompt?.slice(0, 40) || 'Untitled Script'}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                  <Calendar className="w-3 h-3 text-zinc-600" />
                  {script.createdAt instanceof Timestamp ? script.createdAt.toDate().toLocaleDateString() : 'Recent'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between z-10 relative">
                <p className="text-[11px] text-zinc-400 line-clamp-3 mb-6 leading-relaxed font-medium">
                  {script.script?.replace(/[#|*-]/g, '').slice(0, 150)}...
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-colors"
                      onClick={() => navigate('/', { state: { scriptId: script.id, script: script.script } })}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-colors">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-zinc-500 hover:text-orange-400 hover:bg-orange-500/10 rounded-full transition-colors"
                      title="Version History"
                      onClick={() => handleOpenVersions(script)}
                    >
                      <GitCommit className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                    onClick={() => handleDelete(script.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filteredScripts.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <FileText className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500">No scripts found matching your search.</p>
          </div>
        )}
      </div>

      <Dialog open={isVersionsModalOpen} onOpenChange={setIsVersionsModalOpen}>
        <DialogContent className="bg-gradient-to-br from-[#111318] to-[#0a0b0e] border border-cyan-500/20 text-zinc-200 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
          
          <DialogHeader className="relative z-10 border-b border-zinc-800/50 pb-4">
            <DialogTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-cyan-100">
              <History className="w-6 h-6 text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
              Version History
            </DialogTitle>
            <DialogDescription className="text-cyan-500/60 font-bold uppercase tracking-widest text-[10px]">
              {selectedScriptForVersions?.prompt?.slice(0, 50)}...
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 relative z-10 pr-4 mt-4">
            {isLoadingVersions ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
              </div>
            ) : scriptVersions.length === 0 ? (
              <div className="text-center py-12 text-zinc-600 font-bold uppercase tracking-widest text-xs">
                No previous versions found.
              </div>
            ) : (
              <div className="flex flex-col gap-4 pb-4">
                {scriptVersions.map((version, idx) => (
                  <Card key={version.id} className="bg-[#0a0a0a]/50 border-zinc-800/60 relative overflow-hidden group hover:border-orange-500/30 transition-all rounded-xl backdrop-blur-md">
                    <CardContent className="p-5 flex gap-5">
                      <div className="flex flex-col items-center justify-start pt-1">
                        <div className={cn("w-3 h-3 rounded-full transition-all drop-shadow-md border", idx === 0 ? "bg-orange-500 border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.6)]" : "bg-zinc-800 border-zinc-700 group-hover:bg-zinc-600")} />
                        {idx !== scriptVersions.length - 1 && (
                          <div className="w-[1px] h-full bg-gradient-to-b from-orange-500/20 via-zinc-800 to-zinc-800 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black tracking-widest uppercase text-zinc-300">
                            {version.createdAt instanceof Timestamp ? version.createdAt.toDate().toLocaleString() : 'Unknown Time'}
                          </p>
                          {idx === 0 && (
                             <span className="text-[9px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-[0.2em] border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]">Latest Origin</span>
                          )}
                        </div>
                        <div className="bg-[#050505] rounded-lg p-3 border border-zinc-800/50 shadow-inner">
                          <p className="text-xs text-zinc-400 line-clamp-3 font-medium leading-relaxed italic">
                            {version.script?.replace(/[#|*-]/g, '').slice(0, 200)}...
                          </p>
                        </div>
                        {idx !== 0 && (
                          <div className="pt-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:text-orange-300 hover:border-orange-400 transition-all shadow-[0_0_10px_rgba(249,115,22,0.05)]"
                              onClick={() => handleRevertVersion(version)}
                            >
                              <History className="w-3 h-3 mr-2" /> Revert Configuration
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
