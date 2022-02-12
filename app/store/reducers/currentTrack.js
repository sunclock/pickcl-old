const initialState = {
    id: null,
    url: null,
    title: null,
    artist: null,
    artwork: null,
};

const currentTrack = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_TRACK':
            return action.payload;
        default:
            return state;
    }
};

export default currentTrack;