import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, DollarSign, Clock, ExternalLink, BookOpen, Target, Users, Star, Award, MapPin, Calendar, Briefcase, CheckCircle, Phone, Mail, MessageCircle, Linkedin, Globe, User, Brain, BarChart3, Cpu } from 'lucide-react';
import { Recommendation } from '../types';

interface RecommendationResultsProps {
  recommendations: Recommendation[];
  onReset: () => void;
}

const RecommendationResults: React.FC<RecommendationResultsProps> = ({ 
  recommendations, 
  onReset 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'financials' | 'workforce' | 'stories' | 'mentors' | 'algorithm'>('overview');

  const handleContactClick = (type: string, value: string) => {
    switch (type) {
      case 'email':
        window.open(`mailto:${value}`, '_blank');
        break;
      case 'phone':
        window.open(`tel:${value}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${value.replace(/[^0-9]/g, '')}`, '_blank');
        break;
      case 'linkedin':
        window.open(value, '_blank');
        break;
      default:
        break;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

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
        
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI-Powered Business Recommendations
          </h2>
          <div className="flex items-center justify-center space-x-2 mt-2 text-sm text-gray-600">
            <Brain className="h-4 w-4 text-purple-600" />
            <span>Machine Learning Algorithm</span>
          </div>
        </div>
        
        <div className="w-24"></div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-1 flex flex-wrap justify-center">
          {[
            { key: 'overview', label: 'Overview', icon: Target },
            { key: 'algorithm', label: 'AI Insights', icon: Brain },
            { key: 'stories', label: 'Success Stories', icon: Award },
            { key: 'mentors', label: 'Expert Mentors', icon: User },
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
                      <Brain className="h-4 w-4" />
                      <span>{recommendation.confidenceScore}% AI Match</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Briefcase className="h-4 w-4" />
                      <span className="capitalize">{recommendation.businessType}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-purple-100 text-sm">ML Confidence</div>
                  <div className="text-white text-xl font-bold">
                    {recommendation.confidenceScore}%
                  </div>
                  {recommendation.mlScore && (
                    <div className="text-purple-200 text-xs">
                      Score: {(recommendation.mlScore * 100).toFixed(1)}
                    </div>
                  )}
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
                      <p className="text-sm text-gray-600">AI Confidence Match</p>
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
                    <h5 className="font-medium text-gray-800 mb-2">Data Sources & AI Transparency</h5>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.dataSources.map((source, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 border">
                          {source}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      * These AI-powered recommendations are guidance-based and not guaranteed results. Success depends on various factors including market conditions and execution.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'algorithm' && (
                <div className="space-y-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Brain className="h-5 w-5 text-purple-600 mr-2" />
                    AI Algorithm Insights for {recommendation.name}
                  </h4>

                  {/* Algorithm Overview */}
                  {recommendation.algorithmInfo && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                      <h5 className="font-medium text-gray-800 mb-4 flex items-center">
                        <Cpu className="h-5 w-5 text-purple-600 mr-2" />
                        Machine Learning Model Details
                      </h5>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-purple-300">
                          <h6 className="font-medium text-purple-800 mb-2">Model Type</h6>
                          <p className="text-gray-700">{recommendation.algorithmInfo.model}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-purple-300">
                          <h6 className="font-medium text-purple-800 mb-2">Training Data</h6>
                          <p className="text-gray-700">{recommendation.algorithmInfo.trainingData}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 bg-white rounded-lg p-4 border border-purple-300">
                        <h6 className="font-medium text-purple-800 mb-2">Feature Engineering</h6>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {recommendation.algorithmInfo.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Confidence Score Breakdown */}
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h5 className="font-medium text-gray-800 mb-4 flex items-center">
                      <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                      Confidence Score Breakdown
                    </h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Skill Matching (TF-IDF)</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{width: `${Math.min(100, recommendation.confidenceScore * 0.4)}%`}}></div>
                          </div>
                          <span className="text-sm font-medium">{Math.round(recommendation.confidenceScore * 0.4)}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Experience Level Match</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{width: `${Math.min(100, recommendation.confidenceScore * 0.25)}%`}}></div>
                          </div>
                          <span className="text-sm font-medium">{Math.round(recommendation.confidenceScore * 0.25)}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Location Suitability</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{width: `${Math.min(100, recommendation.confidenceScore * 0.2)}%`}}></div>
                          </div>
                          <span className="text-sm font-medium">{Math.round(recommendation.confidenceScore * 0.2)}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Business Type Alignment</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{width: `${Math.min(100, recommendation.confidenceScore * 0.15)}%`}}></div>
                          </div>
                          <span className="text-sm font-medium">{Math.round(recommendation.confidenceScore * 0.15)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ML Score Details */}
                  {recommendation.mlScore && (
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <h5 className="font-medium text-gray-800 mb-3">Raw ML Prediction Score</h5>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" 
                              style={{width: `${recommendation.mlScore * 100}%`}}
                            ></div>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                          {(recommendation.mlScore * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        This raw score from the Random Forest model indicates the predicted success probability before business-specific adjustments.
                      </p>
                    </div>
                  )}

                  {/* Algorithm Explanation */}
                  <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                    <h5 className="font-medium text-gray-800 mb-3">How the AI Works</h5>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <p><strong>Skill Analysis:</strong> Uses TF-IDF vectorization to analyze skill similarity between your profile and successful business owners.</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <p><strong>Pattern Recognition:</strong> Random Forest algorithm identifies patterns from 1000+ training samples of successful entrepreneurs.</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <p><strong>Multi-Factor Scoring:</strong> Combines skill matching, experience level, location preferences, and business type alignment.</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <p><strong>Confidence Calibration:</strong> Applies business-specific adjustments and market factors to generate final recommendations.</p>
                      </div>
                    </div>
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

              {activeTab === 'mentors' && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="h-5 w-5 text-purple-600 mr-2" />
                    Expert Mentors for {recommendation.name}
                  </h4>
                  <div className="space-y-6">
                    {recommendation.mentors.map((mentor, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Mentor Profile */}
                          <div className="flex-shrink-0">
                            <img
                              src={mentor.profilePic}
                              alt={mentor.name}
                              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                          </div>
                          
                          {/* Mentor Details */}
                          <div className="flex-1 space-y-4">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <h5 className="text-xl font-bold text-gray-800">{mentor.name}</h5>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="flex">{renderStars(mentor.rating)}</div>
                                  <span className="text-sm text-gray-600">({mentor.rating}/5)</span>
                                  <span className="text-sm text-gray-500">• {mentor.totalMentees} mentees</span>
                                </div>
                              </div>
                              <div className="mt-2 sm:mt-0">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  mentor.businessType === 'goods' ? 'bg-blue-100 text-blue-800' :
                                  mentor.businessType === 'service' ? 'bg-green-100 text-green-800' :
                                  'bg-purple-100 text-purple-800'
                                }`}>
                                  {mentor.businessType === 'both' ? 'Goods & Service' : mentor.businessType.charAt(0).toUpperCase() + mentor.businessType.slice(1)} Expert
                                </span>
                              </div>
                            </div>

                            {/* Bio */}
                            <p className="text-gray-700 leading-relaxed">{mentor.bio}</p>

                            {/* Specializations */}
                            <div>
                              <h6 className="font-medium text-gray-800 mb-2">Specializations:</h6>
                              <div className="flex flex-wrap gap-2">
                                {mentor.specialization.map((spec, specIdx) => (
                                  <span key={specIdx} className="px-3 py-1 bg-white rounded-full text-sm text-purple-700 border border-purple-200">
                                    {spec}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Contact & Availability */}
                            <div className="grid md:grid-cols-2 gap-4">
                              {/* Contact Information */}
                              <div className="bg-white rounded-lg p-4 border border-purple-200">
                                <h6 className="font-medium text-gray-800 mb-3">Contact Information</h6>
                                <div className="space-y-2">
                                  <button
                                    onClick={() => handleContactClick('email', mentor.contact.email)}
                                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-purple-600 transition-colors w-full text-left"
                                  >
                                    <Mail className="h-4 w-4" />
                                    <span>{mentor.contact.email}</span>
                                  </button>
                                  <button
                                    onClick={() => handleContactClick('phone', mentor.contact.phone)}
                                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-purple-600 transition-colors w-full text-left"
                                  >
                                    <Phone className="h-4 w-4" />
                                    <span>{mentor.contact.phone}</span>
                                  </button>
                                  {mentor.contact.whatsapp && (
                                    <button
                                      onClick={() => handleContactClick('whatsapp', mentor.contact.whatsapp)}
                                      className="flex items-center space-x-2 text-sm text-gray-600 hover:text-green-600 transition-colors w-full text-left"
                                    >
                                      <MessageCircle className="h-4 w-4" />
                                      <span>WhatsApp</span>
                                    </button>
                                  )}
                                  {mentor.contact.linkedin && (
                                    <button
                                      onClick={() => handleContactClick('linkedin', mentor.contact.linkedin)}
                                      className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors w-full text-left"
                                    >
                                      <Linkedin className="h-4 w-4" />
                                      <span>LinkedIn Profile</span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Availability & Fees */}
                              <div className="bg-white rounded-lg p-4 border border-purple-200">
                                <h6 className="font-medium text-gray-800 mb-3">Availability & Fees</h6>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <Globe className="h-4 w-4 text-gray-500" />
                                    <span className="capitalize">{mentor.availability.mode}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span>{mentor.address.city}, {mentor.address.state}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span>{mentor.availability.timings.join(', ')}</span>
                                  </div>
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="text-xs text-gray-600 mb-1">Consultation Fees:</div>
                                    <div className="font-medium text-purple-600">{mentor.fees.consultation}</div>
                                    <div className="text-xs text-gray-600 mt-1">Monthly: {mentor.fees.monthly}</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Achievements */}
                            <div className="bg-white rounded-lg p-4 border border-purple-200">
                              <h6 className="font-medium text-gray-800 mb-2">Key Achievements</h6>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {mentor.achievements.map((achievement, achIdx) => (
                                  <div key={achIdx} className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{achievement}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Testimonials */}
                            {mentor.testimonials.length > 0 && (
                              <div className="bg-white rounded-lg p-4 border border-purple-200">
                                <h6 className="font-medium text-gray-800 mb-3">What Mentees Say</h6>
                                <div className="space-y-3">
                                  {mentor.testimonials.map((testimonial, testIdx) => (
                                    <div key={testIdx} className="bg-gray-50 rounded-lg p-3">
                                      <div className="flex items-center justify-between mb-2">
                                        <div>
                                          <span className="font-medium text-sm text-gray-800">{testimonial.name}</span>
                                          <span className="text-xs text-gray-600 ml-2">• {testimonial.business}</span>
                                        </div>
                                        <div className="flex">{renderStars(testimonial.rating)}</div>
                                      </div>
                                      <p className="text-sm text-gray-700 italic">"{testimonial.feedback}"</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 pt-4">
                              <button
                                onClick={() => handleContactClick('email', mentor.contact.email)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                              >
                                <Mail className="h-4 w-4" />
                                <span>Send Email</span>
                              </button>
                              <button
                                onClick={() => handleContactClick('phone', mentor.contact.phone)}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <Phone className="h-4 w-4" />
                                <span>Call Now</span>
                              </button>
                              {mentor.contact.whatsapp && (
                                <button
                                  onClick={() => handleContactClick('whatsapp', mentor.contact.whatsapp)}
                                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  <span>WhatsApp</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {recommendation.mentors.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>No mentors available for this business type at the moment.</p>
                        <p className="text-sm mt-2">Check back later or contact us for mentor recommendations.</p>
                      </div>
                    )}
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
          Get New AI Recommendations
        </button>
      </div>
    </div>
  );
};

export default RecommendationResults;