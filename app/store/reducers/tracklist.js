import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from 'react-native-track-player';
import { storeData } from '../../utils/localStorage';
const initialState = []

const setupIfNeeded = async (tracklist) => {
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


const tracklist = (state = initialState, action) => {
    switch (action.type) {
        case 'INIT_TRACK':
            storeData('tracklist', []);
            setupIfNeeded(state);
            return [];
        case 'LOAD_TRACK':
            storeData('tracklist', action.payload);
            TrackPlayer.add(action.payload);
            return action.payload;
        case 'ADD_TRACK':
            if (action.payload.length > 1) {
                action.payload.map(track => {
                    track.id = state.length
                    state.push(track)
                })
                storeData('tracklist', state);
                TrackPlayer.add(state);
                return state;
            } else if (action.payload.length === 1) {
                action.payload[0].id = state.length
                storeData('tracklist', [...state, action.payload[0]]);
                TrackPlayer.add([...state, action.payload[0]]);
                return [...state, action.payload];
            } return state;
        case 'REMOVE_TRACK':
            storeData('tracklist', state.filter(track => track.id !== action.payload.id));
            let removeIndex = state?.indexOf(action.payload);
            TrackPlayer.remove(removeIndex);
            return state.filter(track => track.id !== action.payload.id);
        case 'EDIT_TRACK':
            storeData('tracklist', state.map(track => {
                if (track.id === action.payload.id) {
                    TrackPlayer.updateMetadataForTrack(state?.indexOf(track), {...track, ...action.payload});
                    return {...track, ...action.payload}
                } return track
            }));
            return state.map(track => {
                if (track.id === action.payload.id) {
                    return {
                        ...track,
                        ...action.payload
                    }
                } return track;
            });
        default:
            console.log('default')
            console.log('state', state);
            return state;
    }
}

export default tracklist;