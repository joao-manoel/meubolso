import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import CreatePersonalWalletForm from '../create-personal-wallet-form'

export default async function CreateWalletPage() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader className="py-2.5">
          <SheetTitle>Criar Carteira</SheetTitle>
        </SheetHeader>
        <div className="">
          <CreatePersonalWalletForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
