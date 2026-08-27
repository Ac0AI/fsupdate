import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useThemeContext } from '@/common/context/theme/themeContext.provider'
import { ThemeEnum } from '@/common/enums/ThemeEnum'
import Button, { type ButtonProps } from '../Button'
import { toDemoPath } from '@/common/utils/demoNavigation'

const ExitActivityButton = (props: ButtonProps) => {
  const { t } = useTranslation()
  const { theme } = useThemeContext()
  const router = useRouter()

  const buttonText = useMemo(() => {
    if (theme === ThemeEnum.FASTIGHETSBYRAN) return t('common:customCtaText')
    if (props.text) return props.text
    return t('error:ctaButton')
  }, [theme, props, t])

  const onButtonClick = (event: React.MouseEvent) => {
    if (theme === ThemeEnum.FASTIGHETSBYRAN) return window.top?.postMessage('complete', '*')
    if (props.onClick) return props.onClick(event)
    return router.push(toDemoPath('/app/movepage'))
  }

  const variant = theme === ThemeEnum.FASTIGHETSBYRAN ? 'primary' : props.variant

  return <Button {...props} padding="14px 54px" text={buttonText} onClick={onButtonClick} variant={variant} withFullWidth={theme === ThemeEnum.FASTIGHETSBYRAN} />
}

export default ExitActivityButton
