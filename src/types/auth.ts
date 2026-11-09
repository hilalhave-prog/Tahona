export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  role: 'owner' | 'production_manager' | 'chemist' | 'weighbridge_operator' | 'accountant';
  millId: string;
}

export interface MillTenant {
  id: string;
  nameAr: string;
  nameFr: string;
  wilaya: string;
  commune: string;
  oaicAgreementNumber: string;
  rcNumber: string;
  nifNumber: string;
  nisNumber: string;
  articleNumber: string;
  dailyCapacityQx: number;
  phone: string;
  email: string;
  ownerName: string;
  createdAt: string;
}
