import React, { useEffect } from 'react';

import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import * as actions from './store/actions';
import { connect } from 'react-redux';

import Theme from './Theme';
import tracklistReducer from './store/reducers/tracklist';
import bookmarkReducer from './store/reducers/bookmark';
import currentTrackReducer from './store/reducers/currentTrack';
import PlayScreen from './screens/PlayScreen';
import BottomTab from './screens/BottomTab';


const App = ({ }) => {

  const rootReducer = combineReducers({
    tracklist: tracklistReducer,
    bookmark: bookmarkReducer,
    currentTrack: currentTrackReducer
  });

  const store = createStore(rootReducer);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <ThemeProvider theme={Theme}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen 
              name="BottomTab" 
              component={BottomTab} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Play" 
              component={PlayScreen} 
              options={{ headerShown: false, unmountOnBlur: true }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
};

export default App;

