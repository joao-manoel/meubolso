import Image from 'next/image'

import Logo from '@/assets/image/banco_do_brasil.png'

export default function BBBagdeIcon() {
  return (
    <div className="flex h-[18px] w-[28px] items-center justify-center rounded-sm bg-[#ffef38]">
      <Image
        src={Logo}
        alt="banco do brasil logo"
        width={15}
        className="text-white"
      />
    </div>
  )
}
