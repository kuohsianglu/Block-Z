/**
 * Defines the structure for a WisBlock module.
 */
export type WisBlockModule = {
  id: string;
  name: string;
  type: 'base' | 'core' | 'sensor' | 'io';
  description: string;
  slots: string[];
};

/**
 * Defines the available slots on a base board.
 */
export type WisBlockSlot = 'Core' | 'A' | 'B' | 'C' | 'D' | 'IO';

/**
 * Represents the current hardware configuration on the canvas.
 */
export type HardwareConfiguration = {
  base: WisBlockModule | null;
  core: WisBlockModule | null;
  slots: {
    [key: string]: WisBlockModule | null;
  };
};

/**
 * Defines the possible states of the firmware build process.
 */
export type BuildStatus = 'ready' | 'building' | 'success' | 'failed';

/**
 * Represents a single line in the build console log.
 */
export type LogEntry = {
  id: number;
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'command';
};
