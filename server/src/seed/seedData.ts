import mongoose from 'mongoose';
import { User } from '../models/User';
import { Customer } from '../models/Customer';
import { Staff } from '../models/Staff';
import { Service } from '../models/Service';
import { Appointment } from '../models/Appointment';
import { Payment } from '../models/Payment';
import { Invoice } from '../models/Invoice';
import { Product } from '../models/Product';
import { InventoryTransaction } from '../models/InventoryTransaction';
import { Supplier } from '../models/Supplier';
import { Promotion } from '../models/Promotion';
import { Review } from '../models/Review';
import { LoyaltyTransaction } from '../models/LoyaltyTransaction';
import { Notification } from '../models/Notification';
import { SalonSettings } from '../models/SalonSettings';
import { connectDB } from '../config/db';

export const seedDatabase = async () => {
  console.log('[Seeder] Starting realistic SalonFlow database seeding...');

  // Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    Customer.deleteMany({}),
    Staff.deleteMany({}),
    Service.deleteMany({}),
    Appointment.deleteMany({}),
    Payment.deleteMany({}),
    Invoice.deleteMany({}),
    Product.deleteMany({}),
    InventoryTransaction.deleteMany({}),
    Supplier.deleteMany({}),
    Promotion.deleteMany({}),
    Review.deleteMany({}),
    LoyaltyTransaction.deleteMany({}),
    Notification.deleteMany({}),
    SalonSettings.deleteMany({}),
  ]);

  // 1. Salon Settings
  const settings = await SalonSettings.create({
    salonName: 'SalonFlow Luxe Studio',
    tagline: 'Your Beauty. Your Time. Your Salon.',
    phone: '+91 98765 43210',
    email: 'concierge@salonflow.demo',
    address: '42, Boulevard Promenade, 100ft Road, Indiranagar',
    city: 'Bengaluru, Karnataka 560038',
    openingHours: '10:00',
    closingHours: '20:00',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    bufferTimeMinutes: 15,
    advanceBookingDays: 30,
    cancellationPolicy: 'Free cancellation up to 4 hours before your scheduled appointment.',
    taxRatePercent: 18,
    taxName: 'GST',
    currencySymbol: '₹',
    loyaltyEarnRate: 100, // ₹100 = 1 point
    loyaltyRedeemRate: 1, // 1 point = ₹1
  });

  // 2. Demo Users
  const adminUser = await User.create({
    name: 'Vikramaditya Roy',
    email: 'admin@salonflow.demo',
    password: 'Admin@123',
    phone: '+91 98450 11001',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&fit=crop&crop=faces',
  });

  const ownerUser = await User.create({
    name: 'Kavita Chawla',
    email: 'owner@salonflow.demo',
    password: 'Owner@123',
    phone: '+91 98450 11002',
    role: 'SALON_OWNER',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&fit=crop&crop=faces',
  });

  const receptionist1 = await User.create({
    name: 'Tanvi Saxena',
    email: 'reception@salonflow.demo',
    password: 'Reception@123',
    phone: '+91 98450 11003',
    role: 'RECEPTIONIST',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&fit=crop&crop=faces',
  });

  const receptionist2 = await User.create({
    name: 'Rhea Deshmukh',
    email: 'rhea@salonflow.demo',
    password: 'Reception@123',
    phone: '+91 98450 11004',
    role: 'RECEPTIONIST',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&fit=crop&crop=faces',
  });

  const demoCustomerUser = await User.create({
    name: 'Meera Nambiar',
    email: 'customer@salonflow.demo',
    password: 'Customer@123',
    phone: '+91 98111 22334',
    role: 'CUSTOMER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&fit=crop&crop=faces',
  });

  // 3. 8 Professional Stylists
  const stylistsData = [
    {
      name: 'Rohan Mehra',
      email: 'stylist@salonflow.demo', // Primary demo stylist account
      password: 'Stylist@123',
      phone: '+91 98200 44001',
      employeeId: 'SF-STF-001',
      specialization: ['Haircut & Styling', 'Creative Color', 'Blowouts'],
      experienceYears: 7,
      salary: 55000,
      commissionPercentage: 15,
      rating: 4.9,
      reviewCount: 148,
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&fit=crop&crop=faces',
      bio: 'Trained at Vidal Sassoon Academy London. Master of precision cuts and modern effortless textures.',
    },
    {
      name: 'Ananya Sharma',
      email: 'ananya.sharma@salonflow.demo',
      password: 'Stylist@123',
      phone: '+91 98200 44002',
      employeeId: 'SF-STF-002',
      specialization: ['Hair Coloring', 'Balayage & Ombre', 'Highlights'],
      experienceYears: 6,
      salary: 50000,
      commissionPercentage: 15,
      rating: 4.95,
      reviewCount: 184,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&fit=crop&crop=faces',
      bio: 'L’Oréal Professionnel Color Specialist. Crafting custom multidimensional sun-kissed shades.',
    },
    {
      name: 'Priya Nair',
      email: 'priya.nair@salonflow.demo',
      password: 'Stylist@123',
      phone: '+91 98200 44003',
      employeeId: 'SF-STF-003',
      specialization: ['Bridal Makeup', 'Pre-Bridal Package', 'Haute Glam'],
      experienceYears: 9,
      salary: 65000,
      commissionPercentage: 20,
      rating: 5.0,
      reviewCount: 215,
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&fit=crop&crop=faces',
      bio: 'Celebrity bridal artist known for dewy, glass-skin finishes and timeless South Asian bridal elegance.',
    },
    {
      name: 'Sneha Kapoor',
      email: 'sneha.kapoor@salonflow.demo',
      password: 'Stylist@123',
      phone: '+91 98200 44004',
      employeeId: 'SF-STF-004',
      specialization: ['Nail Art', 'Gel Extensions', 'Russian Manicure'],
      experienceYears: 4,
      salary: 38000,
      commissionPercentage: 12,
      rating: 4.85,
      reviewCount: 96,
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&fit=crop&crop=faces',
      bio: 'Certified nail technician specializing in hand-painted minimalist art and non-damaging extensions.',
    },
    {
      name: 'Aisha Khan',
      email: 'aisha.khan@salonflow.demo',
      password: 'Stylist@123',
      phone: '+91 98200 44005',
      employeeId: 'SF-STF-005',
      specialization: ['Facial Treatments', 'Hydrafacial', 'Skin Therapy'],
      experienceYears: 8,
      salary: 48000,
      commissionPercentage: 15,
      rating: 4.9,
      reviewCount: 162,
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&fit=crop&crop=faces',
      bio: 'CIDESCO-certified dermal therapist delivering medical-grade skin renewal and sculpting lymphatic massages.',
    },
    {
      name: 'Vikram Singhania',
      email: 'vikram.singhania@salonflow.demo',
      password: 'Stylist@123',
      phone: '+91 98200 44006',
      employeeId: 'SF-STF-006',
      specialization: ['Keratin Treatment', 'Hair Straightening', 'Hair Spa'],
      experienceYears: 10,
      salary: 58000,
      commissionPercentage: 18,
      rating: 4.88,
      reviewCount: 173,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&crop=faces',
      bio: 'Chemical treatment and restructuring authority. Restores damaged cuticles with formaldehyde-free formulas.',
    },
    {
      name: 'Meera Joshi',
      email: 'meera.joshi@salonflow.demo',
      password: 'Stylist@123',
      phone: '+91 98200 44007',
      employeeId: 'SF-STF-007',
      specialization: ['Eyebrow Styling', 'Threading', 'Waxing & Cleanup'],
      experienceYears: 5,
      salary: 35000,
      commissionPercentage: 12,
      rating: 4.82,
      reviewCount: 110,
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&fit=crop&crop=faces',
      bio: 'Master of facial symmetry and gentle wax rituals. Precision brow mapping specialist.',
    },
    {
      name: 'Arjun Verma',
      email: 'arjun.verma@salonflow.demo',
      password: 'Stylist@123',
      phone: '+91 98200 44008',
      employeeId: 'SF-STF-008',
      specialization: ['Haircut & Styling', 'Beard Sculpting', 'Men Grooming'],
      experienceYears: 6,
      salary: 45000,
      commissionPercentage: 14,
      rating: 4.91,
      reviewCount: 135,
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&fit=crop&crop=faces',
      bio: 'Bespoke men’s grooming, classic taper fades, and revitalizing scalp detoxification rituals.',
    },
  ];

  const createdStaffDocs: any[] = [];
  for (const s of stylistsData) {
    const userDoc = await User.create({
      name: s.name,
      email: s.email,
      password: s.password,
      phone: s.phone,
      role: 'STYLIST',
      avatar: s.image,
    });

    const staffDoc = await Staff.create({
      userId: userDoc._id,
      employeeId: s.employeeId,
      name: s.name,
      email: s.email,
      phone: s.phone,
      role: 'STYLIST',
      specialization: s.specialization,
      experienceYears: s.experienceYears,
      salary: s.salary,
      commissionPercentage: s.commissionPercentage,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      workingHours: { start: '10:00', end: '20:00' },
      rating: s.rating,
      reviewCount: s.reviewCount,
      image: s.image,
      bio: s.bio,
    });
    createdStaffDocs.push(staffDoc);
  }

  // 4. 20+ Realistic Services with INR Pricing
  const servicesData = [
    // Hair
    {
      name: 'Signature Precision Haircut & Styling',
      category: 'HAIR',
      description: 'Consultation, botanical shampoo wash, deep conditioning, tailored haircut, and blowout styling.',
      price: 850,
      durationMinutes: 45,
      popular: true,
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&fit=crop',
    },
    {
      name: 'Luxe Balayage & Toning Ritual',
      category: 'HAIR',
      description: 'Hand-painted dimensional balayage finished with customized gloss toner and bond protector.',
      price: 4800,
      durationMinutes: 120,
      popular: true,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&fit=crop',
    },
    {
      name: 'Full Head Foil Highlights',
      category: 'HAIR',
      description: 'High-lift blonde or warm caramel foiling throughout for maximum illumination and depth.',
      price: 3600,
      durationMinutes: 90,
      popular: false,
      image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&fit=crop',
    },
    {
      name: 'Olaplex Hair Spa Therapy',
      category: 'HAIR',
      description: 'Intense disulfide bond repair with steam mist and aromatic essential oil scalp massage.',
      price: 1950,
      durationMinutes: 50,
      popular: true,
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&fit=crop',
    },
    {
      name: 'Brazilian Keratin Smoothing',
      category: 'HAIR',
      description: 'Eliminates 95% of frizz, imparts mirror shine, and seals cuticles for up to 5 months.',
      price: 5500,
      durationMinutes: 150,
      popular: true,
      image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&fit=crop',
    },
    {
      name: 'Permanent Hair Rebonding',
      category: 'HAIR',
      description: 'Silky smooth, pin-straight hair alignment using conditioning Japanese re-texturizing matrix.',
      price: 6500,
      durationMinutes: 180,
      popular: false,
      image: 'https://images.unsplash.com/photo-1522337094344-664f3316e165?w=600&fit=crop',
    },
    {
      name: 'Red Carpet Bouncy Blow Dry',
      category: 'HAIR',
      description: 'Volume-packed blowout with ceramic round brushes and thermal protective setting mist.',
      price: 950,
      durationMinutes: 40,
      popular: false,
      image: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&fit=crop',
    },
    {
      name: 'Anti-Hairfall Scalp Exfoliation',
      category: 'TREATMENT',
      description: 'Salicylic acid clarifying scalp peel followed by peptide micro-infusion to stimulate roots.',
      price: 1800,
      durationMinutes: 45,
      popular: false,
      image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&fit=crop',
    },

    // Beauty / Skin
    {
      name: '24K Royal Gold Radiance Facial',
      category: 'BEAUTY',
      description: 'Pure 24K colloidal gold leaf infusion, lymphatic drainage, and lifting collagen mask.',
      price: 2600,
      durationMinutes: 60,
      popular: true,
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&fit=crop',
    },
    {
      name: 'Hydro-Dermabrasion Glow Treatment',
      category: 'BEAUTY',
      description: 'Deep vortex extraction, salicylic wash, antioxidant hydration, and cold therapy pore seal.',
      price: 3400,
      durationMinutes: 60,
      popular: true,
      image: 'https://images.unsplash.com/photo-1512290900672-1f55b967814b?w=600&fit=crop',
    },
    {
      name: 'Organic Vitamin C Glow Cleanup',
      category: 'BEAUTY',
      description: 'Quick refresh with mild fruit enzyme exfoliation, steam extraction, and brightening pack.',
      price: 1100,
      durationMinutes: 35,
      popular: false,
      image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600&fit=crop',
    },
    {
      name: 'Rica Avocado Full Waxing Ritual',
      category: 'BEAUTY',
      description: 'Italian liposoluble colophony-free wax for arms, full legs, underarms with post-soothing oil.',
      price: 1450,
      durationMinutes: 50,
      popular: false,
      image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600&fit=crop',
    },
    {
      name: 'High Definition Brow Threading & Tint',
      category: 'BEAUTY',
      description: 'Golden ratio facial mapping, organic cotton threading, and herbal henna shade contouring.',
      price: 450,
      durationMinutes: 25,
      popular: false,
      image: 'https://images.unsplash.com/photo-1583001800470-438a0f90d1f7?w=600&fit=crop',
    },

    // Nails
    {
      name: 'Deluxe Lavender Spa Manicure',
      category: 'NAILS',
      description: 'Aromatherapy soak, dead sea salt scrub, cuticle therapy, hand massage, and gel polish.',
      price: 1250,
      durationMinutes: 45,
      popular: false,
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&fit=crop',
    },
    {
      name: 'Charcoal Detox Foot Spa & Pedicure',
      category: 'NAILS',
      description: 'Warm bubbling bath, callus smoothing, charcoal mask, hot towel wrap, and nail buffing.',
      price: 1550,
      durationMinutes: 50,
      popular: true,
      image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&fit=crop',
    },
    {
      name: 'Sculpted Gel Extensions & Chrome Art',
      category: 'NAILS',
      description: 'Full set custom builder gel tips with iridescent chrome finish or minimalist 3D accents.',
      price: 2400,
      durationMinutes: 75,
      popular: true,
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&fit=crop',
    },

    // Bridal
    {
      name: 'Royal Bridal Haute Couture Makeup',
      category: 'BRIDAL',
      description: 'HD Airbrush makeup, waterproof HD base, lashes, jewelry setting, dupatta draping, and touchup kit.',
      price: 18500,
      durationMinutes: 180,
      popular: true,
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&fit=crop',
    },
    {
      name: 'Comprehensive 7-Day Pre-Bridal Glow',
      category: 'BRIDAL',
      description: 'Head-to-toe full body polishing, brightening facial, hair spa, manicure, pedicure, and threading.',
      price: 11500,
      durationMinutes: 240,
      popular: true,
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&fit=crop',
    },
    {
      name: 'Engagement & Sangeet Glam Makeup',
      category: 'BRIDAL',
      description: 'Dramatic smokey or soft romantic eye artistry, radiant strobe base, and contemporary hair updo.',
      price: 7500,
      durationMinutes: 90,
      popular: false,
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&fit=crop',
    },

    // Men / Grooming
    {
      name: 'Gentleman Royal Hair & Beard Sculpting',
      category: 'HAIR',
      description: 'Precision scissor cut, hot lather straight razor beard contouring, and hot towel facial compress.',
      price: 1300,
      durationMinutes: 45,
      popular: false,
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&fit=crop',
    },
  ];

  const createdServices: any[] = [];
  for (const s of servicesData) {
    const doc = await Service.create(s);
    createdServices.push(doc);
  }

  // 5. 30 Realistic Indian Customers
  const indianNames = [
    { name: 'Meera Nambiar', phone: '+91 98111 22334', email: 'customer@salonflow.demo', tier: 'PLATINUM', visits: 18, spent: 48500 },
    { name: 'Aditi Varma', phone: '+91 98231 44551', email: 'aditi.varma@gmail.com', tier: 'GOLD', visits: 9, spent: 22400 },
    { name: 'Siddharth Iyer', phone: '+91 98311 55662', email: 'siddharth.iyer@gmail.com', tier: 'SILVER', visits: 5, spent: 7800 },
    { name: 'Pooja Hegde', phone: '+91 98401 66773', email: 'pooja.hegde@yahoo.com', tier: 'GOLD', visits: 8, spent: 18900 },
    { name: 'Rohan Banerjee', phone: '+91 98511 77884', email: 'rohan.banerjee@gmail.com', tier: 'BRONZE', visits: 2, spent: 2200 },
    { name: 'Divya Krishnan', phone: '+91 98621 88995', email: 'divya.k@outlook.com', tier: 'PLATINUM', visits: 14, spent: 39800 },
    { name: 'Karan Malhotra', phone: '+91 98731 99006', email: 'karan.malhotra@gmail.com', tier: 'SILVER', visits: 4, spent: 5900 },
    { name: 'Shreya Sen', phone: '+91 98841 00117', email: 'shreya.sen@gmail.com', tier: 'GOLD', visits: 7, spent: 16500 },
    { name: 'Varun Dhawan', phone: '+91 98951 11228', email: 'varun.dhawan99@gmail.com', tier: 'BRONZE', visits: 1, spent: 850 },
    { name: 'Tara Sutaria', phone: '+91 99061 22339', email: 'tara.sutaria@icloud.com', tier: 'PLATINUM', visits: 12, spent: 33400 },
    { name: 'Nikhil Kamath', phone: '+91 99171 33440', email: 'nikhil.kamath@zerodh.com', tier: 'GOLD', visits: 6, spent: 15200 },
    { name: 'Ananya Birla', phone: '+91 99281 44551', email: 'ananya.b@adityabirla.com', tier: 'PLATINUM', visits: 15, spent: 44000 },
    { name: 'Gaurav Taneja', phone: '+91 99391 55662', email: 'gaurav.taneja@flyingbeast.in', tier: 'SILVER', visits: 4, spent: 6200 },
    { name: 'Ishita Dutta', phone: '+91 99401 66773', email: 'ishita.dutta@gmail.com', tier: 'GOLD', visits: 10, spent: 24900 },
    { name: 'Kabir Bedi', phone: '+91 99511 77884', email: 'kabir.bedi@cinema.org', tier: 'BRONZE', visits: 2, spent: 3100 },
    { name: 'Mallika Sarabhai', phone: '+91 99621 88995', email: 'mallika.s@darpana.com', tier: 'GOLD', visits: 8, spent: 19500 },
    { name: 'Raghav Chadha', phone: '+91 99731 99006', email: 'raghav.c@delhi.gov.in', tier: 'SILVER', visits: 3, spent: 4800 },
    { name: 'Kriti Sanon', phone: '+91 99841 00117', email: 'kriti.sanon@mimi.in', tier: 'PLATINUM', visits: 16, spent: 46200 },
    { name: 'Harshvardhan Kapoor', phone: '+91 99951 11228', email: 'harsh.k@kapoor.in', tier: 'BRONZE', visits: 1, spent: 1300 },
    { name: 'Radhika Madan', phone: '+91 98122 33445', email: 'radhika.madan@gmail.com', tier: 'GOLD', visits: 7, spent: 17800 },
    { name: 'Abhishek Bachchan', phone: '+91 98233 44556', email: 'abhishek.b@jalsa.in', tier: 'SILVER', visits: 5, spent: 8400 },
    { name: 'Sonam Bajwa', phone: '+91 98344 55667', email: 'sonam.bajwa@punjab.in', tier: 'PLATINUM', visits: 11, spent: 31000 },
    { name: 'Ayushmann Khurrana', phone: '+91 98455 66778', email: 'ayushmann.k@chandigarh.in', tier: 'GOLD', visits: 9, spent: 21500 },
    { name: 'Bhumi Pednekar', phone: '+91 98566 77889', email: 'bhumi.p@climatewarrior.org', tier: 'GOLD', visits: 6, spent: 16800 },
    { name: 'Rajkummar Rao', phone: '+91 98677 88990', email: 'rajkummar.rao@gmail.com', tier: 'SILVER', visits: 4, spent: 5800 },
    { name: 'Fatima Sana Shaikh', phone: '+91 98788 99001', email: 'fatima.sana@dangal.in', tier: 'GOLD', visits: 8, spent: 19000 },
    { name: 'Vicky Kaushal', phone: '+91 98899 00112', email: 'vicky.kaushal@uri.in', tier: 'PLATINUM', visits: 13, spent: 38200 },
    { name: 'Sanya Malhotra', phone: '+91 98900 11223', email: 'sanya.malhotra@meenakshi.in', tier: 'SILVER', visits: 5, spent: 7500 },
    { name: 'Vijay Deverakonda', phone: '+91 99011 22334', email: 'vijay.d@rowdywear.in', tier: 'GOLD', visits: 7, spent: 18200 },
    { name: 'Samantha Prabhu', phone: '+91 99122 33445', email: 'samantha.prabhu@shakuntalam.in', tier: 'PLATINUM', visits: 17, spent: 49000 },
  ];

  const createdCustomers: any[] = [];
  for (let i = 0; i < indianNames.length; i++) {
    const cust = indianNames[i];
    const preferredStylist = createdStaffDocs[i % createdStaffDocs.length]._id;
    const points = Math.floor(cust.spent / 100);

    const doc = await Customer.create({
      userId: i === 0 ? demoCustomerUser._id : undefined,
      name: cust.name,
      phone: cust.phone,
      email: cust.email,
      dateOfBirth: '1994-06-15',
      address: 'Indiranagar, Bengaluru, Karnataka',
      totalVisits: cust.visits,
      totalSpending: cust.spent,
      loyaltyPoints: points,
      tier: cust.tier,
      preferredStylist,
      notes: `Loyal guest. Prefers herbal infusions and gentle pressure.`,
      lastVisitDate: new Date(Date.now() - (i % 10) * 86400000 * 3),
    });
    createdCustomers.push(doc);

    // Initial loyalty transaction
    await LoyaltyTransaction.create({
      customer: doc._id,
      type: 'EARNED',
      points,
      reason: 'Welcome bonus & completed salon services rewards',
      balanceAfter: points,
      date: new Date(Date.now() - (i + 1) * 86400000 * 5),
    });
  }

  // 6. 5 Realistic Promotions
  const promotionsData = [
    {
      code: 'FIRSTVISIT15',
      title: 'First Visit Luxe Welcome',
      description: 'Enjoy 15% off your first salon appointment experience.',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minPurchase: 1000,
      maxDiscount: 500,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      usageLimit: 1000,
      usedCount: 84,
      active: true,
    },
    {
      code: 'HAIRSPA',
      title: 'Hair Rejuvenation Privilege',
      description: 'Flat ₹500 discount on Olaplex or Botanical Spa rituals.',
      discountType: 'FIXED',
      discountValue: 500,
      minPurchase: 1800,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      usageLimit: 500,
      usedCount: 42,
      active: true,
    },
    {
      code: 'BRIDAL2026',
      title: 'Royal Bridal Exclusive',
      description: 'Special 20% off all pre-bridal packages & bridal couture.',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minPurchase: 10000,
      maxDiscount: 4000,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      usageLimit: 200,
      usedCount: 19,
      active: true,
    },
    {
      code: 'BIRTHDAY',
      title: 'Birthday Pampering Treat',
      description: 'Flat ₹400 off any beauty, skin, or hair indulgence.',
      discountType: 'FIXED',
      discountValue: 400,
      minPurchase: 1500,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      usageLimit: 500,
      usedCount: 31,
      active: true,
    },
    {
      code: 'WEEKEND10',
      title: 'Weekend Indulgence Pass',
      description: '10% off styling & nail transformations all weekend long.',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minPurchase: 1200,
      maxDiscount: 350,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      usageLimit: 300,
      usedCount: 27,
      active: true,
    },
  ];

  for (const promo of promotionsData) {
    await Promotion.create(promo);
  }

  // 7. 30 Realistic Salon Products & Suppliers
  const suppliers = [
    { name: 'L’Oréal India Professional', contactPerson: 'Sameer Sen', phone: '+91 98190 22001', email: 'orders@lorealindia.demo' },
    { name: 'Olaplex Distributor South', contactPerson: 'Ranjit Roy', phone: '+91 98190 22002', email: 'southdist@olaplex.demo' },
    { name: 'Kérastase Luxury Haircare', contactPerson: 'Nandini Das', phone: '+91 98190 22003', email: 'concierge@kerastase.demo' },
    { name: 'OPI International Nails', contactPerson: 'Kunal Kapoor', phone: '+91 98190 22004', email: 'sales@opinails.demo' },
  ];

  for (const sup of suppliers) {
    await Supplier.create(sup);
  }

  const productsData = [
    { name: 'L’Oréal Serie Expert Absolut Repair Shampoo (500ml)', sku: 'LOR-SHP-001', category: 'HAIRCARE', supplier: 'L’Oréal India Professional', purchasePrice: 950, sellingPrice: 1500, stockQuantity: 28, minStockLevel: 6 },
    { name: 'L’Oréal Serie Expert Absolut Repair Masque (250ml)', sku: 'LOR-MSQ-002', category: 'HAIRCARE', supplier: 'L’Oréal India Professional', purchasePrice: 1100, sellingPrice: 1750, stockQuantity: 19, minStockLevel: 5 },
    { name: 'Olaplex No. 3 Hair Perfector (100ml)', sku: 'OLA-PRF-003', category: 'TREATMENT', supplier: 'Olaplex Distributor South', purchasePrice: 1800, sellingPrice: 2850, stockQuantity: 14, minStockLevel: 4 },
    { name: 'Olaplex No. 7 Bonding Oil (30ml)', sku: 'OLA-OIL-004', category: 'TREATMENT', supplier: 'Olaplex Distributor South', purchasePrice: 1600, sellingPrice: 2600, stockQuantity: 22, minStockLevel: 5 },
    { name: 'Kérastase Elixir Ultime Hair Oil (100ml)', sku: 'KER-ELX-005', category: 'HAIRCARE', supplier: 'Kérastase Luxury Haircare', purchasePrice: 2400, sellingPrice: 3800, stockQuantity: 11, minStockLevel: 4 },
    { name: 'Kérastase Bain Satin 2 Shampoo (250ml)', sku: 'KER-STN-006', category: 'HAIRCARE', supplier: 'Kérastase Luxury Haircare', purchasePrice: 1500, sellingPrice: 2400, stockQuantity: 16, minStockLevel: 5 },
    { name: 'Moroccanoil Original Treatment (100ml)', sku: 'MOR-TRT-007', category: 'HAIRCARE', supplier: 'L’Oréal India Professional', purchasePrice: 2100, sellingPrice: 3300, stockQuantity: 18, minStockLevel: 5 },
    { name: 'Rica Avocado Liposoluble Wax Can (800ml)', sku: 'RIC-WAX-008', category: 'SKINCARE', supplier: 'L’Oréal India Professional', purchasePrice: 850, sellingPrice: 1400, stockQuantity: 4, minStockLevel: 5 }, // LOW STOCK
    { name: 'Rica Post Wax Soothing Avocado Lotion (500ml)', sku: 'RIC-LOT-009', category: 'SKINCARE', supplier: 'L’Oréal India Professional', purchasePrice: 650, sellingPrice: 1100, stockQuantity: 8, minStockLevel: 4 },
    { name: 'Cheryl’s Cosmeceuticals Dermashade SPF 50 (100g)', sku: 'CHR-SPF-010', category: 'SKINCARE', supplier: 'L’Oréal India Professional', purchasePrice: 420, sellingPrice: 750, stockQuantity: 25, minStockLevel: 6 },
    { name: 'Cheryl’s TanClear Scrub & Pack Kit', sku: 'CHR-TAN-011', category: 'SKINCARE', supplier: 'L’Oréal India Professional', purchasePrice: 1200, sellingPrice: 2100, stockQuantity: 3, minStockLevel: 5 }, // LOW STOCK
    { name: 'OPI GelColor Top Coat (15ml)', sku: 'OPI-TOP-012', category: 'NAILS', supplier: 'OPI International Nails', purchasePrice: 750, sellingPrice: 1250, stockQuantity: 15, minStockLevel: 4 },
    { name: 'OPI GelColor Base Coat (15ml)', sku: 'OPI-BAS-013', category: 'NAILS', supplier: 'OPI International Nails', purchasePrice: 750, sellingPrice: 1250, stockQuantity: 12, minStockLevel: 4 },
    { name: 'OPI Nail Lacquer Big Apple Red (15ml)', sku: 'OPI-RED-014', category: 'NAILS', supplier: 'OPI International Nails', purchasePrice: 450, sellingPrice: 850, stockQuantity: 20, minStockLevel: 4 },
    { name: 'OPI Nail Lacquer Bubble Bath Neutral (15ml)', sku: 'OPI-NUD-015', category: 'NAILS', supplier: 'OPI International Nails', purchasePrice: 450, sellingPrice: 850, stockQuantity: 2, minStockLevel: 5 }, // LOW STOCK
    { name: 'Schwarzkopf Professional Osis+ Dust It (10g)', sku: 'SCH-DST-016', category: 'STYLING', supplier: 'L’Oréal India Professional', purchasePrice: 420, sellingPrice: 750, stockQuantity: 30, minStockLevel: 6 },
    { name: 'Schwarzkopf Osis+ Session Extreme Hairspray (300ml)', sku: 'SCH-SPR-017', category: 'STYLING', supplier: 'L’Oréal India Professional', purchasePrice: 550, sellingPrice: 950, stockQuantity: 24, minStockLevel: 6 },
    { name: 'L’Oréal Majirel Cool Inforced Shade 7.1', sku: 'LOR-MAJ-018', category: 'COLOR', supplier: 'L’Oréal India Professional', purchasePrice: 380, sellingPrice: 650, stockQuantity: 18, minStockLevel: 5 },
    { name: 'L’Oréal Majirel Warm Brown Shade 5.3', sku: 'LOR-MAJ-019', category: 'COLOR', supplier: 'L’Oréal India Professional', purchasePrice: 380, sellingPrice: 650, stockQuantity: 22, minStockLevel: 5 },
    { name: 'L’Oréal Oxydant Crème 20 Volume (1000ml)', sku: 'LOR-OXY-020', category: 'COLOR', supplier: 'L’Oréal India Professional', purchasePrice: 480, sellingPrice: 850, stockQuantity: 10, minStockLevel: 3 },
    { name: 'Dyson Supersonic Professional Filter Cage & Mesh', sku: 'DYS-FLT-021', category: 'EQUIPMENT', supplier: 'L’Oréal India Professional', purchasePrice: 1800, sellingPrice: 2800, stockQuantity: 5, minStockLevel: 2 },
    { name: 'Brazilian Blowout Açai Thermal Straightening Balm', sku: 'BRZ-BLM-022', category: 'TREATMENT', supplier: 'Olaplex Distributor South', purchasePrice: 1400, sellingPrice: 2300, stockQuantity: 9, minStockLevel: 3 },
    { name: 'Kérastase Genesis Anti Hair-Fall Serum (90ml)', sku: 'KER-GEN-023', category: 'TREATMENT', supplier: 'Kérastase Luxury Haircare', purchasePrice: 2600, sellingPrice: 4100, stockQuantity: 12, minStockLevel: 4 },
    { name: 'Olaplex No. 4 Bond Maintenance Shampoo (250ml)', sku: 'OLA-SHP-024', category: 'HAIRCARE', supplier: 'Olaplex Distributor South', purchasePrice: 1700, sellingPrice: 2750, stockQuantity: 17, minStockLevel: 5 },
    { name: 'Olaplex No. 5 Bond Maintenance Conditioner (250ml)', sku: 'OLA-CND-025', category: 'HAIRCARE', supplier: 'Olaplex Distributor South', purchasePrice: 1700, sellingPrice: 2750, stockQuantity: 15, minStockLevel: 5 },
    { name: 'MAC Prep + Prime Fix+ Makeup Setting Mist (100ml)', sku: 'MAC-FIX-026', category: 'BRIDAL', supplier: 'L’Oréal India Professional', purchasePrice: 1300, sellingPrice: 2150, stockQuantity: 14, minStockLevel: 4 },
    { name: 'Huda Beauty Easy Bake Loose Baking Powder (20g)', sku: 'HUD-BAK-027', category: 'BRIDAL', supplier: 'L’Oréal India Professional', purchasePrice: 1900, sellingPrice: 3100, stockQuantity: 8, minStockLevel: 3 },
    { name: 'Anastasia Beverly Hills Dipbrow Pomade Dark Brown', sku: 'ABH-BRW-028', category: 'BEAUTY', supplier: 'L’Oréal India Professional', purchasePrice: 1400, sellingPrice: 2200, stockQuantity: 12, minStockLevel: 3 },
    { name: 'L’Oréal Professional Mythic Oil Nourishing Mask (200ml)', sku: 'LOR-MYT-029', category: 'HAIRCARE', supplier: 'L’Oréal India Professional', purchasePrice: 900, sellingPrice: 1550, stockQuantity: 14, minStockLevel: 4 },
    { name: 'OPI Avoplex Cuticle Oil To Go (7.5ml)', sku: 'OPI-AVO-030', category: 'NAILS', supplier: 'OPI International Nails', purchasePrice: 380, sellingPrice: 650, stockQuantity: 32, minStockLevel: 8 },
  ];

  for (const prod of productsData) {
    const p = await Product.create(prod);
    await InventoryTransaction.create({
      product: p._id,
      productName: p.name,
      sku: p.sku,
      type: 'STOCK_IN',
      quantity: p.stockQuantity,
      reason: 'Warehouse restock allocation',
      performedBy: 'Vikramaditya Roy (Admin)',
    });
  }

  // 8. 100+ Realistic Appointments across past 90 days, current month, and next 30 days
  const timeSlots = [
    { start: '10:00', end: '10:45' },
    { start: '11:00', end: '11:50' },
    { start: '12:00', end: '13:00' },
    { start: '13:30', end: '14:30' },
    { start: '15:00', end: '16:00' },
    { start: '16:30', end: '17:30' },
    { start: '18:00', end: '19:00' },
  ];

  const now = new Date();
  const createdAppointments: any[] = [];

  // Generate 110 appointments
  for (let i = 0; i < 110; i++) {
    // Days offset: -75 to +25
    const dayOffset = Math.floor(i * 0.95) - 75;
    const apptDateObj = new Date(now.getTime() + dayOffset * 86400000);
    const dateStr = apptDateObj.toISOString().split('T')[0];

    // Pick customer and stylist in round-robin fashion so no same stylist overlaps on the same day/slot!
    const customer = createdCustomers[i % createdCustomers.length];
    const stylist = createdStaffDocs[(i * 3) % createdStaffDocs.length];
    const service = createdServices[(i * 2) % createdServices.length];
    const slot = timeSlots[i % timeSlots.length];

    let status: any = 'COMPLETED';
    let paymentStatus: any = 'PAID';

    if (dayOffset > 0) {
      status = i % 5 === 0 ? 'PENDING' : 'CONFIRMED';
      paymentStatus = i % 4 === 0 ? 'PAID' : 'PENDING';
    } else if (dayOffset === 0) {
      status = i % 2 === 0 ? 'IN_PROGRESS' : 'CONFIRMED';
      paymentStatus = 'PENDING';
    } else {
      if (i % 12 === 0) {
        status = 'CANCELLED';
        paymentStatus = 'REFUNDED';
      } else if (i % 20 === 0) {
        status = 'NO_SHOW';
        paymentStatus = 'PENDING';
      } else {
        status = 'COMPLETED';
        paymentStatus = 'PAID';
      }
    }

    const discount = i % 6 === 0 ? 300 : 0;
    const finalPrice = Math.max(0, service.price - discount);
    const appointmentId = `SF-${dateStr.replace(/-/g, '')}-${(1000 + i)}`;

    const appt = await Appointment.create({
      appointmentId,
      customer: customer._id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      service: service._id,
      serviceName: service.name,
      stylist: stylist._id,
      stylistName: stylist.name,
      appointmentDate: dateStr,
      startTime: slot.start,
      endTime: slot.end,
      durationMinutes: service.durationMinutes,
      price: service.price,
      discount,
      finalPrice,
      couponCode: discount > 0 ? 'HAIRSPA' : undefined,
      status,
      paymentStatus,
      notes: i % 4 === 0 ? 'Guest requested cold iced tea upon arrival.' : undefined,
      bookingSource: i % 3 === 0 ? 'ONLINE_WIZARD' : i % 3 === 1 ? 'PHONE' : 'WALK_IN',
    });

    createdAppointments.push(appt);

    // If paid, create payment record & invoice
    if (paymentStatus === 'PAID') {
      const paymentMethods: any = ['UPI', 'CARD', 'CASH', 'ONLINE'];
      const method = paymentMethods[i % paymentMethods.length];
      const paymentId = `PAY-${apptDateObj.getFullYear()}-${(2000 + i)}`;
      const invoiceNumber = `INV-${apptDateObj.getFullYear()}-${(1000 + i)}`;

      const invoice = await Invoice.create({
        invoiceNumber,
        customer: customer._id,
        customerName: customer.name,
        customerPhone: customer.phone,
        appointment: appt._id,
        items: [
          {
            name: service.name,
            quantity: 1,
            unitPrice: service.price,
            totalPrice: service.price,
          },
        ],
        subtotal: service.price,
        discount,
        tax: Math.round(finalPrice * 0.18),
        finalAmount: finalPrice,
        paymentMethod: method,
        paymentStatus: 'PAID',
        issuedDate: apptDateObj,
        paidDate: apptDateObj,
      });

      await Payment.create({
        paymentId,
        appointment: appt._id,
        customer: customer._id,
        customerName: customer.name,
        invoice: invoice._id,
        amount: finalPrice,
        method,
        status: 'PAID',
        date: apptDateObj,
        transactionRef: `UPI${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        notes: `Settlement for appointment ${appointmentId}`,
      });
    }
  }

  // 9. 30 Realistic Reviews (Ratings 4 to 5)
  const reviewsContent = [
    { text: 'Rohan gave me the best haircut of my life! The layers fall so naturally and effortlessly. The Indiranagar salon aesthetic is unmatched.', rating: 5 },
    { text: 'Ananya is an absolute wizard with balayage. My hair looks sun-kissed and dimensional without feeling damaged at all.', rating: 5 },
    { text: 'Priya did my engagement makeup and everyone was raving about the glass skin finish. Truly premium service.', rating: 5 },
    { text: 'The Hydrafacial with Aisha left my skin glowing for weeks. The massage and extractions were so gentle.', rating: 5 },
    { text: 'Sneha did chrome nail extensions for my vacation and they did not chip even once. High quality Japanese builder gel!', rating: 5 },
    { text: 'Vikram did my keratin treatment and it took away 100% of the Bangalore humidity frizz. Super smooth experience.', rating: 5 },
    { text: 'Very relaxing Olaplex hair spa. Beautiful editorial ambiance with soft jazz and herbal teas.', rating: 4 },
    { text: 'Arjun is brilliant with men beard contouring and fades. Sharp, hygienic, and very polite.', rating: 5 },
    { text: 'Meera shaped my brows with such perfection. Painless threading with organic cotton thread.', rating: 4 },
    { text: 'Clean, spotless salon, punctual appointment start, and genuine European luxury products.', rating: 5 },
    { text: 'Had my pre-bridal package here and felt treated like royalty. Every stylist is attentive and master of their craft.', rating: 5 },
    { text: 'Loved the gold facial! My skin looked instantly radiant and lifted. Will be coming back monthly.', rating: 5 },
    { text: 'The foot spa and pedicure was heavenly. The charcoal scrub and hot towel compression were so rejuvenating.', rating: 5 },
    { text: 'Fast, seamless online booking wizard. Got my confirmation right away and didn’t have to wait even 2 minutes at the desk.', rating: 5 },
    { text: 'Top tier salon experience. Rohan listened carefully to what length I wanted and executed it with surgical precision.', rating: 5 },
    { text: 'Ananya spent 20 minutes just discussing my hair history before applying color. Never seen such dedication.', rating: 5 },
    { text: 'The bridal airbrush makeup held up through 8 hours of dancing and sweating. Priya Nair is a genius!', rating: 5 },
    { text: 'Delightful atmosphere, complimentary organic espresso, and gentle treatment. Well worth every rupee.', rating: 5 },
    { text: 'Clean Russian manicure by Sneha. The cuticle care was so meticulous. My nails look immaculate.', rating: 5 },
    { text: 'Extremely professional staff. Receptionist Tanvi was very welcoming and guided me to the VIP lounge.', rating: 4 },
    { text: 'Had the scalp detox therapy. My flaky irritated scalp felt instantly soothed and cool.', rating: 5 },
    { text: 'The 24K gold mask felt so luxurious. My skin texture has noticeably smoothed out.', rating: 5 },
    { text: 'Great haircut by Arjun. High attention to detail with scissor over comb techniques.', rating: 4 },
    { text: 'A tranquil sanctuary in the middle of Indiranagar. Left feeling rejuvenated and confident.', rating: 5 },
    { text: 'Their loyalty program actually gives good value! Redeemed points easily on my blow dry.', rating: 5 },
    { text: 'The Rica avocado wax was far less painful than regular wax. Very clean and hygienic cabins.', rating: 4 },
    { text: 'My balayage grow-out is completely seamless. Ananya blended the roots so naturally.', rating: 5 },
    { text: 'Always a pleasure visiting SalonFlow. The level of care and personalized attention is exceptional.', rating: 5 },
    { text: 'Best salon in Bengaluru hands down. Modern booking system, polite stylists, and authentic results.', rating: 5 },
    { text: 'Five stars across the board! Everything from the consultation to the final blowout was perfection.', rating: 5 },
  ];

  for (let i = 0; i < reviewsContent.length; i++) {
    const rev = reviewsContent[i];
    const appt = createdAppointments[i];
    await Review.create({
      customer: appt.customer,
      customerName: appt.customerName,
      appointment: appt._id,
      service: appt.service,
      serviceName: appt.serviceName,
      stylist: appt.stylist,
      stylistName: appt.stylistName,
      rating: rev.rating,
      reviewText: rev.text,
      approved: true,
      featured: rev.rating === 5,
      date: new Date(Date.now() - (i + 1) * 86400000 * 2),
    });
  }

  // 10. 15 System Notifications
  const sampleNotifications = [
    { type: 'APPOINTMENT_BOOKED', title: 'New Online Booking', message: 'Meera Nambiar booked Royal Bridal Haute Couture Makeup with Priya Nair.', link: '/admin/appointments' },
    { type: 'APPOINTMENT_CONFIRMED', title: 'Booking Confirmed', message: 'Appointment SF-20261124-1045 has been confirmed by receptionist.', link: '/admin/appointments' },
    { type: 'LOW_INVENTORY', title: 'Low Stock Alert', message: 'OPI Nail Lacquer Bubble Bath is running low (2 units remaining).', link: '/admin/inventory' },
    { type: 'LOW_INVENTORY', title: 'Low Stock Alert', message: 'Cheryl’s TanClear Kit is below minimum threshold (3 units remaining).', link: '/admin/inventory' },
    { type: 'PAYMENT_COMPLETED', title: 'Payment Received', message: 'Received ₹18,500 via UPI from Meera Nambiar for Bridal package.', link: '/admin/billing' },
    { type: 'NEW_CUSTOMER', title: 'New Customer Registered', message: 'Samantha Prabhu registered profile via customer portal.', link: '/admin/customers' },
    { type: 'NEW_REVIEW', title: '5-Star Review Received', message: 'Pooja Hegde reviewed L’Oréal Balayage with Ananya Sharma: "Absolute wizard!".', link: '/admin/reviews' },
    { type: 'APPOINTMENT_REMINDER', title: 'Upcoming Appointment', message: 'Kriti Sanon has an appointment today at 15:00 with Rohan Mehra.', link: '/admin/appointments' },
    { type: 'LOW_INVENTORY', title: 'Low Stock Alert', message: 'Rica Avocado Wax Can is running low (4 cans left).', link: '/admin/inventory' },
    { type: 'PAYMENT_COMPLETED', title: 'Payment Received', message: 'Received ₹4,800 via Card from Aditi Varma for Balayage.', link: '/admin/billing' },
  ];

  for (const n of sampleNotifications) {
    await Notification.create({
      ...n,
      read: false,
    });
  }

  console.log('[Seeder] Database seeding successfully completed!');
  console.log('---------------------------------------------------------');
  console.log('DEMO ACCOUNTS SEEDED:');
  console.log('Admin:       admin@salonflow.demo       / Admin@123');
  console.log('Owner:       owner@salonflow.demo       / Owner@123');
  console.log('Reception:   reception@salonflow.demo   / Reception@123');
  console.log('Stylist:     stylist@salonflow.demo     / Stylist@123');
  console.log('Customer:    customer@salonflow.demo    / Customer@123');
  console.log('---------------------------------------------------------');
};

// If run directly via CLI
if (require.main === module) {
  connectDB().then(async () => {
    await seedDatabase();
    process.exit(0);
  });
}
