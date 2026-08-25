'use client'

import { useTranslation } from 'react-i18next'
import { partnerLogos } from './partnerLogos'

const LogoItem = ({ src, alt }: { src: string; alt: string }) => (
  <div className="flex-shrink-0 flex items-center justify-center px-6 py-3 h-14 md:h-16 w-32 md:w-40">
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="max-h-full max-w-full object-contain"
    />
  </div>
)

const Partners = () => {
  const { t } = useTranslation('landing')

  return (
    <section className="bg-gray-50 py-10 md:py-14 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <p className="text-xs text-[var(--color-primary-main)] font-semibold uppercase tracking-wider mb-3">
            Samarbeten
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Används av hälften av Sveriges mäklarkedjor
          </h2>
        </div>
      </div>

      {/* Scrolling logo marquee - true infinite */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max gap-6 animate-scroll-infinite">
          {partnerLogos.map((logo) => (
            <LogoItem key={logo.src} src={logo.src} alt={logo.alt} />
          ))}
          {/* Duplicate for seamless loop */}
          {partnerLogos.map((logo) => (
            <LogoItem key={`dup-${logo.src}`} src={logo.src} alt={logo.alt} />
          ))}
        </div>
      </div>

    </section>
  )
}

export default Partners
