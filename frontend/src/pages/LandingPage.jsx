import React from 'react';
import Card from '../components/Card';

const LandingPage = () => {
    return (
    <div className="flex min-h-screen bg-off-white">
<Card>
              <div className="flex flex-col gap-3">
                <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition text-center">
                  Student
                </button>
                <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition text-center">
                  Lecturer
                </button>
                <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition text-center">
                  Admin
                </button>
              </div>
            </Card>    
             </div>
)
};
export default LandingPage;