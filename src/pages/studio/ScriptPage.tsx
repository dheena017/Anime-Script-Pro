import { ScriptTopBar } from '@/components/studio/modules/script/ScriptTopBar';
import { ScriptPanel } from '@/components/studio/modules/script/ScriptPanel';

export function ScriptPage() {
  return (
    <ScriptTopBar>
      <ScriptPanel />
    </ScriptTopBar>
  );
}
