// data/subscribers.ts
import { 
  Users, UserPlus, TrendingUp 
} from 'lucide-react'

export const stats = [
  {
    id: 1,
    title: 'Total Subscribers',
    value: '12,450',
    change: '+5.2%',
    icon: Users
  },
  {
    id: 2,
    title: 'New This Week',
    value: '+432',
    change: '+1.5%',
    icon: UserPlus
  },
  {
    id: 3,
    title: 'Growth Rate',
    value: '12%',
    change: '+2.1%',
    icon: TrendingUp
  }
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