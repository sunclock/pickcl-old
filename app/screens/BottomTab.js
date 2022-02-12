import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';

import PlaylistScreen from './PlaylistScreen';
import UploadScreen from './UploadScreen';
import { getData } from '../utils/localStorage';
import * as actions from '../store/actions';
import PlayScreen from './PlayScreen';

const Tab = createBottomTabNavigator();

function BottomTab({ navigation }) {
    const dispatch = useDispatch();

    useEffect(() => {
        getData('tracklist').then(tracklist => {
            dispatch(actions.loadTrack(tracklist));
            if (tracklist) {
                navigation.navigate('Playlist');
            } else {
                navigation.navigate('Upload');
            }
        });
        getData('bookmark').then(bookmark => {
            dispatch(actions.loadBookmark(bookmark));
        })
    }, []);

    return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
            <Tab.Screen
                name="Playlist"
                component={PlaylistScreen}
                options={{
                    tabBarIcon: () => (
                        <Icon name="list" size={20} />
                    ),
                    unmountOnBlur: true,
                    tabBarHideOnKeyboard: true,
                }}
            />
            <Tab.Screen
                name="PlayStack"
                component={PlayScreen}
                options={{
                    tabBarIcon: () => (
                        <Icon name="play" size={20} />
                    ),
                    tabBarVisibilityAnimationConfig: {
                        visible: 'never',
                        hidden: 'always',
                    },
                    
                }} />
            <Tab.Screen
                name="Upload"
                component={UploadScreen}
                options={{
                    tabBarIcon: () => (
                        <Icon name="upload" size={20} />
                    ),
                unmountOnBlur: true,
                }} 
            />
        </Tab.Navigator>
    );
}

export default BottomTab;