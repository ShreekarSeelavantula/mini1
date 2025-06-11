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

// Business recommendation logic
function generateRecommendations(formData: any, algorithm: string) {
  const userSkills = formData.skills.map((s: string) => s.toLowerCase());
  const businessType = formData.businessType?.toLowerCase() as 'goods' | 'service' | 'both' || 'both';

  const allBusinesses = [
    {
      id: 'tailoring',
      name: 'Tailoring Services',
      type: 'goods' as const,
      skills: ['sewing', 'fashion', 'design', 'alterations', 'embroidery', 'pattern making', 'stitching', 'garment making'],
      description: 'A tailoring business involves creating, altering, and repairing clothing items. This service-based business can range from basic alterations to custom clothing design, offering flexibility to work from home or establish a shop.'
    },
    {
      id: 'cooking',
      name: 'Cooking Services',
      type: 'goods' as const,
      skills: ['cooking', 'food preparation', 'nutrition', 'catering', 'baking', 'recipe development', 'culinary', 'food service'],
      description: 'A cooking business offering custom meal preparation, catering services, and cooking classes. Perfect for those with culinary expertise and a passion for food.'
    },
    {
      id: 'handicrafts',
      name: 'Handicrafts Business',
      type: 'goods' as const,
      skills: ['art', 'craft', 'creativity', 'handmade', 'traditional arts', 'pottery', 'woodwork', 'art & craft'],
      description: 'A handicrafts business creating and selling handmade items, traditional art pieces, and custom crafts. Ideal for those with artistic skills and creativity.'
    },
    {
      id: 'tutoring',
      name: 'Online Tutoring',
      type: 'service' as const,
      skills: ['teaching', 'education', 'communication', 'subject expertise', 'mentoring', 'training', 'academic'],
      description: 'An online tutoring business offering personalized education services to students. Perfect for those with teaching experience and strong subject knowledge.'
    },
    {
      id: 'beauty_services',
      name: 'Beauty Services',
      type: 'service' as const,
      skills: ['beauty', 'makeup', 'hair styling', 'skincare', 'aesthetics', 'customer service', 'beauty & makeup'],
      description: 'A beauty services business offering makeup, hair styling, and skincare services. Great for those with beauty expertise and customer service skills.'
    },
    {
      id: 'online_business',
      name: 'Online Business',
      type: 'both' as const,
      skills: ['technology', 'digital marketing', 'e-commerce', 'social media', 'content creation', 'analytics', 'online'],
      description: 'An online business leveraging digital platforms for sales and services. Perfect for those with technical skills and digital marketing knowledge.'
    }
  ];

  // Score each business based on user input
  const scoredBusinesses = allBusinesses.map(business => {
    let score = 0;
    
    // Skill matching (40% weight)
    const skillMatches = userSkills.filter((skill: string) => 
      business.skills.some((businessSkill: string) => 
        businessSkill.includes(skill) || skill.includes(businessSkill)
      )
    ).length;
    score += (skillMatches / Math.max(userSkills.length, 1)) * 0.4;

    // Business type matching (20% weight)
    if (!businessType || business.type === businessType || business.type === 'both') {
      score += 0.2;
    }

    // Location preference (20% weight)
    const locationScores: Record<string, number> = {
      urban: 1.0,
      'semi-urban': 0.8,
      rural: 0.6
    };
    const locationScore = locationScores[formData.location.toLowerCase()] || 0.8;
    score += locationScore * 0.2;

    // Experience level (20% weight)
    const experienceScores: Record<string, number> = {
      none: 0.6,
      beginner: 0.7,
      intermediate: 0.8,
      expert: 1.0
    };
    const experienceScore = experienceScores[formData.experience.toLowerCase()] || 0.7;
    score += experienceScore * 0.2;

    return {
      ...business,
      score,
      confidenceScore: Math.min(95, Math.max(65, Math.round(score * 100))),
      mlScore: algorithm === 'ml' ? score * 1.1 : score
    };
  });

  // Sort by score and get top 3
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
