import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { client } from '../feathers'; // adjust if your client path is different
import { message } from 'antd';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setLoginError(null);

    try {
      // Step 1: Authenticate with Feathers using 'local' strategy
      const authResult = await client.authenticate({
        strategy: 'local',
        email,
        password,
      });

      // Step 2: Get the user's email from the response (or use authResult.user if available)
      const userEmail = authResult.user?.email || email;

      // Step 3: Fetch the user from the 'users' service to get their role
      const userResult = await client.service('users').find({
        query: { email: userEmail },
      });

      const user = userResult.data[0];
      if (!user) {
        throw new Error('User not found after login');
      }

      // Step 4: Redirect based on role
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/voucher');
      }

      message.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Login failed');
      message.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <InputText
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            feedback={false}
            toggleMask
            className="w-full"
            placeholder="Enter your password"
          />
        </div>

        {loginError && <Message severity="error" text={loginError} className="mb-4" />}

        <Button
          label={loading ? 'Logging in...' : 'Login'}
          icon="pi pi-sign-in"
          className="w-full"
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default LoginPage;
