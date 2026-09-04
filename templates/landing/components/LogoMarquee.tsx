/**
 * Logotypremsan som rullar löpande. Används av bevisblocket (mäklarkedjorna)
 * och av Förhandlat i förväg (leverantörerna).
 *
 * Två buggar som fanns i den gamla remsan och som ligger bakom hur den här är
 * byggd:
 *
 *  1. Loggorna var `loading="lazy"`. Spåret är över 13 000 px brett, så bara
 *     de första hann laddas och resten kom in som tomma rutor: remsan blev vit
 *     i fläckar medan den rullade (mätt 2026-09-04: 4 av 7 synliga slots hade
 *     bild). Här laddas de direkt, med låg prioritet så de inte konkurrerar
 *     med heron.
 *  2. Spåret hade `gap` mellan alla slots, även mellan de två kopiorna.
 *     Animeringen flyttar -50 %, vilket då blir en halv gap-bredd fel och ger
 *     ett hopp varje varv. Här bär varje slot sitt eget mellanrum och spåret
 *     har ingen gap, så -50 % landar exakt på nästa kopia.
 *
 * Andra kopian är aria-hidden: den finns för loopen, inte för läsaren.
 */

export type MarqueeLogo = { src: string; alt: string }

type Props = {
  logos: MarqueeLogo[]
  /** Bredden på en plats i spåret, mellanrummet inräknat. */
  slotClassName?: string
  imageClassName?: string
  /** Spåret behöver vara bredare än skärmen för att loopen ska se hel ut. */
  minSlots?: number
}

const LogoMarquee = ({
  logos,
  slotClassName = 'h-9 w-[160px] md:w-[192px]',
  imageClassName = 'max-h-full max-w-[112px] md:max-w-[128px] object-contain',
  minSlots = 12,
}: Props) => {
  if (logos.length === 0) return null

  // Få loggor räcker inte till ett spår: upprepa listan tills den fyller bredden.
  const filled = Array.from({ length: Math.max(1, Math.ceil(minSlots / logos.length)) }, () => logos).flat()

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-scroll-infinite motion-reduce:animate-none">
        {[...filled, ...filled].map((logo, index) => (
          <span
            key={`${logo.src}-${index}`}
            className={`flex shrink-0 items-center justify-center ${slotClassName}`}
            aria-hidden={index >= filled.length}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={index >= filled.length ? '' : logo.alt}
              loading="eager"
              fetchPriority="low"
              decoding="async"
              className={imageClassName}
            />
          </span>
        ))}
      </div>
    </div>
  )
}

export default LogoMarquee
