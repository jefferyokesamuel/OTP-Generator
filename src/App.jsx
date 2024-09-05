import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './App.css';

function App() {
  return (
    <GoogleOAuthProvider clientId="872401651717-eho1fvede65rh69948hi6vlusdmubs24.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

const Home = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
      
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        
        navigate('/welcome', { state: { userInfo: userInfo.data } });
      } catch (error) {
        console.error('Failed to fetch user info', error);
      }
    },
    onError: () => {
      console.log('Login Failed');
      return (
        <div className="card">
          <p>Login Failed</p>
        </div>
      )
    },
  });

  return (
    <div className='card'>
      <h1>Random OTP Generator</h1>
      <button onClick={() => login()}>Sign Up with Google</button>
      <p>Hi there, sign up to our platform & get a free OTP code 🔥🚀</p>
    </div>
  );
};

const Welcome = () => {
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [visible, setVisible] = useState(true);
  const userInfo = location.state?.userInfo;

  useEffect(() => {
    const generateOtp = () => {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      setOtp(otpCode);
    };

    generateOtp();

    const timer = setTimeout(() => {
      setVisible(false);
    }, 20000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h1>Welcome to the Platform</h1>
      <p>You have successfully signed up!</p>
      {userInfo && (
        <div>
          <p>Signed in with: {userInfo.email}</p>
          <p>Name: {userInfo.name}</p>
  
        </div>
      )}
      {visible ? (
        <div>
          <h2>Your OTP Code: {otp}</h2>
          <p>Please use this code for verification. It will disappear in 20 seconds.</p>
        </div>
      ) : (
        <p>Your OTP code has expired.</p>
      )}
    </div>
  );
};

export default App;
