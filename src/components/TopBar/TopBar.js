import React, { Component, useEffect, useState } from 'react';

import { Text, TouchableOpacity, Animated, StyleSheet } from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome'
//
const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 16,
    width: 400,
    fontWeight: '400',
    flex: 6,
    color: '#000',
    ...Platform.select({
      ios: {
        fontFamily: "Baskerville",
      },
      android: {
        fontFamily: "serif"
      },
    }),
  },
  header: {
    backgroundColor: "#b1c0ce",
    ...Platform.select({
      ios: {
        paddingTop: 40,
      },
      android: {
        paddingTop: 0,
      },
    }),
    top: 0,
    ...Platform.select({
      ios: {
        height: 84,
      },
      android: {
        height: 52,
      },
    }),
    right: 0,
    left: 0,
    borderBottomWidth: 1,
    borderBottomColor:"#000",
    position: 'absolute',
    display: 'flex',
    alignItems:'center',
    justifyContent:'center',
    flexDirection: 'row',
    flex: 1
  },
  backButton: {
    width: 30,
    height: 30,
    margin: 2,
    paddingTop: 8,

    flex: 1,
    display: 'flex',
    alignItems:'center',
    justifyContent:'center',
    flexDirection: 'row'
  },
  backButtonImage: {
    width: 30,
    height: 30,
  }
});

export const TopBar = ({title, user, onNavButtonPressed, onOpenButtonPressed, onSettingsButtonPressed, onInfoButtonPressed, onSignInButtonPressed, onSignOutButtonPressed}) => {
    return (

        <Animated.View style={styles.header}>
          <TouchableOpacity style={styles.backButton}
              onPress={onNavButtonPressed}>
              <Icon name="navicon" size={30} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton}
                          onPress={onOpenButtonPressed}>
            <Icon name="folder-open" size={30} />
          </TouchableOpacity>

          <Text style={styles.title}>{title}</Text>

          {!user && (
          <TouchableOpacity style={styles.backButton}
                            onPress={onSignInButtonPressed}>
            <Icon name="sign-in" size={30} />
          </TouchableOpacity>
          )}

          {user && (
          <TouchableOpacity style={styles.backButton}
                            onPress={onSignOutButtonPressed}>
            <Icon name="sign-out" size={30} />
          </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.backButton}
                            onPress={onSettingsButtonPressed}>
            <Icon name="gear" size={30} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton}
                            onPress={onInfoButtonPressed}>
            <Icon name={"exclamation"} size={30} />
          </TouchableOpacity>
            
        </Animated.View>

    )
}

