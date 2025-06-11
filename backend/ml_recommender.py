import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import json
import os

class MLBusinessRecommender:
    def __init__(self):
        self.model = None
        self.business_matrix = {
            'tailoring': {
                'type': 'goods',
                'skills': ['sewing', 'fashion', 'design', 'alterations', 'embroidery', 'pattern making', 'stitching', 'garment making'],
                'location_preference': [0.8, 1.0, 0.9],
                'experience_weight': [0.5, 0.7, 0.9, 1.2],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'investment_level': 'low'
            },
            'cooking': {
                'type': 'goods',
                'skills': ['cooking', 'food preparation', 'nutrition', 'catering', 'baking', 'recipe development', 'culinary', 'food service'],
                'location_preference': [1.0, 0.9, 0.7],
                'experience_weight': [0.5, 0.7, 0.9, 1.2],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'investment_level': 'low'
            },
            'handicrafts': {
                'skills': ['art', 'craft', 'creativity', 'handmade', 'traditional arts', 'pottery', 'woodwork'],
                'location_preference': [0.7, 1.0, 1.0],
                'investment_level': 'low',
                'experience_weight': [0.4, 0.6, 0.8, 1.1],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'business_type': 'goods',
                'profit_potential': 0.5,
                'market_demand': 0.6,
                'scalability': 0.6,
                'competition_level': 0.5
            },
            'tutoring': {
                'skills': ['teaching', 'education', 'communication', 'subject expertise', 'mentoring', 'training'],
                'location_preference': [1.0, 0.9, 0.8],
                'investment_level': 'very_low',
                'experience_weight': [0.3, 0.6, 0.9, 1.3],
                'education_bonus': [0.0, 0.2, 0.4, 0.8, 1.2],
                'business_type': 'service',
                'profit_potential': 0.7,
                'market_demand': 0.9,
                'scalability': 0.9,
                'competition_level': 0.8
            },
            'beauty_services': {
                'skills': ['beauty', 'makeup', 'hair styling', 'skincare', 'aesthetics', 'customer service'],
                'location_preference': [1.0, 0.8, 0.6],
                'investment_level': 'medium',
                'experience_weight': [0.4, 0.7, 0.9, 1.2],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'business_type': 'service',
                'profit_potential': 0.45,
                'market_demand': 0.8,
                'scalability': 0.7,
                'competition_level': 0.7
            },
            'online_business': {
                'skills': ['technology', 'digital marketing', 'e-commerce', 'social media', 'content creation', 'analytics'],
                'location_preference': [1.0, 0.9, 0.8],
                'investment_level': 'low',
                'experience_weight': [0.3, 0.6, 0.9, 1.2],
                'education_bonus': [0.0, 0.2, 0.4, 0.8, 1.0],
                'business_type': 'both',
                'profit_potential': 0.6,
                'market_demand': 0.95,
                'scalability': 0.95,
                'competition_level': 0.9
            },
            'food_business': {
                'skills': ['cooking', 'food service', 'restaurant management', 'customer service', 'hygiene', 'menu planning'],
                'location_preference': [0.9, 1.0, 0.8],
                'investment_level': 'medium',
                'experience_weight': [0.4, 0.7, 0.9, 1.2],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'business_type': 'goods',
                'profit_potential': 0.3,
                'market_demand': 0.85,
                'scalability': 0.8,
                'competition_level': 0.8
            },
            'boutique': {
                'skills': ['fashion', 'retail', 'customer service', 'visual merchandising', 'trend analysis', 'sales'],
                'location_preference': [1.0, 0.8, 0.6],
                'investment_level': 'high',
                'experience_weight': [0.3, 0.6, 0.8, 1.1],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'business_type': 'goods',
                'profit_potential': 0.25,
                'market_demand': 0.7,
                'scalability': 0.6,
                'competition_level': 0.8
            },
            'daycare': {
                'skills': ['childcare', 'education', 'patience', 'communication', 'safety management', 'activity planning'],
                'location_preference': [1.0, 0.9, 0.7],
                'investment_level': 'medium',
                'experience_weight': [0.4, 0.7, 0.9, 1.2],
                'education_bonus': [0.0, 0.2, 0.4, 0.8, 1.0],
                'business_type': 'service',
                'profit_potential': 0.35,
                'market_demand': 0.8,
                'scalability': 0.7,
                'competition_level': 0.6
            },
            'event_planning': {
                'skills': ['organization', 'communication', 'creativity', 'vendor management', 'time management', 'coordination'],
                'location_preference': [1.0, 0.7, 0.5],
                'investment_level': 'medium',
                'experience_weight': [0.3, 0.6, 0.8, 1.1],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'business_type': 'service',
                'profit_potential': 0.25,
                'market_demand': 0.7,
                'scalability': 0.8,
                'competition_level': 0.7
            },
            'jewelry_making': {
                'skills': ['jewelry design', 'metalwork', 'creativity', 'precision', 'art', 'craftsmanship'],
                'location_preference': [0.9, 1.0, 0.8],
                'investment_level': 'medium',
                'experience_weight': [0.4, 0.7, 0.9, 1.2],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'business_type': 'goods',
                'profit_potential': 0.55,
                'market_demand': 0.6,
                'scalability': 0.6,
                'competition_level': 0.5
            },
            'photography': {
                'skills': ['photography', 'creativity', 'technical skills', 'editing', 'customer service', 'marketing'],
                'location_preference': [1.0, 0.8, 0.6],
                'investment_level': 'medium',
                'experience_weight': [0.3, 0.6, 0.9, 1.2],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'business_type': 'service',
                'profit_potential': 0.5,
                'market_demand': 0.7,
                'scalability': 0.7,
                'competition_level': 0.8
            },
            'catering': {
                'skills': ['cooking', 'event management', 'food service', 'logistics', 'customer service', 'time management'],
                'location_preference': [1.0, 0.9, 0.7],
                'investment_level': 'medium',
                'experience_weight': [0.4, 0.7, 0.9, 1.2],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'business_type': 'service',
                'profit_potential': 0.28,
                'market_demand': 0.75,
                'scalability': 0.8,
                'competition_level': 0.7
            },
            'home_bakery': {
                'skills': ['baking', 'decoration', 'creativity', 'food safety', 'customer service', 'time management'],
                'location_preference': [0.9, 1.0, 0.8],
                'investment_level': 'low',
                'experience_weight': [0.4, 0.7, 0.9, 1.2],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'business_type': 'goods',
                'profit_potential': 0.45,
                'market_demand': 0.8,
                'scalability': 0.7,
                'competition_level': 0.6
            },
            'consulting': {
                'skills': ['expertise', 'communication', 'analysis', 'problem solving', 'business knowledge', 'mentoring'],
                'location_preference': [1.0, 0.7, 0.5],
                'investment_level': 'very_low',
                'experience_weight': [0.2, 0.5, 0.8, 1.3],
                'education_bonus': [0.0, 0.2, 0.4, 0.8, 1.2],
                'business_type': 'service',
                'profit_potential': 0.65,
                'market_demand': 0.6,
                'scalability': 0.9,
                'competition_level': 0.8
            }
        }

    def predict_business_scores(self, user_input):
        """Predict business scores using ML model and rule-based components"""
        scores = {}
        
        for business_id in self.business_matrix:
            # Check for exact skill matches first
            user_skills_lower = [s.lower().strip() for s in user_input['skills']]
            business_skills_lower = [s.lower().strip() for s in self.business_matrix[business_id]['skills']]
            
            # Calculate exact skill matches
            exact_matches = sum(1 for skill in user_skills_lower if skill in business_skills_lower)
            
            # Only proceed if there's at least one exact skill match
            if exact_matches > 0:
                weighted_components = {
                    'ml_prediction': 0.0,
                    'business_type': 0.0,
                    'location': 0.0,
                    'experience': 0.0,
                    'education': 0.0,
                    'skills': 0.0
                }
                
                # ML prediction (30% weight)
                features = self._prepare_features(user_input)
                ml_score = self._get_ml_predictions(features)
                weighted_components['ml_prediction'] = ml_score * 0.3
                
                # Business type matching (15% weight)
                if not user_input.get('businessType') or self.business_matrix[business_id]['type'] == user_input['businessType'] or self.business_matrix[business_id]['type'] == 'both':
                    weighted_components['business_type'] = 0.15
                
                # Location preference (15% weight)
                location_idx = {'urban': 0, 'semi-urban': 1, 'rural': 2}.get(user_input.get('location', '').lower(), 0)
                weighted_components['location'] = self.business_matrix[business_id]['location_preference'][location_idx] * 0.15
                
                # Experience level (10% weight)
                exp_idx = {'none': 0, 'beginner': 1, 'intermediate': 2, 'expert': 3}.get(user_input.get('experience', '').lower(), 0)
                exp_score = self.business_matrix[business_id]['experience_weight'][exp_idx]
                weighted_components['experience'] = exp_score * 0.1
                
                # Education bonus (10% weight)
                edu_idx = {'none': 0, '10th': 1, '12th': 2, 'graduate': 3, 'pg': 4}.get(user_input.get('education', '').lower(), 0)
                edu_score = self.business_matrix[business_id]['education_bonus'][edu_idx]
                weighted_components['education'] = edu_score * 0.1
                
                # Skill matching (20% weight)
                skill_ratio = exact_matches / len(user_skills_lower) if user_skills_lower else 0
                weighted_components['skills'] = skill_ratio * 0.2
                
                # Calculate total score
                total_score = sum(weighted_components.values())
                
                # Boost score based on number of exact skill matches
                total_score = total_score * (1 + skill_ratio)
                scores[business_id] = total_score
        
        return scores

    def _get_ml_predictions(self, user_input):
        """Get ML model predictions for businesses"""
        # If no model is loaded, return uniform predictions
        if self.model is None:
            return {business_id: 0.5 for business_id in self.business_matrix}
        
        # Convert user input to model features
        features = self._prepare_features(user_input)
        
        # Get predictions from model
        predictions = self.model.predict_proba([features])[0]
        
        # Map predictions to business IDs
        return {business_id: pred for business_id, pred in zip(self.business_matrix.keys(), predictions)}

    def _prepare_features(self, user_input):
        """Prepare user input features for ML model"""
        # Convert categorical features to numerical
        features = []
        
        # Location encoding
        location_map = {'urban': 0, 'semi-urban': 1, 'rural': 2}
        features.append(location_map[user_input['location'].lower()])
        
        # Experience encoding
        exp_map = {'none': 0, 'beginner': 1, 'intermediate': 2, 'expert': 3}
        features.append(exp_map[user_input['experience'].lower()])
        
        # Education encoding
        edu_map = {'none': 0, '10th': 1, '12th': 2, 'graduate': 3, 'pg': 4}
        features.append(edu_map[user_input['education'].lower()])
        
        # Business type encoding
        type_map = {'goods': 0, 'service': 1, 'both': 2}
        features.append(type_map.get(user_input.get('business_type', 'both'), 2))
        
        # Skill matching features
        all_skills = set()
        for business in self.business_matrix.values():
            all_skills.update(business['skills'])
        
        user_skills_lower = [s.lower().strip() for s in user_input['skills']]
        for skill in all_skills:
            skill_lower = skill.lower().strip()
            # Check for exact or partial matches
            match = any(
                user_skill in skill_lower or skill_lower in user_skill 
                for user_skill in user_skills_lower
            )
            features.append(1 if match else 0)
        
        return features

# Initialize the ML recommender
ml_recommender = MLBusinessRecommender()