const initialState = [];
import { storeData } from '../../utils/localStorage';

const bookmark = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_BOOKMARK':
            storeData('bookmark', action.payload);
            return action.payload;
        case 'ADD_BOOKMARK':
            if (bookmark === null) action.payload.id = 0;
            else action.payload.id = state.length;
            storeData('bookmark', [...state, action.payload]);
            return [...state, action.payload];
        case 'EDIT_BOOKMARK':
            return [...state.filter(item => item.id !== action.payload.id), action.payload]
        case 'REMOVE_BOOKMARK':
            return [...state.filter(item => item.id !== action.payload.id)]
        default:
            return state;
    }
}

export default bookmark;