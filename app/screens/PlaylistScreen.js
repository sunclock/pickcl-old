import React, {useState} from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import styled from 'styled-components/native';

import PlaylistSectionList from '../components/playlist/Playlist.SectionList';
import { PlaylistHeader } from '../components/playlist/Playlist.Header';
import PlaylistFlatList from '../components/playlist/Playlist.FlatList';

export default function PlaylistScreen({ navigation, }) {
    const isDarkMode = useColorScheme() === 'dark';
    const [ isFlatList, setIsFlatList ] = useState(true);
    const [ isEditMode, setIsEditMode ] = useState(true);

    return (
        <Container>
        <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
            <PlaylistHeader setIsFlatList={setIsFlatList} setIsEditMode={setIsEditMode}/>
            { isFlatList
            ? <PlaylistFlatList isEditMode={isEditMode} />
            // : <PlaylistSectionList /> 
            : null }
        </Container>
    );
}

const Container = styled.View`
    flex: 1;
    background-color: #fff;
`;

