import { useEffect, useRef, useState } from 'react';

interface UseStoryboardHistoryArgs {
  generatedScript: string | null;
  setGeneratedScript: (script: string) => void;
}

export function useStoryboardHistory({ generatedScript, setGeneratedScript }: UseStoryboardHistoryArgs) {
  const [pastScripts, setPastScripts] = useState<string[]>([]);
  const [futureScripts, setFutureScripts] = useState<string[]>([]);
  const scriptRef = useRef<string | null>(generatedScript);

  useEffect(() => {
    scriptRef.current = generatedScript;
  }, [generatedScript]);

  const recordScriptChange = (newScript: string) => {
    const currentScript = scriptRef.current;
    if (currentScript && currentScript !== newScript) {
      setPastScripts((prev) => [...prev.slice(-19), currentScript]);
      setFutureScripts([]);
    }
    setGeneratedScript(newScript);
    scriptRef.current = newScript;
    return newScript;
  };

  const handleUndo = () => {
    if (pastScripts.length === 0) return null;
    const previousScript = pastScripts[pastScripts.length - 1];
    if (scriptRef.current) {
      setFutureScripts((prev) => [...prev, scriptRef.current as string]);
    }
    setPastScripts((prev) => prev.slice(0, -1));
    setGeneratedScript(previousScript);
    scriptRef.current = previousScript;
    return previousScript;
  };

  const handleRedo = () => {
    if (futureScripts.length === 0) return null;
    const nextScript = futureScripts[futureScripts.length - 1];
    if (scriptRef.current) {
      setPastScripts((prev) => [...prev, scriptRef.current as string]);
    }
    setFutureScripts((prev) => prev.slice(0, -1));
    setGeneratedScript(nextScript);
    scriptRef.current = nextScript;
    return nextScript;
  };

  return {
    pastScripts,
    futureScripts,
    recordScriptChange,
    handleUndo,
    handleRedo,
  };
}
