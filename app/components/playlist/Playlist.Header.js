import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';

import * as actions from '../../store/actions';

export const PlaylistHeader = ({ setIsFlatList, setIsEditMode }) => {
    const dispatch = useDispatch();
    return (
        <Header>
            <TitleContainer><Title>재생 목록</Title></TitleContainer>
            <TouchableOpacity onPress={() => dispatch(actions.initTrack())}>
                <ViewControllerContainer>
                    <Edit>초기화</Edit>
                </ViewControllerContainer>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => setIsFlatList(false)}>
                <ViewControllerContainer>
                    <Icon name="table" size={35} />
                </ViewControllerContainer>
            </TouchableOpacity> */}
            {/* <TouchableOpacity onPress={() => setIsFlatList(true)}>
                <ViewControllerContainer>
                    <Icon name="table-column" size={35} />
                </ViewControllerContainer>
            </TouchableOpacity> */}
        </Header>
    );
};

const Header = styled.View`
    flex-direction: row;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: #e6e6e6;
`;

const ViewControllerContainer = styled.View`
    padding-right: ${p => p.theme.spacing.medium};
`;

const Edit = styled.Text`
    font-size: ${p => p.theme.font.size.small};
    font-family: ${p => p.theme.font.weight.semiBold};
`;
    
const TitleContainer = styled.View`
    flex: 1;
    padding: ${p => p.theme.spacing.medium};
`;

const Title = styled.Text`
    font-size: ${p => p.theme.font.size.large};
    font-family: ${p => p.theme.font.weight.bold};
`;