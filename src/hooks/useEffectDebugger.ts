import { useRef, useEffect, useMemo } from 'react'

const usePrevious = (value, initialValue) => {
  const ref = useRef(initialValue)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export const useEffectDebugger = (effectHook, dependencies, dependencyNames = []) => {
  const previousDeps = usePrevious(dependencies, [])

  const changedDeps = dependencies.reduce((accum, dependency, index) => {
    if (dependency !== previousDeps[index]) {
      const keyName = dependencyNames[index] || index
      return {
        ...accum,
        [keyName]: {
          before: previousDeps[index],
          after: dependency,
        },
      }
    }

    return accum
  }, {})

  if (Object.keys(changedDeps).length) {
    console.log('[use-effect-debugger] ', changedDeps)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effectHook, dependencies)
}
