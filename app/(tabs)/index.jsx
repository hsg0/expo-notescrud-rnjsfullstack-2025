import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'




const homeScreen = () => {
  return (
    <View style={ styles.container }>
      <Text style={ styles.notesemoji} >📝</Text>
      <Text style={ styles.welcome } >Welcome to Notes app</Text>
      <Text style={ styles.thoughts } >Save your thoughts</Text>
      <TouchableOpacity style={ styles.button } 
        onPress={ () => router.push('/notes') }
      >
        <Text style={ styles.buttonText } >Get Started</Text>
      </TouchableOpacity>

        
    </View>
  )
}

export default homeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'cornsilk',
    textColor: 'purple',
  },
  notesemoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  thoughts: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    marginTop: 30,
    backgroundColor: 'purple',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
