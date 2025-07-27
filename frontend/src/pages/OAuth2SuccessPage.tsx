import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuth2SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    console.log('OAuth2 token:', token); // Debug: log token nhận được
    if (token) {
      localStorage.setItem('jwt', token);
      localStorage.setItem('auth_token', token); // Lưu đồng bộ cho login thường và Google
      // Reload lại app để AuthContext nhận token mới
      window.location.href = '/';
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  return <div>Đang đăng nhập...</div>;
};

export default OAuth2SuccessPage; 