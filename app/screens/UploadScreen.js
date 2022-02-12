import React from 'react';
import styled from 'styled-components/native';

import Upload from '../components/upload/Upload';
export default function UploadScreen({ navigation }) {

    return (
            <Container>
                <Upload />
            </Container>
    );
}

const Container = styled.View`
    flex: 1;
    background-color: #fff;
`;
