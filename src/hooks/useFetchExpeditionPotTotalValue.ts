import { useDispatch } from 'react-redux'
import {
  getExpeditionTreasuryAddress,
} from 'utils/'
import { useEffect } from 'react'
import axios from 'axios'
import useRefresh from 'hooks/useRefresh'
import { setExpeditionPot } from 'state/summitEcosystem'

export const useFetchExpeditionPotTotalValue = async () => {
  const expeditionTreasuryAddress = getExpeditionTreasuryAddress()
  const { slowRefresh } = useRefresh() 
  const dispatch = useDispatch()

  return useEffect(
    () => {
      axios.get(`https://openapi.debank.com/v1/user/chain_balance?id=${expeditionTreasuryAddress}&chain_id=ftm`)
      .then(res => {
        dispatch(setExpeditionPot(res.data.usd_value))
      })
    },
    [expeditionTreasuryAddress, slowRefresh, dispatch]
  )
}
