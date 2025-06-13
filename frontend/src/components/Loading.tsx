import { Icon } from '@iconify-icon/react'

const LoadingModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000a7] transition-opacity duration-300 ease-in-out">
      <div className="flex flex-col items-center space-y-4">
        <Icon
          icon="mdi:loading"
          className="text-cyan-blue animate-spin"
          width={48}
          height={48}
        />
        <p className="text-white">Loading...</p>
      </div>
    </div>
  )
}

export default LoadingModal
