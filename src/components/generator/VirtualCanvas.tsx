'use client';

import type { WisBlockModule, WisBlockSlot } from '@/types/wisblock';
import { useDroppable } from '@dnd-kit/core';
import { LayoutGrid, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useGenerator } from '@/contexts/GeneratorContext';

export default function VirtualCanvas() {
  const { config, removeModule } = useGenerator();

  return (
    <div className="flex h-full flex-col items-center rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Virtual Canvas</h2>
      {!config.base
        ? (<DroppableSlot slotId="Base" compatibleTypes={['base']} />)
        : (
            <div className="flex w-full max-w-md flex-col gap-2 rounded-lg border-2 border-dashed border-primary/50 bg-primary/10 p-4">
              {/* Base Board */}
              <div className="flex items-center justify-between rounded border bg-background p-2">
                <span className="text-sm">
                  Base:
                  {' '}
                  <span className="font-semibold">{config.base.name}</span>
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
                {(Object.keys(config.slots) as WisBlockSlot[])
                  .filter(slotKey => slotKey !== 'IO')
                  .map(slotKey => (
                    <DroppableSlot
                      key={slotKey}
                      slotId={slotKey as WisBlockSlot}
                      module={config.slots[slotKey]}
                      compatibleTypes={['sensor']}
                      onRemove={() => removeModule(slotKey as WisBlockSlot)}
                    />
                  ))}
              </div>
              {(Object.keys(config.slots) as WisBlockSlot[])
                .filter(slotKey => slotKey === 'IO')
                .map(slotKey => (
                  <DroppableSlot
                    key={slotKey}
                    slotId={slotKey}
                    module={config.slots[slotKey]}
                    compatibleTypes={['io']}
                    onRemove={() => removeModule(slotKey)}
                  />
                ))}
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
      <div className="relative flex min-h-[130px] flex-col justify-center rounded-md border border-primary bg-primary/20 p-2 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-primary/80">
            {slotId}
          </span>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute -right-1 -top-1 z-10 rounded-full bg-background text-muted-foreground transition-colors hover:text-destructive"
              title="Remove module"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-1 flex flex-1 items-center justify-between gap-3">
          <div className="flex-1 overflow-hidden pr-1">
            <span
              className="block truncate font-semibold"
              title={module.name}
            >
              {module.name}
            </span>
            <span
              className="mt-1 block text-xs text-muted-foreground"
              title={module.description}
            >
              {module.description}
            </span>
          </div>

          {module.imageUrl && (
            <div className="relative h-20 w-20 flex-shrink-0">
              <Image
                src={module.imageUrl}
                alt={module.name}
                fill
                sizes="100px"
                style={{ objectFit: 'contain' }}
                className="rounded-sm p-1"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[130px] flex-col items-center justify-center rounded-md border-2 border-dashed
      ${isActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 bg-muted/20'}
      transition-colors`}
    >
      <LayoutGrid className="h-6 w-6 text-muted-foreground" />
      <span className="text-base font-bold text-muted-foreground">
        Slot
        {' '}
        {slotId}
      </span>
      <span className="text-xs text-muted-foreground">
        Drag a
        {' '}
        {compatibleTypes.join(' or ')}
        {' '}
        module here
      </span>
    </div>
  );
}
