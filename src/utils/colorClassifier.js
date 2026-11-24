export function getNetWorthBand(netWorth) {
  if (netWorth < 100000) return 'red'
  if (netWorth > 200000) return 'green'
  return 'orange'
}
