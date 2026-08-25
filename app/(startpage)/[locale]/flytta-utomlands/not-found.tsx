import SegmentNotFound from '@/components/molecules/SegmentNotFound'

export default function AbroadNotFound() {
  return (
    <SegmentNotFound
      title="Vi har ingen sida för det landet än"
      body="Vi kör till fler länder än de som har en egen sida. Hittar du inte ditt, hör av dig så säger vi rakt ut om vi kan köra sträckan eller inte."
      backHref="/flytta-utomlands"
      backLabel="Se länderna vi kör till"
    />
  )
}
