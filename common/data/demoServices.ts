/**
 * Fixturer för tjänstevyerna under /demo. Samma regel som demoMovepage:
 * de serveras bara när webbläsarens sökväg ligger under /demo, så
 * produktionsflödet är orört.
 *
 * Siffrorna här är påhittade och ska aldrig användas som underlag för
 * marknadsföring. De finns för att vyerna ska gå att visa och rita av.
 */

const supplierBase = (id: string, name: string, rating: string, reviewCount: number) => ({
  id,
  name,
  displayName: name,
  type: 'company',
  serviceTypes: [],
  rating,
  reviewCount,
  imageUrl: '',
})

export const demoMovecleanSuppliers = {
  city: 'Göteborg',
  suppliers: [
    { ...supplierBase('demo-clean-1', 'Ns Nordic Service AB', '4.6', 212), isRecommended: true, prices: { total: 3900, rutDeduction: 1860, priceAfterRut: 2040 } },
    { ...supplierBase('demo-clean-2', 'Städpoolen Väst AB', '4.4', 143), prices: { total: 4300, rutDeduction: 2050, priceAfterRut: 2250 } },
    { ...supplierBase('demo-clean-3', 'Rent & Klart i Göteborg', '4.8', 76), prices: { total: 4650, rutDeduction: 2220, priceAfterRut: 2430 } },
  ],
}

export const demoMovehelpSuppliers = {
  city: 'Göteborg',
  suppliers: [
    { ...supplierBase('demo-move-1', 'Onspot Logistic AB', '4.7', 318), isRecommended: true, prices: { total: 18900, rutDeduction: 9450, priceAfterRut: 9450 } },
    { ...supplierBase('demo-move-2', 'Flyttbolaget Väst AB', '4.5', 187), prices: { total: 20400, rutDeduction: 10200, priceAfterRut: 10200 } },
  ],
}

export const demoInsuranceSuppliers = {
  items: [
    { id: 'demo-ins-1', name: 'Hedvig', type: 'insurance', cancellationOptions: [], createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
    { id: 'demo-ins-2', name: 'Trygg-Hansa', type: 'insurance', cancellationOptions: [], createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
    { id: 'demo-ins-3', name: 'Länsförsäkringar', type: 'insurance', cancellationOptions: [], createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  ],
}

/**
 * Bredbandserbjudanden för /demo/broadband. Utan dem svarar demolagret {}
 * på bredbandsvals-anropet, och Step1 kraschar på offers.length.
 */
const offerPrice = (monthly: number) => ({
  campaign: false,
  monthlyAmounts: [{ start: 1, end: 24, amount: monthly }],
})

export const demoBroadbandOffers: BredbandsvalResponse = {
  status: 'done',
  progress: 100,
  groupDeals: [],
  offers: [
    {
      id: 'demo-offer-fiber-1000',
      isGroupDeal: false,
      contractMonths: 24,
      speed: { down: 1000, up: 1000 },
      price: offerPrice(449),
      name: 'Fiber 1000',
      title: 'Fiber 1000/1000',
      type: 'fiber',
      company: 'Demoleverantören',
      category: 'fiber',
      comparisonPriceAmount: 449,
    },
    {
      id: 'demo-offer-fiber-250',
      isGroupDeal: false,
      contractMonths: 12,
      speed: { down: 250, up: 250 },
      price: offerPrice(329),
      name: 'Fiber 250',
      title: 'Fiber 250/250',
      type: 'fiber',
      company: 'Demoleverantören',
      category: 'fiber',
      comparisonPriceAmount: 329,
    },
    {
      id: 'demo-offer-mobil-500',
      isGroupDeal: false,
      contractMonths: 0,
      speed: { down: 500, up: 100 },
      price: offerPrice(299),
      name: 'Mobilt bredband 500',
      title: 'Mobilt bredband 500',
      type: 'mobile',
      company: 'Demoleverantören',
      category: 'mobile',
      comparisonPriceAmount: 299,
    },
  ],
}
