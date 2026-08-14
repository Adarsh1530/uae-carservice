import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting WHALESS GROUP Database & Asset Seed...');

  // 1. Copy local images from Desktop/imgs to public/uploads
  const sourceDir = 'C:\\Users\\KEERTHI ADARSH M P\\Desktop\\imgs';
  const targetDir = path.join(process.cwd(), 'public', 'uploads');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const imageMapping: Record<string, string> = {};

  if (fs.existsSync(sourceDir)) {
    const files = fs.readdirSync(sourceDir);
    console.log(`📁 Found ${files.length} source images in local folder.`);
    for (const file of files) {
      const srcPath = path.join(sourceDir, file);
      const cleanFileName = file.toLowerCase().replace(/[^a-z0-9._-]/g, '_');
      const destPath = path.join(targetDir, cleanFileName);
      fs.copyFileSync(srcPath, destPath);
      imageMapping[file] = `/uploads/${cleanFileName}`;
      console.log(`  ✓ Copied ${file} -> /uploads/${cleanFileName}`);
    }
  } else {
    console.warn(`⚠️ Source image directory not found at ${sourceDir}, creating fallback placeholders.`);
  }

  // 2. Admin User Bootstrapping
  const adminUsername = 'WALESSGROUP';
  const rawPassword = 'Walessgroup@2026';
  const passwordHash = await bcrypt.hash(rawPassword, 12);

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        username: adminUsername,
        passwordHash: passwordHash,
        name: 'WHALESS GROUP Administrator',
        role: 'ADMIN',
      },
    });
    console.log(`✅ Default admin account initialized: Username '${adminUsername}'`);
  } else {
    console.log(`ℹ️ Admin account '${adminUsername}' already exists.`);
  }

  // 3. Site Settings Initialization
  const heroImg = imageMapping['home page.jpg'] || '/uploads/home_page.jpg';
  const aboutImg = imageMapping['gallery (1).jpg'] || '/uploads/gallery__1_.jpg';
  const contactImg = imageMapping['gallery (12).jpg'] || '/uploads/gallery__12_.jpg';

  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {
      heroImageUrl: heroImg,
      aboutImageUrl: aboutImg,
      contactImageUrl: contactImg,
    },
    create: {
      id: 'default',
      companyName: 'WHALESS GROUP',
      domain: 'walessgroup.ae',
      phone: '+971 7 222 868',
      mobile1: '+971 54 307 2733',
      mobile2: '+971 54 307 2711',
      address: 'AL DHAIT SOUTH, RAS AL KHAIMAH, UNITED ARAB EMIRATES',
      instagram: '@waless_group',
      whatsapp1: '+971543072733',
      whatsapp2: '+971543072711',
      mapLatitude: 25.7533,
      mapLongitude: 55.9525,
      mapZoom: 14,
      heroHeading: 'BESPOKE AUTOMOTIVE EXCELLENCE & CORPORATE INNOVATION',
      heroSubheading: 'WHALESS GROUP represents the pinnacle of luxury vehicle customization, precision engineering, performance tuning, and executive solutions in Ras Al Khaimah and across the UAE.',
      heroImageUrl: heroImg,
      aboutImageUrl: aboutImg,
      contactImageUrl: contactImg,
      seoTitle: 'WHALESS GROUP | Luxury Automotive Customization & Corporate Solutions UAE',
      seoDescription: 'Official website of WHALESS GROUP, Ras Al Khaimah. Premium bespoke vehicle modifications, executive detailing, performance upgrades, and corporate services.',
    },
  });
  console.log('✅ Site Settings seeded successfully.');

  // 4. Services Seed Data
  const defaultServices = [
    {
      slug: 'bespoke-vehicle-customization',
      name: 'Bespoke Vehicle Customization',
      shortDesc: 'Tailored exterior and interior craftsmanship designed for ultra-luxury automobiles.',
      detailedDesc: 'Experience complete vehicle transformation tailored strictly to your individual aesthetic and engineering desires. From wide-body dynamic kits and forged aerodynamic carbon components to handcrafted leather upholstery, ambient starry lighting, and custom gold/metal exterior trims.',
      mainImage: imageMapping['gallery (2).jpg'] || '/uploads/gallery__2_.jpg',
      additionalImages: JSON.stringify([
        imageMapping['gallery (3).jpg'] || '/uploads/gallery__3_.jpg',
        imageMapping['gallery (4).jpg'] || '/uploads/gallery__4_.jpg',
      ]),
      features: JSON.stringify([
        'Custom Aero Carbon Fiber Body Kits',
        'Handcrafted Italian Nappa Leather Upholstery',
        'Starlight LED Ceiling & Ambient Mood Light Systems',
        'Precision Wheel & Forged Rim Fitments',
        'Tailor-Made Interior Monograms & Accents',
      ]),
      priceInfo: 'Bespoke Quote Upon Consultation',
      displayOrder: 1,
    },
    {
      slug: 'executive-auto-detailing-protection',
      name: 'Executive Detailing & Ceramic Protection',
      shortDesc: 'Paint Protection Film (PPF), 9H Ceramic Coatings, and high-end aesthetic restoration.',
      detailedDesc: 'Preserve and accentuate your vehicle’s finish with state-of-the-art multi-stage paint correction, ultra-hydrophobic self-healing PPF, ceramic glass armor, and hospital-grade interior leather and suede restoration.',
      mainImage: imageMapping['gallery (5).jpg'] || '/uploads/gallery__5_.jpg',
      additionalImages: JSON.stringify([
        imageMapping['gallery (6).jpg'] || '/uploads/gallery__6_.jpg',
        imageMapping['gallery (7).jpg'] || '/uploads/gallery__7_.jpg',
      ]),
      features: JSON.stringify([
        'Multi-Stage Precision Paint Correction & Polish',
        'Self-Healing TPU Paint Protection Film (PPF)',
        '9H Nanotech Ceramic & Graphene Coating',
        'Deep Leather Steam Conditioning & Hydrophobic Protection',
        'Engine Bay & Undercarriage Glass Restoration',
      ]),
      priceInfo: 'Premium Package Options',
      displayOrder: 2,
    },
    {
      slug: 'high-performance-tuning-exhaust',
      name: 'High-Performance Engine & Exhaust Tuning',
      shortDesc: 'ECU/TCU recalibration, titanium valved exhaust systems, and precision diagnostics.',
      detailedDesc: 'Unlock maximum horsepower, torque, and thrilling acoustic dynamics with customized ECU remapping, high-flow titanium performance exhaust installations, cold air intake systems, and master-level diagnostic calibration.',
      mainImage: imageMapping['gallery (8).jpg'] || '/uploads/gallery__8_.jpg',
      additionalImages: JSON.stringify([
        imageMapping['gallery (9).jpg'] || '/uploads/gallery__9_.jpg',
        imageMapping['gallery (10).jpg'] || '/uploads/gallery__10_.jpg',
      ]),
      features: JSON.stringify([
        'Custom ECU/TCU Stage 1, 2 & 3 Dyno Software Mapping',
        'Valved Titanium & Inconel Performance Exhausts',
        'Cold Air Carbon Intake & Downpipe Systems',
        'Bespoke Braking & Suspension Upgrades',
        'Advanced OBD-II Computer Diagnostics',
      ]),
      priceInfo: 'Consultation Required',
      displayOrder: 3,
    },
    {
      slug: 'luxury-armored-fleet-solutions',
      name: 'VIP & Armored Fleet Solutions',
      shortDesc: 'Specialized vehicle fortification, security enhancement, and executive transportation setups.',
      detailedDesc: 'WHALESS GROUP offers tactical and luxury vehicle reinforcement, bullet-resistant glass integrations, reinforced suspension components, and customized executive rear VIP cabin lounges for dignitaries and elite clients.',
      mainImage: imageMapping['gallery (11).jpg'] || '/uploads/gallery__11_.jpg',
      additionalImages: JSON.stringify([
        imageMapping['gallery (13).jpg'] || '/uploads/gallery__13_.jpg',
        imageMapping['gallery (14).jpg'] || '/uploads/gallery__14_.jpg',
      ]),
      features: JSON.stringify([
        'B6 & B7 Level Armor Glass & Ballistic Protection',
        'VIP Partition Lounge Screens with Smart Automation',
        'Reinforced Heavy-Duty Suspension & Run-Flat Tires',
        'Encrypted Communications & Executive Consoles',
        'Custom Security Light & Siren Integration',
      ]),
      priceInfo: 'Exclusive Executive Pricing',
      displayOrder: 4,
    },
    {
      slug: 'corporate-automobile-consultancy',
      name: 'Corporate Fleet & Brand Consulting',
      shortDesc: 'End-to-end corporate fleet acquisition, branding, and maintenance architecture.',
      detailedDesc: 'Strategic consulting for corporate clients and luxury fleet owners across Ras Al Khaimah and the UAE. Complete lifecycle management, custom corporate livery designs, preventive maintenance scheduling, and vehicle evaluation.',
      mainImage: imageMapping['gallery (15).jpg'] || '/uploads/gallery__15_.jpg',
      additionalImages: JSON.stringify([
        imageMapping['gallery (1).jpg'] || '/uploads/gallery__1_.jpg',
      ]),
      features: JSON.stringify([
        'Corporate Fleet Fleet Customization & Branding',
        'Automated Maintenance & Inspection Scheduling',
        'Vehicle Valuation & Technical Audit Reports',
        'VIP Transportation Logistics Management',
      ]),
      priceInfo: 'Retainer & Project Contracts',
      displayOrder: 5,
    },
  ];

  for (const s of defaultServices) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log('✅ Services seeded successfully.');

  // 5. Gallery Images Seed Data
  const categories = ['Luxury Customization', 'Detailing & PPF', 'Performance Tuning', 'VIP Cabin'];
  const galleryList = [
    { file: 'home page.jpg', title: 'WHALESS GROUP Flagship Showcase', cat: 'Luxury Customization' },
    { file: 'gallery (1).jpg', title: 'Corporate Lounge & Workshop Exterior', cat: 'Corporate' },
    { file: 'gallery (2).jpg', title: 'Carbon Aero Widebody Craftsmanship', cat: 'Luxury Customization' },
    { file: 'gallery (3).jpg', title: 'Handcrafted Bespoke Interior Upholstery', cat: 'VIP Cabin' },
    { file: 'gallery (4).jpg', title: 'Starlight Ceiling Lighting Integration', cat: 'VIP Cabin' },
    { file: 'gallery (5).jpg', title: '9H Ceramic Mirror Polish Finish', cat: 'Detailing & PPF' },
    { file: 'gallery (6).jpg', title: 'Self-Healing TPU PPF Application', cat: 'Detailing & PPF' },
    { file: 'gallery (7).jpg', title: 'High-Precision Wheel & Rim Fitment', cat: 'Luxury Customization' },
    { file: 'gallery (8).jpg', title: 'Titanium Valved Performance Exhaust', cat: 'Performance Tuning' },
    { file: 'gallery (9).jpg', title: 'Dyno ECU Software Optimization', cat: 'Performance Tuning' },
    { file: 'gallery (10).jpg', title: 'Carbon Fiber Cold Air Intake System', cat: 'Performance Tuning' },
    { file: 'gallery (11).jpg', title: 'Armored B7 Glass Fortification', cat: 'Luxury Customization' },
    { file: 'gallery (12).jpg', title: 'WHALESS GROUP Ras Al Khaimah Headquarters', cat: 'Corporate' },
    { file: 'gallery (13).jpg', title: 'VIP Rear Suite Partition Console', cat: 'VIP Cabin' },
    { file: 'gallery (14).jpg', title: 'Bespoke Executive Seating Concept', cat: 'VIP Cabin' },
    { file: 'gallery (15).jpg', title: 'Corporate Fleet Delivery Lineup', cat: 'Corporate' },
  ];

  let order = 1;
  for (const item of galleryList) {
    const imgUrl = imageMapping[item.file] || `/uploads/${item.file.toLowerCase().replace(/[^a-z0-9._-]/g, '_')}`;
    await prisma.galleryImage.create({
      data: {
        title: item.title,
        description: `${item.title} delivered by WHALESS GROUP in Ras Al Khaimah, UAE.`,
        imageUrl: imgUrl,
        category: item.cat,
        displayOrder: order++,
        active: true,
      },
    });
  }
  console.log('✅ Gallery Images seeded successfully.');

  console.log('🎉 WHALESS GROUP Database Seeding Completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
