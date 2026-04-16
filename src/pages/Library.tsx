import React from 'react';
import { 
  History, 
  Search, 
  FileText,
  LayoutGrid,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, PageShell } from '@/components/page/PageShell';
import { Button } from '@/components/ui/button';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';

// New Components
import { LibraryStats } from '@/components/library/LibraryStats';
import { ScriptCard } from '@/components/library/ScriptCard';
import { ScriptListItem } from '@/components/library/ScriptListItem';
import { LibraryFilters } from '@/components/library/LibraryFilters';
import { LibrarySidebar } from '@/components/library/LibrarySidebar';
import { LibraryQuickView } from '@/components/library/LibraryQuickView';
import { LibraryCollections } from '@/components/library/LibraryCollections';
import { LibraryBulkActions } from '@/components/library/LibraryBulkActions';

export function LibraryPage() {
  const [user] = useAuthState(auth);
  const [scripts, setScripts] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState('newest');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [currentFilter, setCurrentFilter] = React.useState('all');
  const [selectedScript, setSelectedScript] = React.useState<any | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
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
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'scripts');
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this script? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'scripts', id));
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `scripts/${id}`);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} scripts?`)) {
      try {
        await Promise.all(selectedIds.map(id => deleteDoc(doc(db, 'scripts', id))));
        setSelectedIds([]);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'scripts-bulk');
      }
    }
  };

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds(prev => 
      selected ? [...prev, id] : prev.filter(item => item !== id)
    );
  };

  const handleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      await updateDoc(doc(db, 'scripts', id), { isFavorite });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `scripts/${id}`);
    }
  };

  const handleView = (script: any) => {
    navigate('/', { state: { scriptId: script.id, script: script.script } });
  };

  const filteredAndSortedScripts = React.useMemo(() => {
    let result = scripts.filter(s => 
      s.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.script?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply sidebar filters
    if (currentFilter === 'favorites') {
      result = result.filter(s => s.isFavorite);
    } else if (currentFilter === 'recents') {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      result = result.filter(s => (s.createdAt?.toDate?.() || new Date(s.createdAt)) > oneDayAgo);
    }

    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => (a.createdAt?.toMillis?.() || 0) - (b.createdAt?.toMillis?.() || 0));
        break;
      case 'az':
        result.sort((a, b) => (a.prompt || '').localeCompare(b.prompt || ''));
        break;
      case 'length':
        result.sort((a, b) => (b.script?.length || 0) - (a.script?.length || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
        break;
    }

    return result;
  }, [scripts, searchTerm, sortBy, currentFilter]);

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 bg-zinc-950">
        <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800 shadow-2xl">
          <History className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-3xl font-black mb-4 tracking-tighter">AUTHENTICATION REQUIRED</h2>
        <p className="text-zinc-500 max-w-sm mb-8 font-medium leading-relaxed">
          Your creative workspace and production history are protected. Sign in to access your scripts.
        </p>
        <Button 
          onClick={() => navigate('/login')}
          className="bg-red-600 hover:bg-red-700 h-12 px-8 font-bold rounded-xl"
        >
          Access Library
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <PageShell className="space-y-10 pb-40">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Creative Library"
          subtitle="Manage your AI-powered anime productions and script archives."
          titleClassName="text-4xl font-black tracking-tighter uppercase"
          className="p-0 border-none bg-transparent"
        />
        <div className="flex items-center gap-3">
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-red-600/20"
            onClick={() => navigate('/')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            New Production
          </Button>
        </div>
      </div>

      <LibraryStats scripts={scripts} />

      <div className="flex flex-col lg:flex-row gap-10">
        <LibrarySidebar 
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
        />

        <div className="flex-1 space-y-10">
          <LibraryCollections />

          <div className="space-y-6">
            <LibraryFilters 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <AnimatePresence mode="popLayout">
              <motion.div 
                layout
                className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {filteredAndSortedScripts.map((script) => (
                  <motion.div
                    layout
                    key={script.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {viewMode === 'grid' ? (
                      <ScriptCard 
                        script={script}
                        onView={handleView}
                        onDelete={handleDelete}
                        onFavorite={handleFavorite}
                        onQuickView={setSelectedScript}
                        isSelected={selectedIds.includes(script.id)}
                        onSelect={handleSelect}
                      />
                    ) : (
                      <ScriptListItem 
                        script={script}
                        onView={handleView}
                        onDelete={handleDelete}
                        isSelected={selectedIds.includes(script.id)}
                        onSelect={handleSelect}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredAndSortedScripts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl"
              >
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-zinc-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">No scripts found</h3>
                <p className="text-zinc-500 max-w-xs mx-auto text-sm">
                  {searchTerm 
                    ? `We couldn't find any results for "${searchTerm}". Try a different search term.` 
                    : "You haven't generated any scripts yet. Start your first production today!"}
                </p>
                {!searchTerm && (
                  <Button 
                    variant="outline" 
                    className="mt-8 border-zinc-800 hover:bg-zinc-800"
                    onClick={() => navigate('/')}
                  >
                    Start Generating
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <LibraryQuickView 
        script={selectedScript}
        isOpen={!!selectedScript}
        onClose={() => setSelectedScript(null)}
        onOpenInStudio={handleView}
      />

      <LibraryBulkActions 
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onDelete={handleBulkDelete}
        onMove={() => alert('Moving to folder...')}
        onExport={() => alert('Batch exporting...')}
      />
    </PageShell>
  );
}



