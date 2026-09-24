export interface SiteSettings {
  id: string;
  companyName: string;
  domain: string;
  phone: string;
  mobile1: string;
  mobile2: string;
  address: string;
  instagram: string;
  whatsapp1: string;
  whatsapp2: string;
  mapLatitude: number;
  mapLongitude: number;
  mapZoom: number;
  heroHeading: string;
  heroSubheading: string;
  heroImageUrl: string;
  aboutImageUrl: string;
  contactImageUrl: string;
  seoTitle: string;
  seoDescription: string;
  updatedAt?: Date | string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  detailedDesc: string;
  mainImage: string;
  additionalImages: string[]; // parsed array
  features: string[]; // parsed array
  priceInfo?: string | null;
  displayOrder: number;
  active: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  category: string;
  displayOrder: number;
  active: boolean;
  createdAt?: Date | string;
}

export interface BookingItem {
  id: string;
  referenceId: string;
  serviceId: string;
  serviceName: string;
  fullName: string;
  address: string;
  phone: string;
  description?: string | null;
  requestedDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  rejectionReason?: string | null;
  acceptedAt?: Date | string | null;
  rejectedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: string;
}

export interface LoyaltyConfig {
  id: string;
  programName: string;
  programTagline: string;
  isActive: boolean;
  rewardMode: 'STAMPS' | 'POINTS';
  stampsPerReward: number;
  stampsPerVisit: number;
  pointsPerAed: number;
  rewardExpiryDays: number;
  rewardTitle: string;
  rewardDescription: string;
  termsConditions: string;
  updatedAt?: Date | string;
}

export interface LoyaltyCustomerItem {
  id: string;
  loyaltyId: string;
  fullName: string;
  phone: string;
  email?: string | null;
  plateNumber?: string | null;
  vehicleMake?: string | null;
  vehicleModel?: string | null;
  vehicleYear?: string | null;
  status: 'ACTIVE' | 'SUSPENDED';
  currentStamps: number;
  lifetimeStamps: number;
  currentPoints: number;
  lifetimePoints: number;
  qrCodeToken: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  transactions?: LoyaltyTransactionItem[];
  redemptions?: LoyaltyRedemptionItem[];
}

export interface LoyaltyRewardItem {
  id: string;
  title: string;
  description: string;
  requiredStamps: number;
  requiredPoints: number;
  validDays: number;
  isActive: boolean;
  redemptionLimit?: number | null;
  redemptionCount: number;
  displayOrder: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface LoyaltyRedemptionItem {
  id: string;
  redemptionCode: string;
  customerId: string;
  rewardId: string;
  rewardTitle: string;
  status: 'COMPLETED' | 'REVERSED';
  serviceReference?: string | null;
  adminUsername: string;
  notes?: string | null;
  redeemedAt: Date | string;
  reversedAt?: Date | string | null;
  reversedBy?: string | null;
  customer?: {
    fullName: string;
    phone: string;
    loyaltyId: string;
    plateNumber?: string | null;
  };
}

export interface LoyaltyTransactionItem {
  id: string;
  customerId: string;
  type: string;
  amount: number;
  balanceAfter: number;
  serviceName?: string | null;
  serviceReference?: string | null;
  adminUsername?: string | null;
  notes?: string | null;
  createdAt: Date | string;
  customer?: {
    fullName: string;
    phone: string;
    loyaltyId: string;
  };
}

