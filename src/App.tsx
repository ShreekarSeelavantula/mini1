import React, { useState } from 'react';
import SkillForm from './components/SkillForm';
import RecommendationResults from './components/RecommendationResults';
import Header from './components/Header';
import { UserInput, Recommendation } from './types';

function App() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleFormSubmit = async (formData: UserInput) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.recommendations);
        setShowResults(true);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Network error:', error);
      // Enhanced fallback data with all new features
      setRecommendations([
        {
          name: 'Tailoring Services',
          id: 'tailoring',
          description: 'A tailoring business involves creating, altering, and repairing clothing items. This service-based business can range from basic alterations to custom clothing design, offering flexibility to work from home or establish a shop.',
          businessType: 'service',
          confidenceScore: 85,
          resources: [
            { title: 'Complete Tailoring Course', link: '#', type: 'Video Course', duration: '40 hours', level: 'All Levels' },
            { title: 'NSDC Tailoring Certification', link: '#', type: 'Government Certification', duration: '3 months', level: 'Beginner' }
          ],
          financials: {
            investment: '₹15,000 - ₹75,000',
            profit_margin: '25% - 45%',
            break_even: '4 - 8 months',
            monthly_income: '₹20,000 - ₹80,000',
            equipment_cost: '₹10,000 - ₹50,000',
            operational_expense: '₹3,000 - ₹8,000/month',
            initialSalesVolume: '15-25 garments per month',
            scalingStrategy: {
              month3: 'Focus on building customer base through quality work and word-of-mouth referrals',
              month6: 'Expand services to include designer alterations and custom clothing',
              month12: 'Open a small shop or expand home setup with 50+ regular customers'
            },
            toolsNeeded: ['Sewing Machine', 'Overlock Machine', 'Iron & Board', 'Cutting Table', 'Measuring Tools']
          },
          caseStudies: [
            {
              name: 'Priya Sharma',
              location: 'Jaipur, Rajasthan',
              story: 'Started with basic alterations from her home after learning tailoring skills through a government program.',
              achievement: 'Built a customer base of 200+ regular clients and now earns ₹45,000 monthly while working from home.'
            }
          ],
          workforcePlan: {
            initialTeamSize: 1,
            roles: ['Tailor/Designer', 'Quality Controller'],
            growthPlan: {
              month3: 'Continue solo operations while building customer base',
              month6: 'Consider hiring a part-time assistant for basic alterations',
              month12: 'Expand to 2-3 team members including a junior tailor'
            },
            soloTips: [
              'Use time-blocking to manage different types of work',
              'Invest in quality equipment to increase efficiency',
              'Create standard pricing charts and measurement forms'
            ]
          },
          dataSources: ['NSDC Skills Database', 'MSME Success Stories', 'Government Schemes Data']
        }
      ]);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setRecommendations([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!showResults ? (
          <SkillForm onSubmit={handleFormSubmit} loading={loading} />
        ) : (
          <RecommendationResults 
            recommendations={recommendations} 
            onReset={handleReset} 
          />
        )}
      </main>
      
      <footer className="bg-white/80 backdrop-blur-sm border-t border-purple-100 py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            Empowering women entrepreneurs with AI-powered business insights and comprehensive planning
          </p>
          <p className="text-sm text-gray-500 mt-2">
            * Recommendations are guidance-based and success depends on various factors including market conditions and execution
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;