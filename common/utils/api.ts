import Cookies from 'js-cookie'
import { demoFetch, isDemoPath } from './demoApi'

const createFetchInstance = (method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT', withNoCache?: boolean, withoutAuth?: boolean) => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(!withoutAuth && { Authorization: `Bearer ${Cookies.get('userToken')}` }),
    cache: withNoCache ? 'no-store' : 'force-cache',
  }

  const fetchInstance = async <T>(url: string, options: RequestInit = {}, params?: Record<string, string | number | undefined | boolean | string[]>): Promise<T> => {
    // Demovyerna under /demo körs utan backend. Bara den sökvägen svarar med
    // fixturer, allt annat går som vanligt.
    if (isDemoPath()) {
      return demoFetch<T>(method, url)
    }

    const queryString = params
      ? '?' +
        new URLSearchParams(
          Object.entries(params).reduce(
            (acc, [key, value]) => {
              if (value !== undefined) {
                acc[key] = String(value)
              }
              return acc
            },
            {} as Record<string, string>,
          ),
        ).toString()
      : ''

    const response = await fetch(`${baseURL}${url}${queryString}`, {
      signal: AbortSignal.timeout(30000),
      method,
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      // Felsvaret är inte alltid JSON. Är det HTML (t.ex. en 404-sida) kastar json()
      // ett SyntaxError som döljer den riktiga statuskoden, så vi läser texten först.
      const body = await response.text().catch(() => '')
      let data: Record<string, unknown> | null = null
      try {
        data = body ? (JSON.parse(body) as Record<string, unknown>) : null
      } catch {
        data = null
      }
      const err: ErrorType = {
        statusCode: (data?.statusCode as number) ?? response.status,
        messageKey: (data?.messageKey ?? data?.message ?? response.statusText) as ErrorType['messageKey'],
      }
      return Promise.reject(err)
    }

    if (response.status === 204 || !response) {
      return Promise.resolve({} as T)
    }

    const responseText = await response.text()
    const responseToReturn = responseText ? (JSON.parse(responseText) as T) : ({} as T)

    return responseToReturn
  }
  return fetchInstance
}

export default createFetchInstance
