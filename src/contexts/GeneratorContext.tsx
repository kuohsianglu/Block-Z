'use client';

import type {
  BuildStatus,
  HardwareConfiguration,
  LogEntry,
  WisBlockModule,
  WisBlockSlot,
} from '@/types/wisblock';
import React, {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { wisblockModules } from '@/data/wisblockModules';

const getTimestamp = () => new Date().toLocaleTimeString();

type GeneratorContextType = {
  config: HardwareConfiguration;
  buildStatus: BuildStatus;
  logs: LogEntry[];
  isConsoleExpanded: boolean;
  addModule: (module: WisBlockModule, slot: WisBlockSlot) => void;
  removeModule: (slot: WisBlockSlot) => void;
  startBuild: () => void;
  clearLogs: () => void;
  toggleConsole: (forceState?: boolean) => void;
};

const GeneratorContext = createContext<GeneratorContextType | undefined>(
  undefined,
);

export function GeneratorProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<HardwareConfiguration>({
    base: wisblockModules.find(m => m.id === 'base-rak19007') || null, // Default base
    core: wisblockModules.find(m => m.id === 'core-rak4631') || null, // Default core
    slots: {
      A: wisblockModules.find(m => m.id === 'sensor-rak1901') || null, // Default sensor
      B: null,
      IO: null,
    },
  });
  const [buildStatus, setBuildStatus] = useState<BuildStatus>('ready');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConsoleExpanded, setIsConsoleExpanded] = useState(true);

  const addModule = useCallback(
    (module: WisBlockModule, slot: WisBlockSlot) => {
      setConfig((prevConfig) => {
        if (module.type === 'base') {
          const newSlots: HardwareConfiguration['slots'] = {};
          module.slots.forEach((s) => {
            if (s !== 'Core') {
              newSlots[s] = null;
            }
          });

          return {
            ...prevConfig,
            base: module,
            core: null,
            slots: newSlots,
          };
        }

        if (module.type === 'core' && slot === 'Core') {
          return {
            ...prevConfig,
            core: module,
          };
        }

        if (
          (module.type === 'sensor' || module.type === 'io')
          && slot !== 'Core'
        ) {
          return {
            ...prevConfig,
            slots: {
              ...prevConfig.slots,
              [slot]: module,
            },
          };
        }

        return prevConfig;
      });
      setBuildStatus('ready');
    },
    [],
  );

  const removeModule = useCallback((slot: WisBlockSlot) => {
    setConfig((prevConfig) => {
      if (slot === 'Core') {
        return {
          ...prevConfig,
          core: null,
        };
      }

      if (Object.prototype.hasOwnProperty.call(prevConfig.slots, slot)) {
        return {
          ...prevConfig,
          slots: {
            ...prevConfig.slots,
            [slot]: null,
          },
        };
      }

      return prevConfig;
    });
    setBuildStatus('ready');
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    setBuildStatus('ready');
  }, []);

  const toggleConsole = useCallback((forceState?: boolean) => {
    setIsConsoleExpanded(forceState ?? (prev => !prev));
  }, []);

  const startBuild = useCallback(async () => {
    setBuildStatus('building');
    setLogs([]);
    setIsConsoleExpanded(true);

    let logId = 0;

    const addLog = (message: string, defaultType: LogEntry['type'] = 'info') => {
      let logType: LogEntry['type'] = defaultType;
      const lowerMessage = message.toLowerCase();
      if (
        lowerMessage.includes('error')
        || lowerMessage.includes('failed')
        || lowerMessage.includes('err:')
      ) {
        logType = 'error';
      } else if (lowerMessage.startsWith('--- [') || lowerMessage.startsWith('west ')) {
        logType = 'command';
      } else if (lowerMessage.includes('successful') || lowerMessage.includes('success')) {
        logType = 'success';
      }

      setLogs(prevLogs => [
        ...prevLogs,
        {
          id: logId++,
          timestamp: getTimestamp(),
          type: logType,
          message: message.trim(),
        },
      ]);
    };

    try {
      const response = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Build request failed: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let partialLine = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (partialLine) {
            addLog(partialLine);
          }
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = (partialLine + chunk).split('\n');
        partialLine = lines.pop() || '';

        for (const line of lines) {
          if (line) {
            addLog(line);
          }
        }
      }

      setLogs((prevLogs) => {
        const lastLog = prevLogs[prevLogs.length - 1]?.message || '';
        if (lastLog.includes('SUCCESSFUL')) {
          setBuildStatus('success');
        } else if (lastLog.includes('FAILED') || lastLog.includes('ERROR')) {
          setBuildStatus('failed');
        } else {
          setBuildStatus('success');
        }
        return prevLogs;
      });
    } catch (error) {
      const errorMessage
        = error instanceof Error ? error.message : String(error);
      addLog(`Frontend Error: ${errorMessage}`, 'error');
      setBuildStatus('failed');
    }
  }, [config]);

  const value = useMemo(
    () => ({
      config,
      buildStatus,
      logs,
      isConsoleExpanded,
      addModule,
      removeModule,
      startBuild,
      clearLogs,
      toggleConsole,
    }),
    [
      config,
      buildStatus,
      logs,
      isConsoleExpanded,
      addModule,
      removeModule,
      startBuild,
      clearLogs,
      toggleConsole,
    ],
  );

  return (
    <GeneratorContext value={value}>
      {children}
    </GeneratorContext>
  );
}

export const useGenerator = () => {
  const context = use(GeneratorContext);
  if (context === undefined) {
    throw new Error('useGenerator must be used within a GeneratorProvider');
  }
  return context;
};
