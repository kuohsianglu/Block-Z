import type { Metadata } from 'next';
import GeneratorClientPage from '@/components/generator/GeneratorClientPage';

export const metadata: Metadata = {
  title: 'Block-Z',
};

export default function GeneratorPage() {
  return <GeneratorClientPage />;
}
