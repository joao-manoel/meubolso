import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import CreatePersonalWalletForm from '../../settings/wallets/create-personal-wallet-form'

export default function CreatePersonalWallet() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Criar Carteira</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <CreatePersonalWalletForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
