import {AppRegistry} from 'react-native';
import TrackPlayer from 'react-native-track-player';

import App from './app/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => require('./app/components/play/service'));