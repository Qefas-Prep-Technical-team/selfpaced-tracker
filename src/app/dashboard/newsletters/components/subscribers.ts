// data/subscribers.ts

import { Users, UserPlus, UserMinus } from 'lucide-react'

export const stats = [
  {
    id: 1,
    title: 'Total Subscribers',
    value: '1,284',
    change: '+12.5%',
    changeType: 'positive' as const, // Add this
    icon: Users,                   // Add this
  },
  {
    id: 2,
    title: 'New This Month',
    value: '142',
    change: '+5.2%',
    changeType: 'positive' as const, // Add this
    icon: UserPlus,                // Add this
  },
  {
    id: 3,
    title: 'Churn Rate',
    value: '2.4%',
    change: '-0.4%',
    changeType: 'negative' as const, // Add this
    icon: UserMinus,               // Add this
  },
]

export const subscribers = [
  {
    id: 1,
    email: 'alex.smith@company.com',
    status: 'active' as const,
    joined: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: 2,
    email: 'sarah.j@outlook.com',
    status: 'active' as const,
    joined: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
  },
  {
    id: 3,
    email: 'm.peterson@techcorp.io',
    status: 'processing' as const,
    joined: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
  },
  {
    id: 4,
    email: 'lisa_g@freemail.com',
    status: 'active' as const,
    joined: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: 5,
    email: 'david.kline@startup.co',
    status: 'active' as const,
    joined: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  }
]