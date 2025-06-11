import { Icon } from '@iconify-icon/react'

const Header = () => {
  return (
    <nav className="top-0 z-50 flex items-center justify-between bg-[#1c2029] px-4 py-4 font-semibold text-white">
      <div>
        <a href="/" className="flex items-center gap-1 px-3 tracking-widest">
          <Icon icon="fluent:bot-16-filled" height={30} />
          Safi
        </a>
      </div>
      <div className="flex flex-1 items-center justify-center gap-8">
        <a href="/" className="flex items-center gap-2">
          <span className="hidden md:inline">About</span>
        </a>
        <a href="services" className="flex items-center gap-2">
          <span className="hidden md:inline">Services</span>
        </a>
        <a href="contact" className="flex items-center gap-2">
          <span className="hidden md:inline">Contact</span>
        </a>
      </div>
      <button className="flex items-center gap-2 rounded-full bg-[#00ADC9] px-6 py-1 font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-[#0085A0]">
        <Icon icon="line-md:login" height={20} />
        Login
      </button>
    </nav>
  )
}
export default Header
