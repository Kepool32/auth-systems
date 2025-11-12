import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider, useSelector } from 'react-redux';
import Header from '@/components/header/header';
import Spinner from '@/components/common/Spinner';
import { RootState, store } from '@/store';

const LoadingWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loading = useSelector((state: RootState) => state.loading.value);

  return (
    <>
      {children}
      {loading && <Spinner />}
    </>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Header />
      <LoadingWrapper>
        <Component {...pageProps} />
      </LoadingWrapper>
    </Provider>
  );
}
