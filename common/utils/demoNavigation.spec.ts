import { toDemoPath } from './demoNavigation'

const setPath = (pathname: string) => {
  Object.defineProperty(window, 'location', {
    value: { pathname },
    writable: true,
  })
}

describe('toDemoPath', () => {
  describe('utanför demon', () => {
    beforeEach(() => setPath('/app/movepage'))

    it('lämnar app-vägar orörda', () => {
      expect(toDemoPath('/app/electricity')).toBe('/app/electricity')
      expect(toDemoPath('/app/movepage')).toBe('/app/movepage')
      expect(toDemoPath('/sv/app/bookings?bookingId=7')).toBe('/sv/app/bookings?bookingId=7')
    })
  })

  describe('inne i demon', () => {
    beforeEach(() => setPath('/demo/movepage'))

    it('byter app mot demo', () => {
      expect(toDemoPath('/app/electricity')).toBe('/demo/electricity')
      expect(toDemoPath('/app/movepage')).toBe('/demo/movepage')
    })

    it('behåller query', () => {
      expect(toDemoPath('/app/movehelp?product=moving')).toBe('/demo/movehelp?product=moving')
    })

    it('behåller locale-prefix', () => {
      expect(toDemoPath('/en/app/bookings?bookingId=7')).toBe('/en/demo/bookings?bookingId=7')
    })

    it('översätter showcleaning till moveclean', () => {
      expect(toDemoPath('/app/showcleaning')).toBe('/demo/moveclean')
    })

    it('skickar okända tjänster till flyttsidan i stället för att kasta ut', () => {
      expect(toDemoPath('/app/flyttkartonger')).toBe('/demo/movepage')
      expect(toDemoPath('/app/settings')).toBe('/demo/movepage')
    })

    it('hanterar vägar utan app-prefix', () => {
      expect(toDemoPath('/electricity')).toBe('/demo/electricity')
    })

    it('dubblerar inte demo-prefixet', () => {
      expect(toDemoPath('/demo/electricity')).toBe('/demo/electricity')
    })

    it('rör inte externa länkar', () => {
      expect(toDemoPath('https://flyttsmart.se/login')).toBe('https://flyttsmart.se/login')
      expect(toDemoPath('tel:0812008822')).toBe('tel:0812008822')
    })
  })
})
