import { AdminSideNavItem } from './admin-item';
import { House } from 'lucide-react'

export const SIDENAV_ITEMS: AdminSideNavItem[] = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
  },
  {
    title: 'Staffs',
    path: '/admin/staffs',
  },
  {
    title: 'Menu',
    path: '/admin/menu',
  },
  {
    title: 'Reservations',
    path: '/admin/reservations',
  },
  {
    title: 'Customers',
    path: '/admin/customers',
  },
  {
    title: 'Orders',
    path: '/#',
  },
  {
    title: 'Dine in',
    path: '/admin/orders/dine-in',
  },
  {
    title: 'Delivery',
    path: '/admin/orders/delivery',
  },
  {
    title: 'Invoice',
    path: '/admin/invoice',
  },
];
