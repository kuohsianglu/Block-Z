'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/contexts/GeneratorContext';

export default function SummaryPanel() {
  const { config, buildStatus, startBuild } = useGenerator();
  const hasCore = config.core;

  return (
    <div className="flex h-full flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="space-y-4 overflow-y-auto p-4">
        <Image
          src="/blockz.svg"
          alt="blockz Logo"
          width={55}
          height={15}
        />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <h3 className="font-semibold">WisBlock</h3>
        <div className="space-y-1 text-base">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Base:</span>
            <span className="font-medium">
              {config.base?.name || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Core:</span>
            <span className="font-medium">
              {config.core?.name || 'N/A'}
            </span>
          </div>
          {Object.entries(config.slots).map(([slot, module]) => (
            <div key={slot} className="flex justify-between">
              <span className="text-muted-foreground">
                Slot
                {slot}
                :
              </span>
              <span className="font-medium">{module?.name || '(Empty)'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <h3 className="font-semibold">Zephyr</h3>
        <div className="space-y-1 text-base">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Kernel Version:</span>
            <span className="font-medium">4.2</span>
          </div>
        </div>
      </div>

      <div className="border-t p-4">
        <Button
          className="w-full"
          onClick={startBuild}
          disabled={!hasCore || buildStatus === 'building'}
        >
          {buildStatus === 'building'
            ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Building...
                </>
              )
            : (
                'Generate Firmware'
              )}
        </Button>
      </div>
    </div>
  );
}
