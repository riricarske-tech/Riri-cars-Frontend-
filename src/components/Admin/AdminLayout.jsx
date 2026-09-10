import { MdLogout } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import logo from '../../assets/logo/RiricarsLogo.png'

export default function AdminLayout({ children, title, description, action }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin', { replace: true })
  }

  return (
    <div className="min-h-screen bg-brand-bg text-dark">
      <header className="border-b border-white/10 bg-black text-white">
        <div className="container-main flex min-h-[96px] items-center justify-between gap-4">
          <button type="button" onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-white">
            <img src={logo} alt="Riri Cars" width="72" height="72" className="h-[72px] w-auto object-contain" />
            <span>
              <span className="block text-sm font-bold tracking-wide">RIRI CARS</span>
              <span className="block text-xs text-white/65">Admin workspace</span>
            </span>
          </button>
          <button type="button" onClick={handleLogout} className="inline-flex min-h-10 items-center gap-2 rounded border border-white/25 px-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white">
            <MdLogout aria-hidden="true" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>
      <main className="container-main py-8 md:py-12">
        <div className="mb-8 flex flex-col gap-5 border-b border-brand-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">Vehicle operations</p>
            <h1 className="text-2xl font-bold tracking-tight text-dark md:text-3xl">{title}</h1>
            {description && <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>}
          </div>
          {action}
        </div>
        {children}
      </main>
    </div>
  )
}