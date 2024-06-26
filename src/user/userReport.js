import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchQuestionsAndResults } from '../DBHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserReport() {
  const [questions, setQuestions] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      getQuestions().then((resp)=>{
        setQuestions(resp);
      })
    }
  }, [userId]);

  const getBackgroundColor = (question) => {
    if (question.result_ans === null) {
      return styles.notAnswered;
    }
    if (parseInt(question.result_ans) === question.answer) {
      return styles.correct;
    }
    return styles.incorrect;
  };

  const getUserId = async () => {
    const id = await AsyncStorage.getItem('user-id');
    setUserId(id);
  };

  const getQuestions = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await fetchQuestionsAndResults(userId);
        console.log("Result", result);
        resolve(result);
      } catch (error) {
        console.error('Query execution error: ', error);
        reject(error);
      }
    });
  };

  return (
    (questions.length == 0 ? <View style={[styles.container,{justifyContent:'center'}]}><Text style={[styles.name,{textAlign:'center'}]}>No Question have answered!!</Text></View>:<ScrollView style={styles.container}>
      {questions.map((question, index) => (
        <View key={index} style={[styles.questionContainer, getBackgroundColor(question)]}>
          <Text style={styles.questionText}>{question.question}</Text>
          <Text style={styles.optionText}>1. {question.opt1}</Text>
          <Text style={styles.optionText}>2. {question.opt2}</Text>
          <Text style={styles.optionText}>3. {question.opt3}</Text>
          <Text style={styles.optionText}>4. {question.opt4}</Text>
          <Text style={styles.answerText}>Your Answer: {question.result_ans || 'Not Answered'}</Text>
          {question.result_ans != null ? <Text style={styles.answerText}>Correct Answer: {question.answer || 'Not Answered'}</Text> : <Text></Text>}
        </View>
      ))}
    </ScrollView>)
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffebcc', 
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ff6600',
  },
  questionContainer: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeeba', 
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333', 
  },
  optionText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333333',
  },
  answerText: {
    fontSize: 16,
    marginTop: 10,
    color: '#333333',
  },
  correct: {
    backgroundColor: '#d4edda', 
    borderColor: '#c3e6cb', 
  },
  incorrect: {
    backgroundColor: '#FF9091', 
    borderColor: '#f5c6cb', 
  },
  notAnswered: {
    backgroundColor: '#fff', 
    borderColor: '#ffeeba', 
  },
});
