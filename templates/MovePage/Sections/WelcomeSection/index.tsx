import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import useResponsive from '@/common/hooks/useResponsive'
import Button from '@/components/atoms/Button'
import Flex from '@/components/atoms/Flex'
import ArrowRightThin from '@/components/atoms/Icons/ArrowRightThin'
import ImageKit from '@/components/atoms/ImageKit'
import Text from '@/components/atoms/Text'
import CloseThin from '@/public/images/Close_thin.svg'
import { welcomeSectionWrapperVariants, closeWrapperVariants, styledFlexVariants } from './WelcomeSection.variants'
import { toDemoPath } from '@/common/utils/demoNavigation'

interface WelcomeSectionProps {
  setShowWelcomeSection: (value: boolean) => void
  assignedMcAdminId?: string
  assignedMcAdminName?: string
}

const WelcomeSection = ({ setShowWelcomeSection, assignedMcAdminId, assignedMcAdminName }: WelcomeSectionProps) => {
  const { t } = useTranslation('movePage')
  const router = useRouter()
  const { isTabletPortraitOrGreater } = useResponsive()

  // Extract only the first name if multiple names are separated by " / "
  const firstName = assignedMcAdminName?.split('/')[0]?.trim() || 'Joel'

  return (
    <>
      <section className={welcomeSectionWrapperVariants()}>
        <Flex alignItems={isTabletPortraitOrGreater ? 'start' : 'center'} style={{ gap: 24 }}>
          <Flex direction="column">
            <Text style={{ color: 'var(--fs-colors-secondaryMain)', textAlign: isTabletPortraitOrGreater ? 'left' : 'left' }} variant="larger" spacing="none">
              {t('WELCOME_SECTION.welcome')}
            </Text>
            <Flex
              className={styledFlexVariants()}
              direction={isTabletPortraitOrGreater ? 'row' : 'column'}
              alignItems={isTabletPortraitOrGreater ? 'start' : 'center'}
              justifyContent="center"
            >
              <Flex direction="column">
                <Text spacing="none" style={{ color: 'var(--fs-colors-secondaryDark)', fontSize: 'var(--fs-fontSizes-5)', textAlign: isTabletPortraitOrGreater ? 'left' : 'left' }}>
                  {t('WELCOME_SECTION.welcomeText')}
                </Text>
                <Text spacing="none" style={{ color: 'var(--fs-colors-secondaryDark)', fontSize: 'var(--fs-fontSizes-5)', textAlign: isTabletPortraitOrGreater ? 'left' : 'left' }}>
                  {t('WELCOME_SECTION.welcomeTextSubSection')}
                </Text>
                <Flex alignItems="end" style={{ paddingTop: 13 }} justifyContent={isTabletPortraitOrGreater ? 'start' : 'start'}>
                  <div style={{ borderRadius: '50%', border: '1px solid #bfbfbf', width: 32, height: 32, overflow: 'hidden' }}>
                    <ImageKit src={`/Marketing/site_images/${assignedMcAdminId}.jpg`} alt="Moving Coordinator" width={32} height={32} />
                  </div>
                  <Text
                    spacing="none"
                    style={{
                      color: 'var(--fs-colors-secondaryMain)',
                      fontSize: 'var(--fs-fontSizes-5)',
                      textAlign: isTabletPortraitOrGreater ? 'left' : 'center',
                      paddingLeft: 4,
                      fontWeight: 'var(--fs-fontWeights-bold)',
                    }}
                  >
                    {t('WELCOME_SECTION.movingCoordinator', { name: firstName })}
                  </Text>
                </Flex>
              </Flex>
              {/* Texten säger börja med elavtalet, så knappen går dit. Rabattraden är får-halvan. */}
              <div className="flex flex-col gap-1.5 w-full md:w-auto md:items-end">
                <Button
                  variant="orange"
                  largerArrowRight
                  iconRight={<ArrowRightThin />}
                  iconColor="#214766"
                  withMaxContentWidth={isTabletPortraitOrGreater}
                  withFullWidth={!isTabletPortraitOrGreater}
                  padding={isTabletPortraitOrGreater ? '4px 32px' : '10px 16px 10px 32px'}
                  text={t('WELCOME_SECTION.getQuotations')}
                  onClick={() => router.push(toDemoPath('/app/electricity'))}
                />
                <span className="text-[13px] leading-[18px] font-semibold text-[var(--color-primary-dark)] text-center md:text-right">
                  {t('WELCOME_SECTION.getQuotationsHint')}
                </span>
              </div>
            </Flex>
          </Flex>
          <div className={closeWrapperVariants()}>
            <CloseThin
              onClick={() => {
                setShowWelcomeSection(false)
                window.localStorage.setItem('hasClosedWelcome', 'true')
              }}
            />
          </div>
        </Flex>
      </section>
    </>
  )
}

export default WelcomeSection
