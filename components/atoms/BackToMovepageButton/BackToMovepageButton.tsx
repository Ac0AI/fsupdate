import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter, usePathname } from 'next/navigation'
import ServiceUrlEnum from '@/common/enums/ServiceUrlEnum'
import useResponsive from '@/common/hooks/useResponsive'
import Text from '@/components/atoms/Text'
import ArrowLeft from '@/public/images/ArrowLeft.svg'
import { buttonVariants, goBackTopWrapperVariants, goBackToTopInnerWrapperVariants, type GoBackTopWrapperVariants } from './BackToMovepageButton.variants'
import { toDemoPath } from '@/common/utils/demoNavigation'

const BackToMovepageButton = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useTranslation(['common'])
  const { isTabletPortraitOrGreater } = useResponsive()

  const buttonIsInHeader = [
    `/app/${ServiceUrlEnum.ADDRESSCHANGE}`,
    `/app/${ServiceUrlEnum.ELECTRICITY}`,
    `/app/${ServiceUrlEnum.INSURANCE}`,
    `/app/${ServiceUrlEnum.BROADBAND}`,
  ].some((servicePath) => pathname === servicePath || pathname === toDemoPath(servicePath))

  return (
    <button className={buttonVariants({ withoutPadding: !buttonIsInHeader })} onClick={() => router.push(toDemoPath('/app/movepage'))}>
      <ArrowLeft width={18} height={18} />
      {(isTabletPortraitOrGreater || !buttonIsInHeader) && (
        <Text className="pl-[5px]" spacing="none">
          {t('backToMovepage')}
        </Text>
      )}
    </button>
  )
}

// Export the styled wrapper components for use elsewhere
export const GoBackTopWrapper = ({
  variant = 'primary',
  children,
  className,
}: {
  variant?: GoBackTopWrapperVariants['variant']
  children: React.ReactNode
  className?: string
}) => <div className={goBackTopWrapperVariants({ variant, className })}>{children}</div>

export const GoBackToTopInnerWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={goBackToTopInnerWrapperVariants({ className })}>{children}</div>
)

export default BackToMovepageButton
