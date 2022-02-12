import React from 'react';
import {
    View,
    SectionList,
    TouchableOpacity,
    Pressable,
    Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';

const PlaylistSectionList = ({ tracklist }) => {
    const navigation = useNavigation();
    
    function renderSectionHeader ({ section }) {
        return <SectionHeader>{section.title}</SectionHeader>
    }

    function renderItem ({ item }) {
        return <Item item={item}/>
    }

    function Item ({ item }) {

        return (
        <ItemContainer>
            <TrackContainer>
                <Pressable 
                    onPress={() => { navigation.navigate('Play', { track: item }) }}
                    style={({pressed}) => [
                        {
                            backgroundColor: pressed ? 'rgba(0, 0, 0, 0.07)' : 'transparent',
                        }
                    ]}>
                    <Track>{item.title}</Track>
                </Pressable>
            </TrackContainer>
            <MoreVerticalContainer>
                <TouchableOpacity>
                    <Icon name="more-vertical" size={20}/>
                </TouchableOpacity>
            </MoreVerticalContainer>
        </ItemContainer>
        );
    }

    return (
            <SectionList
                sections={tracklist}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                keyExtractor={(item, index) => index}
            />
    );
}


export default PlaylistSectionList;

const SectionHeader = styled.Text`
    margin-horizontal: ${p => p.theme.spacing.medium};
    font-family: ${p => p.theme.font.weight.bold};
    font-size: ${p => p.theme.font.size.medium};
`;

const ItemContainer = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: ${p => p.theme.spacing.small};
    border-bottom-width: 1px;
    border-bottom-color: #e6e6e6;

    &:last-child {
        border-bottom-width: 0;
    }
`;

const TrackContainer = styled.View`
    flex: 15;
    margin-horizontal: ${p => p.theme.spacing.medium};
`;

const Track = styled.Text`
    font-family: ${p => p.theme.font.weight.regular};
    font-size: ${p => p.theme.font.size.normal};
`;

const MoreVerticalContainer = styled.View`
    flex: 1;
    margin-horizontal: ${p => p.theme.spacing.normal}; 
`;
