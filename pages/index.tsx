import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/track-new');
  }, [router]);
  
  return (
    <div>
      <p>Redirecting to tracking page...</p>
    </div>
  );
} 