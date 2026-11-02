import React from 'react';
import { 
  Utensils, 
  Home, 
  Car, 
  Film, 
  HeartPulse, 
  GraduationCap, 
  ShoppingBag, 
  Briefcase, 
  TrendingUp, 
  Code, 
  Receipt, 
  Zap, 
  Coffee, 
  Plane, 
  CreditCard,
  DollarSign,
  LucideIcon
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  color?: string;
}

const iconMap: Record<string, LucideIcon> = {
  Utensils,
  Home,
  Car,
  Film,
  HeartPulse,
  GraduationCap,
  ShoppingBag,
  Briefcase,
  TrendingUp,
  Code,
  Receipt,
  Zap,
  Coffee,
  Plane,
  CreditCard,
  DollarSign
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = "w-5 h-5", color }) => {
  const IconComponent = iconMap[name] || Receipt;
  return <IconComponent className={className} style={color ? { color } : undefined} />;
};
