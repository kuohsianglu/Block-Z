'use client';

import { ChevronDown, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/contexts/GeneratorContext';
import { LORAWAN_REGIONS } from '@/data/regions';

export default function SummaryPanel() {
  const { config, buildStatus, startBuild, selectedRegion, setSelectedRegion } = useGenerator();
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
      <div className="p-4">
        <Image
          src="/blockz.svg"
          alt="blockz Logo"
          width={55}
          height={15}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
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
                  {' '}
                  {slot}
                  :
                </span>
                <span className="font-medium">{module?.name || '(Empty)'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 p-4">
          <h3 className="font-semibold">LoRaWAN</h3>
          <div className="space-y-1 text-base">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Region:</span>
              <div className="relative">
                <select
                  value={selectedRegion}
                  onChange={e => setSelectedRegion(e.target.value)}
                  className="cursor-pointer appearance-none rounded bg-transparent pr-5 text-center font-medium text-foreground focus:outline-none focus:ring-0 disabled:opacity-50"
                  disabled={buildStatus === 'building'}
                >
                  {LORAWAN_REGIONS.map(region => (
                    <option key={region.value} value={region.value}>
                      {region.label.match(/\((.*?)\)/)?.[1] || region.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {zephyrVersion && (
          <>
            <div className="mx-4" />
            <div className="space-y-4 p-4">
              <h3 className="font-semibold">Zephyr</h3>
              <div className="space-y-1 text-base">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kernel:</span>
                  <span className="font-medium">{zephyrVersion}</span>
                </div>
              </div>
            </div>
          </>
        )}
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
