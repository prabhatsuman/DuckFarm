import { Navigate } from 'react-router-dom';
import API_URL from '../config';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem(`${API_URL}:accessToken`);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
