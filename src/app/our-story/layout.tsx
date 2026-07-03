import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story // ABSTRACT',
  description: 'The genesis, vision, and futuristic philosophy of ABSTRACT Premium Couture Studio.',
};

export default function OurStoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
