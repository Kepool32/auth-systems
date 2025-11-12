import { GetServerSideProps } from 'next';
import Layout from '../../components/common/Layout';
import ProfileCard from '../../components/profile/ProfileCard';
import ProfileEditor from '../../components/profile/ProfileEditor';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { User } from '@/types/user';
import { AuthenticatedRequest, withAuth } from '@/middlewares/withAuth';
import { RootState } from '@/store';
import { setUser } from '@/store/slices/authSlice';

interface ProfilePageProps {
  user: User;
}

export default function ProfilePage({ user }: ProfilePageProps) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        {currentUser && (
          <>
            <ProfileCard
              login={currentUser.login}
              email={currentUser.email}
              username={currentUser.username}
            />

            <button
              onClick={() => setIsEditorOpen(true)}
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            >
              Edit Profile
            </button>
          </>
        )}

        {isEditorOpen && currentUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
              <button
                onClick={() => setIsEditorOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                &times;
              </button>
              <ProfileEditor user={currentUser} onClose={() => setIsEditorOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const req = context.req as AuthenticatedRequest;
  return {
    props: {
      user: req.user,
    },
  };
});
