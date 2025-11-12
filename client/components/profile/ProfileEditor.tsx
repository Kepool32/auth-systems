import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import axios from '../../utils/api';
import { User } from '@/types/user';

import { RootState } from '@/store';
import { AxiosError } from 'axios';
import { setLoading } from '@/store/slices/loadingSlice';
import { setUser } from '@/store/slices/authSlice';

interface ProfileEditorProps {
  user: User;
  onClose?: () => void;
}

interface ProfileFormValues {
  username: string;
  email: string;
  login: string;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ user, onClose }) => {
  const { register, handleSubmit } = useForm<ProfileFormValues>({
    defaultValues: {
      username: user.username,
      email: user.email,
      login: user.login,
    },
  });

  const loading = useSelector((state: RootState) => state.loading.value);
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    dispatch(setLoading(true));
    try {
      const res = await axios.patch<User>('/users/profile', data);
      dispatch(setUser(res.data));
      onClose?.();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      alert(error.response?.data?.message || 'Update failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register('username')}
          placeholder="Username"
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <input {...register('email')} placeholder="Email" className="w-full border p-2 rounded" />
      </div>
      <div>
        <input {...register('login')} placeholder="Login" className="w-full border p-2 rounded" />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded w-full"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};

export default ProfileEditor;
