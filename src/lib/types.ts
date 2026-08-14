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
