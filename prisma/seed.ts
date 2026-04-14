import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as any)

const LEADS_DATA = [
  { address: '4521 N Desert Bloom Dr', city: 'Phoenix', state: 'AZ', zipCode: '85001', lat: 33.4484, lng: -112.0740, lotSizeSqFt: 8400, homeValue: 485000, ownerName: 'Robert Martinez', yearBuilt: 1998, sunExposure: 'full', recentSale: false },
  { address: '1823 W Cactus Flower Ln', city: 'Phoenix', state: 'AZ', zipCode: '85001', lat: 33.4521, lng: -112.0812, lotSizeSqFt: 9200, homeValue: 612000, ownerName: 'Jennifer Walsh', yearBuilt: 2004, sunExposure: 'full', recentSale: true },
  { address: '7654 E Sunridge Rd', city: 'Phoenix', state: 'AZ', zipCode: '85001', lat: 33.4498, lng: -112.0658, lotSizeSqFt: 11500, homeValue: 728000, ownerName: 'Michael Chen', yearBuilt: 2001, sunExposure: 'full', recentSale: false },
  { address: '2901 S Paseo Bonito', city: 'Phoenix', state: 'AZ', zipCode: '85001', lat: 33.4412, lng: -112.0891, lotSizeSqFt: 7800, homeValue: 394000, ownerName: 'Sarah Thompson', yearBuilt: 1995, sunExposure: 'partial', recentSale: false },
  { address: '5187 N Acacia Way', city: 'Phoenix', state: 'AZ', zipCode: '85001', lat: 33.4567, lng: -112.0723, lotSizeSqFt: 10300, homeValue: 543000, ownerName: 'David Kim', yearBuilt: 2007, sunExposure: 'full', recentSale: true },
  { address: '8832 E Camelback Rd', city: 'Scottsdale', state: 'AZ', zipCode: '85251', lat: 33.5092, lng: -111.9261, lotSizeSqFt: 14200, homeValue: 892000, ownerName: 'Amanda Foster', yearBuilt: 2003, sunExposure: 'full', recentSale: false },
  { address: '3345 N Scottsdale Rd', city: 'Scottsdale', state: 'AZ', zipCode: '85251', lat: 33.5134, lng: -111.9198, lotSizeSqFt: 12800, homeValue: 1050000, ownerName: 'James Rodriguez', yearBuilt: 2010, sunExposure: 'full', recentSale: true },
  { address: '6721 E Lincoln Dr', city: 'Scottsdale', state: 'AZ', zipCode: '85251', lat: 33.5021, lng: -111.9342, lotSizeSqFt: 16500, homeValue: 1240000, ownerName: 'Patricia Lee', yearBuilt: 2008, sunExposure: 'full', recentSale: false },
  { address: '412 Lakeview Blvd', city: 'Orlando', state: 'FL', zipCode: '32801', lat: 28.5384, lng: -81.3789, lotSizeSqFt: 9800, homeValue: 425000, ownerName: 'Carlos Rivera', yearBuilt: 2000, sunExposure: 'full', recentSale: false },
  { address: '2234 Magnolia Ave', city: 'Orlando', state: 'FL', zipCode: '32801', lat: 28.5412, lng: -81.3856, lotSizeSqFt: 8600, homeValue: 378000, ownerName: 'Lisa Anderson', yearBuilt: 1997, sunExposure: 'partial', recentSale: true },
  { address: '891 Palms Terrace', city: 'Orlando', state: 'FL', zipCode: '32801', lat: 28.5356, lng: -81.3721, lotSizeSqFt: 11200, homeValue: 562000, ownerName: 'Thomas Brown', yearBuilt: 2005, sunExposure: 'full', recentSale: false },
  { address: '5523 Cypress Creek Rd', city: 'Orlando', state: 'FL', zipCode: '32801', lat: 28.5478, lng: -81.3934, lotSizeSqFt: 13400, homeValue: 687000, ownerName: 'Maria Gonzalez', yearBuilt: 2012, sunExposure: 'full', recentSale: false },
  { address: '734 Orange Blossom Way', city: 'Orlando', state: 'FL', zipCode: '32801', lat: 28.5389, lng: -81.3812, lotSizeSqFt: 7400, homeValue: 312000, ownerName: 'Kevin Wilson', yearBuilt: 1993, sunExposure: 'partial', recentSale: true },
  { address: '1892 Butler Bay Dr', city: 'Windermere', state: 'FL', zipCode: '34786', lat: 28.4989, lng: -81.5234, lotSizeSqFt: 18700, homeValue: 1180000, ownerName: 'Elizabeth Parker', yearBuilt: 2015, sunExposure: 'full', recentSale: false },
  { address: '3456 Spyglass Hill Rd', city: 'Windermere', state: 'FL', zipCode: '34786', lat: 28.5012, lng: -81.5289, lotSizeSqFt: 21000, homeValue: 1450000, ownerName: 'William Davis', yearBuilt: 2018, sunExposure: 'full', recentSale: true },
  { address: '6789 Lakewood Blvd', city: 'Dallas', state: 'TX', zipCode: '75201', lat: 32.7767, lng: -96.7970, lotSizeSqFt: 9500, homeValue: 495000, ownerName: 'Nancy White', yearBuilt: 2002, sunExposure: 'full', recentSale: false },
  { address: '2341 Swiss Ave', city: 'Dallas', state: 'TX', zipCode: '75201', lat: 32.7812, lng: -96.7845, lotSizeSqFt: 10800, homeValue: 678000, ownerName: 'Richard Harris', yearBuilt: 1999, sunExposure: 'full', recentSale: false },
  { address: '8901 Turtle Creek Blvd', city: 'Dallas', state: 'TX', zipCode: '75201', lat: 32.7734, lng: -96.8012, lotSizeSqFt: 14300, homeValue: 892000, ownerName: 'Sandra Clark', yearBuilt: 2006, sunExposure: 'partial', recentSale: true },
  { address: '445 Mockingbird Ln', city: 'Dallas', state: 'TX', zipCode: '75201', lat: 32.7789, lng: -96.7923, lotSizeSqFt: 8900, homeValue: 423000, ownerName: 'George Lewis', yearBuilt: 1996, sunExposure: 'full', recentSale: false },
  { address: '1120 Gaston Ave', city: 'Dallas', state: 'TX', zipCode: '75201', lat: 32.7756, lng: -96.7889, lotSizeSqFt: 11600, homeValue: 589000, ownerName: 'Barbara Hall', yearBuilt: 2009, sunExposure: 'full', recentSale: false },
  { address: '3782 Legacy Dr', city: 'Plano', state: 'TX', zipCode: '75023', lat: 33.0198, lng: -96.6989, lotSizeSqFt: 12400, homeValue: 645000, ownerName: 'Joseph Young', yearBuilt: 2001, sunExposure: 'full', recentSale: true },
  { address: '8234 Preston Rd', city: 'Plano', state: 'TX', zipCode: '75023', lat: 33.0156, lng: -96.7012, lotSizeSqFt: 10900, homeValue: 512000, ownerName: 'Margaret Allen', yearBuilt: 2004, sunExposure: 'full', recentSale: false },
  { address: '9102 E Camelback Ct', city: 'Paradise Valley', state: 'AZ', zipCode: '85253', lat: 33.5312, lng: -111.9456, lotSizeSqFt: 22000, homeValue: 1890000, ownerName: 'Charles Scott', yearBuilt: 2016, sunExposure: 'full', recentSale: false },
  { address: '4467 N Palo Cristi Rd', city: 'Paradise Valley', state: 'AZ', zipCode: '85253', lat: 33.5289, lng: -111.9512, lotSizeSqFt: 19800, homeValue: 2100000, ownerName: 'Dorothy King', yearBuilt: 2019, sunExposure: 'full', recentSale: true },
  { address: '5834 Summerlin Pkwy', city: 'Las Vegas', state: 'NV', zipCode: '89101', lat: 36.1699, lng: -115.1398, lotSizeSqFt: 8200, homeValue: 445000, ownerName: 'Paul Wright', yearBuilt: 2003, sunExposure: 'full', recentSale: false },
  { address: '2198 Desert Inn Rd', city: 'Las Vegas', state: 'NV', zipCode: '89101', lat: 36.1745, lng: -115.1456, lotSizeSqFt: 9600, homeValue: 523000, ownerName: 'Ruth Lopez', yearBuilt: 2007, sunExposure: 'full', recentSale: false },
  { address: '7623 Warm Springs Rd', city: 'Henderson', state: 'NV', zipCode: '89002', lat: 36.0397, lng: -115.0356, lotSizeSqFt: 11800, homeValue: 634000, ownerName: 'Frank Hill', yearBuilt: 2011, sunExposure: 'full', recentSale: true },
  { address: '1823 Gulf Blvd', city: 'Clearwater', state: 'FL', zipCode: '33755', lat: 27.9659, lng: -82.8001, lotSizeSqFt: 9300, homeValue: 498000, ownerName: 'Helen Green', yearBuilt: 2002, sunExposure: 'full', recentSale: false },
  { address: '5634 Mandalay Ave', city: 'Clearwater', state: 'FL', zipCode: '33755', lat: 27.9712, lng: -82.8045, lotSizeSqFt: 10500, homeValue: 612000, ownerName: 'Raymond Adams', yearBuilt: 2008, sunExposure: 'full', recentSale: false },
  { address: '3412 Bayview Dr', city: 'Clearwater', state: 'FL', zipCode: '33755', lat: 27.9634, lng: -82.7956, lotSizeSqFt: 12200, homeValue: 734000, ownerName: 'Deborah Baker', yearBuilt: 2014, sunExposure: 'full', recentSale: true },
]

async function main() {
  console.log('Seeding database...')
  for (const lead of LEADS_DATA) {
    const id = `seed-${lead.address.replace(/\s+/g, '-').toLowerCase().substring(0, 30)}`
    await prisma.lead.upsert({
      where: { id },
      update: {},
      create: { id, ...lead },
    })
  }
  console.log(`Seeded ${LEADS_DATA.length} leads`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
