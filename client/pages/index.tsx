import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Spinner from '@/components/common/Spinner';

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/profile');
    } else {
      router.replace('/login');
    }
  }, [user, router]);

  return <Spinner />;
}
