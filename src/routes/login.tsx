import ShopLayout from '../components/shop/ShopLayout';
import LoginForm from '../components/shop/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    // Redirigir según el rol
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/shop" replace />;
  }

  return (
    <ShopLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoginForm />
      </div>
    </ShopLayout>
  );
}
