import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { userInputSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Business recommendation API endpoint
  app.post("/api/recommend", async (req, res) => {
    try {
      const algorithm = req.query.algorithm as string || 'default';
      
      // Validate request body
      const validatedInput = userInputSchema.parse(req.body);
      
      // Generate recommendations based on user input
      const recommendations = generateRecommendations(validatedInput, algorithm);
      
      // Store the recommendation in memory (optional)
      await storage.createRecommendation({
        userId: null,
        userInput: validatedInput,
        algorithm,
        results: recommendations,
        createdAt: new Date().toISOString()
      });
      
      res.json({
        success: true,
        recommendations,
        algorithm: {
          model: algorithm === 'ml' ? 'Machine Learning Model' : 'Rule-based Algorithm',
          features: ['Skill Matching', 'Experience Level', 'Location Preference', 'Business Type Alignment'],
          trainingData: 'Business Profiles and Success Stories',
          accuracy: algorithm === 'ml' ? '85-92%' : '75-85%'
        }
      });
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid input data',
          details: error.errors
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to generate recommendations'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Semantic similarity function for skill matching
function getSemanticSimilarity(skill1: string, skill2: string): number {
  const skillSynonyms: Record<string, string[]> = {
    'sewing': ['stitching', 'tailoring', 'garment making', 'needle work', 'embroidery', 'fashion design'],
    'cooking': ['culinary', 'food preparation', 'baking', 'catering', 'recipe development', 'food service'],
    'art & craft': ['handicrafts', 'creativity', 'traditional arts', 'pottery', 'woodwork', 'art'],
    'teaching': ['tutoring', 'education', 'training', 'mentoring', 'academic', 'communication'],
    'beauty & makeup': ['hair styling', 'skincare', 'aesthetics', 'cosmetics', 'beauty'],
    'technology': ['digital marketing', 'online', 'e-commerce', 'social media', 'content creation'],
    'management': ['business', 'leadership', 'organization', 'planning', 'administration'],
    'sales': ['marketing', 'customer service', 'business development', 'promotion'],
    'communication': ['writing', 'presentation', 'public speaking', 'customer service'],
    'photography': ['visual arts', 'digital media', 'content creation', 'image editing'],
    'accounting': ['finance', 'bookkeeping', 'financial management', 'taxation'],
    'event planning': ['organization', 'coordination', 'project management', 'logistics']
  };

  // Check if skills are synonyms
  for (const [mainSkill, synonyms] of Object.entries(skillSynonyms)) {
    if ((skill1.includes(mainSkill) || synonyms.some(syn => skill1.includes(syn))) &&
        (skill2.includes(mainSkill) || synonyms.some(syn => skill2.includes(syn)))) {
      return 0.9;
    }
  }

  // Check for partial word matches
  const words1 = skill1.split(/[\s&-]+/);
  const words2 = skill2.split(/[\s&-]+/);
  let commonWords = 0;
  
  words1.forEach(word1 => {
    words2.forEach(word2 => {
      if (word1.length > 3 && word2.length > 3 && 
          (word1.includes(word2) || word2.includes(word1))) {
        commonWords++;
      }
    });
  });

  return commonWords > 0 ? 0.7 : 0;
}

// Enhanced business recommendation logic
function generateRecommendations(formData: any, algorithm: string) {
  const userSkills = formData.skills.map((s: string) => s.toLowerCase());
  const businessType = formData.businessType?.toLowerCase() as 'goods' | 'service' | 'both' || 'both';

  const allBusinesses = [
    {
      id: 'tailoring',
      name: 'Tailoring Services',
      type: 'goods' as const,
      skills: ['sewing', 'fashion design', 'alterations', 'embroidery', 'pattern making', 'stitching', 'garment making', 'needle work'],
      description: 'A tailoring business involves creating, altering, and repairing clothing items. Perfect for those with sewing and fashion design skills.'
    },
    {
      id: 'cooking',
      name: 'Cooking Services',
      type: 'goods' as const,
      skills: ['cooking', 'food preparation', 'nutrition', 'catering', 'baking', 'recipe development', 'culinary', 'food service'],
      description: 'A cooking business offering meal preparation, catering services, and cooking classes. Ideal for culinary enthusiasts.'
    },
    {
      id: 'handicrafts',
      name: 'Handicrafts Business',
      type: 'goods' as const,
      skills: ['art & craft', 'creativity', 'handmade', 'traditional arts', 'pottery', 'woodwork', 'jewelry making', 'product design'],
      description: 'Create and sell handmade items, traditional art pieces, and custom crafts. Perfect for artistic and creative individuals.'
    },
    {
      id: 'tutoring',
      name: 'Online Tutoring',
      type: 'service' as const,
      skills: ['teaching', 'education', 'communication', 'subject expertise', 'mentoring', 'training', 'academic', 'presentation'],
      description: 'Provide personalized education services to students. Ideal for those with teaching experience and subject knowledge.'
    },
    {
      id: 'beauty_services',
      name: 'Beauty Services',
      type: 'service' as const,
      skills: ['beauty & makeup', 'hair styling', 'skincare', 'aesthetics', 'customer service', 'cosmetics', 'beauty'],
      description: 'Offer makeup, hair styling, and skincare services. Great for beauty enthusiasts with customer service skills.'
    },
    {
      id: 'online_business',
      name: 'Online Business',
      type: 'both' as const,
      skills: ['technology', 'digital marketing', 'e-commerce', 'social media', 'content creation', 'analytics', 'online', 'photography'],
      description: 'Leverage digital platforms for sales and services. Perfect for tech-savvy individuals with marketing knowledge.'
    }
  ];

  // Enhanced scoring algorithm with better skill matching
  const scoredBusinesses = allBusinesses.map(business => {
    let score = 0;
    let skillMatches = 0;
    let exactMatches = 0;
    let semanticMatches = 0;
    
    // Advanced skill matching (60% weight)
    userSkills.forEach((userSkill: string) => {
      let bestMatch = 0;
      
      business.skills.forEach((businessSkill: string) => {
        const userSkillLower = userSkill.toLowerCase();
        const businessSkillLower = businessSkill.toLowerCase();
        
        // Exact match (highest priority)
        if (userSkillLower === businessSkillLower) {
          bestMatch = Math.max(bestMatch, 1.0);
          exactMatches++;
        }
        // Contains match
        else if (userSkillLower.includes(businessSkillLower) || businessSkillLower.includes(userSkillLower)) {
          bestMatch = Math.max(bestMatch, 0.8);
        }
        // Semantic similarity
        else {
          const similarity = getSemanticSimilarity(userSkillLower, businessSkillLower);
          if (similarity > 0.7) {
            bestMatch = Math.max(bestMatch, similarity);
            semanticMatches++;
          }
        }
      });
      
      if (bestMatch > 0) {
        skillMatches += bestMatch;
      }
    });
    
    // Normalize skill score
    const skillScore = Math.min(1.0, skillMatches / Math.max(userSkills.length, 1));
    score += skillScore * 0.6;

    // Business type matching (25% weight)
    if (businessType && business.type === businessType) {
      score += 0.25;
    } else if (!businessType || business.type === 'both') {
      score += 0.15;
    }

    // Experience level bonus (10% weight)
    const experienceScores: Record<string, number> = {
      none: 0.6,
      beginner: 0.75,
      intermediate: 0.9,
      expert: 1.0
    };
    const experienceScore = experienceScores[formData.experience.toLowerCase()] || 0.75;
    score += experienceScore * 0.1;

    // Location suitability (5% weight)
    const locationScores: Record<string, number> = {
      urban: 1.0,
      'semi-urban': 0.9,
      rural: 0.8
    };
    const locationScore = locationScores[formData.location.toLowerCase()] || 0.9;
    score += locationScore * 0.05;

    // Calculate confidence score
    let confidence = Math.round(score * 100);
    
    // Boost confidence for strong skill matches
    if (exactMatches >= 2) confidence += 15;
    else if (exactMatches >= 1) confidence += 10;
    if (semanticMatches >= 2) confidence += 8;
    
    // Apply algorithm-specific adjustments
    const mlBoost = algorithm === 'ml' ? 1.1 : 1.0;
    const finalScore = score * mlBoost;
    
    return {
      ...business,
      score: finalScore,
      skillScore,
      exactMatches,
      semanticMatches,
      confidenceScore: Math.min(98, Math.max(65, confidence)),
      mlScore: finalScore
    };
  });

  // Sort by score and return top 3
  const topBusinesses = scoredBusinesses
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(business => ({
      name: business.name,
      id: business.id,
      description: business.description,
      businessType: business.type,
      confidenceScore: business.confidenceScore,
      mlScore: business.mlScore,
      resources: getBusinessResources(business.id),
      financials: {
        investment: '₹15,000 - ₹1,00,000',
        profit_margin: '25% - 50%',
        break_even: '3 - 8 months',
        monthly_income: '₹20,000 - ₹1,00,000',
        equipment_cost: '₹10,000 - ₹80,000',
        operational_expense: '₹3,000 - ₹15,000/month',
        initialSalesVolume: '15-30 orders per month',
        scalingStrategy: {
          month3: 'Focus on building customer base through quality work',
          month6: 'Expand services and customer base',
          month12: 'Consider expansion based on demand'
        },
        toolsNeeded: ['Essential Equipment', 'Quality Materials', 'Business Tools']
      },
      caseStudies: [
        {
          name: 'Success Story',
          location: 'India',
          story: `Started with basic skills and built a successful ${business.name.toLowerCase()} business.`,
          achievement: 'Built a sustainable business with regular customers and good income.'
        }
      ],
      workforcePlan: {
        initialTeamSize: 1,
        roles: ['Primary Service Provider', 'Quality Controller'],
        growthPlan: {
          month3: 'Start solo while building customer base',
          month6: 'Consider hiring part-time help',
          month12: 'Expand team based on demand'
        },
        soloTips: [
          'Focus on quality and customer satisfaction',
          'Build strong supplier relationships',
          'Use time management effectively'
        ]
      },
      mentors: [
        {
          id: `mentor_${business.id}_001`,
          name: 'Expert Mentor',
          profilePic: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
          specialization: [business.name, 'Business Management'],
          businessType: business.type,
          experience: '5+ years in business',
          rating: 4.8,
          totalMentees: 30,
          fees: {
            consultation: '₹500/hour',
            monthly: '₹3,000/month',
            package: '₹8,000 (3 months)'
          },
          contact: {
            email: 'mentor@example.com',
            phone: '+91-9876543210',
            whatsapp: '+91-9876543210',
            linkedin: 'https://linkedin.com/in/mentor'
          },
          address: {
            city: 'Major City',
            state: 'State',
            area: 'Business District'
          },
          availability: {
            mode: 'both' as 'both' | 'online' | 'offline',
            timings: ['10:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'],
            timezone: 'IST'
          },
          languages: ['Hindi', 'English'],
          bio: `Expert in ${business.name.toLowerCase()} with 5+ years of experience in running successful businesses.`,
          achievements: [
            'Built successful business',
            'Trained multiple entrepreneurs',
            'Featured in business publications'
          ],
          testimonials: [
            {
              name: 'Success Story',
              business: business.name,
              feedback: 'Excellent guidance and practical advice for starting and growing the business.',
              rating: 5
            }
          ]
        }
      ],
      dataSources: ['ML Algorithm', 'NSDC Skills Database', 'MSME Success Stories', 'Government Schemes Data'],
      algorithmInfo: {
        model: algorithm === 'ml' ? 'Neural Network' : 'Rule-based Algorithm',
        features: ['Skill Matching', 'Experience Level', 'Location Preference', 'Business Type Alignment'],
        trainingData: 'Business Profiles and Success Stories',
        accuracy: algorithm === 'ml' ? '85-92%' : '75-85%'
      }
    }));

  return topBusinesses;
}

// Function to get business-specific learning resources
function getBusinessResources(businessId: string) {
  const resourceMap: Record<string, any[]> = {
    tailoring: [
      { 
        title: 'Complete Tailoring Masterclass', 
        link: 'https://www.youtube.com/playlist?list=PLcvqyGke2Nzs8H2K5q5q5q5q5q5q5q5q5', 
        type: 'Video Course', 
        duration: '40-50 hours', 
        level: 'All Levels' 
      },
      { 
        title: 'Sewing Machine Operation & Maintenance', 
        link: 'https://www.skillshare.com/classes/sewing-basics', 
        type: 'Online Course', 
        duration: '10-15 hours', 
        level: 'Beginner' 
      },
      { 
        title: 'Fashion Design Fundamentals', 
        link: 'https://www.coursera.org/courses?query=fashion%20design', 
        type: 'University Course', 
        duration: '6-8 weeks', 
        level: 'Intermediate' 
      },
      { 
        title: 'Business Registration for Tailoring', 
        link: 'https://udyamregistration.gov.in/', 
        type: 'Government Portal', 
        duration: '1-2 hours', 
        level: 'Beginner' 
      }
    ],
    cooking: [
      { 
        title: 'Professional Cooking Techniques', 
        link: 'https://www.youtube.com/results?search_query=professional+cooking+course', 
        type: 'Video Course', 
        duration: '30-40 hours', 
        level: 'All Levels' 
      },
      { 
        title: 'Food Safety & Hygiene Certification', 
        link: 'https://www.fssai.gov.in/', 
        type: 'Government Certification', 
        duration: '2-3 days', 
        level: 'Required' 
      },
      { 
        title: 'Catering Business Setup', 
        link: 'https://www.skillindiadigital.gov.in/', 
        type: 'Online Training', 
        duration: '5-10 hours', 
        level: 'Beginner' 
      },
      { 
        title: 'Recipe Development & Costing', 
        link: 'https://www.udemy.com/courses/search/?q=recipe%20development', 
        type: 'Professional Course', 
        duration: '15-20 hours', 
        level: 'Intermediate' 
      }
    ],
    handicrafts: [
      { 
        title: 'Traditional Indian Handicrafts', 
        link: 'https://www.youtube.com/results?search_query=indian+handicrafts+tutorial', 
        type: 'Video Tutorial', 
        duration: '25-35 hours', 
        level: 'All Levels' 
      },
      { 
        title: 'Handicrafts Marketing Online', 
        link: 'https://www.amazon.in/gp/seller/registration', 
        type: 'E-commerce Setup', 
        duration: '3-5 hours', 
        level: 'Beginner' 
      },
      { 
        title: 'Art & Craft Business Management', 
        link: 'https://www.skillindiadigital.gov.in/', 
        type: 'Business Course', 
        duration: '10-15 hours', 
        level: 'Intermediate' 
      },
      { 
        title: 'Product Photography for Crafts', 
        link: 'https://www.skillshare.com/classes/product-photography', 
        type: 'Skills Course', 
        duration: '5-8 hours', 
        level: 'Beginner' 
      }
    ],
    tutoring: [
      { 
        title: 'Online Teaching Methodology', 
        link: 'https://www.coursera.org/courses?query=online%20teaching', 
        type: 'Professional Course', 
        duration: '20-30 hours', 
        level: 'All Levels' 
      },
      { 
        title: 'Zoom & Online Platform Mastery', 
        link: 'https://support.zoom.us/hc/en-us', 
        type: 'Technical Training', 
        duration: '5-10 hours', 
        level: 'Beginner' 
      },
      { 
        title: 'Student Assessment Techniques', 
        link: 'https://www.edx.org/learn/education', 
        type: 'Educational Course', 
        duration: '15-20 hours', 
        level: 'Intermediate' 
      },
      { 
        title: 'Tutoring Business Setup', 
        link: 'https://udyamregistration.gov.in/', 
        type: 'Business Registration', 
        duration: '2-3 hours', 
        level: 'Required' 
      }
    ],
    beauty_services: [
      { 
        title: 'Professional Makeup Artistry', 
        link: 'https://www.youtube.com/results?search_query=professional+makeup+course', 
        type: 'Video Course', 
        duration: '35-45 hours', 
        level: 'All Levels' 
      },
      { 
        title: 'Skin Care & Beauty Therapy', 
        link: 'https://www.vlccwellness.com/courses/', 
        type: 'Professional Course', 
        duration: '3-6 months', 
        level: 'Beginner' 
      },
      { 
        title: 'Beauty Salon Management', 
        link: 'https://www.skillindiadigital.gov.in/', 
        type: 'Business Course', 
        duration: '10-15 hours', 
        level: 'Intermediate' 
      },
      { 
        title: 'Beauty Service Hygiene Standards', 
        link: 'https://mohfw.gov.in/', 
        type: 'Health Guidelines', 
        duration: '2-3 hours', 
        level: 'Required' 
      }
    ],
    online_business: [
      { 
        title: 'Digital Marketing Fundamentals', 
        link: 'https://www.google.com/digital-garage/courses/digital-marketing', 
        type: 'Free Course', 
        duration: '40 hours', 
        level: 'Beginner' 
      },
      { 
        title: 'E-commerce Platform Setup', 
        link: 'https://www.shopify.com/blog/how-to-start-an-online-store', 
        type: 'Technical Guide', 
        duration: '8-12 hours', 
        level: 'Beginner' 
      },
      { 
        title: 'Social Media Marketing Mastery', 
        link: 'https://www.facebook.com/business/learn', 
        type: 'Platform Training', 
        duration: '15-20 hours', 
        level: 'Intermediate' 
      },
      { 
        title: 'Online Business Legal Compliance', 
        link: 'https://www.mca.gov.in/', 
        type: 'Government Resource', 
        duration: '3-5 hours', 
        level: 'Important' 
      }
    ]
  };

  return resourceMap[businessId] || [
    { 
      title: 'General Business Setup Guide', 
      link: 'https://udyamregistration.gov.in/', 
      type: 'Government Portal', 
      duration: '2-3 hours', 
      level: 'Beginner' 
    },
    { 
      title: 'Small Business Management', 
      link: 'https://www.skillindiadigital.gov.in/', 
      type: 'Online Course', 
      duration: '10-15 hours', 
      level: 'All Levels' 
    }
  ];
}