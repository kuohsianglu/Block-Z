'use client';

import type { WisBlockModule, WisBlockSlot } from '@/types/wisblock';
import { useDraggable } from '@dnd-kit/core';
import { Package, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGenerator } from '@/contexts/GeneratorContext';
import { wisblockModules } from '@/data/wisblockModules';

const moduleCategories = {
  Base: wisblockModules.filter(m => m.type === 'base'),
  Core: wisblockModules.filter(m => m.type === 'core'),
  Sensor: wisblockModules.filter(m => m.type === 'sensor'),
  IO: wisblockModules.filter(m => m.type === 'io'),
};

export default function ModuleLibrary() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4">
        <Image
          src="/wisblock.png"
          alt="WisBlock Logo"
          width={150}
          height={30}
        />
        <Input placeholder="Search modules..." className="mt-2" />
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="flex flex-col gap-4 pb-4">
          {Object.entries(moduleCategories).map(([category, modules]) => (
            <div key={category}>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                {category}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {modules.map(module => (
                  <DraggableModule key={module.id} module={module} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function DraggableModule({ module }: { module: WisBlockModule }) {
  const { addModule, config } = useGenerator();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: module.id,
    data: { module },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100,
        cursor: 'grabbing',
      }
    : {
        cursor: 'grab',
      };

  const handleClick = () => {
    if (module.type === 'base') {
      addModule(module, 'Core');
    } else if (module.type === 'core') {
      if (!config.core) {
        addModule(module, 'Core');
      }
    } else {
      const firstEmptySlot = Object.keys(config.slots).find(
        slotKey => config.slots[slotKey as keyof typeof config.slots] === null,
      );
      if (firstEmptySlot) {
        addModule(module, firstEmptySlot as WisBlockSlot);
      } else {
        console.warn('No compatible empty slot available for this module.');
      }
    }
  };

  const Icon = module.icon || Package;
  const iconColor = module.color || 'text-muted-foreground';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="group relative rounded-md border bg-background p-2 transition-all hover:shadow-md"
      title={`Click to add, or drag to canvas\n${module.description}`}
    >
      <button
        type="button"
        onClick={handleClick}
        onMouseDown={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
        className="absolute -right-1 -top-1 z-10 hidden rounded-full bg-primary text-primary-foreground opacity-80 transition-all hover:opacity-100 group-hover:block"
        title="Click to add to first available slot"
      >
        <PlusCircle className="h-4 w-4" />
      </button>
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold">{module.name}</p>
          <Icon className={`h-4 w-4 flex-shrink-0 ${iconColor}`} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{module.description}</p>
    </div>
  );
}
