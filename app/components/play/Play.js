import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import { useDispatch, useSelector } from 'react-redux';

import * as actions from '../../store/actions'
import PlayBookmark from './Play.Bookmark';

const setupIfNeeded = async (tracklist, nextTrack) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack !== null && nextTrack !== null) {
        let nextIndex = tracklist.indexOf(nextTrack);
        await TrackPlayer.skip(nextIndex);
        return ;
    }
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
        stopWithApp: false,
        capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
            Capability.Skip,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause, Capability.Stop],
    });

    await TrackPlayer.add(tracklist);
    TrackPlayer.setRepeatMode(RepeatMode.Queue);
}


const togglePlayback = async (playbackState) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack == null) {
        // TODO: Perhaps present an error or restart the playlist?
        setupIfNeeded();

    } else {
        if (playbackState !== State.Playing) {
            await TrackPlayer.play();
        } else {
            await TrackPlayer.pause();
        }
    }
};

const Play = ({ navigation, nextTrack }) => {
    let data = [{
        artist: "",
        artwork: "file:///storage/emulated/0/시맨틱 에러/시멘틱 에러 1/시맨틱에러1 앨범아트.jpg",
        id: 2,
        title: "Semantic Error 1 03",
        url: "file:///storage/emulated/0/시맨틱 에러/시멘틱 에러 1/Semantic Error 1 03.wav"
    }]
    const [showArtwork, setShowArtwork] = useState(true);
    const currentTrack = useSelector(state => state.currentTrack);
    const tracklist = useSelector(state => state.tracklist);
    const playbackState = usePlaybackState();
    const progress = useProgress();
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const bookmarks = useSelector(state => state.bookmark);

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
        if (
            event.type === Event.PlaybackTrackChanged &&
            event.nextTrack !== undefined
        ) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            dispatch(actions.setCurrentTrack(track));
        }
    });

    useEffect(() => {
        setupIfNeeded(tracklist, nextTrack);
    }, []);

    function renderBookmark(tracklist, bookmarks, isPreview = false) {
        let trackId = tracklist.find(track => track.title === currentTrack.title)?.id;
        let bookmark = bookmarks.filter(bookmark => bookmark.trackId === trackId);
        return (
            <>
                {bookmark.map((item, index) => {
                    return (
                        <>
                            {isPreview
                                ? <TouchableOpacity onPress={() => setShowArtwork(!showArtwork)}>
                                    <BookmarkPreview key={index}>{item?.text}</BookmarkPreview>
                                </TouchableOpacity>
                                : <TouchableOpacity onPress={() => setShowArtwork(!showArtwork)}>
                                    <Bookmark key={index}>{item?.text}</Bookmark>
                                </TouchableOpacity>
                            }
                        </>
                    )
                })}
            </>
        )
    }

    return (
        <>
        <Container>
            <Header>
                <Title>{currentTrack?.title}</Title><Artist>{currentTrack?.artist}</Artist>
            </Header>
            <Body>
                {showArtwork
                    ? <>
                        <ArtworkContainer>
                            <Artwork source={{ uri: data[0].artwork }} />
                        </ArtworkContainer>
                        <BookmarkPreviewContainer onPress={() => setShowArtwork(false)}>
                            {renderBookmark(tracklist, bookmarks, true)}
                        </BookmarkPreviewContainer>
                        <MenuContainer>
                            <Menu><Icon name="heart" size={35} color="pink" /></Menu>
                            <Menu onPress={() => setModalVisible(true)}><Icon name="bookmark" size={35} color="skyblue" /></Menu>
                        </MenuContainer>
                        <PlayBookmark modalVisible={modalVisible} setModalVisible={setModalVisible} bookmarkTime={new Date(progress.position * 1000).toISOString().substr(14, 5)} selectedTrack={currentTrack} />
                    </>
                    :
                    <BookmarkContainer>
                        {renderBookmark(tracklist, bookmarks)}
                    </BookmarkContainer>
                }
                    <Slider
                        style={{
                            width: 380,
                            flexDirection: 'row',
                        }}
                        value={progress.position}
                        minimumValue={0}
                        maximumValue={progress.duration}
                        thumbTintColor="pink"
                        minimumTrackTintColor="pink"
                        maximumTrackTintColor="skyblue"
                        onSlidingComplete={async value => {
                            await TrackPlayer.seekTo(value);
                        }}
                    />
                <ProgressLabelContainer>
                    <ProgressLabelText>
                        {new Date(progress.position * 1000).toISOString().substr(14, 5)}
                    </ProgressLabelText>
                    <ProgressLabelText>
                        {new Date((progress.duration - progress.position) * 1000)
                            .toISOString()
                            .substr(14, 5)}
                    </ProgressLabelText>
                </ProgressLabelContainer>
            </Body>
            <ControlContainer>
                <Control><Icon name="repeat" size={25} color="grey" /></Control>
                <Control><Icon name="skip-back" size={30} onPress={() => TrackPlayer.skipToPrevious()} /></Control>
                {playbackState === State.Playing
                    ? <Control onPress={() => togglePlayback(playbackState)}><Icon name="pause" size={40} /></Control>
                    : <Control onPress={() => togglePlayback(playbackState)}><Icon name="play" size={40} /></Control>
                }
                <Control onPress={() => TrackPlayer.skipToNext()}><Icon name="skip-forward" size={30} /></Control>
                <Control onPress={() => navigation.navigate('BottomTab')}><Icon name="list" size={25} /></Control>
            </ControlContainer>
            </Container>
        </>
    );
}
//
export default Play;


const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #fff;
`;

const Header = styled.View`
    flex: 1;
    border-bottom-width: 1px;
    border-bottom-color: ${p => p.theme.lightGrey}; 
    align-items: center;
`;

const Body = styled.View`
    flex: 6;
    margin: ${p => p.theme.spacing.normal}; 
    margin-bottom: 0px;
    align-items: center;
`;

const ControlContainer = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    border-top-width: 1px;
    border-top-color: ${p => p.theme.lightGrey}; 
`;

const MenuContainer = styled.View`
    flex: 1;
    flex-direction: row;
`;

const Title = styled.Text`
    font-family: ${p => p.theme.font.weight.medium};
    font-size: ${p => p.theme.font.size.medium};
`;

const Artist = styled.Text`
    font-family: ${p => p.theme.font.weight.regular};   
    font-size: ${p => p.theme.font.size.normal};
`;

const ArtworkContainer = styled.View`
    width: 300px;
    height: 300px;
    overflow: hidden;
    padding: ${p => p.theme.spacing.normal}; 
`;

const BookmarkPreviewContainer = styled.TouchableOpacity`
    align-items: center;
    overflow: hidden;
    max-height: 80px;
    margin-bottom: ${p => p.theme.spacing.normal};
`;

const BookmarkContainer = styled.ScrollView`
    height:100%;
`;

const Artwork = styled.Image`
    width: 100%;
    height: 100%;
`;

const BookmarkPreview = styled.Text`
    font-family: ${p => p.theme.font.weight.regular};
    font-size: ${p => p.theme.font.size.normal};
    color: ${p => p.theme.grey};
`;

const Bookmark = styled.Text`
    font-family: ${p => p.theme.font.weight.regular};
    font-size: ${p => p.theme.font.size.normal};
`;

const Control = styled.TouchableWithoutFeedback`
`;

const Menu = styled.TouchableOpacity`
    width: 100px;
    justify-content: center;
    align-items: center;
    margin-horizontal: ${p => p.theme.spacing.normal};
    // border-radius: ${p => p.theme.spacing.normal};
    // border-width: 1px;
    // border-color: ${p => p.theme.lightGrey}; 
`;


const ProgressLabelContainer = styled.View`
    width: 370px;
    flex-direction: row;
    justify-content: space-between;
`;

const ProgressLabelText = styled.Text`
    font-family: ${p => p.theme.font.weight.light};
    font-size: ${p => p.theme.font.size.small};
    color: ${p => p.theme.grey};
    font-variant: tabular-nums;
`;