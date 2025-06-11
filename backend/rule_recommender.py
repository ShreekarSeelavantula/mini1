import json
import os

class BusinessRecommender:
    def __init__(self):
        # Load business data
        self.business_matrix = {
            'tailoring': {
                'type': 'goods',
                'skills': ['sewing', 'fashion', 'design', 'alterations', 'embroidery', 'pattern making', 'stitching', 'garment making'],
                'location_preference': [0.8, 1.0, 0.9],  # urban, semi-urban, rural
                'experience_weight': [0.5, 0.7, 0.9, 1.2],  # none, beginner, intermediate, expert
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],  # none, 10th, 12th, graduate, pg
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
                'type': 'goods',
                'skills': ['art', 'craft', 'creativity', 'handmade', 'traditional arts', 'pottery', 'woodwork', 'art & craft'],
                'location_preference': [0.7, 1.0, 1.0],
                'experience_weight': [0.4, 0.6, 0.8, 1.1],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'investment_level': 'low'
            },
            'tutoring': {
                'type': 'service',
                'skills': ['teaching', 'education', 'communication', 'subject expertise', 'mentoring', 'training', 'academic'],
                'location_preference': [1.0, 0.9, 0.8],
                'experience_weight': [0.3, 0.6, 0.9, 1.3],
                'education_bonus': [0.0, 0.2, 0.4, 0.8, 1.2],
                'investment_level': 'very_low'
            },
            'beauty_services': {
                'type': 'service',
                'skills': ['beauty', 'makeup', 'hair styling', 'skincare', 'aesthetics', 'customer service', 'beauty & makeup'],
                'location_preference': [1.0, 0.8, 0.6],
                'experience_weight': [0.4, 0.7, 0.9, 1.2],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'investment_level': 'medium'
            },
            'online_business': {
                'type': 'both',
                'skills': ['technology', 'digital marketing', 'e-commerce', 'social media', 'content creation', 'analytics', 'online'],
                'location_preference': [1.0, 0.9, 0.8],
                'experience_weight': [0.3, 0.6, 0.9, 1.2],
                'education_bonus': [0.0, 0.2, 0.4, 0.8, 1.0],
                'investment_level': 'low'
            },
            'food_business': {
                'type': 'goods',
                'skills': ['cooking', 'food service', 'restaurant management', 'customer service', 'hygiene', 'menu planning', 'culinary'],
                'location_preference': [0.9, 1.0, 0.8],
                'experience_weight': [0.4, 0.7, 0.9, 1.2],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'investment_level': 'medium'
            },
            'boutique': {
                'type': 'goods',
                'skills': ['fashion', 'retail', 'customer service', 'visual merchandising', 'trend analysis', 'sales', 'clothing'],
                'location_preference': [1.0, 0.8, 0.6],
                'experience_weight': [0.3, 0.6, 0.8, 1.1],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'investment_level': 'high'
            },
            'daycare': {
                'type': 'service',
                'skills': ['childcare', 'education', 'patience', 'communication', 'safety management', 'activity planning', 'teaching'],
                'location_preference': [1.0, 0.9, 0.7],
                'experience_weight': [0.4, 0.7, 0.9, 1.2],
                'education_bonus': [0.0, 0.2, 0.4, 0.8, 1.0],
                'investment_level': 'medium'
            },
            'event_planning': {
                'type': 'service',
                'skills': ['organization', 'communication', 'creativity', 'vendor management', 'time management', 'coordination', 'planning'],
                'location_preference': [1.0, 0.7, 0.5],
                'experience_weight': [0.3, 0.6, 0.8, 1.1],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'investment_level': 'medium'
            },
            'jewelry_making': {
                'type': 'goods',
                'skills': ['jewelry design', 'metalwork', 'creativity', 'precision', 'art', 'craftsmanship', 'jewelry making'],
                'location_preference': [0.9, 1.0, 0.8],
                'experience_weight': [0.4, 0.7, 0.9, 1.2],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'investment_level': 'medium'
            },
            'photography': {
                'type': 'service',
                'skills': ['photography', 'creativity', 'technical skills', 'editing', 'customer service', 'marketing', 'camera'],
                'location_preference': [1.0, 0.8, 0.6],
                'experience_weight': [0.3, 0.6, 0.9, 1.2],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'investment_level': 'medium'
            },
            'catering': {
                'type': 'service',
                'skills': ['cooking', 'event management', 'food service', 'logistics', 'customer service', 'time management', 'catering'],
                'location_preference': [1.0, 0.9, 0.7],
                'experience_weight': [0.4, 0.7, 0.9, 1.2],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'investment_level': 'medium'
            },
            'home_bakery': {
                'type': 'goods',
                'skills': ['baking', 'decoration', 'creativity', 'food safety', 'customer service', 'time management', 'cooking'],
                'location_preference': [0.9, 1.0, 0.8],
                'experience_weight': [0.4, 0.7, 0.9, 1.2],
                'education_bonus': [0.0, 0.1, 0.2, 0.4, 0.6],
                'investment_level': 'low'
            },
            'consulting': {
                'type': 'service',
                'skills': ['expertise', 'communication', 'analysis', 'problem solving', 'business knowledge', 'mentoring', 'management'],
                'location_preference': [1.0, 0.7, 0.5],
                'experience_weight': [0.2, 0.5, 0.8, 1.3],
                'education_bonus': [0.0, 0.2, 0.4, 0.8, 1.2],
                'investment_level': 'very_low'
            }
        }

    def calculate_score(self, user_input, business_id):
        business = self.business_matrix[business_id]
        
        # Initialize weighted components
        weighted_components = {
            'skills': 0.0,
            'business_type': 0.0,
            'location': 0.0,
            'experience': 0.0,
            'education': 0.0
        }
        
        # Skill matching (40% weight)
        user_skills_lower = [s.lower().strip() for s in user_input['skills']]
        business_skills_lower = [s.lower().strip() for s in business['skills']]
        
        # Calculate skill matches with variations
        skill_matches = 0
        for user_skill in user_skills_lower:
            # Check for exact matches first
            if user_skill in business_skills_lower:
                skill_matches += 1
            else:
                # Check for partial matches only if no exact match
                for business_skill in business_skills_lower:
                    if user_skill in business_skill or business_skill in user_skill:
                        skill_matches += 0.3  # Reduced weight for partial matches
                        break
        
        # Calculate skill ratio
        total_skills = len(user_skills_lower)
        skill_ratio = skill_matches / total_skills if total_skills > 0 else 0
        weighted_components['skills'] = skill_ratio * 0.4  # Increased weight for skills
        
        # Business type matching (20% weight)
        if not user_input.get('businessType') or business['type'] == user_input['businessType'] or business['type'] == 'both':
            weighted_components['business_type'] = 0.2
        
        # Location preference (20% weight)
        location_idx = {'urban': 0, 'semi-urban': 1, 'rural': 2}.get(user_input.get('location', '').lower(), 0)
        weighted_components['location'] = business['location_preference'][location_idx] * 0.2
        
        # Experience level (10% weight)
        exp_idx = {'none': 0, 'beginner': 1, 'intermediate': 2, 'expert': 3}.get(user_input.get('experience', '').lower(), 0)
        weighted_components['experience'] = business['experience_weight'][exp_idx] * 0.1
        
        # Education bonus (10% weight)
        edu_idx = {'none': 0, '10th': 1, '12th': 2, 'graduate': 3, 'pg': 4}.get(user_input.get('education', '').lower(), 0)
        weighted_components['education'] = business['education_bonus'][edu_idx] * 0.1
        
        # Calculate total score
        total_score = sum(weighted_components.values())
        return total_score

    def recommend(self, user_input, k=3, business_type=None):
        scores = {}
        for business_id in self.business_matrix:
            if business_type and self.business_matrix[business_id]['type'] != business_type:
                continue
                
            # Calculate base score
            score = self.calculate_score(user_input, business_id)
            
            # Get skill match ratio
            user_skills_lower = [s.lower().strip() for s in user_input['skills']]
            business_skills_lower = [s.lower().strip() for s in self.business_matrix[business_id]['skills']]
            
            # Calculate exact skill matches
            exact_matches = sum(1 for skill in user_skills_lower if skill in business_skills_lower)
            skill_ratio = exact_matches / len(user_skills_lower) if user_skills_lower else 0
            
            # Only include businesses with at least one exact skill match
            if exact_matches > 0:
                # Boost score for businesses with exact skill matches
                score = score * (1 + skill_ratio)
                scores[business_id] = score
        
        # Sort businesses by score in descending order
        sorted_businesses = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        return sorted_businesses[:k] 