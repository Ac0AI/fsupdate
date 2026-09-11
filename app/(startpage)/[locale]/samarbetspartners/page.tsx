'use client'

import { PartnersIntro, PartnerLogos, PartnerQuotes, DistributionPartners, Suppliers } from '@/templates/landing/components/partnersSections'

export default function SamarbetspartnersPage() {
  return (
    <main>
      <PartnersIntro />
      <PartnerLogos />
      <PartnerQuotes />
      <div id="distributionspartners-section" className="bg-white">
        <DistributionPartners />
      </div>
      <div id="leverantorer-section" className="bg-[var(--color-background-default)]">
        <Suppliers />
      </div>
    </main>
  )
}
