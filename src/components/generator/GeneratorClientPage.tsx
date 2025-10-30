'use client';

import type { DragEndEvent } from '@dnd-kit/core';
import type { WisBlockSlot } from '@/types/wisblock';
import { DndContext } from '@dnd-kit/core';
import dynamic from 'next/dynamic';
import BuildConsole from '@/components/generator/BuildConsole';
import ModuleLibrary from '@/components/generator/ModuleLibrary';
import SummaryPanel from '@/components/generator/SummaryPanel';
import VirtualCanvas from '@/components/generator/VirtualCanvas';
import { GeneratorProvider, useGenerator } from '@/contexts/GeneratorContext';

function GeneratorLayout() {
  const { addModule, config } = useGenerator();

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    const draggedModule = active.data.current?.module;

    if (over && draggedModule) {
      const slotId = over.id as string;
      const compatibleTypes = over.data.current?.compatibleTypes as string[];

      if (compatibleTypes.includes(draggedModule.type)) {
        if (slotId === 'Core' && draggedModule.type === 'core') {
          addModule(draggedModule, 'Core');
        } else if (slotId === 'Base' && draggedModule.type === 'base') {
          addModule(draggedModule, 'Core');
        } else if (Object.hasOwn(config.slots, slotId)) {
          addModule(draggedModule, slotId as WisBlockSlot);
        }
      } else {
        console.warn(`Module ${draggedModule.name} is not compatible with slot ${slotId}`);
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
