import React, { Component } from "react"
import {
  AppRegistry,
  Button,
  StyleSheet,
  Text,
  View,
  Alert,
  NativeModules,
  TouchableOpacity } from "react-native"

const {RNTwitterSignIn} = NativeModules
import {firebase} from '@react-native-firebase/auth';
import {Keys} from './Keys'

const { TwitterAuthProvider } = firebase.auth;

export const SignInTwitter = async () => {
    await RNTwitterSignIn.init(Keys.KEY, Keys.SECRET)
    
    try {
        const { authToken, authTokenSecret } = await RNTwitterSignIn.logIn()

        if (authToken && authTokenSecret) {
            const credential = TwitterAuthProvider.credential( authToken, authTokenSecret )
            //console.log( '----- credential', credential)
            const result = await firebase.auth().signInWithCredential(credential);
            //console.log( '==== result', result)
        }
    } catch (error) {
        console.error( error )
    }
}

export const SignOutTwitter = async () => {
    await RNTwitterSignIn.init(Keys.KEY, Keys.SECRET)

    await RNTwitterSignIn.logOut()
}