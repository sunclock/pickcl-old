import React from 'react';
import { View, Text } from 'react-native';
import Play from '../components/play/Play';

export default function PlayScreen({ navigation, route }) {
    return (
            <View style={{ flex: 1 }}>
                <Play navigation={navigation} nextTrack={route?.params?.nextTrack}/>
            </View>
    );
}
