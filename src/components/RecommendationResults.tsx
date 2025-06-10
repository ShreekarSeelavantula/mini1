import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, DollarSign, Clock, ExternalLink, BookOpen, Target, Users, Star, Award, MapPin, Calendar, Briefcase, CheckCircle } from 'lucide-react';
import { Recommendation } from '../types';

interface RecommendationResultsProps {
  recommendations: Recommendation[];
  onReset: () => void;
}

const RecommendationResults: React.FC<RecommendationResultsProps> = ({ 
  recommendations, 
  onReset 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'financials' | 'workforce' | 'stories'>('overview');

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Form</span>
        </button>
        
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Your Personalized Business Recommendations
        </h2>
        
        <div className="w-24"></div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-1 flex flex-wrap justify-center">
          {[
            { key: 'overview', label: 'Overview', icon: Target },
            { key: 'stories', label: 'Success Stories', icon: Award },
            { key: 'resources', label: 'Learning', icon: BookOpen },
            { key: 'financials', label: 'Financial Plan', icon: DollarSign },
            { key: 'workforce', label: 'Team Planning', icon: Users }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === key
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {recommendations.map((recommendation, index) => (
          <div
            key={recommendation.id}
            className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden"
          >
            {/* Business Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {recommendation.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-purple-100">
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4" />
                      <span>Recommendation #{index + 1}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>{recommendation.confidenceScore}% Match</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Briefcase className="h-4 w-4" />
                      <span className="capitalize">{recommendation.businessType}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-purple-100 text-sm">Expected ROI</div>
                  <div className="text-white text-xl font-bold">
                    {recommendation.financials.profit_margin}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Business Description */}
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                      About This Business
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{recommendation.description}</p>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">{recommendation.confidenceScore}%</span>
                      </div>
                      <p className="text-sm text-gray-600">Confidence Match</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <DollarSign className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-bold text-purple-600">{recommendation.financials.break_even}</span>
                      </div>
                      <p className="text-sm text-gray-600">Break-even Time</p>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Users className="h-5 w-5 text-orange-600" />
                        <span className="text-2xl font-bold text-orange-600">{recommendation.workforcePlan.initialTeamSize}</span>
                      </div>
                      <p className="text-sm text-gray-600">Initial Team Size</p>
                    </div>
                  </div>

                  {/* Data Sources */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-800 mb-2">Data Sources & Transparency</h5>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.dataSources.map((source, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 border">
                          {source}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      * These recommendations are guidance-based and not guaranteed results. Success depends on various factors including market conditions and execution.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'stories' && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Award className="h-5 w-5 text-yellow-600 mr-2" />
                    Success Stories for {recommendation.name}
                  </h4>
                  <div className="space-y-4">
                    {recommendation.caseStudies.map((story, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
                        <div className="flex items-start space-x-4">
                          <div className="bg-yellow-500 text-white rounded-full p-2">
                            <Award className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h5 className="font-semibold text-gray-800">{story.name}</h5>
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-1" />
                                {story.location}
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3 leading-relaxed">{story.story}</p>
                            <div className="bg-white rounded-lg p-3 border border-yellow-300">
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-green-800">Achievement:</span>
                              </div>
                              <p className="text-green-700 mt-1">{story.achievement}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                    Learning Resources for {recommendation.name}
                  </h4>
                  <div className="grid gap-4">
                    {recommendation.resources.map((resource, idx) => (
                      <div
                        key={idx}
                        className="bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors border border-blue-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-800 mb-2">
                              {resource.title}
                            </h5>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <span className="bg-blue-200 px-2 py-1 rounded">
                                {resource.type}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {resource.duration}
                              </span>
                              {resource.level && (
                                <span className="bg-green-200 px-2 py-1 rounded text-green-800">
                                  {resource.level}
                                </span>
                              )}
                            </div>
                          </div>
                          <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'financials' && (
                <div className="space-y-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                    Financial Planning for {recommendation.name}
                  </h4>
                  
                  {/* Investment & Revenue */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <h5 className="font-medium text-gray-800 mb-4">Investment Requirements</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Initial Investment:</span>
                          <span className="font-medium">{recommendation.financials.investment}</span>
                        </div>
                        {recommendation.financials.equipment_cost && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Equipment Cost:</span>
                            <span className="font-medium">{recommendation.financials.equipment_cost}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Initial Sales Volume:</span>
                          <span className="font-medium">{recommendation.financials.initialSalesVolume}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                      <h5 className="font-medium text-gray-800 mb-4">Revenue Potential</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Profit Margin:</span>
                          <span className="font-medium text-green-600">{recommendation.financials.profit_margin}</span>
                        </div>
                        {recommendation.financials.monthly_income && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Income:</span>
                            <span className="font-medium">{recommendation.financials.monthly_income}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Break-even Time:</span>
                          <span className="font-medium">{recommendation.financials.break_even}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tools Needed */}
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h5 className="font-medium text-gray-800 mb-4">Tools & Materials Needed</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {recommendation.financials.toolsNeeded.map((tool, idx) => (
                        <div key={idx} className="flex items-center space-x-2 bg-white rounded-lg p-2 border">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{tool}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scaling Strategy */}
                  <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                    <h5 className="font-medium text-gray-800 mb-4 flex items-center">
                      <Calendar className="h-5 w-5 text-orange-600 mr-2" />
                      Growth & Scaling Strategy
                    </h5>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-orange-300">
                        <h6 className="font-medium text-orange-800 mb-2">Month 3 Goals</h6>
                        <p className="text-gray-700">{recommendation.financials.scalingStrategy.month3}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-orange-300">
                        <h6 className="font-medium text-orange-800 mb-2">Month 6 Goals</h6>
                        <p className="text-gray-700">{recommendation.financials.scalingStrategy.month6}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-orange-300">
                        <h6 className="font-medium text-orange-800 mb-2">Month 12 Goals</h6>
                        <p className="text-gray-700">{recommendation.financials.scalingStrategy.month12}</p>
                      </div>
                    </div>
                  </div>

                  {/* Operational Expenses */}
                  {recommendation.financials.operational_expense && (
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <h5 className="font-medium text-gray-800 mb-2">Operational Expenses</h5>
                      <div className="text-sm">
                        <span className="text-gray-600">Monthly Operating Cost: </span>
                        <span className="font-medium">{recommendation.financials.operational_expense}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'workforce' && (
                <div className="space-y-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    Workforce Planning for {recommendation.name}
                  </h4>

                  {/* Initial Team Setup */}
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h5 className="font-medium text-gray-800 mb-4">Initial Team Structure</h5>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Recommended Team Size:</p>
                        <p className="text-2xl font-bold text-blue-600">{recommendation.workforcePlan.initialTeamSize} {recommendation.workforcePlan.initialTeamSize === 1 ? 'person' : 'people'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Key Roles:</p>
                        <div className="space-y-1">
                          {recommendation.workforcePlan.roles.map((role, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">{role}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Growth Timeline */}
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h5 className="font-medium text-gray-800 mb-4 flex items-center">
                      <Calendar className="h-5 w-5 text-green-600 mr-2" />
                      Team Growth Timeline
                    </h5>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-green-300">
                        <h6 className="font-medium text-green-800 mb-2">Month 3 Plan</h6>
                        <p className="text-gray-700">{recommendation.workforcePlan.growthPlan.month3}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-300">
                        <h6 className="font-medium text-green-800 mb-2">Month 6 Plan</h6>
                        <p className="text-gray-700">{recommendation.workforcePlan.growthPlan.month6}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-300">
                        <h6 className="font-medium text-green-800 mb-2">Month 12 Plan</h6>
                        <p className="text-gray-700">{recommendation.workforcePlan.growthPlan.month12}</p>
                      </div>
                    </div>
                  </div>

                  {/* Solo Work Tips */}
                  {recommendation.workforcePlan.soloTips && (
                    <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                      <h5 className="font-medium text-gray-800 mb-4">Solo Work Efficiency Tips</h5>
                      <div className="space-y-2">
                        {recommendation.workforcePlan.soloTips.map((tip, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                            <span className="text-sm text-gray-700">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="text-center mt-8">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          Get New Recommendations
        </button>
      </div>
    </div>
  );
};

export default RecommendationResults;