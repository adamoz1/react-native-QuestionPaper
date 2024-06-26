import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { fetchQuestionsAndResults, insertResultTable } from '../DBHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AttendQuestion({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      getQuestions().then((unattemptedQuestions) => {
        setQuestions(unattemptedQuestions);
        if (unattemptedQuestions.length > 0) {
          setCurrentQuestion(unattemptedQuestions[0]);
        }
      });
    }
  }, [userId]);

  const getUserId = async () => {
    const id = await AsyncStorage.getItem('user-id');
    setUserId(id);
  };

  const getQuestions = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await fetchQuestionsAndResults(userId);
        const unattemptedQuestions = result.filter(question => question.result_qid === null);
        resolve(unattemptedQuestions);
      } catch (error) {
        console.error('Query execution error: ', error);
        reject(error);
      }
    });
  };

  const handleOptionSelect = async (questionId, option) => {
    if (questionId && userId && option) {
      try {
        await insertResultTable(questionId, userId, option);
        goToNextQuestion();
      } catch (error) {
        console.error('Error inserting result: ', error);
        Alert.alert("Error", "There was an issue saving your answer. Please try again.");
      }
    } else {
      Alert.alert("Warning", "Some data are incomplete");
    }
  };

  const handleSkip = () => {
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
    } else {
      Alert.alert('Completed', 'You have completed all questions.');
      navigation.goBack();
    }
  };

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text style={[styles.name,{textAlign:'center'}]}>No unattempted questions available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{currentQuestion.question}</Text>
      <TouchableOpacity style={styles.option} onPress={() => handleOptionSelect(currentQuestion.qid, '1')}>
        <Text style={styles.optionText}>{currentQuestion.opt1}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => handleOptionSelect(currentQuestion.qid, '2')}>
        <Text style={styles.optionText}>{currentQuestion.opt2}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => handleOptionSelect(currentQuestion.qid, '3')}>
        <Text style={styles.optionText}>{currentQuestion.opt3}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => handleOptionSelect(currentQuestion.qid, '4')}>
        <Text style={styles.optionText}>{currentQuestion.opt4}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffebcc', 
  },
  question: {
    fontSize: 24,
    marginBottom: 20,
    color: '#ffffff', 
    textAlign: 'center',
    padding: 15,
    borderRadius: 5,
    fontWeight: 'bold',
    backgroundColor: '#ff6600'
  },
  option: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#ffa366',
    marginVertical: 5,
  },
  optionText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ff6600',
  },
  skipButton: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#ff5252', 
    marginVertical: 20,
  },
  skipText: {
    fontSize: 18,
    color: '#ffffff', 
    textAlign: 'center',
  },
});
