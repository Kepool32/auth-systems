import React, { useState } from 'react';
import { UseFormRegister, UseFormHandleSubmit, FieldErrors } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import axios from '../../utils/api';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../common/Spinner';
import { RootState } from '@/store';
import { setLoading } from '@/store/slices/loadingSlice';
import { setUser } from '@/store/slices/authSlice';

export interface AuthFormValues {
  login?: string;
  username?: string;
  email: string;
  password: string;
}

interface AuthFormProps {
  type: 'login' | 'register';
  register: UseFormRegister<AuthFormValues>;
  handleSubmit: UseFormHandleSubmit<AuthFormValues>;
  errors: FieldErrors<AuthFormValues>;
  submitText: string;
  title: string;
  setErrorForm?: (msg: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  register,
  handleSubmit,
  errors,
  submitText,
  title,
  setErrorForm,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const loading = useSelector((state: RootState) => state.loading.value);
  const [error, setError] = useState('');

  const onSubmit = async (data: AuthFormValues) => {
    dispatch(setLoading(true));
    setError('');
    try {
      const url = type === 'login' ? '/auth/login' : '/auth/register';
      const res = await axios.post(url, data);
      dispatch(setUser(res.data.user));
      router.push('/profile');
    } catch (err: any) {
      let message = 'Ошибка авторизации';
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') message = data;
        else if (data.message) message = data.message;
        else message = JSON.stringify(data);
      }
      setError(message);
      setErrorForm?.(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loginError = errors.login?.message?.toString();
  const usernameError = errors.username?.message?.toString();
  const emailError = errors.email?.message?.toString();
  const passwordError = errors.password?.message?.toString();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 px-4 flex justify-center items-center">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <Spinner />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 relative z-10"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{title}</h2>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg text-center font-medium"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {type === 'register' && (
            <>
              <div>
                <input
                  {...register('login')}
                  placeholder="Логин"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                {loginError && <p className="text-red-500 text-sm mt-1">{loginError}</p>}
              </div>

              <div>
                <input
                  {...register('username')}
                  placeholder="Имя пользователя"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
              </div>
            </>
          )}

          <div>
            <input
              {...register('email')}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <input
              type="password"
              {...register('password')}
              placeholder="Пароль"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold shadow-lg transition transform hover:scale-105"
          >
            {loading ? 'Подождите...' : submitText}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthForm;
