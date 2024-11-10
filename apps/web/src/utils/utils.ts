export const convertTransactionStatus = (text: string) => {
  switch (text) {
    case 'paid':
      return 'Pago'
    case 'pending':
      return 'Pendente'
    default:
      return text
  }
}
