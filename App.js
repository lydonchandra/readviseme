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

import { Epub, Streamer } from "epubjs-rn"
import {TopBar} from './src/components/TopBar'
import {Nav} from './src/components/Nav'

import firestore from '@react-native-firebase/firestore';
 
// Read the users documents

export default function App () {

  const [streamer, setStreamer] = useState( new Streamer() )
  const [flow, setFlow] = useState('paginated')
  const [location, setLocation] = useState(16)
  const [url, setUrl] = useState("https://s3-ap-southeast-2.amazonaws.com/www.readvise.me/judgement.epub")
  const [src, setSrc] = useState('')

  const [origin, setOrigin] = useState('') //eg. origin http://localhost:3481
  const [title, setTitle] = useState('')
  const [toc, setToc] = useState([])
  const [booksPaths, setBookPaths] = useState([])

  const [book, setBook] = useState(null)

  const [isNavVisible, setIsNavVisible] = useState(false)

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


  useEffect( () => {
    async function testFirestore() {
      const querySnapshot = await firestore()
        .collection('users')
        .get();
      
      console.log('Total users', querySnapshot.size);
      console.log('User Documents', querySnapshot.docs);

    }

    testFirestore()
  }, [])



  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
     
      <View style={{flex: 8, top: 40, paddingBottom: 20}} >
        <Epub
          fontSize={'120%'}
          src={src}
          flow={flow}
          location={location}
          origin={origin}
          onReady={(book) => {
            setTitle( book.package.metadata.title )
            setToc( book.navigation.toc )
            setBook( book )
          }}
          onLongPress={() => { 
            console.log('onLongPress')
          }}
          onLocationChange={ async (newLocation) => {
            console.log('-------- newLocation2', newLocation)
            await firestore().collection("currentLocation").add({
              user: 'don',
              currentLocation: JSON.stringify(newLocation)
            })
            .then(function(docRef) {
                console.log("currentLocation written with ID: ",newLocation);
            })
            .catch(function(error) {
                console.error("Error adding currentLocation: ", error);
            });
          }}
          ></Epub>
      </View>

      <View style={{position:"absolute",
        left:0,
        right:0,
        height:55,
        flex: 1}} >
        <TopBar title={title} onNavButtonPressed={() => setIsNavVisible(true)}  />
      </View>

      <View>
        <Nav isVisible={isNavVisible} setIsVisible={setIsNavVisible} 
              toc={toc} 
              displayFunc={(newLoc) => {
                console.log('=============== newLoc', newLoc)
                setLocation(newLoc) }
              } 
        />


      </View>

      {/* <View style={{flex: 1, height: 20}}>
        <TwitterButton />

      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',

    justifyContent: 'space-between',
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
    flex: 10,
    // top: 100,
    //position: "absolute",
    // marginTop: 200, 
    alignSelf: 'stretch',
    backgroundColor: '#3F3F3C'
  },
  bar: {
    position:"absolute",
    left:0,
    right:0,
    height:55,
    flex: 1
  },
  topBar: {
    height: 100
  }
});
