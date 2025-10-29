'use client';

import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { GeneratorProvider, useGenerator } from '@/contexts/GeneratorContext';
import ModuleLibrary from '@/components/generator/ModuleLibrary';
import VirtualCanvas from '@/components/generator/VirtualCanvas';
import SummaryPanel from '@/components/generator/SummaryPanel';
import BuildConsole from '@/components/generator/BuildConsole';
import dynamic from 'next/dynamic';
import type { WisBlockSlot } from '@/types/wisblock';

function GeneratorLayout() {
  const { addModule, config } = useGenerator();

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    const module = active.data.current?.module;

    if (over && module) {
      const slotId = over.id as string;
      const compatibleTypes = over.data.current?.compatibleTypes as string[];

      if (compatibleTypes.includes(module.type)) {
        if (slotId === 'Core' && module.type === 'core') {
          addModule(module, 'Core');
        }
        else if (slotId === 'Base' && module.type === 'base') {
          addModule(module, 'Core');
        }
        else if (config.slots.hasOwnProperty(slotId)) {
          addModule(module, slotId as WisBlockSlot);
        }
      } else {
        console.warn(`Module ${module.name} is not compatible with slot ${slotId}`);
      }
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="relative flex h-full w-full flex-col gap-4 overflow-hidden p-4">
        {/* (A) Module Library (Left) */}
        <div className="relative flex flex-1 gap-4 overflow-hidden">
          <div className="h-full w-1/4 min-w-[250px] flex-shrink-0">
            <ModuleLibrary />
          </div>

          {/* (B) Virtual Canvas (Center) */}
          <div className="flex-1">
            <VirtualCanvas />
          </div>

          {/* (C) Summary & Action (Right) */}
          <div className="w-1/4 min-w-[250px] flex-shrink-0">
            <SummaryPanel />
          </div>
        </div>

        {/* (D) Build Console (Bottom) */}
        <BuildConsole />
      </div>
    </DndContext>
  );
}

const DynamicGeneratorLayout = dynamic(() => Promise.resolve(GeneratorLayout), {
  ssr: false,
});

export default function GeneratorPage() {
  return (
    <GeneratorProvider>
      <DynamicGeneratorLayout />
    </GeneratorProvider>
  );
}
