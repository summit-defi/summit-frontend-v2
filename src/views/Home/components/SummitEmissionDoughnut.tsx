import React from 'react'
import styled from 'styled-components'
import { Doughnut } from 'react-chartjs-2'
import { ChartOptions } from 'chart.js'

const StyledDoughnut = styled(Doughnut)`
  overflow: visible;
`

interface Props {
  poolEmission: number
  treasuryEmission: number
}

const SummitEmissionDoughnut: React.FC<Props> = ({ poolEmission, treasuryEmission }) => {
  const summitBalancesChartData = {
    labels: ['Farm (%)', 'Treasury (%)'],
    datasets: [
      {
        data: [poolEmission, treasuryEmission],
        backgroundColor: ['#1D4D57', '#638263'],
        hoverBackgroundColor: ['#35655D', '#BBAA6A'],
        hoverOffset: 5,
        borderColor: 'transparent',
        borderWidth: 2,
        rotation: 90,
        // offset: [20, 10],
      },
    ],
  }

  const summitBalancesChartOptions: ChartOptions = {
    responsive: false,
    layout: {
      padding: { top: 20 },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12,
            family: 'Courier Prime, monospace',
          },
        },
      },
    },
  } as ChartOptions

  return <StyledDoughnut width={200} height={250} options={summitBalancesChartOptions} data={summitBalancesChartData} />
}

export default React.memo(SummitEmissionDoughnut)
