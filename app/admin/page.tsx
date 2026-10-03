import { AdminPage } from '@/_pages/admin'
import { getDestinations, getMunicipalities, getVideos } from '@/shared/api'

export default function AdminRoute() {
  return (
    <AdminPage
      initialDestinations={getDestinations()}
      initialVideos={getVideos()}
      municipalities={getMunicipalities()}
    />
  )
}
