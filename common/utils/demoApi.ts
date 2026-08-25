import { demoChecklist, demoUser } from '@/common/data/demoMovepage'
import { demoInsuranceSuppliers, demoMovecleanSuppliers, demoMovehelpSuppliers } from '@/common/data/demoServices'

/**
 * Svarar på API-anrop med fixturer när sidan visas under /demo. Gör att
 * riktiga vyer går att visa utan backend, auth eller BankID. Produktionsrutter
 * berörs inte - kontrollen är på webbläsarens sökväg, inte på en env-variabel.
 *
 * Listan är föränderlig i minnet, så bocka av, återställ och lägg till fungerar
 * i demon precis som i skarpa appen. Den nollställs vid omladdning.
 */
export const isDemoPath = () => typeof window !== 'undefined' && window.location.pathname.split('/').includes('demo')

type Item = Record<string, unknown> & { id: string; type: string; skippedAt?: string | null; hiddenAt?: string | null; status?: string }

let items: Item[] = demoChecklist.items.map((i) => ({ ...i })) as Item[]

const find = (id: string) => items.find((i) => i.id === id)

const mutations: { method: string; test: RegExp; run: (id: string) => void }[] = [
  { method: 'PATCH', test: /^\/web\/checklist\/item\/([^/]+)\/skip$/, run: (id) => { const i = find(id); if (i) { i.skippedAt = new Date().toISOString(); i.status = 'completed' } } },
  { method: 'PATCH', test: /^\/web\/checklist\/item\/([^/]+)\/hide$/, run: (id) => { const i = find(id); if (i) i.hiddenAt = new Date().toISOString() } },
  { method: 'PATCH', test: /^\/web\/checklist\/item\/([^/]+)\/show$/, run: (id) => { const i = find(id); if (i) { i.hiddenAt = null; i.skippedAt = undefined; i.status = 'not_started' } } },
  { method: 'PATCH', test: /^\/web\/checklist\/item\/([^/]+)\/reset$/, run: (id) => { const i = find(id); if (i) { i.hiddenAt = null; i.skippedAt = undefined; i.status = 'not_started' } } },
  { method: 'DELETE', test: /^\/web\/checklist\/item\/([^/]+)\/remove$/, run: (id) => { items = items.filter((i) => i.id !== id) } },
]

const reads: { method: string; test: RegExp; value: () => unknown }[] = [
  { method: 'GET', test: /^\/users\/me$/, value: () => ({ ...demoUser.profile, domesticServicesBalance: { data: null } }) },
  { method: 'GET', test: /^\/moves\/current$/, value: () => demoUser.currentMove },
  { method: 'GET', test: /^\/users\/contact$/, value: () => demoUser.contact },
  { method: 'GET', test: /^\/web\/checklist\/move\/current$/, value: () => ({ items }) },
  { method: 'GET', test: /\/todo\/active$/, value: () => [] },
  { method: 'GET', test: /\/orders/, value: () => [] },
  // Tjänstevyerna. Saknas en av de här faller templaten till sitt felläge
  // i stället för att visa flödet, vilket ser ut som en designbugg men inte är det.
  { method: 'GET', test: /^\/web\/supplier\/moveclean$/, value: () => demoMovecleanSuppliers },
  { method: 'GET', test: /^\/web\/supplier\/movehelp$/, value: () => demoMovehelpSuppliers },
  { method: 'GET', test: /^\/web\/supplier\//, value: () => ({ suppliers: [] }) },
  { method: 'GET', test: /^\/web\/order\/move-service\/quotation$/, value: () => ({ suppliers: [] }) },
  { method: 'GET', test: /^\/suppliers/, value: () => demoInsuranceSuppliers },
  { method: 'GET', test: /^\/holidays/, value: () => [] },
]

export const demoFetch = async <T>(method: string, url: string): Promise<T> => {
  const added = method === 'POST' && /^\/web\/checklist\/item\/add\/([^/]+)$/.exec(url)
  if (added) {
    const type = added[1]
    if (!items.some((i) => i.type === type)) {
      items = [...items, { checklistId: 'demo-checklist-0001', id: `demo-item-${type}`, hiddenAt: null, status: 'not_started', sortOrder: items.length + 1, type, orders: [] }]
    }
    return { items } as T
  }

  for (const m of mutations) {
    const hit = m.method === method && m.test.exec(url)
    if (hit) {
      m.run(hit[1])
      return { items } as T
    }
  }

  const read = reads.find((r) => r.method === method && r.test.test(url))
  if (read) return read.value() as T

  // Okända anrop ska inte krascha vyn, de ska bara inte göra något.
  return {} as T
}
