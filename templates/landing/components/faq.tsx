'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useIntercom } from 'react-use-intercom'
import { clsx } from 'clsx'
import Link from 'next/link'

type FAQItem = {
  question: string
  answer: string
  list_item_1?: string
  list_item_2?: string
  list_item_3?: string
  list_item_4?: string
  list_item_5?: string
  list_item_6?: string
  list_item_7?: string
  answer_last?: string
  answer_last_header?: string
  answer_last_second_part?: string
}

interface FAQProps {
  isServerIosOrSafari: boolean
}

const FAQ = ({ isServerIosOrSafari }: FAQProps) => {
  const { t } = useTranslation('landing')
  const { show } = useIntercom()
  const faqItems = t('landing:FAQITEMS', { returnObjects: true }) as FAQItem[]
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary-main)]">
          {t('faq_title')}
        </h2>
      </div>

      {/* FAQ Items */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className={clsx(
              'bg-white rounded-2xl border overflow-hidden transition-[border-color,box-shadow] duration-300 ease-standard',
              openIndex === index
                ? 'border-[var(--color-primary-main)] '
                : 'border-gray-200 hover:'
            )}
          >
            {/* Question button */}
            <button
              onClick={() => toggleItem(index)}
              className={clsx(
                'w-full px-6 py-5 flex items-center justify-between text-left',
                'text-[var(--color-secondary-main)] font-semibold',
                'hover:bg-gray-50 transition-colors'
              )}
            >
              <span className="pr-4">{item.question}</span>
              <svg
                className={clsx(
                  'w-5 h-5 flex-shrink-0 text-[var(--color-secondary-main)] transition-transform duration-300',
                  openIndex === index && 'rotate-180'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Answer content */}
            <div
              className={clsx(
                'overflow-hidden transition-[max-height,opacity] duration-300 ease-openclose',
                openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="px-6 pb-6 text-[var(--color-secondary-main)]/80 leading-relaxed">
                <p>{item.answer}</p>

                {item.list_item_1 && (
                  <ul className="mt-4 ml-4 list-disc list-inside space-y-1">
                    {item.list_item_1 && <li>{item.list_item_1}</li>}
                    {item.list_item_2 && <li>{item.list_item_2}</li>}
                    {item.list_item_3 && <li>{item.list_item_3}</li>}
                    {item.list_item_4 && <li>{item.list_item_4}</li>}
                    {item.list_item_5 && <li>{item.list_item_5}</li>}
                    {item.list_item_6 && <li>{item.list_item_6}</li>}
                    {item.list_item_7 && <li>{item.list_item_7}</li>}
                  </ul>
                )}

                {item.answer_last_header && (
                  <p className="mt-6 font-semibold text-[var(--color-secondary-main)]">
                    {item.answer_last_header}
                  </p>
                )}

                {item.answer_last && item.answer_last_second_part && (
                  <p className="mt-2">
                    {item.answer_last}
                    <Link
                      href={`mailto:${t('flyttsmart_email')}`}
                      className="text-[var(--color-primary-main)] font-semibold hover:underline"
                    >
                      {t('flyttsmart_email')}
                    </Link>
                    {' '}
                    <Link
                      href={`tel:${t('flyttsmart_phone')}`}
                      className="text-[var(--color-primary-main)] font-semibold hover:underline"
                    >
                      {t('flyttsmart_phone')}
                    </Link>
                    ,{' '}
                    <button
                      onClick={() => show()}
                      className="text-[var(--color-primary-main)] font-semibold hover:underline"
                    >
                      {t('flyttsmart_chat')}
                    </button>
                    {item.answer_last_second_part}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* More questions link */}
      <div className="text-center mt-10">
        <a
          href={t('faq_link')}
          target="_blank"
          rel="noreferrer"
          className={clsx(
            'inline-flex items-center gap-2 px-6 py-3 rounded-full',
            'bg-[var(--color-primary-main)]/10 text-[var(--color-primary-main)]',
            'font-semibold hover:bg-[var(--color-primary-main)]/20 transition-colors'
          )}
        >
          {t('faq_more_questions')}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  )
}

export default FAQ
