import Image from 'next/image'

import Logo from '@/assets/image/Nubank_logo.png'

export default function NubankBagdeIcon() {
  return (
    <div className="flex h-[18px] w-[28px] items-center justify-center rounded-sm bg-[#8a05be]">
      <Image src={Logo} alt="nubank logo" width={15} className="text-white" />
    </div>
  )
}
