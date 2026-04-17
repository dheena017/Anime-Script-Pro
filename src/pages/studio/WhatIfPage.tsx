import React from 'react';
import { useGenerator } from '@/contexts/GeneratorContext';
import { WhatIfTopBar } from '@/components/studio/modules/whatif/WhatIfTopBar';
import { WhatIfPanel } from '@/components/studio/modules/whatif/WhatIfPanel';

export function WhatIfPage() {
  const { generatedScript, selectedModel } = useGenerator();

  return (
    <div className="pb-20">
      <WhatIfTopBar>
        <WhatIfPanel 
          scriptContext={generatedScript || ''} 
          model={selectedModel} 
        />
      </WhatIfTopBar>
    </div>
  );
}
