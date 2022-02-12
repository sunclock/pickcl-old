import React, { useState } from 'react';
import {
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/actions';

const PlayBookmark = ({ modalVisible, setModalVisible, bookmarkTime, selectedTrack }) => {
    const [bookmarkText, setBookmarkText] = useState('');
    const bookmark = useSelector(state => state.bookmark);
    const dispatch = useDispatch();
    const tracklist = useSelector(state => state.tracklist);

    const handleCloseModal = () => {
        setModalVisible(false);
        setBookmarkText('');
    }

    const handleSubmit = () => {
        let payload = { id:bookmark.length + 1, trackId: tracklist.find(track => track.title === selectedTrack.title).id, trackTitle: selectedTrack.title };
        if (bookmarkText.length > 0) {
            payload.timestamp = bookmarkTime;
            payload.text = bookmarkText;
        }
        console.log('new bookmark', payload);
        handleCloseModal();
        dispatch(actions.addBookmark(payload));
    }

    return (
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
                            <Track>[타임스탬프] `${bookmarkTime}`</Track>
                            <Track>[메시지]</Track>
                            <EditTrackInput
                                placeholder={'...'}
                                blurOnSubmit={true}
                                value={bookmarkText}
                                multiline={true}
                                onChangeText={(text) => setBookmarkText(text)}
                            />
                            <ActionButtonContainer>
                                <SubmitTrackButton onPress={() => handleCloseModal()}><Track>취소</Track></SubmitTrackButton>
                                <SubmitTrackButton onPress={() => handleSubmit()}><Track>저장</Track></SubmitTrackButton>
                            </ActionButtonContainer>
                        </ModalContainer>
                    </CenterContainer>
                </TouchableWithoutFeedback>
            </Modal>
        </CenterContainer>
    )
}

export default PlayBookmark;


const ActionButtonContainer = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: ${p => p.theme.spacing.small};
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