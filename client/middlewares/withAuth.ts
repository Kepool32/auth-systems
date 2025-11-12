import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { IncomingMessage } from 'http';
import axios from '../utils/api';
import { User } from '@/types/user';

export interface AuthenticatedRequest extends IncomingMessage {
  cookies: Partial<Record<string, string>>;
  user?: User;
}

export function withAuth<P extends Record<string, unknown>>(
  gssp: GetServerSideProps<P>,
): GetServerSideProps<P> {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const req = context.req as AuthenticatedRequest;
    const cookies = req.headers.cookie || '';

    try {
      const { data } = await axios.get<User>('/users/profile', {
        headers: { cookie: cookies },
        withCredentials: true,
      });

      req.user = data;

      return await gssp(context);
    } catch {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
  };
}
