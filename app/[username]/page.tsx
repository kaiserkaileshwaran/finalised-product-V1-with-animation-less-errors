import { PublicProfilePage } from '@/components/public-profile/public-profile-page'

interface Props {
  params: Promise<{ username: string }>
}

export default async function UsernamePage({ params }: Props) {
  const { username } = await params
  return <PublicProfilePage username={username} />
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params
  return {
    title: `@${username}'s ProcastiView Records`,
    description: `View ${username}'s productivity records on ProcastiView. Passcode required.`,
  }
}
