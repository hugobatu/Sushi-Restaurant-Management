import { AdminSideNavItem } from './admin-item';
import { House } from 'lucide-react'

export const SIDENAV_ITEMS: AdminSideNavItem[] = [
  {
    title: 'Dashboard',
    path: '/a/dashboard',
  },
  {
    title: 'Staffs',
    path: '/a/staffs',
  },
  {
    title: 'Menu',
    path: '/a/menu',
  },
  {
    title: 'Reservations',
    path: '/a/reservations',
  },
  {
    title: 'Customers',
    path: '/a/customers',
  },
  {
    title: 'Orders',
    path: '/#',
  },
  {
    title: 'Dine in',
    path: '/a/orders/dine-in',
  },
  {
    title: 'Delivery',
    path: '/a/orders/delivery',
  },
  {
    title: 'Invoice',
    path: '/a/invoice',
  },
];
