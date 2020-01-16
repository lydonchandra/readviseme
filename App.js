/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */

import React, { Component, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View, NativeModules } from 'react-native';

import firebase from '@react-native-firebase/app';
import TwitterButton from './TwitterButton';

import StaticServer from 'react-native-static-server';

const RNFetchBlob  = NativeModules.RNFetchBlob

// TODO(you): import any additional firebase services that you require for your app, e.g for auth:
//    1) install the npm package: `yarn add @react-native-firebase/auth@alpha` - you do not need to
//       run linking commands - this happens automatically at build time now
//    2) rebuild your app via `yarn run run:android` or `yarn run run:ios`
//    3) import the package here in your JavaScript code: `import '@react-native-firebase/auth';`
//    4) The Firebase Auth service is now available to use here: `firebase.auth().currentUser`

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu',
});

const firebaseCredentials = Platform.select({
  ios: 'https://invertase.link/firebase-ios',
  android: 'https://invertase.link/firebase-android',
})

type Props = {};

import { Epub, Streamer } from "epubjs-rn";
import {TopBar} from './src/components/TopBar';

export default function App () {

  const [streamer, setStreamer] = useState( new Streamer() )
  const [flow, setFlow] = useState('paginated')
  const [location, setLocation] = useState(8)
  const [url, setUrl] = useState("https://s3-ap-southeast-2.amazonaws.com/www.readvise.me/judgement.epub")
  const [src, setSrc] = useState('')

  const [origin, setOrigin] = useState('') //eg. origin http://localhost:3481
  const [title, setTitle] = useState('')
  const [toc, setToc] = useState([])
  const [booksPaths, setBookPaths] = useState([])

  const [book, setBook] = useState(null)

  useEffect( () => {
    async function streamerStart() {
      const origin = await streamer.start()
      setOrigin(origin)
      const srcValue = await streamer.get( url )
      setSrc( srcValue )
    }
    // setup async function and call it immediately, otherwise got warning if doing
    // useEffect( async() => {}
    streamerStart()

    
  }, [])

  return (
    <View style={styles.container}>
     
      <Epub style={styles.reader}
        height={'100%'}

        fontSize={'140%'}
        src={src}
        flow={flow}
        location={location}
        origin={origin}
        onReady={(book) => {
          setTitle( book.package.metadata.title )
          setToc( book.navigation.toc )
          setBook( book )

        }}
        ></Epub>

      <View style={[styles.bar, {top: 0}]} >
        <TopBar title={title} style={styles.topBar} />
      </View>
        <TwitterButton style={styles.button} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',

    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    height: 40,
    flex: 1

  },
  reader: {
    flex: 1,
    top: 100,
    position: "absolute",
    // marginTop: 200, 
    alignSelf: 'stretch',
    backgroundColor: '#3F3F3C'
  },
  bar: {
    position:"absolute",
    left:0,
    right:0,
    height:55
  },


  

  topBar: {
    height: 100
  }
});
