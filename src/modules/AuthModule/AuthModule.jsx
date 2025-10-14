import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import OmniHubLogo from '../../assets/my-logo.png';

const AuthModule = () => {
  const [currentView, setCurrentView] = useState('login');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return <LoginForm onSwitchToRegister={() => setCurrentView('register')} />;
      case 'register':
        return <RegisterForm onSwitchToLogin={() => setCurrentView('login')} onOTPRequired={() => setCurrentView('login')} />;
      default:
        return <LoginForm onSwitchToRegister={() => setCurrentView('register')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gray-800 border-2 border-orange-500 rounded-lg mx-auto mb-4 flex items-center justify-center overflow-hidden">
            <img src={OmniHubLogo} alt="OmniHub Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">OmniHub</h1>
          <p className="text-gray-400">Your entertainment universe</p>
        </div>
        
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default AuthModule;