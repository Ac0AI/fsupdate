import React, { ReactNode } from 'react'
import initTranslations from 'i18n'
import TranslationsProvider from 'providers/TranslationProvider'
import getI18nNamespaces from '@/appComponents/getI18nNamespaces'

interface Props {
  children: ReactNode
  params: Promise<{ locale: string }>
}

const i18nNamespaces = getI18nNamespaces('')
export default async function layout(props: Props) {
  const { locale } = await props.params
  const { resources } = await initTranslations(locale, i18nNamespaces)
  return (
    <TranslationsProvider namespaces={i18nNamespaces} locale={locale} resources={resources}>
      {props.children}
    </TranslationsProvider>
  )
}
