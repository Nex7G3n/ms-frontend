import ShopLayout from '../components/shop/ShopLayout';
import UserProfile from '../components/shop/UserProfile';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function Profile() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ShopLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserProfile />
      </div>
    </ShopLayout>
  );
}
