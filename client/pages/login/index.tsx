import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AuthForm from '@/components/auth/AuthForm';

const schema = z.object({
  email: z.string().email({ message: 'Некорректный email' }),
  password: z.string().min(6, { message: 'Минимум 6 символов' }),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  return (
    <AuthForm
      type="login"
      title="Вход"
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      submitText="Войти"
    />
  );
}
