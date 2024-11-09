export const getMonthInterval = (year: string, month: string) => {
  const parsedDate = new Date(`${year}-${month}-01`)
  const startOfMonth = new Date(
    Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), 1),
  )
  const endOfMonth = new Date(
    Date.UTC(
      parsedDate.getUTCFullYear(),
      parsedDate.getUTCMonth() + 1,
      0,
      23,
      59,
      59,
    ),
  )
  return { startOfMonth, endOfMonth }
}
