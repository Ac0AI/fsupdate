'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import useResponsive from '@/common/hooks/useResponsive'
import Flex from '@/components/atoms/Flex'
import Link from '@/components/molecules/Link'
import Logo from '@/public/images/Logo2.svg'
import LaptopMenu from './laptopMenu'
import MobileMenu from './mobileMenu'

interface Props {
  isServerMobile: boolean
  noMenu?: boolean
  onlyLogin?: boolean
}
const Index = ({ noMenu, onlyLogin = false, isServerMobile }: Props) => {
  const { isTabletPortraitOrGreater, isClient } = useResponsive()
  const isMobile = isServerMobile || (!isTabletPortraitOrGreater && isClient)
  const pathname = usePathname()
  const isExternal = pathname === '/flytthjalp' || pathname === '/flyttstadning'

  return (
    <div className="flex h-12 sm:h-[68px] bg-[var(--color-white-main)] px-4 justify-center items-center" id="topnav">
      <Flex justifyContent="space-between" alignItems="center" className="w-[1168px] h-full">
        <Flex>
          <Link href={isExternal ? '/flytthjalp' : '/'} noUnderline>
            <Logo width={isMobile ? 116 : 177} height={isMobile ? 21 : 32} alt="Flyttsmart" />
          </Link>
        </Flex>
        <Flex alignItems="center">{!noMenu && (isMobile ? <MobileMenu onlyLogin={onlyLogin} /> : <LaptopMenu onlyLogin={onlyLogin} />)}</Flex>
      </Flex>
    </div>
  )
}

export default Index
