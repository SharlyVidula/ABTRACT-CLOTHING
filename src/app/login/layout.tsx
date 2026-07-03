import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Identity Login // ABSTRACT',
  description: 'Log in or register your account at ABSTRACT to access the virtual Fit-On Atelier studio.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
