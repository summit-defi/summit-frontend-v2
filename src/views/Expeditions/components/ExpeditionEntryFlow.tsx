import BigNumber from 'bignumber.js'
import { Elevation } from 'config/constants'
import React, { useState } from 'react'
import { useExpeditionEntryFlow } from 'state/hooks'
import styled from 'styled-components'
import { Flex, Text } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import ConvictionSlider from './ConvictionSlider'

const DivineBonus = 20

enum ExpedEntryFlowItem {
    Deity,
    Conviction,
    EverestOwned,
    Entered,
}
const OrderedEntryFlow = [
    ExpedEntryFlowItem.Deity,
    ExpedEntryFlowItem.Conviction,
    ExpedEntryFlowItem.EverestOwned,
    ExpedEntryFlowItem.Entered,
]
const ProgressHeaderFlowItems = [
    ExpedEntryFlowItem.Deity,
    ExpedEntryFlowItem.Conviction,
    ExpedEntryFlowItem.EverestOwned,
]
const flowItemTitle = (flowItem: ExpedEntryFlowItem) => {
    switch (flowItem) {
        case ExpedEntryFlowItem.Deity:
            return 'SELECT DEITY'
        case ExpedEntryFlowItem.Conviction:
            return 'SELECT CONVICTION'
        case ExpedEntryFlowItem.EverestOwned:
            return 'GET EVEREST'
        default: return ''
    }
}


const ActiveFlowItemUnderline = styled.div`
    position: absolute;
    width: 100%;
    bottom: -2px;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.text};
`

const EntryFlowItem: React.FC<{ flowItem: ExpedEntryFlowItem, flowIndex: number, completed: boolean, active: boolean }> = ({ flowItem, flowIndex, completed, active }) => {
    return (
        <Flex gap='6px' alignItems='center' justifyContent='center' position='relative'>
            <Text gold={completed} bold={active || completed} monospace lineHeight='16px'>{completed ? '✔ ' : `${flowIndex}.`}</Text>
            <Text gold={completed} bold={active || completed} monospace textAlign='center' lineHeight='16px'>{ flowItemTitle(flowItem) }</Text>
            { active && <ActiveFlowItemUnderline/>}
        </Flex>
    )
}

interface EntryProgress {
    [ExpedEntryFlowItem.Deity]: boolean
    [ExpedEntryFlowItem.Conviction]: boolean
    [ExpedEntryFlowItem.EverestOwned]: boolean
    [ExpedEntryFlowItem.Entered]: boolean
}

interface EntryFlowProgressProps {
    entryProgress: EntryProgress
    activeFlowItem: ExpedEntryFlowItem
}

const EntryFlowProgress: React.FC<EntryFlowProgressProps> = ({ entryProgress, activeFlowItem}) => {
    return (
        <Flex px='24px' gap='36px' alignItems='center' justifyContent='center'>
            { ProgressHeaderFlowItems.map((flowItem, index) =>
                <EntryFlowItem
                    key={flowItem}
                    flowIndex={index + 1}
                    flowItem={flowItem}
                    completed={entryProgress[flowItem]}
                    active={flowItem === activeFlowItem}
                />
            )}
        </Flex>
    )
}



const SelectDeityFlowItem: React.FC = () => {
    return <Flex gap='12px' flexDirection='column' alignItems='center' justifyContent='center'>
        <Text bold monospace small textAlign='center' style={{maxWidth: '500px'}}>
            The DEITIES above watch over each 24 hour EXPEDITION. The relative strength
            of each DEITY changes each round. Only one DEITY wins each
            round, and the winnings are distributed to only that DEITY.
            <br/>
            <br/>
            You can change your DEITY at any point without penalty.
        </Text>
    </Flex>
}

const SelectConvictionFlowItem: React.FC = () => {
    const [ conviction, setConviction ] = useState(null)

    const convictionPending = false
    const onSelectConviction = () => null

    const handleSelectConviction = () => {
        if (convictionPending) return
        onSelectConviction()
    }

    const convictionText = conviction != null ? `${conviction}%` : '-'
    const invConvictionText = conviction != null ? `${100 - conviction}%` : '-'

    return <Flex gap='24px' flexDirection='column' alignItems='center' justifyContent='center' pl='24px' pr='24px'>
        <Text bold monospace small textAlign='center' style={{maxWidth: '500px'}}>
            Betting on the DEITIES is risky, but your risk is up to you.
            Your CONVICTION determines how much of your winnings is risked with the gods VS guaranteed.
            Winnings from the DEITIES is given a {DivineBonus}% divine bonus.
        </Text>

        <ConvictionSlider
            existingConviction={null}
            setConviction={setConviction}
        />
        
        <Text bold monospace small textAlign='center' style={{maxWidth: '500px'}}>
            {convictionText} of your potential winnings each round will be risked on the DEITIES, and will earn a {DivineBonus}% bonus if your DEITY wins.
            The rest ({invConvictionText}) are guaranteed winnings.
        </Text>

        <SummitButton
            disabled={conviction == null}
            onClick={handleSelectConviction}
            isLoading={convictionPending}
            elevation={Elevation.EXPEDITION}
            mt='24px'
        >
            CONFIRM CONVICTION
        </SummitButton>
        <Text mt='-12px' bold monospace small textAlign='center' fontSize='10px' style={{maxWidth: '500px'}}>
            You can change your CONVICTION at any point without penalty.
        </Text>
    </Flex>
}



const GetEverestFlowItem: React.FC = () => {
    return <Flex gap='36px' flexDirection='column' alignItems='center' justifyContent='center'>
        <Text bold monospace small textAlign='center' style={{maxWidth: '500px'}}>
            EVEREST is the currency of the gods, and it is your
            entry ticket to witness their battle. Lock your SUMMIT for
            anywhere from 7 days to 1 year, and return here to enjoy the spoils.
            <br/>
            <br/>
            <br/>
            The amount of EVEREST you own determines how much you can
            win in each EXPEDITION.
            <br/>
            <br/>
            <br/>
            Is there any greater Summit than EVEREST itself?
        </Text>
        <SummitButton
            onClick={() => null}
            elevation={Elevation.EXPEDITION}
            as="a"
            href='/everest'
            mt='12px'
        >
            GET EVEREST
        </SummitButton>
    </Flex>
}



const ActiveFlowItem: React.FC<{ activeFlowItem: ExpedEntryFlowItem }> = ({ activeFlowItem }) => {
    switch (activeFlowItem) {
        case ExpedEntryFlowItem.Deity:
            return <SelectDeityFlowItem/>
        case ExpedEntryFlowItem.Conviction:
            return <SelectConvictionFlowItem/>
        case ExpedEntryFlowItem.EverestOwned:
            return <GetEverestFlowItem/>
        case ExpedEntryFlowItem.Entered:
            return <Text>Enter the expedition</Text>
        default: return null
    }
}



const ExpeditionEntryFlow: React.FC = () => {
    // const { deity, conviction, everestOwned } = useExpeditionEntryFlow()
    const { deity, conviction, everestOwned } = {
        deity: 0,
        conviction: null,
        everestOwned: new BigNumber(50),
    }

    const entryProgress: EntryProgress = {
        [ExpedEntryFlowItem.Deity]: deity != null,
        [ExpedEntryFlowItem.Conviction]: conviction != null,
        [ExpedEntryFlowItem.EverestOwned]: everestOwned != null && everestOwned.isGreaterThan(0),
        [ExpedEntryFlowItem.Entered]: false,
    }

    const activeFlowItem = OrderedEntryFlow.find((flowItem) => !entryProgress[flowItem])

    return (
        <Flex mt='36px' gap='32px' flexDirection='column' alignItems='center' justifyContent='center'>
            <EntryFlowProgress entryProgress={entryProgress} activeFlowItem={activeFlowItem}/>
            <ActiveFlowItem activeFlowItem={activeFlowItem}/>
        </Flex>
    )
}

export default React.memo(ExpeditionEntryFlow)