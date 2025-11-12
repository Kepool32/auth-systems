import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AuthForm from '@/components/auth/AuthForm';

const schema = z.object({
  login: z.string().min(3, { message: 'Минимум 3 символа' }).optional(),
  username: z.string().min(1, { message: 'Введите имя' }).optional(),
  email: z.string().email({ message: 'Некорректный email' }),
  password: z.string().min(6, { message: 'Минимум 6 символов' }),
});

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  return (
    <AuthForm
      type="register"
      title="Регистрация"
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      submitText="Зарегистрироваться"
    />
  );
}
