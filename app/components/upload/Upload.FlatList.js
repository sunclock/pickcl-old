import React from 'react';
import {
    FlatList,
    TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';

const UploadFlatList = ({ files, setFiles }) => {

    function renderItem({ item }) {
        return <Item item={item} />
    }

    function Item({ item }) {

        return (
            <ItemContainer>
                <TrackContainer>
                    <Track>{item.title}</Track>
                    <Path>위치: {item.url}</Path>
                </TrackContainer>
                <IconContainer onPress={() => setFiles(files.filter(file => file.id !== item.id))}>
                    <Icon name="x-circle" size={40} color="grey" />
                </IconContainer>
            </ItemContainer>
        );
    }

    return (
        <FlatList
            data={files}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
            setFiles={setFiles}
        />
    );
}




export default UploadFlatList;


const ItemContainer = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: #e6e6e6;
    padding-horizontal: ${p => p.theme.spacing.medium};
`;

const TrackContainer = styled.View`
    flex: 8;
`;

const Track = styled.Text`
    font-family: ${p => p.theme.font.weight.regular};
    font-size: ${p => p.theme.font.size.normal};
`;

const Path = styled.Text`
    font-family: ${p => p.theme.font.weight.extraLight};
    font-size: ${p => p.theme.font.size.small};
`;

const IconContainer = styled.TouchableOpacity`
    flex: 1;
    justify-content: center;
    align-items: center;
`;
