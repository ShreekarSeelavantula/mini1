from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import json
import os
from ml_recommender import ml_recommender

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
mentors_data = load_json_data('mentors.json')

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
        
        # Prepare input for ML model
        user_input = {
            'skills': skills,
            'experience': experience,
            'location': location,
            'education': education,
            'businessType': business_type,
            'workEnvironment': work_environment
        }
        
        # Get ML-based recommendations
        ml_recommendations = ml_recommender.get_recommendations(user_input, top_k=5)
        
        # Prepare response with all data
        response = []
        for rec in ml_recommendations:
            business_id = rec['business_id']
            confidence_score = rec['confidence_score']
            
            # Get mentors for this business type
            business_mentors = mentors_data.get(business_id, [])
            # Filter mentors by business type preference
            if business_type:
                business_mentors = [m for m in business_mentors if m['businessType'] == business_type or m['businessType'] == 'both']
            
            business_data = {
                'name': business_id.replace('_', ' ').title(),
                'id': business_id,
                'description': get_business_description(business_id),
                'businessType': ml_recommender.business_data[business_id]['business_type'],
                'confidenceScore': confidence_score,
                'mlScore': rec['ml_score'],
                'resources': resources_data.get(business_id, []),
                'financials': financials_data.get(business_id, {}),
                'caseStudies': case_studies_data.get(business_id, []),
                'workforcePlan': workforce_data.get(business_id, {}),
                'mentors': business_mentors,
                'dataSources': ['ML Algorithm', 'NSDC Skills Database', 'MSME Success Stories', 'Government Schemes Data', 'Market Analysis'],
                'algorithmInfo': {
                    'model': 'Random Forest Classifier',
                    'features': ['Skill Matching (TF-IDF)', 'Experience Level', 'Location Preference', 'Education Level', 'Business Type Alignment'],
                    'trainingData': f'{len(ml_recommender.training_data)} samples',
                    'accuracy': 'Cross-validated on synthetic data'
                }
            }
            response.append(business_data)
        
        return jsonify({
            'success': True,
            'recommendations': response,
            'algorithm': 'Machine Learning (Random Forest + TF-IDF)',
            'modelInfo': {
                'type': 'Hybrid ML Model',
                'components': ['Random Forest Classifier', 'TF-IDF Vectorization', 'Feature Engineering'],
                'trainingSize': len(ml_recommender.training_data)
            }
        })
    
    except Exception as e:
        print(f"Error in recommendation: {str(e)}")
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
    return jsonify({'status': 'healthy', 'ml_model': 'loaded'})

@app.route('/api/model-info', methods=['GET'])
def get_model_info():
    """Get information about the ML model"""
    return jsonify({
        'model_type': 'Random Forest Classifier',
        'features': [
            'Skill Matching (TF-IDF Vectorization)',
            'Experience Level Encoding',
            'Location Preference Mapping',
            'Education Level Scoring',
            'Business Type Alignment',
            'Work Environment Preference'
        ],
        'training_data_size': len(ml_recommender.training_data),
        'business_categories': len(ml_recommender.business_data),
        'algorithm_components': [
            'TF-IDF Vectorization for skill matching',
            'Random Forest for pattern recognition',
            'Feature engineering for categorical data',
            'Cosine similarity for skill alignment',
            'Multi-factor scoring system'
        ]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)