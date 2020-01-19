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

const { RNTwitterSignIn } = NativeModules
// import firebase from '@react-native-firebase/app';
import { firebase } from '@react-native-firebase/auth';

const { TwitterAuthProvider } = firebase.auth;




const Constants = {
  //Dev Parse keys
  TWITTER_COMSUMER_KEY: "Es053ZYyEDsw9hMnuXQV0vtRu",
  TWITTER_CONSUMER_SECRET: "9WMWaFxVogq3AxLTDs1CTBqV9LiYWvyq3Fwtuxkxh3U2JPQfil"
}
 
///
export default class TwitterButton extends Component {
  state = {
    isLoggedIn: false
  }
  
  _twitterSignIn = async () => {
    
    await RNTwitterSignIn.init(Constants.TWITTER_COMSUMER_KEY, Constants.TWITTER_CONSUMER_SECRET)

    try {
        const { authToken, authTokenSecret } = await RNTwitterSignIn.logIn()

        if (authToken && authTokenSecret) {

            const credential = TwitterAuthProvider.credential( authToken, authTokenSecret )
            console.log( '----- credential', credential)
            const result = await firebase.auth().signInWithCredential(credential);
            console.log( '==== result', result)


            this.setState({
              isLoggedIn: true
            })
          }

    } catch (error) {
        console.error( error )
    }

    

    // if (authToken && authTokenSecret) {
    //     this.setState({
    //       isLoggedIn: true
    //     })
    //   }

    // RNTwitterSignIn.logIn()
    //   .then(loginData => {
    //     console.log(loginData)
    //     const { authToken, authTokenSecret } = loginData
    //     if (authToken && authTokenSecret) {
    //       this.setState({
    //         isLoggedIn: true
    //       })
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   }
    // )
  } 

  handleLogout = () => {
    console.log("logout")
    RNTwitterSignIn.logOut()
    this.setState({
      isLoggedIn: false 
    })
  }

  render() {
    const { isLoggedIn } = this.state
    return (
      <View style={this.props.style}>
        {isLoggedIn
          ? <TouchableOpacity onPress={this.handleLogout}>
              <Text>Log out</Text>
            </TouchableOpacity>
          : <Button name="logo-twitter" style={styles.button} onPress={this._twitterSignIn} title="Login with Twitter">
            </Button>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1b95e0',
    color: 'white',
    width: 200,
    height: 50,
    flex: 1
  }
})