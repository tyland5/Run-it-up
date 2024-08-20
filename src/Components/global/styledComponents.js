import styled from 'styled-components';
import React from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback} from 'react-native';
import {hs, vs, ms} from "./responsiveScaling"; 

//https://medium.com/building-crowdriff/styled-components-to-use-or-not-to-use-a6bb4a7ffc21
export const StyledText = styled.Text`
    font-size: ${ms(16)}px;
     ${props => props.small && `
     font-size: ${ms(14)}px;
    `}
    ${props => props.large && `
     font-size: ${ms(28)}px;
    `}
    ${props => props.xlarge && `
        font-size: ${ms(40)}px;
    `}

    color: ${props => props.color ? props.color : "white"};
    ${props => props.error && `
        color: red;
    `}

    margin: ${props=> props.margin ? props.margin : 0};
    fontWeight: ${props => props.bold ? "bold" : "normal"};
    ${props => props.underline && `textDecorationLine: underline;`}
`;

export const StyledVertSpace = styled.View`
    height: ${props => vs(props.space)}px;
`;

export const StyledTextInput = styled.TextInput`
    width: 80%;
    color: white;
    padding: ${vs(10)}px ${hs(10)}px;
    fontSize: ${ms(16)}px;
    borderWidth: ${ms(2)}px;
    borderColor: white;
    borderRadius: ${ms(8)}px;
`;

export const StyledTextLabel = styled(StyledText)`
        alignSelf: flex-start;
        marginLeft: 10%;
        marginBottom: ${vs(10)}px;
    `;

export const StyledButton = styled.Pressable`
    width: ${hs(150)}px;
    height: ${vs(70)}px;
    ${props => props.small && `
        width: ${hs(70)}px;
        height: ${vs(30)}px;
    `}

    backgroundColor: #F57600;
    alignItems: center;
    justifyContent: center;
    borderRadius: ${ms(8)}px;
`;