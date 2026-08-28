import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useThemeContext } from '@/common/context/theme/themeContext.provider'
import { ThemeEnum } from '@/common/enums/ThemeEnum'
import { BirdError } from '@/components/atoms/BirdError'
import Button from '@/components/atoms/Button'
import Flex from '@/components/atoms/Flex'
import Text from '@/components/atoms/Text'
import LinkButton from '@/components/linkButton'
import BankId from '@/public/images/BankId.svg'
import { smallButtonWrapperVariants, styledHeaderTextVariants } from '../AddresschangePage.variants'
import { toDemoPath } from '@/common/utils/demoNavigation'

export const AddresschangeError = ({ onLogin, errorText }: { onLogin: () => void; errorText: string }) => {
  const { t } = useTranslation()
  const { theme } = useThemeContext()
  const router = useRouter()
  return (
    <Flex style={{ textAlign: 'center' }} direction="column" justifyContent="center" alignItems="center">
      <BirdError />
      <Text className={styledHeaderTextVariants()}>{t('common:tryAgain')}</Text>
      <div dangerouslySetInnerHTML={{ __html: errorText }} />
      <div className={smallButtonWrapperVariants()}>
        <Button
          onClick={onLogin}
          variant={theme === ThemeEnum.FASTIGHETSBYRAN ? 'fbPrimary' : 'primaryAlt'}
          text={t('common:tryAgain')}
          iconLeft={<BankId />}
          padding="0 20px !important"
        />
      </div>
      <LinkButton
        noUnderline={false}
        onClick={() => {
          router.push(toDemoPath('/app/movepage'))
        }}
      >
        {t('common:toMovepage')}
      </LinkButton>
    </Flex>
  )
}
