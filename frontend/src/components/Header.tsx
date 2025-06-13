import { Icon } from '@iconify-icon/react'

const Header = () => {
  return (
    <nav className="top-0 z-50 flex items-center justify-between bg-[#1c2029] px-4 py-4 font-semibold text-white">
      <div>
        <a href="/" className="flex items-center gap-1 px-3 tracking-widest">
          <img src="/logo.svg" height={40} />
          SAFI
        </a>
      </div>

      <button className="hover:bg-cyan-blue-hover bg-cyan-blue flex items-center gap-2 rounded-full px-6 py-1 font-semibold text-white">
        <Icon icon="line-md:login" height={20} />
        Login
      </button>
    </nav>
  )
}
export default Header
