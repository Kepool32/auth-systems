import React from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { clearUser } from '@/store/slices/authSlice';
import api from '@/utils/api';

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await api.post('/auth/logout');
    dispatch(clearUser());
    window.location.href = '/login';
  };

  return (
    <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">Auth System</h1>
      <nav className="space-x-4">
        {!user ? (
          <>
            <Link href="/login" className="text-gray-700 hover:text-blue-500 font-medium">
              Войти
            </Link>
            <Link href="/register" className="text-gray-700 hover:text-blue-500 font-medium">
              Регистрация
            </Link>
          </>
        ) : (
          <>
            <span className="text-gray-800 font-medium">Привет, {user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
            >
              Выйти
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
