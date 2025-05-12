import React from 'react';
import { EmployeeTraining } from '../components/EmployeeTraining';
import Header from '../components/Header';
import Footer from '../components/Footer';

const EmployeeTrainingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center mb-4">
              Employee Training & Development
            </h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              Enhance your skills and knowledge through our comprehensive training modules.
              Track your progress, earn achievements, and grow professionally.
            </p>
          </div>

          <EmployeeTraining />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmployeeTrainingPage; 