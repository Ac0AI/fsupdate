import React, { ReactNode } from 'react'
import initTranslations from 'i18n'
import { Metadata } from 'next'
import TranslationsProvider from 'providers/TranslationProvider'
import StyledFlex from '@/appComponents/StyledLayoutFlex'
import getI18nNamespaces from '@/appComponents/getI18nNamespaces'
import { PageLayoutClient } from '../../../../../(withHeader)/[locale]/app/_components/PageLayoutClient'

interface Props {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Flyttsmart | Demo av onboarding',
}

const i18nNamespaces = getI18nNamespaces('signup')
export default async function layout(props: Props) {
  const { locale } = await props.params
  const { resources } = await initTranslations(locale, i18nNamespaces)
  return (
    <TranslationsProvider namespaces={i18nNamespaces} locale={locale} resources={resources}>
      <StyledFlex>
        <PageLayoutClient>{props.children}</PageLayoutClient>
      </StyledFlex>
    </TranslationsProvider>
  )
}
