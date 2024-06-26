import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchQuestionsAndResults } from '../DBHelper';

export default function QuestionReport(props) {
  const [questions, setQuestions] = useState([]);
  const [userId, setUserId] = useState(props.route.params.id);

  useEffect(() => {
    getQuestions().then((resp) => {
      setQuestions(resp);
    });
  }, []);

  const getBackgroundColor = (question) => {
    if (question.result_ans === null) {
      return styles.notAnswered;
    }
    if (parseInt(question.result_ans) === question.answer) {
      return styles.correct;
    }
    return styles.incorrect;
  };

  const getQuestions = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await fetchQuestionsAndResults(userId);
        resolve(result);
      } catch (error) {
        console.error('Query execution error: ', error);
        reject(error);
      }
    });
  };

  if(questions.length === 0){
    return (<View style={[{justifyContent:'center'}, styles.container]}><Text style={styles.noDataText}>No Question are there!!!</Text></View>)
  }

  return (
    <ScrollView style={styles.container}>
        {questions.map((question, index) => (
          <View key={index} style={[styles.questionContainer, getBackgroundColor(question)]}>
            <Text style={styles.questionText}>{question.question}</Text>
            <Text style={styles.optionText}>1. {question.opt1}</Text>
            <Text style={styles.optionText}>2. {question.opt2}</Text>
            <Text style={styles.optionText}>3. {question.opt3}</Text>
            <Text style={styles.optionText}>4. {question.opt4}</Text>
            <Text style={styles.answerText}>Selected Answer: {question.result_ans || 'Not Answered'}</Text>
            <Text style={styles.answerText}>Correct Answer: {question.answer || 'Not Answered'}</Text>
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff5e6',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ff6600',
  },
  questionContainer: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff6600', 
  },
  optionText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333333',
  },
  answerText: {
    fontSize: 16,
    marginTop: 10,
    color: '#ff6600',
  },
  correct: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb', 
  },
  incorrect: {
    backgroundColor: '#f8d7da', 
    borderColor: '#f5c6cb', 
  },
  notAnswered: {
    backgroundColor: '#fff3cd', 
    borderColor: '#ffeeba',
  },
});
