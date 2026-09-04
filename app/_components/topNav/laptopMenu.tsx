'use client'

import React, { useState } from 'react'
import NextLink from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { isClientDemoMode } from '@/common/utils/demoMode'
import Button from '@/components/atoms/Button'
import Flex from '@/components/atoms/Flex'

interface DropdownItem {
  label: string
  href: string
}

interface NavItemProps {
  label: string
  href?: string
  items?: DropdownItem[]
  currentPath: string
}

function NavItem({ label, href, items, currentPath }: NavItemProps) {
  const [open, setOpen] = useState(false)
  const isActive = href ? currentPath === href : items?.some((item) => currentPath === item.href)

  const baseClass = `relative text-sm font-semibold transition-colors pb-1 ${isActive ? 'text-[var(--color-primary-main)]' : 'text-[var(--color-secondary-main)] hover:text-[var(--color-primary-main)]'}`
  const underline = isActive ? <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary-main)] rounded-full" /> : null

  if (!items) {
    return (
      <NextLink href={href || '/'} className={baseClass}>
        {label}
        {underline}
      </NextLink>
    )
  }

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className={`${baseClass} flex items-center gap-1`}>
        {underline}
        {label}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 pt-2 min-w-[220px] z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2">
            {items.map((item) => (
              <NextLink
                key={item.href}
                href={item.href}
                className={`block px-5 py-2.5 text-sm transition-colors ${currentPath === item.href ? 'text-[var(--color-primary-main)] bg-[var(--color-primary-main)]/5' : 'text-[var(--color-secondary-main)] hover:bg-gray-50 hover:text-[var(--color-primary-main)]'}`}
              >
                {item.label}
              </NextLink>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface Props {
  onlyLogin: boolean
}

const LaptopMenu = ({ onlyLogin }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  // Demosajten: Logga in leder till demons startsida, inte till testläget.
  const loginPath = '/demo'

  // Strip locale prefix for matching (e.g. /sv/tjanster -> /tjanster)
  const cleanPath = pathname.replace(/^\/(sv|en)/, '') || '/'

  if (onlyLogin) {
    return <Button onClick={() => router.push(loginPath)} text="Logga in" className="!px-13 !py-3" />
  }

  return (
    <Flex alignItems="center" className="gap-8">
      <NavItem label="Våra tjänster" href="/#how-it-works" currentPath={cleanPath} />
      {/* Flyttguiden, inte "Blogg" (Sebastian 2026-09-04): blogg låter som
          företagsnyheter, guiden är det folk söker på. Adressen är kvar på
          /blogg tills ägaren säger annat. */}
      <NavItem label="Flyttguiden" href="/blogg" currentPath={cleanPath} />
      <NavItem label="Samarbetspartners" href="/samarbetspartners" currentPath={cleanPath} />
      <NavItem label="Om oss" href="/om-oss" currentPath={cleanPath} />
      <Button onClick={() => router.push(loginPath)} text="Logga in" className="!px-13 !py-3" />
    </Flex>
  )
}

export default LaptopMenu
