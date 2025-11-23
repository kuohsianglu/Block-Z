'use client';

import type { WisBlockModule, WisBlockSlot } from '@/types/wisblock';
import { useDraggable } from '@dnd-kit/core';
import { Package, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGenerator } from '@/contexts/GeneratorContext';
import { wisblockModules } from '@/data/wisblockModules';

export default function ModuleLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredModuleCategories = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();

    if (!lowerCaseSearch) {
      return {
        Base: wisblockModules.filter(m => m.type === 'base'),
        Core: wisblockModules.filter(m => m.type === 'core'),
        Sensor: wisblockModules.filter(m => m.type === 'sensor'),
        IO: wisblockModules.filter(m => m.type === 'io'),
      };
    }

    const filteredModules = wisblockModules.filter(
      module =>
        module.name.toLowerCase().includes(lowerCaseSearch)
        || module.description.toLowerCase().includes(lowerCaseSearch),
    );

    return {
      Base: filteredModules.filter(m => m.type === 'base'),
      Core: filteredModules.filter(m => m.type === 'core'),
      Sensor: filteredModules.filter(m => m.type === 'sensor'),
      IO: filteredModules.filter(m => m.type === 'io'),
    };
  }, [searchTerm]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4">
        <Image
          src="/wisblock.png"
          alt="WisBlock Logo"
          width={150}
          height={30}
        />
        <Input
          placeholder="Search modules..."
          className="mt-2"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="h-125 flex flex-col gap-4 pb-4">
          {Object.entries(filteredModuleCategories).map(
            ([category, modules]) =>
              modules.length > 0 && (
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
              ),
          )}
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
      addModule(module, 'Core');
    } else {
      const compatibleSlot = module.slots.find((slotName) => {
        return (
          Object.hasOwn(config.slots, slotName)
          && config.slots[slotName as WisBlockSlot] === null
        );
      });

      if (compatibleSlot) {
        addModule(module, compatibleSlot as WisBlockSlot);
      } else {
        console.warn('No compatible empty slot available for this module.');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleClick();
      e.preventDefault();
    }
    if (listeners?.onKeyDown) {
      listeners.onKeyDown(e);
    }
  };

  const Icon = module.icon || Package;
  const iconColor = module.color || 'text-muted-foreground';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group relative rounded-md border bg-background p-2 transition-all hover:shadow-md cursor-pointer"
      title={`Click to add, or drag to canvas\n${module.description}`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        onMouseDown={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
        onPointerDown={e => e.stopPropagation()}
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
