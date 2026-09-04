import SegmentNotFound from '@/components/molecules/SegmentNotFound'

export default function BlogNotFound() {
  return (
    <SegmentNotFound
      title="Den guiden finns inte"
      body="Adressen kan ha ändrats eller så är guiden borttagen. De vi har publicerat ligger kvar i Flyttguiden."
      backHref="/blogg"
      backLabel="Till Flyttguiden"
    />
  )
}
