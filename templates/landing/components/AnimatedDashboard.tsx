const CHECKLIST_ITEMS = [
  { iconPath: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Elavtal tecknat' },
  {
    iconPath:
      'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
    label: 'Bredband inkopplat',
  },
  { iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', label: 'Flytthjälp bokad' },
  {
    iconPath:
      'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    label: 'Flyttstädning bokad',
  },
  {
    iconPath:
      'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
    label: 'Flyttanmälan skickad',
  },
  {
    iconPath:
      'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    label: 'Hemförsäkring flyttad',
  },
]

const AnimatedDashboard = () => {
  return (
    <div className="animated-dashboard absolute inset-0 flex flex-col bg-[#f8faf9] pt-12 px-3 pb-3">
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 h-11 flex items-center justify-between px-6 pt-1">
        <span className="text-[12px] font-semibold text-[#214766] tracking-tight">9:41</span>
        <div className="flex items-center gap-1.5 text-[#214766]">
          {/* Signal bars */}
          <svg className="w-4 h-3" viewBox="0 0 16 12" fill="currentColor">
            <rect x="0" y="8" width="3" height="4" rx="0.5" />
            <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" />
            <rect x="9" y="3" width="3" height="9" rx="0.5" />
            <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.35" />
          </svg>
          {/* Battery */}
          <svg className="w-6 h-3" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.45" />
            <rect x="2" y="2" width="15" height="8" rx="1.5" fill="currentColor" />
            <path d="M23 4v4c1-.3 1.7-1 1.7-2S24 4.3 23 4z" fill="currentColor" opacity="0.45" />
          </svg>
        </div>
      </div>

      {/* Header with addresses */}
      <div className="bg-white rounded-xl px-4 py-3 mb-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <p className="text-[12px] font-bold text-[#214766] mb-2">
          Din flytt
        </p>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-[9px] text-[#214766]/50 font-semibold uppercase">Från</p>
            <p className="text-[11px] text-[#214766] font-medium leading-tight">Storgatan 12,</p>
            <p className="text-[11px] text-[#214766] font-medium leading-tight">Stockholm</p>
          </div>
          <div className="text-[#51c8b4] flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <div className="flex-1 min-w-0 text-right">
            <p className="text-[9px] text-[#214766]/50 font-semibold uppercase">Till</p>
            <p className="text-[11px] text-[#214766] font-medium leading-tight">Ekvägen 8,</p>
            <p className="text-[11px] text-[#214766] font-medium leading-tight">Göteborg</p>
          </div>
        </div>
        <div className="h-[6px] rounded-full bg-[#e8eeef] overflow-hidden">
          <div className="h-full rounded-full bg-[#51c8b4] animate-dashboard-progress" />
        </div>
      </div>

      {/* Checklist */}
      <div className="flex-1 flex flex-col gap-[5px] overflow-hidden">
        {CHECKLIST_ITEMS.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white rounded-xl px-4 py-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            {/* Checkbox */}
            <div
              className={`dashboard-check-${i} w-[22px] h-[22px] rounded-md border-2 border-[#d4dbe0] flex items-center justify-center flex-shrink-0`}
            >
              <svg
                className={`dashboard-checkmark-${i} w-3 h-3 text-white`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {/* Icon + label */}
            <span className="w-6 h-6 rounded-md bg-[#51c8b4]/10 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-3.5 h-3.5 text-[#2a9d8a]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={item.iconPath} />
              </svg>
            </span>
            <span className="text-[13px] font-medium text-[#214766]">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Personal contact banner */}
      <div className="bg-white rounded-xl px-4 py-4 mt-2 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex items-center gap-3">
        <img
          src="/images/team-nina.webp"
          alt="Din flyttkoordinator"
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-[#214766]">Personlig kontakt</p>
          <p className="text-[10px] leading-tight text-[#214766]/50">Din koordinator hjälper dig</p>
        </div>
        <div className="w-7 h-7 rounded-full bg-[#51c8b4]/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-[#51c8b4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      </div>

      {/* Celebration overlay */}
      <div className="animate-dashboard-celebration absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-b from-[#51c8b4] to-[#37ae9a] px-6">
        {/* Coordinator photos */}
        <div className="flex items-center justify-center mb-4">
          <img src="/images/team-nina.webp" alt="Nina" className="w-14 h-14 rounded-full object-cover border-2 border-white/40 relative z-30" />
          <img src="/images/team-andreas.webp" alt="Andreas" className="w-14 h-14 rounded-full object-cover border-2 border-white/40 -ml-3 relative z-20" />
          <img src="/images/team-joel.webp" alt="Joel" className="w-14 h-14 rounded-full object-cover border-2 border-white/40 -ml-3 relative z-10" />
        </div>
        <p className="text-xl font-bold text-white mb-1">Välkommen hem!</p>
        <p className="text-[13px] text-white/80 text-center leading-relaxed">
          Allt är klart – njut av ditt nya hem
        </p>
      </div>
    </div>
  )
}

export default AnimatedDashboard
