import AuthProvider from '@/components/AuthProvider';
import LandingContent from '@/components/LandingContent';

export default function Home() {
  return (
    <AuthProvider>
      <LandingContent />
    </AuthProvider>
  );
}
