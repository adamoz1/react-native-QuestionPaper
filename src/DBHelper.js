import { Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({name: 'my.db', location: 'default'}, () => {
  console.log('Database opened');
}, error => {
  console.log('Error opening database: ', error);
});

const createTables = () => {
  db.transaction(tx => {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS user (
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        uname TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        phone_no TEXT NOT NULL,
        image BLOB
      );
    `);

    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS question_paper (
        qid INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        opt1 TEXT NOT NULL,
        opt2 TEXT NOT NULL,
        opt3 TEXT NOT NULL,
        opt4 TEXT NOT NULL,
        answer INTEGER NOT NULL
      );
    `);

    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS result (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        qid INTEGER NOT NULL,
        userid INTEGER NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY (qid) REFERENCES question_paper (qid),
        FOREIGN KEY (userid) REFERENCES user (uid)
      );
    `);
  }, error => {
    console.log('Transaction error: ', error);
  }, () => {
    console.log('Tables created successfully');
  });
};

var validateUser = (username, password) => {
  return new Promise((resolve, reject) => {
    try{  
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM user WHERE uname = ? AND password = ?',
          [username, password],
          (tx, results) => {
            console.log(results);
            if (results.rows.length > 0) {
              const user = results.rows.item(0);
              resolve(user);
            } else {
              reject('Invalid username or password');
            }
          },
          error => {
            reject('Transaction error: ' + error.message);
          }
        );
      });
    }catch(e){
      console.log(e);
      reject('Transaction error: ' + error.message);
    }
  });
};

const insertUser = (uname, password, phone_no, imageUri) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO user (uname, password, phone_no, image) VALUES (?, ?, ?, ?)',
        [uname, password, phone_no, imageUri],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            resolve('User inserted successfully');
          } else {
            reject('Failed to insert user');
          }
        },
        error => {
          console.log(error);
          reject('Transaction error: ' + error.message);
        }
      );
    });
  });
};

const getUserData = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM user',
        [],
        (tx, results) => {
          let users = [];
          for (let i = 0; i < results.rows.length; i++) {
            users.push(results.rows.item(i));
          }
          resolve(users);
        },
        error => {
          reject('Transaction error: ' + error.message);
        }
      );
    });
  });
};

const updateUser = (uid, uname, password, phone_no, image) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE user SET uname = ?, password = ?, phone_no = ?, image = ? WHERE uid = ?',
        [uname, password, phone_no, image, uid],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            resolve('User updated successfully');
          } else {
            reject('Failed to update user');
          }
        },
        error => {
          reject('Transaction error: ' + error.message);
        }
      );
    });
  });
};

const insertQuestion = (question, opt1, opt2, opt3, opt4, answer) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO question_paper (question, opt1, opt2, opt3, opt4, answer) VALUES (?, ?, ?, ?, ?, ?)',
        [question, opt1, opt2, opt3, opt4, answer],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            resolve(true);
          } else {
            reject('Failed to insert question');
          }
        },
        error => {
          reject('Transaction error: ' + error.message);
        }
      );
    });
  });
};

const fetchQuestionsAndResults = async (userId) => {
  return new Promise((resolve, reject) => {
      db.transaction((tx) => {
          const query = `
              SELECT qp.*, r.status AS result_ans,r.id AS result_qid
              FROM question_paper qp
              LEFT JOIN result r ON qp.qid = r.qid AND r.userid = ?;
          `;
          tx.executeSql(query, [userId], (tx, results) => {
              let questions = [];
              for (let i = 0; i < results.rows.length; i++) {
                  questions.push(results.rows.item(i));
              }
              resolve(questions);
          }, (tx, error) => {
              console.error('Query execution error: ', error);
              reject(error);
          });
      });
  });
};

const insertResultTable = (questionId, userId, option)=>{
  console.log(questionId, userId, option);
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO result (qid, userid, status) VALUES (?, ?, ?)',
        [questionId, userId, option],
        (tx, results) => {
          Alert.alert('Answer recorded', `You selected: ${option}`);
          console.log('Result inserted successfully');
          resolve();
        },
        (tx, error) => {
          console.error('Error inserting result: ', error);
        }
      );
    });
});
}

export {createTables, validateUser, insertUser, getUserData, updateUser, insertQuestion, fetchQuestionsAndResults, insertResultTable};

