'use client'

import { clsx } from 'clsx'

/*
 * Byggstenar för eldemon. Färger, storlekar och avstånd är hämtade ur Paper
 * (get_jsx/get_computed_styles på sidan "El · mätbar och tumvänlig (20 okt)").
 * Navy #214766, ljusblå #3879AD, mint #51C8B4, mörk mint #1F6156, bakgrund #F8FAF9.
 */

export const press =
  'transition-[background-color,color,border-color,box-shadow,transform] duration-200 motion-safe:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3879AD] focus-visible:ring-offset-2'

export const ArrowLeft = ({ color = '#FFFFFF', size = 18 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 17" aria-hidden className="shrink-0">
    <path d="M13.5 8.5H2.5" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 4L2.5 8.5L7 13" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ArrowRight = ({ size = 24, color = '#FFFFFF', width = 1.5 }: { size?: number; color?: string; width?: number }) => (
  <svg width={size} height={size} viewBox="0 0 25 25" aria-hidden className="shrink-0">
    <path d="M4.504 12.5H21.004" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.254 5.75L21.004 12.5L14.254 19.25" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ChevronDown = ({ up = false }: { up?: boolean }) => (
  <svg width="25" height="24" viewBox="0 0 25 24" aria-hidden className={clsx('shrink-0 transition-transform duration-200', up && 'rotate-180')}>
    <path d="M6.75 9L12.75 15L18.75 9" fill="none" stroke="#000000" strokeWidth="2" />
  </svg>
)

export const Shield = () => (
  <svg width="25" height="25" viewBox="0 0 16 16" aria-hidden className="shrink-0">
    <path
      d="M2.5 7.169V3.5C2.5 3.367 2.553 3.24 2.646 3.146C2.74 3.053 2.867 3 3 3H13C13.133 3 13.26 3.053 13.354 3.146C13.447 3.24 13.5 3.367 13.5 3.5V7.169C13.5 12.419 9.044 14.156 8.156 14.45C8.055 14.487 7.945 14.487 7.844 14.45C6.956 14.156 2.5 12.419 2.5 7.169Z"
      fill="none"
      stroke="#51C8B4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10.75 6.5L7.081 10L5.25 8.25" fill="none" stroke="#51C8B4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Help = () => (
  <svg width="24" height="24" viewBox="0 0 25 25" aria-hidden className="shrink-0">
    <path
      d="M12.75 21.98C17.721 21.98 21.75 17.951 21.75 12.98C21.75 8.01 17.721 3.98 12.75 3.98C7.779 3.98 3.75 8.01 3.75 12.98C3.75 17.951 7.779 21.98 12.75 21.98Z"
      fill="none"
      stroke="#51C8B4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.75 18.793C13.268 18.793 13.688 18.373 13.688 17.855C13.688 17.338 13.268 16.918 12.75 16.918C12.232 16.918 11.813 17.338 11.813 17.855C11.813 18.373 12.232 18.793 12.75 18.793Z"
      fill="#51C8B4"
    />
    <path
      d="M12.75 14.48V13.73C13.269 13.73 13.777 13.576 14.208 13.288C14.64 13 14.976 12.59 15.175 12.11C15.374 11.63 15.426 11.103 15.325 10.593C15.223 10.084 14.973 9.616 14.606 9.249C14.239 8.882 13.771 8.632 13.262 8.531C12.753 8.43 12.225 8.482 11.745 8.68C11.266 8.879 10.856 9.215 10.567 9.647C10.279 10.079 10.125 10.586 10.125 11.105"
      fill="none"
      stroke="#51C8B4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const CheckCircle = ({ size = 22, stroke = 2 }: { size?: number; stroke?: number }) => (
  <span className="flex shrink-0 items-center justify-center rounded-full bg-[#51C8B4]" style={{ width: size, height: size }}>
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
      <path d="M2.5 6.2l2.3 2.3 4.7-5" fill="none" stroke="#FFFFFF" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
)

export const Pen = ({ color = '#4C96D0' }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="shrink-0">
    <path
      d="M5.794 13.5H3C2.867 13.5 2.74 13.447 2.646 13.354C2.553 13.26 2.5 13.133 2.5 13V10.206C2.5 10.141 2.512 10.077 2.537 10.017C2.562 9.957 2.598 9.902 2.644 9.856L10.144 2.356C10.19 2.309 10.246 2.271 10.307 2.246C10.368 2.22 10.434 2.207 10.5 2.207C10.566 2.207 10.632 2.22 10.693 2.246C10.754 2.271 10.81 2.309 10.856 2.356L13.644 5.144C13.691 5.19 13.729 5.246 13.754 5.307C13.78 5.368 13.793 5.434 13.793 5.5C13.793 5.566 13.78 5.632 13.754 5.693C13.729 5.754 13.691 5.81 13.644 5.856L6.144 13.356C6.098 13.402 6.043 13.438 5.983 13.463C5.923 13.488 5.859 13.5 5.794 13.5V13.5Z"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8.5 4L12 7.5" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const PenLarge = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" aria-hidden className="shrink-0">
    <path
      d="M6.88 16.031H3.563C3.405 16.031 3.254 15.969 3.143 15.857C3.031 15.746 2.969 15.595 2.969 15.438V12.12C2.968 12.043 2.983 11.967 3.013 11.895C3.042 11.824 3.085 11.759 3.139 11.704L12.046 2.798C12.101 2.742 12.167 2.698 12.239 2.667C12.312 2.637 12.39 2.621 12.469 2.621C12.547 2.621 12.625 2.637 12.698 2.667C12.771 2.698 12.837 2.742 12.892 2.798L16.202 6.108C16.258 6.164 16.303 6.229 16.333 6.302C16.363 6.375 16.379 6.453 16.379 6.531C16.379 6.61 16.363 6.688 16.333 6.761C16.303 6.833 16.258 6.899 16.202 6.954L7.296 15.861C7.241 15.915 7.176 15.958 7.105 15.988C7.034 16.017 6.957 16.032 6.88 16.031V16.031Z"
      fill="none"
      stroke="#51C8B4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10.094 4.75L14.25 8.906" fill="none" stroke="#51C8B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Pin = () => (
  <svg width="16" height="17" viewBox="0 0 16 17" aria-hidden className="shrink-0">
    <path
      d="M8 1.5C6.542 1.502 5.144 2.082 4.113 3.113C3.082 4.144 2.502 5.542 2.5 7C2.5 11.706 7.5 15.262 7.713 15.412C7.798 15.469 7.898 15.499 8 15.499C8.102 15.499 8.202 15.469 8.287 15.412C8.5 15.262 13.5 11.706 13.5 7C13.498 5.542 12.918 4.144 11.887 3.113C10.856 2.082 9.458 1.502 8 1.5ZM8 5C8.396 5 8.782 5.117 9.111 5.337C9.44 5.557 9.696 5.869 9.848 6.235C9.999 6.6 10.039 7.002 9.962 7.39C9.884 7.778 9.694 8.135 9.414 8.414C9.135 8.694 8.778 8.884 8.39 8.962C8.002 9.039 7.6 8.999 7.235 8.848C6.869 8.696 6.557 8.44 6.337 8.111C6.117 7.782 6 7.396 6 7C6 6.47 6.211 5.961 6.586 5.586C6.961 5.211 7.47 5 8 5Z"
      fill="#FFFFFF"
    />
  </svg>
)

export const House = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" aria-hidden className="shrink-0">
    <path
      d="M15.945 13.238H14.945V7.457C14.946 7.317 14.916 7.18 14.859 7.052C14.802 6.925 14.719 6.812 14.614 6.719L9.614 2.176C9.431 2.007 9.191 1.914 8.942 1.914C8.693 1.914 8.454 2.007 8.27 2.176L3.27 6.719C3.168 6.813 3.086 6.927 3.03 7.054C2.974 7.181 2.945 7.318 2.945 7.457V13.238H1.945C1.813 13.238 1.686 13.291 1.592 13.385C1.498 13.478 1.445 13.605 1.445 13.738C1.445 13.871 1.498 13.998 1.592 14.092C1.686 14.185 1.813 14.238 1.945 14.238H15.945C16.078 14.238 16.205 14.185 16.299 14.092C16.393 13.998 16.445 13.871 16.445 13.738C16.445 13.605 16.393 13.478 16.299 13.385C16.205 13.291 16.078 13.238 15.945 13.238ZM10.445 13.238H7.445V10.238C7.445 10.105 7.498 9.978 7.592 9.885C7.686 9.791 7.813 9.738 7.945 9.738H9.945C10.078 9.738 10.205 9.791 10.299 9.885C10.393 9.978 10.445 10.105 10.445 10.238V13.238Z"
      fill="#FFFFFF"
    />
  </svg>
)

export const Lock = () => (
  <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden className="shrink-0">
    <rect x="1" y="6" width="10" height="7" rx="1.5" fill="#214766" />
    <path d="M3.5 6V4.2a2.5 2.5 0 015 0V6" fill="none" stroke="#214766" strokeWidth="1.5" />
  </svg>
)

/** Bild som bakgrund, som Paper ritar loggor (contain, vänsterställd). */
export const Logo = ({ src, alt, className }: { src: string; alt: string; className: string }) => (
  <span role="img" aria-label={alt} className={clsx('shrink-0 bg-contain bg-left bg-no-repeat', className)} style={{ backgroundImage: `url(${src})` }} />
)

/** Elavtal: steg n av 3 med tre streck. */
export const Steps = ({ n }: { n: 1 | 2 | 3 }) => (
  <div className="flex flex-col gap-[10px]">
    <p className="text-[14px] leading-[18px] tracking-[0.32px] text-[#214766]">Elavtal: steg {n} av 3</p>
    <div className="flex gap-[5px]">
      {[1, 2, 3].map((i) => (
        <span key={i} className={clsx('h-[4px] flex-1 rounded-[4px]', i <= n ? 'bg-[#214766]' : 'bg-[#DCEFFF]')} />
      ))}
    </div>
  </div>
)

/** Rubrik i mitten med tillbakapil till vänster (Detaljer, Sammanfattning). */
export const Title = ({ children, onBack }: { children: React.ReactNode; onBack: () => void }) => (
  <div className="relative flex items-center justify-center py-[20px]">
    <div role="heading" aria-level={1} className="text-[24px] leading-[22px] font-bold tracking-[0.32px] text-[#214766]">
      {children}
    </div>
    <button type="button" aria-label="Tillbaka" onClick={onBack} className={clsx('absolute top-[9px] left-[-11px] flex size-11 items-center justify-center rounded-full', press)}>
      <ArrowLeft color="#214766" size={22} />
    </button>
  </div>
)

/** Fast fot. Sticky i stället för fixed: följer med både i mobilens helbredd och i desktopramen. */
export const Foot = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div
    className={clsx(
      'sticky bottom-0 z-20 mt-auto flex flex-col gap-[10px] border-t border-[#EEEEF0] bg-white px-[20px] pt-[15px] pb-[max(25px,env(safe-area-inset-bottom))] shadow-[0_-4px_12px_#00000014]',
      className,
    )}
  >
    {children}
  </div>
)

/** Fält med etikett i ramen, som live (Adress, Boarea, Lägenhetsnummer). */
export const FramedField = ({ label, error, children, tone = 'grey' }: { label: string; error?: boolean; children: React.ReactNode; tone?: 'grey' | 'date' }) => (
  <div
    className={clsx(
      'relative flex h-10 shrink-0 items-center bg-white',
      tone === 'date' ? 'rounded-[6px] border px-[15px]' : 'rounded-[5px] border-[1.9px] px-[10px]',
      error ? 'border-[#F25A43]' : tone === 'date' ? 'border-[#D1D5DC]' : 'border-[#76767666]',
      'focus-within:border-[#3879AD]',
    )}
  >
    {children}
    <span
      className={clsx(
        'pointer-events-none absolute bg-white text-[12px] leading-[16px]',
        tone === 'date' ? 'top-[-10px] left-[15px] px-[5px]' : 'top-[-9px] left-[10px] px-[2px]',
        error ? 'text-[#F25A43]' : tone === 'date' ? 'text-[#6A7282]' : 'text-[#000000B3]',
      )}
    >
      {label}
    </span>
  </div>
)

export const fieldInput = 'h-full w-full min-w-0 bg-transparent text-[16px] leading-[20px] tracking-[0.32px] text-[#000000B3] outline-none'
