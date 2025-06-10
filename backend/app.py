from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import json
import os

app = Flask(__name__)
CORS(app)

# Load static data
def load_json_data(filename):
    try:
        with open(filename, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

resources_data = load_json_data('resources.json')
financials_data = load_json_data('financials.json')
case_studies_data = load_json_data('case_studies.json')
workforce_data = load_json_data('workforce.json')

class BusinessRecommender:
    def __init__(self):
        self.business_matrix = {
            # Skill-based business mapping with scoring
            'tailoring': {'weight': 1.0, 'location_bonus': {'urban': 0.8, 'semi-urban': 1.0, 'rural': 0.9}, 'type': 'service'},
            'cooking': {'weight': 0.9, 'location_bonus': {'urban': 1.0, 'semi-urban': 0.9, 'rural': 0.7}, 'type': 'goods'},
            'handicrafts': {'weight': 0.8, 'location_bonus': {'urban': 0.7, 'semi-urban': 1.0, 'rural': 1.0}, 'type': 'goods'},
            'tutoring': {'weight': 1.0, 'location_bonus': {'urban': 1.0, 'semi-urban': 0.9, 'rural': 0.8}, 'type': 'service'},
            'beauty_services': {'weight': 0.9, 'location_bonus': {'urban': 1.0, 'semi-urban': 0.8, 'rural': 0.6}, 'type': 'service'},
            'online_business': {'weight': 0.7, 'location_bonus': {'urban': 1.0, 'semi-urban': 0.9, 'rural': 0.8}, 'type': 'service'},
            'food_business': {'weight': 0.8, 'location_bonus': {'urban': 0.9, 'semi-urban': 1.0, 'rural': 0.8}, 'type': 'goods'},
            'boutique': {'weight': 0.9, 'location_bonus': {'urban': 1.0, 'semi-urban': 0.8, 'rural': 0.6}, 'type': 'goods'},
            'daycare': {'weight': 0.8, 'location_bonus': {'urban': 1.0, 'semi-urban': 0.9, 'rural': 0.7}, 'type': 'service'},
            'event_planning': {'weight': 0.7, 'location_bonus': {'urban': 1.0, 'semi-urban': 0.7, 'rural': 0.5}, 'type': 'service'},
            'jewelry_making': {'weight': 0.8, 'location_bonus': {'urban': 0.9, 'semi-urban': 1.0, 'rural': 0.8}, 'type': 'goods'},
            'photography': {'weight': 0.7, 'location_bonus': {'urban': 1.0, 'semi-urban': 0.8, 'rural': 0.6}, 'type': 'service'},
            'catering': {'weight': 0.9, 'location_bonus': {'urban': 1.0, 'semi-urban': 0.9, 'rural': 0.7}, 'type': 'service'},
            'home_bakery': {'weight': 0.8, 'location_bonus': {'urban': 0.9, 'semi-urban': 1.0, 'rural': 0.8}, 'type': 'goods'},
            'consulting': {'weight': 0.6, 'location_bonus': {'urban': 1.0, 'semi-urban': 0.7, 'rural': 0.5}, 'type': 'service'}
        }
        
    def recommend(self, skills, experience, location, education, business_type, work_environment):
        recommendations = {}
        
        # Experience multiplier
        exp_multiplier = {
            'none': 0.5,
            'beginner': 0.7,
            'intermediate': 0.9,
            'expert': 1.2
        }.get(experience.lower(), 0.7)
        
        # Education bonus
        edu_bonus = {
            'none': 0.0,
            '10th': 0.1,
            '12th': 0.2,
            'graduate': 0.4,
            'pg': 0.6
        }.get(education.lower(), 0.2)
        
        # Work environment bonus
        work_bonus = 1.1 if work_environment == 'team' else 1.0
        
        # Skill to business mapping
        skill_business_map = {
            'sewing': ['tailoring', 'boutique'],
            'cooking': ['cooking', 'food_business', 'catering', 'home_bakery'],
            'art': ['handicrafts', 'jewelry_making'],
            'teaching': ['tutoring', 'consulting'],
            'beauty': ['beauty_services'],
            'technology': ['online_business', 'consulting'],
            'communication': ['tutoring', 'event_planning', 'consulting'],
            'management': ['daycare', 'event_planning', 'consulting'],
            'craft': ['handicrafts', 'jewelry_making'],
            'sales': ['boutique', 'online_business'],
            'photography': ['photography', 'event_planning'],
            'jewelry': ['jewelry_making'],
            'writing': ['online_business', 'consulting'],
            'marketing': ['online_business', 'consulting', 'event_planning'],
            'accounting': ['consulting'],
            'customer service': ['beauty_services', 'tutoring'],
            'event planning': ['event_planning'],
            'music': ['tutoring'],
            'dancing': ['tutoring'],
            'embroidery': ['handicrafts', 'boutique']
        }
        
        # Calculate scores for each business
        for skill in skills:
            skill_lower = skill.lower()
            for skill_key, businesses in skill_business_map.items():
                if skill_key in skill_lower or skill_lower in skill_key:
                    for business in businesses:
                        if business in self.business_matrix:
                            # Filter by business type preference
                            if business_type and self.business_matrix[business]['type'] != business_type:
                                continue
                                
                            base_score = self.business_matrix[business]['weight']
                            location_bonus = self.business_matrix[business]['location_bonus'].get(location.lower(), 0.7)
                            
                            total_score = base_score * exp_multiplier * location_bonus * (1 + edu_bonus) * work_bonus
                            
                            if business not in recommendations:
                                recommendations[business] = 0
                            recommendations[business] += total_score
        
        # Add default recommendations if no matches
        if not recommendations:
            default_businesses = ['tailoring', 'cooking', 'handicrafts', 'tutoring', 'beauty_services']
            if business_type:
                default_businesses = [b for b in default_businesses if self.business_matrix[b]['type'] == business_type]
            
            for business in default_businesses[:3]:
                recommendations[business] = 0.6
        
        # Sort and return top 5
        sorted_recommendations = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)
        return [business for business, score in sorted_recommendations[:5]]

recommender = BusinessRecommender()

@app.route('/api/recommend', methods=['POST'])
def get_recommendations():
    try:
        data = request.json
        skills = data.get('skills', [])
        experience = data.get('experience', 'beginner')
        location = data.get('location', 'urban')
        education = data.get('education', '12th')
        business_type = data.get('businessType', '')
        work_environment = data.get('workEnvironment', 'solo')
        
        recommendations = recommender.recommend(skills, experience, location, education, business_type, work_environment)
        
        # Prepare response with all data
        response = []
        for business in recommendations:
            # Calculate confidence score based on various factors
            confidence_score = min(95, max(65, 
                75 + (len([s for s in skills if any(s.lower() in skill_key for skill_key in ['sewing', 'cooking', 'art', 'teaching', 'beauty', 'technology', 'communication', 'management', 'craft', 'sales'])]) * 5) +
                ({'none': 0, 'beginner': 5, 'intermediate': 10, 'expert': 15}.get(experience.lower(), 5)) +
                ({'none': 0, '10th': 2, '12th': 4, 'graduate': 8, 'pg': 12}.get(education.lower(), 4))
            ))
            
            business_data = {
                'name': business.replace('_', ' ').title(),
                'id': business,
                'description': get_business_description(business),
                'businessType': recommender.business_matrix[business]['type'],
                'confidenceScore': confidence_score,
                'resources': resources_data.get(business, []),
                'financials': financials_data.get(business, {}),
                'caseStudies': case_studies_data.get(business, []),
                'workforcePlan': workforce_data.get(business, {}),
                'dataSources': ['NSDC Skills Database', 'MSME Success Stories', 'Government Schemes Data', 'Industry Reports']
            }
            response.append(business_data)
        
        return jsonify({
            'success': True,
            'recommendations': response
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def get_business_description(business_id):
    descriptions = {
        'tailoring': 'A tailoring business involves creating, altering, and repairing clothing items. This service-based business can range from basic alterations to custom clothing design, offering flexibility to work from home or establish a shop.',
        'cooking': 'A cooking business focuses on preparing and selling homemade food items. This can include tiffin services, catering for small events, or selling specialty food products in your local community.',
        'handicrafts': 'Handicrafts business involves creating handmade decorative or functional items using traditional or modern techniques. Products can include pottery, textiles, woodwork, or paper crafts sold online or at local markets.',
        'tutoring': 'Tutoring services provide personalized education support to students of various ages. This can be conducted in-person or online, covering academic subjects, skill development, or exam preparation.',
        'beauty_services': 'Beauty services encompass various personal care treatments including hair styling, makeup, skincare, and nail care. This business can operate from home, as a mobile service, or in a dedicated salon space.',
        'online_business': 'Online business leverages digital platforms to sell products or services. This includes e-commerce stores, digital marketing services, content creation, or online consulting across various industries.',
        'food_business': 'Food business involves commercial food preparation and sales, including restaurants, food trucks, packaged food products, or specialty food items with proper licensing and food safety compliance.',
        'boutique': 'A boutique business focuses on selling carefully curated fashion items, accessories, or specialty products. This retail business emphasizes unique, high-quality items with personalized customer service.',
        'daycare': 'Daycare services provide supervised care and early childhood education for young children. This business requires proper licensing, child safety measures, and educational programming.',
        'event_planning': 'Event planning involves organizing and coordinating various types of events including weddings, corporate functions, parties, and celebrations. This service requires strong organizational and communication skills.',
        'jewelry_making': 'Jewelry making business involves designing and creating handmade jewelry pieces using various materials and techniques. Products can be sold online, at craft fairs, or through retail partnerships.',
        'photography': 'Photography business offers professional photo services for events, portraits, commercial needs, or artistic projects. This requires technical skills, equipment investment, and marketing to build a client base.',
        'catering': 'Catering business provides food services for events, parties, and gatherings. This requires food safety certification, reliable transportation, and the ability to prepare large quantities of food.',
        'home_bakery': 'Home bakery business involves baking and selling baked goods from your home kitchen. This includes cakes, cookies, bread, and pastries for local customers and special occasions.',
        'consulting': 'Consulting business leverages your expertise to provide professional advice and solutions to businesses or individuals. This service-based business can operate in various fields including business, technology, or personal development.'
    }
    return descriptions.get(business_id, 'A promising business opportunity that matches your skills and preferences.')

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)