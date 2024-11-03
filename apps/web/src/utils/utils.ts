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
