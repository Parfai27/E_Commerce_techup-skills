export function formatRwf(amount) {
  return `RWF ${new Intl.NumberFormat("en-US").format(amount)}`
}
