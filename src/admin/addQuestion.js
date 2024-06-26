import React, { useState } from 'react';
import { insertQuestion } from '../DBHelper';
import { View, StyleSheet, Alert, Text, ScrollView } from 'react-native';
import { TextInput, Button } from '@react-native-material/core';
import { Picker } from '@react-native-picker/picker';

export default function AddQuestion() {
  const [question, setQuestion] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleSaveQuestion = async () => {
    if (question === '' || option1 === '' || option2 === '' || option3 === '' || option4 === '' || selectedAnswer === '') {
      Alert.alert('Message', 'All fields are required', [{ text: 'OK' }]);
      return;
    }

    try {
      await insertQuestion(question, option1, option2, option3, option4, selectedAnswer);
      Alert.alert('Success', 'Question saved successfully', [{ text: 'OK' }]);
      setQuestion('');
      setOption1('');
      setOption2('');
      setOption3('');
      setOption4('');
      setSelectedAnswer('');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to save question', [{ text: 'OK' }]);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.header}>Add Question</Text>
          <TextInput
            label="Question"
            value={question}
            onChangeText={text => setQuestion(text)}
            color='#ff6600'
            style={styles.input}
            variant="outlined"
          />
          <TextInput
            label="Option 1"
            value={option1}
            onChangeText={text => setOption1(text)}
            color='#ff6600'
            style={styles.input}
            variant="outlined"
          />
          <TextInput
            label="Option 2"
            value={option2}
            onChangeText={text => setOption2(text)}
            color='#ff6600'
            style={styles.input}
            variant="outlined"
          />
          <TextInput
            label="Option 3"
            value={option3}
            onChangeText={text => setOption3(text)}
            color='#ff6600'
            style={styles.input}
            variant="outlined"
          />
          <TextInput
            label="Option 4"
            value={option4}
            onChangeText={text => setOption4(text)}
            color='#ff6600'
            style={styles.input}
            variant="outlined"
          />
          <Picker
            selectedValue={selectedAnswer}
            onValueChange={value => setSelectedAnswer(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Correct Answer" value="" />
            <Picker.Item label="Option 1" value="1" />
            <Picker.Item label="Option 2" value="2" />
            <Picker.Item label="Option 3" value="3" />
            <Picker.Item label="Option 4" value="4" />
          </Picker>
          <Button title="Save Question" onPress={handleSaveQuestion} style={styles.button} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff5e6',
  },
  card: {
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: '#ffffff',
  },
  input: {
    marginBottom: 16,
    borderColor: '#ff6600',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
    borderColor: '#ff6600',
    color: 'black'
  },
  button: {
    marginTop: 16,
    backgroundColor: '#ff6600',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#ff6600',
  },
});
