import React, { useCallback } from 'react'
import { Flex } from 'uikit'
import TextInput from 'components/Input/TextInput'
import { useDispatch } from 'react-redux'
import { updateStrategyDescription, updateStrategyTitle, updateStrategyOwner } from 'state/summitEcosystem'
import { useUserStrategyTitleOwnerDescWithPreset } from 'state/hooksNew'
import { clone } from 'lodash'
import styled from 'styled-components'

const TextInputsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 8px;
    align-items: center;
    justify-content: center;
    width: 100%;

    ${({ theme }) => theme.mediaQueries.nav} {
        width: unset;
    }
`

const StrategyTextInput: React.FC = () => {
    const dispatch = useDispatch()
    const {
        isPreset,
        title,
        owner,
        description,
    } = useUserStrategyTitleOwnerDescWithPreset()

    const handleChangeTitle = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            if (isPreset) return
            dispatch(updateStrategyTitle(clone(e.currentTarget.value)))
        },
        [dispatch, isPreset],
    )
    const handleChangeOwner = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            if (isPreset) return
            dispatch(updateStrategyOwner(clone(e.currentTarget.value)))
        },
        [dispatch, isPreset],
    )
    const handleChangeDescription = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            if (isPreset) return
            dispatch(updateStrategyDescription(clone(e.currentTarget.value)))
        },
        [dispatch, isPreset],
    )

    return (
        <TextInputsWrapper>
            <Flex alignItems='center' gap='8px' width='100%' justifyContent='center'>
                <TextInput
                    onChange={handleChangeTitle}
                    value={title}
                    placeholder='Strategy Title'
                    preset={isPreset}
                    multiline={false}
                />
                <TextInput
                    onChange={handleChangeOwner}
                    value={owner}
                    placeholder='Discord / Tg Handle'
                    preset={isPreset}
                    multiline={false}
                />
            </Flex>
            <Flex alignItems='center' gap='12px' width='100%' justifyContent='center'>
                <TextInput
                    onChange={handleChangeDescription}
                    value={description}
                    multiline
                    placeholder='Strategy Description'
                    preset={isPreset}
                />
            </Flex>
        </TextInputsWrapper>
    )
}

export default StrategyTextInput
