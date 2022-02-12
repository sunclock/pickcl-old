/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    TouchableWithoutFeedback,
    Image,
    TouchableOpacity,
} from 'react-native';

import Slider from '@react-native-community/slider';

import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from 'react-native-track-player';

import playlist from '../../assets/playlist.json';

import DocumentPicker from 'react-native-document-picker'

const setupIfNeeded = async () => {
    // if app was relaunched and music was already playing, we don't setup again.
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack !== null) {
        return;
    }


    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
        stopWithApp: false,
        capabilities: [
            Capability.Play,
            // Capability.PlayFromId,
            // Capability.PlayFromSearch,
            Capability.Pause,
            Capability.Stop,
            // Capability.SeekTo,
            // Capability.Skip,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            // Capability.JumpForward,
            // Capability.JumpBackward,
            Capability.SetRating,
            // Capability.Like,
            // Capability.Dislike,
            // Capability.Bookmark,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
    });

    await TrackPlayer.add(playlist);

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

const Player = () => {

    const playbackState = usePlaybackState();
    const progress = useProgress();

    const [trackArtwork, setTrackArtwork] = useState();
    const [trackTitle, setTrackTitle] = useState();
    const [trackArtist, setTrackArtist] = useState();


    useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
        if (
            event.type === Event.PlaybackTrackChanged &&
            event.nextTrack !== undefined
        ) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            const { title, artist, artwork } = track || {};
            setTrackTitle(title);
            setTrackArtist(artist);
            setTrackArtwork(artwork);
        }
    });

    useEffect(() => {
        setupIfNeeded();
    }, []);


    async function pickFiles() {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            })

            res.map(file => {
                console.log('type', file.type);
                console.log('name', file.name);
                console.log('uri', file.uri);
            })

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err
            }
        }
    }

    var RNFS = require('react-native-fs');

    RNFS.getAllExternalFilesDirs()
        .then((result) => {
            console.log('resolved result', result);
        })

    RNFS.getFSInfo()
        .then((result) => {
            console.log('resolved result', result);
        })

    function readDocuments() {
        RNFS.readDir("/storage/emulated/0/시맨틱 에러/시멘틱 에러 1") // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
            .then((result) => {
                console.log('GOT RESULT', result);

                // stat the first file
                return Promise.all([RNFS.stat(result[0].path), result[0].path]);
            })
            // .then((statResult) => {
            //   if (statResult[0].isFile()) {
            //     // if we have a file, read it
            //     return RNFS.readFile(statResult[1], 'utf8');
            //   }

            //   return 'no file';
            // })
            .then((contents) => {
                // log the file contents
                console.log('contents', contents);
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });
    }

    return (
        <View style={styles.screenContainer}>
            <View style={styles.contentContainer}>
                <View style={styles.topBarContainer}>
                    <TouchableOpacity onPress={() => pickFiles()}>
                        <Text style={styles.queueButton}>Content Provider URI</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => readDocuments()}>
                        <Text style={styles.queueButton}>Read File Dir</Text>
                    </TouchableOpacity>
                </View>
                <Image style={styles.artwork} source={{ uri: `${trackArtwork}` }} />
                <Text style={styles.titleText}>{trackTitle}</Text>
                <Text style={styles.artistText}>{trackArtist}</Text>
                <Slider
                    style={styles.progressContainer}
                    value={progress.position}
                    minimumValue={0}
                    maximumValue={progress.duration}
                    thumbTintColor="#FFD479"
                    minimumTrackTintColor="#FFD479"
                    maximumTrackTintColor="#FFFFFF"
                    onSlidingComplete={async value => {
                        await TrackPlayer.seekTo(value);
                    }}
                />
                <View style={styles.progressLabelContainer}>
                    <Text style={styles.progressLabelText}>
                        {new Date(progress.position * 1000).toISOString().substr(14, 5)}
                    </Text>
                    <Text style={styles.progressLabelText}>
                        {new Date((progress.duration - progress.position) * 1000)
                            .toISOString()
                            .substr(14, 5)}
                    </Text>
                </View>
            </View>
            <View style={styles.actionRowContainer}>
                <TouchableWithoutFeedback onPress={() => TrackPlayer.skipToPrevious()}>
                    <Text style={styles.secondaryActionButton}>Prev</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => togglePlayback(playbackState)}>
                    <Text style={styles.primaryActionButton}>
                        {playbackState === State.Playing ? 'Pause' : 'Play'}
                    </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => TrackPlayer.skipToNext()}>
                    <Text style={styles.secondaryActionButton}>Next</Text>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#212121',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    topBarContainer: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 20,
        justifyContent: 'flex-end',
    },
    queueButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD479',
    },
    artwork: {
        width: 240,
        height: 240,
        marginTop: 30,
        backgroundColor: 'grey',
    },
    titleText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginTop: 30,
    },
    artistText: {
        fontSize: 16,
        fontWeight: '200',
        color: 'white',
    },
    progressContainer: {
        height: 40,
        width: 380,
        marginTop: 25,
        flexDirection: 'row',
    },
    progressLabelContainer: {
        width: 370,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressLabelText: {
        color: 'white',
        fontVariant: ['tabular-nums'],
    },
    actionRowContainer: {
        width: '60%',
        flexDirection: 'row',
        marginBottom: 100,
        justifyContent: 'space-between',
    },
    primaryActionButton: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFD479',
    },
    secondaryActionButton: {
        fontSize: 14,
        color: '#FFD479',
    },
});

export default Player;
