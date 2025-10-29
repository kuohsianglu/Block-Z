'use client';

import { useDroppable } from '@dnd-kit/core';
import { useGenerator } from '@/contexts/GeneratorContext';
import type { WisBlockModule, WisBlockSlot } from '@/types/wisblock';
import { XCircle, Package } from 'lucide-react';

export default function VirtualCanvas() {
  const { config, removeModule } = useGenerator();

  return (
    <div className="flex h-full flex-col items-center rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Virtual Canvas</h2>
      {!config.base ? (
        <DroppableSlot slotId="Base" compatibleTypes={['base']} />
      ) : (
        <div className="flex w-full max-w-md flex-col gap-2 rounded-lg border-2 border-dashed border-primary/50 bg-primary/10 p-4">
          {/* Base Board */}
          <div className="flex items-center justify-between rounded border bg-background p-2">
            <span className="text-sm">
              Base: <span className="font-semibold">{config.base.name}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              {config.base.description}
            </span>
          </div>

          {/* Core Slot */}
          <DroppableSlot
            slotId="Core"
            module={config.core}
            compatibleTypes={['core']}
            onRemove={() => removeModule('Core')}
          />

          {/* Module Slots */}
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(config.slots).map((slotKey) => (
              <DroppableSlot
                key={slotKey}
                slotId={slotKey as WisBlockSlot}
                module={config.slots[slotKey]}
                compatibleTypes={slotKey === 'IO' ? ['io'] : ['sensor']}
                onRemove={() => removeModule(slotKey as WisBlockSlot)}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Click [x] to remove a module.
          </p>
        </div>
      )}
    </div>
  );
}

function DroppableSlot({
  slotId,
  module,
  compatibleTypes,
  onRemove,
}: {
  slotId: WisBlockSlot | 'Base';
  module?: WisBlockModule | null;
  compatibleTypes: WisBlockModule['type'][];
  onRemove?: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: slotId,
    data: { compatibleTypes },
  });

  const isActive = isOver;

  if (module) {
    return (
      <div className="relative flex min-h-[60px] flex-col justify-center rounded-md border border-primary bg-primary/20 p-2 shadow-inner">
        <span className="text-xs font-bold uppercase text-primary/80">
          {slotId}
        </span>
        <span className="font-semibold">{module.name}</span>
        <span className="text-xs text-muted-foreground">
          {module.description}
        </span>
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute -right-1 -top-1 rounded-full bg-background text-muted-foreground transition-colors hover:text-destructive"
            title="Remove module"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[60px] flex-col items-center justify-center rounded-md border-2 border-dashed
      ${isActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 bg-muted/20'}
      transition-colors`}
    >
      <Package className="h-5 w-5 text-muted-foreground" />
      <span className="text-sm font-medium text-muted-foreground">
        Slot {slotId}
      </span>
      <span className="text-xs text-muted-foreground">
        Drag a {compatibleTypes.join(' or ')} module here
      </span>
    </div>
  );
}
