import type { FaqItem } from '@/constants/abroad'

/**
 * Frågelistan. Svaren står utskrivna i stället för att ligga i en accordion.
 * Poängen med sidorna är att kunna citeras av AI-sök, och en fråga vars svar
 * ligger bakom en klick är svårare att plocka upp.
 */

interface Props {
  heading: string
  items: FaqItem[]
}

const FaqSection = ({ heading, items }: Props) => (
  <section className="bg-white">
    <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-16">
        <h2 className="text-[28px] md:text-[32px] font-bold leading-tight text-[var(--color-secondary-dark)] lg:sticky lg:top-28 lg:self-start">{heading}</h2>

        <dl className="max-w-[788px]">
          {items.map((item, index) => (
            <div key={item.question} className={index === 0 ? '' : 'mt-7 border-t border-[var(--color-inactive-main)] pt-7'}>
              <dt className="text-[18px] font-bold text-[var(--color-secondary-dark)]">{item.question}</dt>
              <dd className="mt-3 text-[15px] leading-[26px] text-[var(--color-inactive-dark)]">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </section>
)

export default FaqSection
