export const formatPriceINR = (value) => {
  const num = Number(value || 0)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num)
}

export const formatArea = (sqft) => `${Number(sqft || 0).toLocaleString('en-IN')} sqft`
