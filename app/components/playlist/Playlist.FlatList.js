import React, { useState } from 'react';
import {
    FlatList,
    TouchableOpacity,
    Pressable,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
// import { DraxProvider, DraxView } from 'react-native-drax';

import * as actions from '../../store/actions';

const PlaylistFlatList = ({ isEditMode }) => {
    const navigation = useNavigation();
    const tracklist = useSelector(state => state.tracklist);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newArtist, setNewArtist] = useState('');

    const dispatch = useDispatch();
    function renderItem({ item }) {
        return <Item item={item} />
    }

    function Item({ item }) {

        return (
            <ItemContainer>
                <TrackContainer>
                    <Pressable
                        onPress={() => handleTitlePress(item)}
                        onLongPress={() => handleLongPress()}
                        style={({ pressed }) => [
                            {
                                backgroundColor: pressed ? 'rgba(0, 0, 0, 0.07)' : 'transparent',
                            }
                        ]}>
                        <Track>{item.title}</Track>
                    </Pressable>
                </TrackContainer>
                <MoreVerticalContainer>
                    <TouchableOpacity onPress={() => handleOpenModal(item)}>
                        <Icon name="more-vertical" size={20} />
                    </TouchableOpacity>
                </MoreVerticalContainer>
            </ItemContainer>
        );
    }

    const handleTitlePress = (item) => {
        navigation.navigate('Play', { nextTrack: item });
    }

    const handleLongPress = (item) => {

    }

    const handleRemove = () => {
        dispatch(actions.removeTrack(selectedTrack));
        handleCloseModal();
    }

    const handleOpenModal = (item) => {
        setSelectedTrack(item);
        setModalVisible(true);
    }

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedTrack(null);
        setNewArtist('');
        setNewTitle('');
    }

    const handleSubmit = () => {
        let payload = { id: selectedTrack.id };
        if (newTitle.length > 0) {
            payload.title = newTitle;
        }
        if (newArtist.length > 0) {
            payload.artist = newArtist;
        }
        handleCloseModal();
        dispatch(actions.editTrack(payload));
    }

    return (<>
        <FlatList
            data={tracklist}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
        />

        <CenterContainer>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <TouchableWithoutFeedback onPress={() => handleCloseModal()} style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <CenterContainer>
                        <ModalContainer>
                            <Track>[파일명]</Track>
                            <EditTrackInput
                                placeholder={selectedTrack?.title}
                                blurOnSubmit={true}
                                value={newTitle}
                                onChangeText={(text) => setNewTitle(text)}
                            />
                            <Track>[성우]</Track>
                            <EditTrackInput
                                placeholder={selectedTrack?.artist}
                                blurOnSubmit={true}
                                value={newArtist}
                                onChangeText={(text) => setNewArtist(text)}
                            />
                            <ActionButtonContainer>
                                <SubmitTrackButton onPress={() => handleRemove()}><Track>삭제</Track></SubmitTrackButton>
                                <SubmitTrackButton onPress={() => handleCloseModal()}><Track>취소</Track></SubmitTrackButton>
                                <SubmitTrackButton onPress={() => handleSubmit()}><Track>저장</Track></SubmitTrackButton>
                            </ActionButtonContainer>
                        </ModalContainer>
                    </CenterContainer>
                </TouchableWithoutFeedback>
            </Modal>
        </CenterContainer>
    </>
    );
}

export default PlaylistFlatList;

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

const ActionButtonContainer = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: ${p => p.theme.spacing.small};
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

const CenterContainer = styled.View`
    flex:1;
    justify-content: center;
    align-items: center;
    margin-top: ${p => p.theme.spacing.medium};
`;

const ModalContainer = styled.View`
    margin: ${p => p.theme.spacing.medium};
    width: 300px;
    backgroundColor: white;
    borderRadius: 20;
    padding: ${p => p.theme.spacing.medium};
    alignItems: center;
    shadowColor: #000;
    shadowOffset: {
    width: 0;
    height: 2;
    };
    shadowOpacity: 0.25;
    shadowRadius: 4;
    elevation: 5;
`;

const EditTrackInput = styled.TextInput`
    align-self: stretch;
    font-family: ${p => p.theme.font.weight.regular};
    font-size: ${p => p.theme.font.size.normal};
    padding: ${p => p.theme.spacing.small};
    border-bottom-width: 1px;
    border-bottom-color: #e6e6e6;
`;

const SubmitTrackButton = styled.TouchableOpacity`
    padding: ${p => p.theme.spacing.small};
    margin-horizontal: ${p => p.theme.spacing.xLarge};
`;