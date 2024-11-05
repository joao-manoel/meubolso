export function CalcParcelas(
  startDate: string,
  endDate: string | null,
): number {
  if (endDate == null) {
    return 1
  }

  const startDateFormatted = new Date(startDate)
  const endDateFormatted = new Date(endDate)

  const mesesInicio =
    startDateFormatted.getMonth() + startDateFormatted.getFullYear() * 12
  const mesesFim =
    endDateFormatted.getMonth() + endDateFormatted.getFullYear() * 12

  const difMeses = mesesFim - mesesInicio
  console.log(mesesInicio, mesesFim)

  return Math.abs(difMeses) + 1
}

export function toCents(value: string): number {
  // Remove o símbolo de moeda e espaços
  const cleanValue = value.replace(/[R$\s]/g, '')

  // Remove pontos de milhar e substitui a vírgula decimal por ponto
  const numericValue = parseFloat(
    cleanValue.replace(/\./g, '').replace(',', '.'),
  )

  // Converte para centavos
  return Math.round(numericValue * 100)
}
