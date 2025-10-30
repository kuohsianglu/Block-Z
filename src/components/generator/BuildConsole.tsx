'use client';

import type { KeyboardEvent } from 'react';
import type { LogEntry } from '@/types/wisblock';
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Loader2,
  Terminal,
  Trash2,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGenerator } from '@/contexts/GeneratorContext';
import { cn } from '@/libs/utils';

export default function BuildConsole() {
  const {
    logs,
    buildStatus,
    isConsoleExpanded,
    toggleConsole,
    clearLogs,
  } = useGenerator();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        'div[data-radix-scroll-area-viewport]',
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [logs]);

  const getStatusInfo = () => {
    switch (buildStatus) {
      case 'building':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin text-blue-400" />,
          text: 'Status: Building...',
          color: 'text-blue-400',
        };
      case 'success':
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-400" />,
          text: 'Status: Success',
          color: 'text-green-400',
        };
      case 'failed':
        return {
          icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
          text: 'Status: Failed',
          color: 'text-destructive',
        };
      case 'ready':
      default:
        return {
          icon: <Terminal className="h-4 w-4 text-muted-foreground" />,
          text: 'Status: Ready',
          color: 'text-muted-foreground',
        };
    }
  };

  const { icon, text, color } = getStatusInfo();

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleConsole();
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col border-t bg-card text-card-foreground shadow-lg transition-all duration-300 ease-in-out',
        isConsoleExpanded ? 'h-80' : 'h-12',
      )}
    >
      {/* Console Header */}
      <div
        role="button"
        tabIndex={0}
        className="flex h-12 flex-shrink-0 cursor-pointer items-center justify-between border-b px-4"
        onClick={() => toggleConsole()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className={cn('font-mono text-sm font-medium', color)}>
            Build Console
            <span className="hidden sm:inline">
              {' '}
              -
              {text}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isConsoleExpanded && (
            <>
              {buildStatus === 'success' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.warn('Simulating firmware download...');
                  }}
                  title="Download Firmware"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  console.warn('Simulating log download...');
                }}
                title="Download Log"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  clearLogs();
                }}
                title="Clear Log"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
          {isConsoleExpanded
            ? (
                <ChevronDown className="h-5 w-5" />
              )
            : (
                <ChevronUp className="h-5 w-5" />
              )}
        </div>
      </div>

      {/* Log Output Area */}
      <ScrollArea
        className="flex-1 min-h-0"
        ref={scrollAreaRef}
        style={{ display: isConsoleExpanded ? 'block' : 'none' }}
      >
        <pre className="p-4 font-mono text-xs">
          {logs.length === 0
            ? (
                <span className="text-muted-foreground">
                  {buildStatus === 'ready'
                    ? 'Click "Generate Firmware" to start the build process.'
                    : 'Waiting for log output...'}
                </span>
              )
            : (
                logs.map(log => (
                  <LogLine key={log.id} log={log} />
                ))
              )}
        </pre>
      </ScrollArea>
    </div>
  );
}

function LogLine({ log }: { log: LogEntry }) {
  const logColor = {
    info: 'text-muted-foreground',
    command: 'text-blue-300',
    success: 'text-green-400',
    error: 'text-destructive',
  }[log.type];

  return (
    <div className="flex">
      <span className="mr-2 w-24 flex-shrink-0 text-muted-foreground/50">
        {log.timestamp}
      </span>
      <span className={logColor}>{log.message}</span>
    </div>
  );
}
