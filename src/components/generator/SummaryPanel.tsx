'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/contexts/GeneratorContext';

export default function SummaryPanel() {
  const { config, buildStatus, startBuild } = useGenerator();
  const [zephyrVersion, setZephyrVersion] = useState<string | null>(null);
  const hasCore = config.core;

  const fetchVersionFromApi = async () => {
    try {
      const res = await fetch('/api/zephyr-version');
      if (res.ok) {
        const data = await res.json();
        return data.version;
      }
    } catch (error) {
      console.error('Failed to fetch Zephyr version', error);
    }
    return null;
  };

  useEffect(() => {
    let ignore = false;

    const initFetch = async () => {
      const version = await fetchVersionFromApi();
      if (!ignore && version) {
        setZephyrVersion(version);
      }
    };

    initFetch();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    if (buildStatus === 'success') {
      const reFetch = async () => {
        const version = await fetchVersionFromApi();
        if (!ignore && version) {
          setZephyrVersion(version);
        }
      };
      reFetch();
    }

    return () => {
      ignore = true;
    };
  }, [buildStatus]);

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

      {zephyrVersion && (
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <h3 className="font-semibold">Zephyr</h3>
          <div className="space-y-1 text-base">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kernel Version:</span>
              <span className="font-medium">{zephyrVersion}</span>
            </div>
          </div>
        </div>
      )}

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
