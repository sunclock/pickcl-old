import * as types from './ActionTypes';

// Tracklist
export const initTrack = () => ({
    type: types.INIT_TRACK
});

export const loadTrack = (payload) => ({
    type: types.LOAD_TRACK,
    payload
});

export const addTrack = (payload) => ({
    type: types.ADD_TRACK,
    payload
});

export const removeTrack = (payload) => ({
    type: types.REMOVE_TRACK,
    payload
});

export const editTrack = (payload) => ({
    type: types.EDIT_TRACK,
    payload
});

// Bookmarks
export const loadBookmark = (payload) => ({
    type: types.LOAD_BOOKMARK,
    payload
});

export const addBookmark = (payload) => ({
    type: types.ADD_BOOKMARK,
    payload
});

export const removeBookmark = (payload) => ({
    type: types.REMOVE_BOOKMARK,
    payload
});

export const editBookmark = (payload) => ({
    type: types.EDIT_BOOKMARK,
    payload
});

// current Track
export const setCurrentTrack = (payload) => ({
    type: types.SET_CURRENT_TRACK,
    payload
});