import type { WisBlockModule } from '../types/wisblock';
import { Blocks, Cpu, Plug, Radio } from 'lucide-react';

export const wisblockModules: WisBlockModule[] = [
  // Base Boards
  {
    id: 'base-rak19007',
    name: 'RAK19007',
    type: 'base',
    description: 'WisBlock Mini Base Board',
    slots: ['Core', 'A', 'B', 'C'],
    icon: Blocks,
    color: 'text-cyan-500',
  },

  // Cores
  {
    id: 'core-rak4631',
    name: 'RAK4631',
    type: 'core',
    description: 'WisBlock Core (LoRaWAN, BLE)',
    slots: ['Core'],
    icon: Cpu,
    color: 'text-yellow-500',
    imageUrl: 'https://store.rakwireless.com/cdn/shop/products/RAK4631_4000x.progressive.png',
  },
  {
    id: 'core-rak3112',
    name: 'RAK3112',
    type: 'core',
    description: 'WisBlock Core (LoRaWAN, Wi-Fi, BLE)',
    slots: ['Core'],
    icon: Cpu,
    color: 'text-yellow-500',
    imageUrl: 'https://store.rakwireless.com/cdn/shop/files/rak3312-wisblock-core-module_4000x.progressive.webp',
  },
  {
    id: 'core-rak3172',
    name: 'RAK3172',
    type: 'core',
    description: 'WisBlock Core (STM32WLE5, LoRaWAN)',
    slots: ['Core'],
    icon: Cpu,
    color: 'text-yellow-500',
    imageUrl: 'https://store.rakwireless.com/cdn/shop/products/RAK3372_4000x.progressive.png',
  },

  // Sensors
  {
    id: 'sensor-rak1901',
    name: 'RAK1901',
    type: 'sensor',
    description: 'Temperature & Humidity Sensor',
    slots: ['A', 'B'],
    icon: Radio,
    color: 'text-blue-600',
    imageUrl: 'https://store.rakwireless.com/cdn/shop/products/RAK1901Isometric_dcc40309-52c0-4fa1-be5e-7e6d85e3e679_4000x.progressive.png',
  },
  {
    id: 'sensor-rak1904',
    name: 'RAK1904',
    type: 'sensor',
    description: '3-Axis Acceleration Sensor',
    slots: ['A', 'B'],
    icon: Radio,
    color: 'text-blue-600',
    imageUrl: 'https://store.rakwireless.com/cdn/shop/products/RAK1904Isometric_9845d016-434d-4849-bc80-05b406f2ee43_4000x.progressive.png',
  },

  // IO Modules
  {
    id: 'io-rak13007',
    name: 'RAK13007',
    type: 'io',
    description: 'Relay Module 250VAC 5A/10A',
    slots: ['IO'],
    icon: Plug,
    color: 'text-green-600',
    imageUrl: 'https://store.rakwireless.com/cdn/shop/products/RAK13007_9bdc65e4-d455-4c85-bc7b-4d754591bf59_4000x.progressive.png',
  },
];
