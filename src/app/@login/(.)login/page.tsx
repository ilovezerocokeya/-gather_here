import LoginForm from '@/components/Login/LoginForm';
import LoginModals from '../../../components/Common/Modal/modal';

const LoginPage: React.FC = () => {
  return (
    <LoginModals>
      <LoginForm />
    </LoginModals>
  );
};

export default LoginPage;
