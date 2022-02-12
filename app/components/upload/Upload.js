import React, { useState } from 'react';
import styled from 'styled-components/native';
import { getAllExternalFilesDirs } from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import { Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';

import * as actions from '../../store/actions';
import UploadFlatList from './Upload.FlatList';
import { storeData } from '../../utils/localStorage';

async function pickFile(files, root) {
    let newFiles = [];
    try {
        const res = await DocumentPicker.pickMultiple({
            type: [DocumentPicker.types.audio],
        });
        res.map((file, index) => {
            let newFile = {
                id: files.length + index + 1,
                url: '',
                title: '',
                artist: '',
                artwork: '',
            }
            newFile.title = file.name.split('.')[0];
            let pathname = decodeURI(file.uri.split('%3A')[1]);
            pathname = pathname.replace(/%2F/gi, "/");
            newFile.url = "file://" + root + pathname;
            newFiles.push(newFile);
        })
    } catch (err) {
        if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
        } else {
            throw err;
        }
    }
    return newFiles;
}

// function readFilesPathInDir(dir) {
//     readDir(dir).then(res => {
//         console.log('res', res);
//         return Promise.all(res.map(file => {
//             [stat(file.path), file.path]
//         }))
//             .then((contents) => {
//                 console.log('contents', contents);
//             })
//             .catch(err => {
//                 console.log(err.message, err.code);
//             });
//     })
// }

const Upload = () => {
    const [files, setFiles] = useState([]);
    const [root, setRoot] = useState('');
    const dispatch = useDispatch();
    const tracklist = useSelector(state => state.tracklist);

    getAllExternalFilesDirs().then(dirs => {
        if (Platform.OS === 'android') {
            // Only get primary storage for now
            let rootPath = dirs[0].split('Android')[0]
            setRoot(rootPath);
        } // ios is not supported yet
    });

    const handleAddTrack = (tracks) => {
        dispatch(actions.addTrack(tracks));
        storeData('tracklist', tracklist);
        Alert.alert(`트랙 등록 완료`, `등록한 트랙: ${files[0]?.title} 외 ${files?.length} 개`);
        setFiles([]);
    }

    return (
        <Container>
            <Header>
                <Title>트랙 불러오기</Title>
                <IconContainer onPress={() => handleAddTrack(files)}>
                    <Icon name="check-circle" size={35} />
                </IconContainer>
            </Header>
            <UploadFlatList files={files} setFiles={setFiles} />
            <FloatingButton
                onPress={() => {
                    pickFile(files, root)
                        .then((newFiles => setFiles(files.concat(newFiles))))
                }}>
                <Icon name="plus" size={30} color="white" />
            </FloatingButton>
        </Container>
    );
}

export default Upload;


const Container = styled.View`
    flex: 1;
    background-color: #fff;
`;

const Header = styled.View`
    border-bottom-width: 1px;
    border-bottom-color: #e6e6e6;
    padding: ${p => p.theme.spacing.medium};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.Text`
    font-family: ${p => p.theme.font.weight.bold};
    font-size: ${p => p.theme.font.size.large};
`;

const FloatingButton = styled.TouchableOpacity`
    position: absolute;
    bottom: ${p => p.theme.spacing.medium};
    right: ${p => p.theme.spacing.medium};
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background-color: pink;
    display: flex;
    justify-content: center;
    align-items: center;
    
`;

const IconContainer = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
`;
