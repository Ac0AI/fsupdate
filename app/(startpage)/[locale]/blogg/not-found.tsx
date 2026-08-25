import SegmentNotFound from '@/components/molecules/SegmentNotFound'

export default function BlogNotFound() {
  return (
    <SegmentNotFound
      title="Den artikeln finns inte"
      body="Adressen kan ha ändrats eller så är artikeln borttagen. De vi har publicerat ligger kvar i listan."
      backHref="/blogg"
      backLabel="Till alla artiklar"
    />
  )
}
