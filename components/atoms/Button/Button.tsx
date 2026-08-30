import React, { ReactElement } from 'react'
import { useThemeContext } from '@/common/context/theme/themeContext.provider'
import { ThemeEnum } from '@/common/enums/ThemeEnum'
import Spinner from '@/components/atoms/Spinner'
import { clsx } from 'clsx'
import { buttonWrapperVariants, buttonVariants, iconLeftVariants, iconRightVariants, type ButtonVariants } from './Button.variants'

type IconElementProps = {
  color?: string
}

export type ButtonProps = {
  onClick?: React.MouseEventHandler
  text?: string | null
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?:
    | 'primary'
    | 'ghost'
    | 'ghostInverted'
    | 'primaryAlt'
    | 'primaryAltInverted'
    | 'orange'
    | 'gray'
    | 'outline'
    | 'green'
    | 'outlineHoverInverted'
    | 'outlineHoverInvertedAlt'
    | 'noOutline'
    | 'noOutlineBold'
    | 'outlineHoverInvertedAlt2'
    | 'fb'
    | 'fbNoPadding'
    | 'fbPrimary'
    | 'lightBlue'
  iconLeft?: ReactElement<IconElementProps> | null
  iconRight?: ReactElement<IconElementProps> | null
  iconColor?: string
  alt?: string
  dataTestId?: string
  opacity?: number
  fontSize?: number
  padding?: string
  type?: 'submit' | 'reset' | 'button'
  isLoading?: boolean
  withFullWidth?: boolean
  largerArrowRight?: boolean
  withSpaceBetween?: boolean
  withMaxContentWidth?: boolean
}

const Button = ({
  onClick,
  text,
  disabled = false,
  className,
  variant = 'primary',
  iconLeft,
  iconRight,
  iconColor,
  dataTestId = '',
  opacity = 1,
  fontSize = 16,
  padding = '',
  type,
  isLoading,
  withFullWidth,
  largerArrowRight = false,
  withSpaceBetween = false,
  withMaxContentWidth = false,
}: ButtonProps) => {
  const { theme } = useThemeContext()
  const newVariant = theme === ThemeEnum.FASTIGHETSBYRAN && variant === 'primary' ? 'fbPrimary' : variant

  // Determine which disabled variant to use for FB theme
  const getDisabledVariant = () => {
    if (theme !== ThemeEnum.FASTIGHETSBYRAN || !disabled) return disabled
    if (withFullWidth) return 'fbDisabledFullWidth'
    return 'fbDisabled'
  }

  const buttonWrapperClasses = buttonWrapperVariants({
    withMaxContentWidth,
    withFullWidth,
  })

  const buttonClasses = buttonVariants({
    variant: newVariant as ButtonVariants['variant'],
    withFullWidth,
    withSpaceBetween,
    withMaxContentWidth,
    isDisabled: disabled && theme !== ThemeEnum.FASTIGHETSBYRAN,
    fbDisabled: getDisabledVariant() === 'fbDisabled',
    fbDisabledFullWidth: getDisabledVariant() === 'fbDisabledFullWidth',
  })

  const iconLeftClasses = iconLeftVariants()
  const iconRightClasses = iconRightVariants({
    largerArrowRight,
  })

  return (
    <div className={buttonWrapperClasses} onClick={(e) => !disabled && onClick?.(e)} data-testid={dataTestId}>
      <button
        className={clsx(buttonClasses, className)}
        type={type}
        disabled={disabled}
        style={{
          // Use inline styles for dynamic values
          fontSize: `${fontSize}px`,
          opacity: opacity,
          // Padding prop takes precedence over all class-based padding
          ...(padding ? { padding } : {}),
        }}
      >
        {iconLeft && (
          <div className={iconLeftClasses} style={{ color: iconColor }} data-testid="iconLeft">
            {React.cloneElement(iconLeft, { color: undefined })}
          </div>
        )}
        {isLoading ? <Spinner scale={1} color="green" /> : text}
        {iconRight && (
          <div className={iconRightClasses} style={{ color: iconColor }} data-testid="iconRight">
            {React.cloneElement(iconRight, { color: undefined })}
          </div>
        )}
      </button>
    </div>
  )
}

export default Button
