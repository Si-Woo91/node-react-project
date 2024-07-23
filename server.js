const express = require('express')
const session = require('express-session')
const path = require('path');
const app = express()
const port = 3001

const db = require('./lib/db');
const sessionOption = require('./lib/sessionOption');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(sessionOption);
app.use(session({  
	key: 'session_cookie_name',
    secret: '~',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}))

app.get('/', (req, res) => {    
    req.sendFile(path.join(__dirname, '/build/index.html'));
})

// 로그인 체크
app.get('/authcheck', (req, res) => {      
    const sendData = { isLogin: "", userId: ""};
    if (req.session.is_logined) {
        sendData.isLogin = "True";
        console.log('세션 아이디체크 :', req.session.nickname);
        sendData.userId = req.session.nickname;
    } else {
        sendData.isLogin = "False";
    }
    res.json(sendData);
})

// 로그아웃
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

// 로그인
app.post("/login", (req, res) => { // 데이터 받아서 결과 전송
    const userId = req.body.userId;
    const password = req.body.userPassword;
    const sendData = { isLogin: "", userId: ""};

    if (userId && password) {             // id와 pw가 입력되었는지 확인
        db.query('SELECT * FROM userTable WHERE username = ?', [userId], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {       // db에서의 반환값이 있다 = 일치하는 아이디가 있다.      

                bcrypt.compare(password , results[0].password, (err, result) => {    // 입력된 비밀번호가 해시된 저장값과 같은 값인지 비교

                    if (result === true) {                  // 비밀번호가 일치하면
                        req.session.is_logined = true;      // 세션 정보 갱신
                        req.session.nickname = userId;

                        console.log('Session Nickname:', req.session.nickname);
                        req.session.save(function () {
                            sendData.isLogin = "True"
                            sendData.userId = userId;
                            res.json(sendData);
                        });
                    }
                    else{                                   // 비밀번호가 다른 경우
                        sendData.isLogin = "로그인 정보가 일치하지 않습니다."
                        res.json(sendData);
                    }
                })                      
            } else {    // db에 해당 아이디가 없는 경우
                sendData.isLogin = "아이디 정보가 일치하지 않습니다."
                res.json(sendData);
            }
        });
    } else {            // 아이디, 비밀번호 중 입력되지 않은 값이 있는 경우
        sendData.isLogin = "아이디와 비밀번호를 입력하세요!"
        res.json(sendData);
    }
});

// 회원가입
app.post("/signup", (req, res) => {  // 데이터 받아서 결과 전송
    const userId = req.body.userId;
    const password = req.body.userPassword;
    const password2 = req.body.userPassword2;
    
    const sendData = { isSuccess: "" };

    if (userId && password && password2) {
        db.query('SELECT * FROM userTable WHERE username = ?', [userId], function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
            if (error) throw error;
            if (results.length <= 0 && password == password2) {         // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우
                const hasedPassword = bcrypt.hashSync(password, 10);    // 입력된 비밀번호를 해시한 값
                db.query('INSERT INTO userTable (username, password) VALUES(?,?)', [username, hasedPassword], function (error, data) {
                    if (error) throw error;
                    req.session.save(function () {                        
                        sendData.isSuccess = "True"
                        res.send(sendData);
                    });
                });
            } else if (password != password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우                  
                sendData.isSuccess = "입력된 비밀번호가 서로 다릅니다."
                res.send(sendData);
            }
            else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우            
                sendData.isSuccess = "이미 존재하는 아이디 입니다!"
                res.send(sendData);  
            }            
        });        
    } else {
        sendData.isSuccess = "아이디와 비밀번호를 입력하세요!"
        res.json(sendData);  
    }
    
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// 게시글 목록
app.get('/list', (req, res) => {
    const query = 'SELECT * FROM postInfo';
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Database query failed' });
        return;
      }
      res.json(results);
    });
  });

// 게시글 작성
app.post('/write', (req, res) => {
    const postUserId = req.body.postUserId
    const postTitle = req.body.postTitle;
    const postContent = req.body.postContent;

    const sendData = {postSuccess : ""};

    if(postUserId && postTitle && postContent) {
        
        const getUserQuery = 'SELECT id FROM userTable WHERE username = ?';

        db.query(getUserQuery, [postUserId], function(error, results) {
            if(error) {
                console.error(error);
                return res.status(500).json({message: 'Database query error.'});
            }

            if(results.length === 0) {
                return res.status(404).json({message : 'User not found.'});
            }

            const userId = results[0].id;

            const query = 'INSERT INTO postInfo(postTitle, postContent, postUserName, postUserId) VALUES(?,?,?,?)';

            db.query(query, [postTitle, postContent, postUserId, userId], function (error, data) {
                if(error) throw error;
                
                sendData.postSuccess = "True";
                res.json(sendData);
                
            })
        })
    }
    else
    {
        sendData.postSuccess = "빠진 항목없이 입력해주세요."
        res.json(sendData);  
    }
})

app.get('/:postId', (req, res) => {
    const postId = parseInt(req.params.postId, 10); // 10은 10진법을 의미
    const query = 'SELECT * FROM postInfo WHERE id = ?';

    const sendData = {  postId : "",
                        postTitle : "",
                        postContent : "",
                        postUserName : "",
                        postUserId : ""
    };

    db.query(query, [postId], function(error, results) {

        if (error) {
            console.error('Error querying the database:', error);
            return res.status(500).send('Internal Server Error'); // HTML 응답
          }

        if(results.length === 0 ){
            return res.status(400).json({message : 'Post not found.'});
        }
        else{
            sendData.postId = results[0].id
            sendData.postTitle = results[0].postTitle
            sendData.postContent = results[0].postContent
            sendData.postUserName = results[0].postUserName
            sendData.postUserId = results[0].postUserId

            console.log("sendData ::: ", sendData);

            res.json(sendData);
        
        }
    })
})

// 게시물 삭제
app.delete('/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    
    const query = 'DELETE FROM postInfo WHERE id = ?';
    db.query(query, [postId], (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error deleting post' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json({ message: 'Post deleted successfully' });
    });
  });