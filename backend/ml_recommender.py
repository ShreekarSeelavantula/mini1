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
        self.skill_vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.business_features = None
        self.trained = False
        
        # Load training data
        self.load_training_data()
        self.train_model()
    
    def load_training_data(self):
        """Load and prepare training data from business profiles and synthetic user data"""
        
        # Business profiles with detailed features
        business_data = {
            'tailoring': {
                'skills': ['sewing', 'fashion', 'design', 'alterations', 'embroidery', 'pattern making'],
                'location_preference': [0.8, 1.0, 0.9],  # urban, semi-urban, rural
                'investment_level': 'low',
                'experience_weight': [0.5, 0.7, 0.9, 1.2],  # none, beginner, intermediate, expert
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],  # none, 10th, 12th, graduate, pg
                'business_type': 'goods',
                'profit_potential': 0.35,
                'market_demand': 0.8,
                'scalability': 0.7,
                'competition_level': 0.6
            },
            'cooking': {
                'skills': ['cooking', 'food preparation', 'nutrition', 'catering', 'baking', 'recipe development'],
                'location_preference': [1.0, 0.9, 0.7],
                'investment_level': 'low',
                'experience_weight': [0.5, 0.7, 0.9, 1.2],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'business_type': 'goods',
                'profit_potential': 0.4,
                'market_demand': 0.9,
                'scalability': 0.8,
                'competition_level': 0.7
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
        
        self.business_data = business_data
        
        # Generate synthetic training data
        self.generate_training_data()
    
    def generate_training_data(self):
        """Generate synthetic training data for ML model"""
        training_samples = []
        
        # Generate positive samples (successful matches)
        for business_id, business_info in self.business_data.items():
            for _ in range(50):  # 50 positive samples per business
                sample = self.generate_positive_sample(business_id, business_info)
                training_samples.append(sample)
        
        # Generate negative samples (poor matches)
        for business_id, business_info in self.business_data.items():
            for _ in range(20):  # 20 negative samples per business
                sample = self.generate_negative_sample(business_id, business_info)
                training_samples.append(sample)
        
        self.training_data = pd.DataFrame(training_samples)
    
    def generate_positive_sample(self, business_id, business_info):
        """Generate a positive training sample"""
        # Select skills that match the business
        relevant_skills = np.random.choice(business_info['skills'], 
                                         size=np.random.randint(1, 4), 
                                         replace=False).tolist()
        
        # Add some random skills
        all_skills = ['sewing', 'cooking', 'art', 'teaching', 'beauty', 'technology', 
                     'communication', 'management', 'sales', 'writing', 'photography']
        additional_skills = np.random.choice([s for s in all_skills if s not in relevant_skills],
                                           size=np.random.randint(0, 2),
                                           replace=False).tolist()
        
        skills = relevant_skills + additional_skills
        
        # Generate other features with bias towards success
        experience_levels = ['none', 'beginner', 'intermediate', 'expert']
        experience = np.random.choice(experience_levels, p=[0.1, 0.3, 0.4, 0.2])
        
        locations = ['urban', 'semi-urban', 'rural']
        location_probs = np.array(business_info['location_preference'])
        location_probs = location_probs / location_probs.sum()
        location = np.random.choice(locations, p=location_probs)
        
        education_levels = ['none', '10th', '12th', 'graduate', 'pg']
        education = np.random.choice(education_levels, p=[0.1, 0.15, 0.3, 0.35, 0.1])
        
        business_type = business_info['business_type']
        if business_type == 'both':
            business_type = np.random.choice(['goods', 'service'])
        
        work_environment = np.random.choice(['solo', 'team'], p=[0.6, 0.4])
        
        return {
            'skills': ' '.join(skills),
            'experience': experience,
            'location': location,
            'education': education,
            'business_type': business_type,
            'work_environment': work_environment,
            'target_business': business_id,
            'success_score': np.random.uniform(0.7, 1.0)  # High success for positive samples
        }
    
    def generate_negative_sample(self, business_id, business_info):
        """Generate a negative training sample"""
        # Select skills that don't match well
        all_skills = ['sewing', 'cooking', 'art', 'teaching', 'beauty', 'technology', 
                     'communication', 'management', 'sales', 'writing', 'photography']
        
        # Avoid business-relevant skills
        irrelevant_skills = [s for s in all_skills if s not in business_info['skills']]
        skills = np.random.choice(irrelevant_skills, 
                                size=np.random.randint(1, 3), 
                                replace=False).tolist()
        
        # Generate other features with bias towards poor match
        experience_levels = ['none', 'beginner', 'intermediate', 'expert']
        experience = np.random.choice(experience_levels, p=[0.4, 0.3, 0.2, 0.1])
        
        locations = ['urban', 'semi-urban', 'rural']
        # Invert location preferences for negative samples
        location_probs = 1 - np.array(business_info['location_preference'])
        location_probs = location_probs / location_probs.sum()
        location = np.random.choice(locations, p=location_probs)
        
        education_levels = ['none', '10th', '12th', 'graduate', 'pg']
        education = np.random.choice(education_levels, p=[0.3, 0.25, 0.25, 0.15, 0.05])
        
        # Mismatched business type
        if business_info['business_type'] == 'goods':
            business_type = 'service'
        elif business_info['business_type'] == 'service':
            business_type = 'goods'
        else:
            business_type = np.random.choice(['goods', 'service'])
        
        work_environment = np.random.choice(['solo', 'team'])
        
        return {
            'skills': ' '.join(skills),
            'experience': experience,
            'location': location,
            'education': education,
            'business_type': business_type,
            'work_environment': work_environment,
            'target_business': business_id,
            'success_score': np.random.uniform(0.0, 0.4)  # Low success for negative samples
        }
    
    def prepare_features(self, data):
        """Prepare features for ML model"""
        features = []
        
        for _, row in data.iterrows():
            # Skill similarity features
            skills_text = row['skills']
            
            # Categorical features
            experience_map = {'none': 0, 'beginner': 1, 'intermediate': 2, 'expert': 3}
            location_map = {'urban': 0, 'semi-urban': 1, 'rural': 2}
            education_map = {'none': 0, '10th': 1, '12th': 2, 'graduate': 3, 'pg': 4}
            business_type_map = {'goods': 0, 'service': 1}
            work_env_map = {'solo': 0, 'team': 1}
            
            feature_vector = [
                experience_map.get(row['experience'], 0),
                location_map.get(row['location'], 0),
                education_map.get(row['education'], 0),
                business_type_map.get(row['business_type'], 0),
                work_env_map.get(row['work_environment'], 0)
            ]
            
            features.append(feature_vector + [skills_text])
        
        return features
    
    def train_model(self):
        """Train the ML model"""
        # Prepare features
        features = self.prepare_features(self.training_data)
        
        # Separate skill text and numerical features
        skill_texts = [f[-1] for f in features]
        numerical_features = [f[:-1] for f in features]
        
        # Vectorize skills
        skill_vectors = self.skill_vectorizer.fit_transform(skill_texts).toarray()
        
        # Combine all features
        X = np.hstack([numerical_features, skill_vectors])
        y = self.training_data['success_score'].values
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.rf_model.fit(X_scaled, y)
        self.trained = True
        
        print(f"Model trained on {len(X)} samples with {X.shape[1]} features")
    
    def predict_business_scores(self, user_input):
        """Predict scores for all businesses given user input"""
        if not self.trained:
            raise ValueError("Model not trained yet")
        
        scores = {}
        
        for business_id in self.business_data.keys():
            # Create feature vector for this user-business combination
            skills_text = ' '.join(user_input['skills'])
            
            experience_map = {'none': 0, 'beginner': 1, 'intermediate': 2, 'expert': 3}
            location_map = {'urban': 0, 'semi-urban': 1, 'rural': 2}
            education_map = {'none': 0, '10th': 1, '12th': 2, 'graduate': 3, 'pg': 4}
            business_type_map = {'goods': 0, 'service': 1}
            work_env_map = {'solo': 0, 'team': 1}
            
            feature_vector = [
                experience_map.get(user_input['experience'].lower(), 0),
                location_map.get(user_input['location'].lower(), 0),
                education_map.get(user_input['education'].lower(), 0),
                business_type_map.get(user_input['businessType'], 0),
                work_env_map.get(user_input['workEnvironment'], 0)
            ]
            
            # Vectorize skills
            skill_vector = self.skill_vectorizer.transform([skills_text]).toarray()[0]
            
            # Combine features
            X = np.array([feature_vector + skill_vector.tolist()])
            X_scaled = self.scaler.transform(X)
            
            # Predict score
            score = self.rf_model.predict(X_scaled)[0]
            
            # Apply business-specific adjustments
            business_info = self.business_data[business_id]
            
            # Business type matching bonus
            if user_input['businessType'] == business_info['business_type'] or business_info['business_type'] == 'both':
                score *= 1.2
            
            # Location preference adjustment
            location_idx = ['urban', 'semi-urban', 'rural'].index(user_input['location'].lower())
            location_bonus = business_info['location_preference'][location_idx]
            score *= location_bonus
            
            # Experience level adjustment
            exp_idx = ['none', 'beginner', 'intermediate', 'expert'].index(user_input['experience'].lower())
            exp_bonus = business_info['experience_weight'][exp_idx]
            score *= exp_bonus
            
            # Education bonus
            edu_idx = ['none', '10th', '12th', 'graduate', 'pg'].index(user_input['education'].lower())
            edu_bonus = 1 + business_info['education_bonus'][edu_idx]
            score *= edu_bonus
            
            # Skill matching bonus using cosine similarity
            user_skills_lower = [s.lower() for s in user_input['skills']]
            business_skills_lower = [s.lower() for s in business_info['skills']]
            
            skill_matches = len(set(user_skills_lower) & set(business_skills_lower))
            skill_bonus = 1 + (skill_matches * 0.1)
            score *= skill_bonus
            
            # Normalize score to 0-1 range
            score = max(0, min(1, score))
            
            scores[business_id] = score
        
        return scores
    
    def get_recommendations(self, user_input, top_k=5):
        """Get top-k business recommendations"""
        scores = self.predict_business_scores(user_input)
        
        # Sort by score
        sorted_businesses = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        
        # Filter by business type if specified
        if user_input.get('businessType'):
            filtered_businesses = []
            for business_id, score in sorted_businesses:
                business_type = self.business_data[business_id]['business_type']
                if (business_type == user_input['businessType'] or 
                    business_type == 'both'):
                    filtered_businesses.append((business_id, score))
            sorted_businesses = filtered_businesses
        
        # Return top-k
        top_businesses = sorted_businesses[:top_k]
        
        # Convert scores to confidence percentages
        recommendations = []
        for business_id, score in top_businesses:
            confidence = min(95, max(65, int(score * 100)))
            recommendations.append({
                'business_id': business_id,
                'confidence_score': confidence,
                'ml_score': score
            })
        
        return recommendations

# Initialize the ML recommender
ml_recommender = MLBusinessRecommender()