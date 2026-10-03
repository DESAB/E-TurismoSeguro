import type { Metadata } from 'next'
import { AdminPage } from '@/_pages/admin'
import { getDestinations, getMunicipalities, getVideos } from '@/shared/api'

export const metadata: Metadata = {
  title: 'Panel de administración',
  robots: { index: false, follow: false },
}

export default function AdminRoute() {
  return (
    <AdminPage
      initialDestinations={getDestinations()}
      initialVideos={getVideos()}
      municipalities={getMunicipalities()}
    />
  )
}
