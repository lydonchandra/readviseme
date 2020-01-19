import React, { Component, useEffect, useState } from 'react';

import { Text, TouchableOpacity, Animated, StyleSheet, View, Modal, FlatList } from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome'



const styles = StyleSheet.create({
  navButtons: {
    width: 130,
    height: 30,
    position: 'absolute',
    top: 7,
    left: 20,
    padding: 0,
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    // justifyContent: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    overflow: "hidden",
  },
  title: {
    fontFamily: "georgia",
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },


  header: {
    backgroundColor: "#b1c0ce",
    paddingTop: 0,
    top: 0,
    ...Platform.select({
      ios: {
        height: 64,
      },
      android: {
        height: 50,
      },
    }),
    right: 0,
    left: 0,
    borderBottomWidth: 1,
    borderBottomColor:"#000",
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '400',
    color: '#000',
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        fontFamily: "Baskerville",
      },
      android: {
        fontFamily: "serif"
      },
    }),
  },

});

export const Settings = ({isVisible, setIsVisible, user }  ) => {

  return (

    <View>
      <Modal animationType={"slide"} visible={isVisible} onRequestClose={ () => {} }>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome {user && user.displayName}</Text>
          
          <TouchableOpacity style={styles.navButtons} 
                            onPress={() => setIsVisible(false)}>
            <Icon name="close" size={34} />

          </TouchableOpacity>
        </View>
        
        

      </Modal>
    </View>

  )
}

