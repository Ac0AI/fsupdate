'use client'

import React, { useState } from 'react'
import NextLink from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { isClientDemoMode } from '@/common/utils/demoMode'
import Button from '@/components/atoms/Button'
import Flex from '@/components/atoms/Flex'
import Link from '@/components/molecules/Link'
import CloseIcon from '@/public/images/Close_large.svg'
import Logo from '@/public/images/Logo2.svg'
import MenuIcon from '@/public/images/MenuIcon.svg'
import { menuIconWrapperVariants, mobileMenuWrapperVariants, iconWrapperVariants } from './Menu.variants'

interface DropdownItem {
  label: string
  href: string
}

function MobileSection({ title, items, onClose }: { title: string; items: DropdownItem[]; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="w-full">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full py-3 text-xl font-bold uppercase text-[var(--color-secondary-main)]"
      >
        {title}
        <svg width="12" height="7" viewBox="0 0 10 6" fill="none" className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {expanded && (
        <div className="pl-4 pb-2">
          {items.map((item) => (
            <NextLink
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="block py-2 text-lg text-[var(--color-secondary-main)] hover:text-[var(--color-primary-main)]"
            >
              {item.label}
            </NextLink>
          ))}
        </div>
      )}
    </div>
  )
}

interface Props {
  onlyLogin?: boolean
}

const MobileMenu = ({ onlyLogin }: Props) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  // Demosajten: Logga in leder till demons startsida, inte till testläget.
  const loginPath = '/demo'

  return (
    <>
      <button type="button" onClick={() => router.push(loginPath)} className="min-h-11 px-3 text-[15px] font-semibold text-[var(--color-secondary-main)]">
        Logga in
      </button>
      <div className={menuIconWrapperVariants()} onClick={() => setOpen(true)}>
        <MenuIcon />
      </div>
      {open && (
        <div className={mobileMenuWrapperVariants()}>
          <div>
            <Flex display="flex" alignItems="center" justifyContent="space-between">
              <Link href="/" noUnderline>
                <Logo width={116} height={21} alt="logo" />
              </Link>
              <div className={iconWrapperVariants()} onClick={() => setOpen(false)}>
                <CloseIcon />
              </div>
            </Flex>
            <div className="flex flex-col items-center mt-12 px-4">
              {!onlyLogin && (
                <>
                  <NextLink
                    href="/#how-it-works"
                    onClick={() => setOpen(false)}
                    className="py-3 text-xl font-bold uppercase text-[var(--color-secondary-main)] w-full text-center"
                  >
                    Våra tjänster
                  </NextLink>

                  <NextLink
                    href="/samarbetspartners"
                    onClick={() => setOpen(false)}
                    className="py-3 text-xl font-bold uppercase text-[var(--color-secondary-main)] w-full text-center"
                  >
                    Samarbetspartners
                  </NextLink>

                  <NextLink
                    href="/om-oss"
                    onClick={() => setOpen(false)}
                    className="py-3 text-xl font-bold uppercase text-[var(--color-secondary-main)] w-full text-center"
                  >
                    Om oss
                  </NextLink>

                  <div className="mt-8">
                    <Button onClick={() => { setOpen(false); router.push(loginPath) }} text="Logga in" />
                  </div>
                </>
              )}
              {onlyLogin && (
                <div className="mt-10">
                  <Button onClick={() => { setOpen(false); router.push(loginPath) }} text="Logga in" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileMenu
