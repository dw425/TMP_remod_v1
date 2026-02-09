export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  role: 'user' | 'admin' | 'partner';
  createdAt: string;
  lastLogin: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
}

export interface Order {
  id: string;
  items: { title: string; type: string; price: number; billing: string }[];
  total: number;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  createdAt: string;
  contactEmail: string;
  companyName: string;
}
