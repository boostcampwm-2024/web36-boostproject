import { Table2, FileText, Network } from 'lucide-react'

const USER = {
  name: 'shadcn',
  email: 'm@example.com',
  avatar: '/avatars/shadcn.jpg',
}

const NAV_MENU = [
  {
    title: 'Table',
    icon: Table2,
    isActive: true,
  },
  {
    title: 'Data',
    icon: FileText,
    isActive: false,
  },
  {
    title: 'ERD',
    icon: Network,
    isActive: false,
  },
]

export { USER, NAV_MENU }
