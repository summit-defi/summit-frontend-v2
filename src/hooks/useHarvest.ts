import { useCallback, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from 'state/actions'
import { crossCompound, harvest, harvestElevation } from 'utils'
import { useElevationTotems, useExpeditionConfigs, useFarmConfigs } from 'state/hooks'
import { useCartographer } from './useContract'
import useToast from './useToast'
import { Elevation, elevationUtils, ExpeditionConfig, FarmConfig } from 'config/constants/types'

const getElevationFromPid = (
  pid: number,
  farmConfigs: FarmConfig[],
  expeditionConfigs: ExpeditionConfig[],
): Elevation => {
  return expeditionConfigs.some((e) => e.pid === pid)
    ? Elevation.EXPEDITION
    : farmConfigs.find((f) => f.pid === pid)?.elevation || Elevation.OASIS
}

export const useHarvest = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const cartographer = useCartographer()
  const elevationTotems = useElevationTotems()
  const farmConfigs = useFarmConfigs()
  const expeditionConfigs = useExpeditionConfigs()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useToast()

  const handleHarvest = useCallback(async () => {
    const elevation = getElevationFromPid(pid, farmConfigs, expeditionConfigs)
    try {
      setPending(true)
      await harvest(cartographer, pid, elevationTotems[elevationUtils.toInt(elevation)], account)
      toastSuccess('Rewards Claimed Successfully')
    } catch (error) {
      toastError('Error Claiming Rewards', (error as Error).message)
    } finally {
      dispatch(fetchFarmUserDataAsync(account))
      setPending(false)
    }
  }, [
    account,
    dispatch,
    farmConfigs,
    expeditionConfigs,
    pid,
    cartographer,
    elevationTotems,
    setPending,
    toastSuccess,
    toastError,
  ])

  return { onHarvest: handleHarvest, pending }
}

export const useCrossCompound = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const cartographer = useCartographer()
  const elevationTotems = useElevationTotems()
  const farmConfigs = useFarmConfigs()
  const expeditionConfigs = useExpeditionConfigs()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useToast()

  const handleCrossCompound = useCallback(async () => {
    const elevation = getElevationFromPid(pid, farmConfigs, expeditionConfigs)
    try {
      setPending(true)
      await crossCompound(cartographer, pid, elevationTotems[elevationUtils.toInt(elevation)], account)
      toastSuccess('Cross Compounded Successfully')
    } catch (error) {
      toastError('Error Cross Compounding', (error as Error).message)
    } finally {
      dispatch(fetchFarmUserDataAsync(account))
      setPending(false)
    }
  }, [
    account,
    dispatch,
    farmConfigs,
    expeditionConfigs,
    pid,
    cartographer,
    elevationTotems,
    setPending,
    toastSuccess,
    toastError,
  ])

  return { onCrossCompound: handleCrossCompound, pending }
}

export const useHarvestAll = (pids: number[]) => {
  const { account } = useWallet()
  const cartographer = useCartographer()
  const elevationTotems = useElevationTotems()
  const farmConfigs = useFarmConfigs()
  const expeditionConfigs = useExpeditionConfigs()
  const [pending, setPending] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const dispatch = useDispatch()

  const handleHarvestAll = useCallback(async () => {
    const harvestPromises = pids.map((pid) => {
      const elevation = getElevationFromPid(pid, farmConfigs, expeditionConfigs)
      return harvest(cartographer, pid, elevationTotems[elevationUtils.toInt(elevation)], account)
    })

    try {
      setPending(true)
      await Promise.all(harvestPromises)
      toastSuccess('All Rewards Claimed Successfully')
    } catch (error) {
      toastError('Error Harvesting All', error[0].message)
    } finally {
      dispatch(fetchFarmUserDataAsync(account))
      setPending(false)
    }
  }, [
    account,
    pids,
    expeditionConfigs,
    farmConfigs,
    cartographer,
    elevationTotems,
    setPending,
    toastSuccess,
    toastError,
    dispatch,
  ])

  return { onHarvestAll: handleHarvestAll, pending }
}

export const useHarvestElevation = (elevation: Elevation) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const cartographer = useCartographer()
  const [harvestPending, setHarvestPending] = useState(false)
  const [crossCompoundPending, setCrossCompoundPending] = useState(false)
  const { toastSuccess, toastError } = useToast()

  const handleHarvestElevation = useCallback(
    async (isCompound) => {
      try {
        if (isCompound) setCrossCompoundPending(true)
        else setHarvestPending(true)

        await harvestElevation(cartographer, elevation, isCompound, account)

        toastSuccess(`Rewards ${isCompound ? 'Compounded' : 'Harvested'} Successfully`)
      } catch (error) {
        toastError(`Error ${isCompound ? 'Compounding' : 'Harvesting'} Rewards`, (error as Error).message)
      } finally {
        dispatch(fetchFarmUserDataAsync(account))
        setHarvestPending(false)
        setCrossCompoundPending(false)
      }
    },
    [account, dispatch, elevation, cartographer, setHarvestPending, setCrossCompoundPending, toastSuccess, toastError],
  )

  return { onHarvestElevation: handleHarvestElevation, harvestPending, crossCompoundPending }
}
