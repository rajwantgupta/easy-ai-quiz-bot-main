import React from 'react';
import { TrainingAdminDashboard } from '../components/TrainingAdminDashboard';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TrainingAdminPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center mb-4">
              Training Administration
            </h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              Manage training modules, track progress, and analyze performance metrics
              for your organization's learning and development program.
            </p>
          </div>

          <TrainingAdminDashboard />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrainingAdminPage; 