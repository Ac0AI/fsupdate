/**
 * Stora och långa flyttar är våra bästa affärer (flytt-attach fördubblas med
 * bostadens storlek, långflytt ger mest kronor). Regeln styr vilken rad som
 * ligger överst på flyttsidan och vart välkomstkortets knapp pekar.
 *
 * Trösklar: 90 kvm (där attach-kurvan planar ut på ~40 %) och "annan stad"
 * som demo-approximation av ett långt avstånd. I skarp drift ersätts
 * stadsjämförelsen med verkligt avstånd (~100 km) mellan adresserna.
 */
export type MoveProfileInput = {
  fromCity?: string | null
  toCity?: string | null
  fromResidenceSize?: number | null
}

export const isBigOrLongMove = ({ fromCity, toCity, fromResidenceSize }: MoveProfileInput): boolean => {
  const big = (fromResidenceSize ?? 0) >= 90
  const long = !!fromCity?.trim() && !!toCity?.trim() && fromCity.trim().toLowerCase() !== toCity.trim().toLowerCase()
  return big || long
}
