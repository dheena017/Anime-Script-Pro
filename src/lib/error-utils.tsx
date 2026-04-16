import React from 'react';
import { auth } from '../firebase';
import { AlertCircle, RefreshCcw, X, Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { cn } from './utils';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  id: string;
  timestamp: number;
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
  }
}

// Global Error Registry for the separate panel
type ErrorListener = (errors: FirestoreErrorInfo[]) => void;
class ErrorRegistry {
  private errors: FirestoreErrorInfo[] = [];
  private listeners: ErrorListener[] = [];

  addError(error: Omit<FirestoreErrorInfo, 'id' | 'timestamp'>) {
    const fullError: FirestoreErrorInfo = {
      ...error,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    this.errors = [fullError, ...this.errors].slice(0, 50); // Keep last 50
    this.notify();
  }

  clear() {
    this.errors = [];
    this.notify();
  }

  getErrors() {
    return this.errors;
  }

  subscribe(listener: ErrorListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.errors));
  }
}

export const errorRegistry = new ErrorRegistry();

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  
  console.error('Firestore Error: ', errInfo);
  errorRegistry.addError(errInfo);
  
  // Return message for potential UI local handling
  return errInfo.error;
}

/**
 * SEPARATE ERROR FEED PANEL COMPONENT
 * This can be dropped anywhere in the layout.
 */
export function SystemErrorPanel({ className }: { className?: string }) {
  const [errors, setErrors] = React.useState<FirestoreErrorInfo[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    return errorRegistry.subscribe(setErrors);
  }, []);

  if (errors.length === 0) return null;

  return (
    <div className={cn("fixed bottom-6 right-6 z-[100] w-96 max-h-[80vh] flex flex-col gap-2", className)}>
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          variant="destructive"
          className="shadow-2xl animate-bounce gap-2 rounded-full px-6"
        >
          <AlertCircle className="w-4 h-4" />
          {errors.length} System Error{errors.length > 1 ? 's' : ''}
        </Button>
      ) : (
        <Card className="bg-zinc-950 border-red-500/50 shadow-2xl overflow-hidden border-2">
          <CardHeader className="p-4 bg-red-950/20 border-b border-red-900/40 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-red-500 text-sm flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                SYSTEM LOGS
              </CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-wider text-red-400/60 mt-1">
                Live Firestore Debugger
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-500 hover:bg-red-500/10"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto max-h-[60vh]">
            <div className="divide-y divide-zinc-900">
              {errors.map((err) => (
                <div key={err.id} className="p-4 hover:bg-zinc-900/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-mono text-zinc-500">
                      {new Date(err.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 text-[9px] font-bold uppercase">
                      {err.operationType}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium mb-1 line-clamp-2">
                    {err.error}
                  </p>
                  <div className="flex gap-2">
                    <code className="text-[9px] px-1 bg-zinc-800 text-zinc-500 rounded">
                      Table: {err.path || 'unknown'}
                    </code>
                    <code className="text-[9px] px-1 bg-zinc-800 text-zinc-400 rounded">
                      ID: {err.authInfo.userId?.slice(0, 6) || 'Anon'}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-2 bg-zinc-950 border-t border-zinc-900 flex gap-2">
            <Button 
              variant="ghost" 
              className="w-full text-[10px] h-8 text-zinc-500 hover:text-zinc-300"
              onClick={() => errorRegistry.clear()}
            >
              Clear Logs
            </Button>
            <Button 
              className="w-full text-[10px] h-8 bg-zinc-800 hover:bg-zinc-700 text-white"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw className="w-3 h-3 mr-1.5" />
              Full Reset
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        const parsed = JSON.parse(this.state.error?.message || "");
        if (parsed.error && parsed.operationType) {
          errorMessage = `Firestore ${parsed.operationType} error: ${parsed.error}`;
        }
      } catch {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
          <Card className="max-w-md w-full bg-zinc-900 border-red-900/50 shadow-2xl border-2">
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                Application Exception
              </CardTitle>
              <CardDescription>
                The core engine encountered a critical failure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-zinc-950 rounded border border-zinc-800">
                <p className="text-zinc-400 text-xs font-mono break-all leading-relaxed">
                  {errorMessage}
                </p>
              </div>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11"
                onClick={() => window.location.reload()}
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                REBOOT STUDIO
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
