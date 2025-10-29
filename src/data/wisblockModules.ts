import type { WisBlockModule } from '../types/wisblock';

export const wisblockModules: WisBlockModule[] = [
  // Base Boards
  {
    id: 'base-rak19007',
    name: 'RAK19007',
    type: 'base',
    description: 'WisBlock Mini Base Board',
    slots: ['Core', 'A', 'B', 'C'],
  },
  {
    id: 'base-rak19003',
    name: 'RAK19003',
    type: 'base',
    description: 'WisBlock Mini Base Board (Tiny)',
    slots: ['Core', 'A', 'B'],
  },

  // Cores
  {
    id: 'core-rak4631',
    name: 'RAK4631',
    type: 'core',
    description: 'WisBlock Core (LoRaWAN, BLE)',
    slots: ['Core'],
  },
  {
    id: 'core-rak3112',
    name: 'RAK3112',
    type: 'core',
    description: 'WisBlock Core (LoRaWAN, Wi-Fi, BLE)',
    slots: ['Core'],
  },
  {
    id: 'core-rak3172',
    name: 'RAK3172',
    type: 'core',
    description: 'WisBlock Core (STM32WLE5, LoRaWAN)',
    slots: ['Core'],
  },

  // Sensors
  {
    id: 'sensor-rak1901',
    name: 'RAK1901',
    type: 'sensor',
    description: 'Temperature & Humidity Sensor',
    slots: ['A', 'B'],
  },
  {
    id: 'sensor-rak1904',
    name: 'RAK1904',
    type: 'sensor',
    description: '3-Axis Acceleration Sensor',
    slots: ['A', 'B'],
  },

  // IO Modules
  {
    id: 'io-rak13007',
    name: 'RAK13007',
    type: 'io',
    description: 'Relay Module 250VAC 5A/10A',
    slots: ['IO'],
  },
];
