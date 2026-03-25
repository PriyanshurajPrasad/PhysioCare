const mongoose = require('mongoose');
const Review = require('../models/Review');
require('dotenv').config();

const dummyReviews = [
  {
    name: 'Sarah Johnson',
    rating: 5,
    message: 'Outstanding service! The physiotherapy sessions helped me recover from my back injury much faster than expected. Dr. Smith is incredibly knowledgeable and caring.',
    treatment: 'Back Pain Treatment',
    isFeatured: true,
    isApproved: true
  },
  {
    name: 'Michael Chen',
    rating: 5,
    message: 'Professional and friendly staff. The personalized treatment plan worked wonders for my shoulder injury. Highly recommend this clinic to anyone needing physiotherapy.',
    treatment: 'Shoulder Rehabilitation',
    isFeatured: true,
    isApproved: true
  },
  {
    name: 'Emily Rodriguez',
    rating: 4,
    message: 'Great experience overall. The facility is clean and modern. My only suggestion would be to have more flexible appointment times. Otherwise, excellent care!',
    treatment: 'Sports Injury Recovery',
    isFeatured: false,
    isApproved: true
  },
  {
    name: 'David Thompson',
    rating: 5,
    message: 'After my knee surgery, I was worried about recovery. The team here guided me through every step with patience and expertise. I\'m back to running marathons thanks to them!',
    treatment: 'Post-Surgical Rehabilitation',
    isFeatured: true,
    isApproved: true
  },
  {
    name: 'Lisa Anderson',
    rating: 5,
    message: 'The best physiotherapy clinic in town! The therapists really listen to your concerns and tailor the treatment accordingly. Very impressed with the results.',
    treatment: 'Neck Pain Treatment',
    isFeatured: false,
    isApproved: true
  },
  {
    name: 'James Wilson',
    rating: 4,
    message: 'Very professional service. The exercises provided were effective and easy to follow at home. My mobility has improved significantly.',
    treatment: 'Mobility Improvement',
    isFeatured: false,
    isApproved: true
  },
  {
    name: 'Maria Garcia',
    rating: 5,
    message: 'Exceptional care from start to finish. The staff makes you feel comfortable and the treatment results speak for themselves. Worth every penny!',
    treatment: 'Chronic Pain Management',
    isFeatured: true,
    isApproved: true
  },
  {
    name: 'Robert Taylor',
    rating: 3,
    message: 'Good service but had to wait a few times for my appointments. The treatment itself was effective though.',
    treatment: 'General Physiotherapy',
    isFeatured: false,
    isApproved: true
  },
  {
    name: 'Jennifer Martinez',
    rating: 5,
    message: 'Life-changing experience! I came in with chronic back pain and now I\'m pain-free. The holistic approach they take really makes a difference.',
    treatment: 'Chronic Back Pain',
    isFeatured: false,
    isApproved: true
  },
  {
    name: 'William Brown',
    rating: 4,
    message: 'Very satisfied with the treatment. The therapists are skilled and the equipment is modern. Would definitely recommend to friends and family.',
    treatment: 'Joint Pain Treatment',
    isFeatured: false,
    isApproved: true
  }
];

const seedReviews = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/physiotherapy-clinic');
    console.log('Connected to MongoDB');

    // Clear existing reviews
    await Review.deleteMany({});
    console.log('Cleared existing reviews');

    // Insert dummy reviews
    const insertedReviews = await Review.insertMany(dummyReviews);
    console.log(`Inserted ${insertedReviews.length} dummy reviews`);

    // Update some reviews to have different creation dates for testing sorting
    const reviews = await Review.find({});
    
    // Set different dates for testing
    const dates = [
      new Date('2024-01-15'),
      new Date('2024-02-20'),
      new Date('2024-03-10'),
      new Date('2024-04-05'),
      new Date('2024-05-12'),
      new Date('2024-06-18'),
      new Date('2024-07-22'),
      new Date('2024-08-30'),
      new Date('2024-09-14'),
      new Date('2024-10-25')
    ];

    for (let i = 0; i < reviews.length; i++) {
      await Review.findByIdAndUpdate(reviews[i]._id, { createdAt: dates[i] });
    }

    console.log('Updated review dates for testing');
    console.log('✅ Reviews seeded successfully!');
    
    // Close connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    process.exit(1);
  }
};

// Run the seed function
seedReviews();
