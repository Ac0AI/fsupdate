'use client'

import { PartnersIntro, PartnerQuotes, DistributionPartners, Suppliers } from '@/templates/landing/components/partnersSections'

export default function SamarbetspartnersPage() {
  return (
    <main>
      <PartnersIntro />
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
