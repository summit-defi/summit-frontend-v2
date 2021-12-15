import { useEffect } from 'react'
import { useSummitPrice } from 'state/hooks'

const useGetDocumentTitlePrice = () => {
  const summitPriceUsd = useSummitPrice()

  const summitPriceUsdString =
    summitPriceUsd == null
      ? ''
      : ` - $${summitPriceUsd.toNumber().toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })}`

  useEffect(() => {
    document.title = `S U M M I T${summitPriceUsdString}`
  }, [summitPriceUsdString])
}
export default useGetDocumentTitlePrice
