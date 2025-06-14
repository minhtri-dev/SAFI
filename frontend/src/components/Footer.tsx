import { Icon } from '@iconify-icon/react'

const Footer = () => {
  return (
    <footer className="bottom-0 w-full bg-[#1c2029] py-4 text-center text-white">
      <a
        href="https://github.com/minhtri-dev/SAFI"
        className="duration-150 hover:text-white"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon icon={'mdi:github'} height={40} />
      </a>
      <p>View on GitHub</p>
    </footer>
  )
}

export default Footer