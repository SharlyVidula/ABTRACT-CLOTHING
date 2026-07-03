import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Control Terminal // ABSTRACT',
  description: 'ABSTRACT Administrative catalog management, inventory levels, and custom order stream.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
