/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */

import React, { Component, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View, NativeModules } from 'react-native';
import StaticServer from 'react-native-static-server';
const RNFetchBlob  = NativeModules.RNFetchBlob

import firebase from '@react-native-firebase/app';
import { firebase as firebaseAuth } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const firebaseCredentials = Platform.select({
  ios: 'https://invertase.link/firebase-ios',
  android: 'https://invertase.link/firebase-android',
})

import { Epub, Streamer } from "epubjs-rn"
import {TopBar} from './src/components/TopBar'
import {Nav} from './src/components/Nav'
import {Settings} from './src/components/Settings'
import TwitterButton from './TwitterButton';
import { SignOutTwitter, SignInTwitter } from './src/components/Twitter';

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
  const [isSettingsVisible, setIsSettingsVisible] = useState(false)

  const [user, setUser] = useState()
  //user 
  //onAuthStateChanged {"displayName": "lydonchandra", "email": null, "emailVerified": false, "isAnonymous": false, "metadata": {"creationTime": 1578759754137, "lastSignInTime": 1578759754138}, "phoneNumber": null, "photoURL": "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png", "providerData": [[Object]], "providerId": "firebase", "uid": "dJRcplbkY1TYevuuA1KdNKnxlJ92"}

  const onAuthStateChanged = (user) => {
    console.log('--- onAuthStateChanged', user)
    setUser(user)
  }
  useEffect( () => {
    const subscriber = firebaseAuth.auth().onAuthStateChanged( onAuthStateChanged )
    return subscriber
  }, [])


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
      var docRef = firestore().collection("currentBooks").doc("currentLocations");
      var doc = await docRef.get()

      if (doc.exists) {
        console.log("Document data:", doc.data());
        setLocation( doc.href )
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }
    testFirestore()
  }, [])

  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
     
      <Settings isVisible={isSettingsVisible} setIsVisible={setIsSettingsVisible} user={user} />
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

            if( user && user.uid ) {
              await firestore().collection("currentBooks").doc("currentLocations").set({
                user: user.uid,
                currentLocation: JSON.stringify(newLocation)
              })
              .then(function(docRef) {
                  console.log("currentLocation written with ID: ",newLocation);
              })
              .catch(function(error) {
                  console.error("Error adding currentLocation: ", error);
              });
            }
          }}
          ></Epub>
      </View>

      <View style={{position:"absolute",
        left:0,
        right:0,
        height:55,
        flex: 1}} >

        <TopBar title={title} user={user}
          onNavButtonPressed={() => setIsNavVisible(true)} 
          onSettingsButtonPressed={() => {
            setIsSettingsVisible(true)
          }}
          onSignOutButtonPressed={ async () => {
            console.log('SignOutTwitter')
            await SignOutTwitter()
            setUser( null )
          }}
          onSignInButtonPressed={ async() => {
            await SignInTwitter()
        }}  />
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

      <View style={{flex: 1, height: 20}}>
        { (user == null) && <TwitterButton /> }
      </View>

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
