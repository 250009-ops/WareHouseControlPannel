export type ProductStatus = "Sotilgan" | "Sotilmagan";
export type DebtBadge = "To'langan" | "To'lanmagan";
export type PaymentType = "Naqd" | "Karta" | "Qarz";
export type SaleStatus = "Tasdiqlangan" | "Bekor qilingan";
export type DebtStatus = "Jarayonda" | "To'langan" | "Muddati o'tgan";
export type AdminRole = "Super Admin" | "Admin" | "Moderator";
export type AdminStatus = "Active" | "Inactive";

export type Product = {
  id: string;
  name: string;
  brand: string;
  size: string;
  color: string;
  chinaUsd: number;
  cargoUsd: number;
  costUzs: number;
  sellUzs: number;
  soldUzs: number | null;
  status: ProductStatus;
  debt: DebtBadge;
  image: string;
  imageName?: string;
};

export type Sale = {
  id: string;
  date: string;
  productId: string;
  quantity: number;
  sellPrice: number;
  soldPrice: number;
  paymentType: PaymentType;
  customer: string;
  status: SaleStatus;
};

export type Debt = {
  id: string;
  debtor: string;
  phone: string;
  productId: string;
  amount: number;
  issuedAt: string;
  dueAt: string;
  paid: number;
  status: DebtStatus;
};

export type Admin = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: AdminRole;
  status: AdminStatus;
  joinedAt: string;
  avatar: string;
};

export type Settings = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: AdminRole;
  avatar: string;
  companyName: string;
  companyAddress: string;
  usdRate: number;
  rateUpdatedAt: string;
  notifySales: boolean;
  notifyDebts: boolean;
  notifyLowStock: boolean;
};

export type AppState = {
  products: Product[];
  sales: Sale[];
  debts: Debt[];
  admins: Admin[];
  settings: Settings;
};

export type SessionUser = {
  email: string;
  name: string;
  role: AdminRole;
  avatar: string;
};
