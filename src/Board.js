import React, { useState, useEffect } from 'react';

function BoardList(props) {

  // 상태 변수 정의
  const [posts, setPosts] = useState([]);

  // 게시글 목록을 가져오는 함수
  const fetchPosts = () => {
    fetch('http://localhost:3001/list') // Express 서버의 API 엔드포인트
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPosts(data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  };

  // 컴포넌트가 마운트될 때 데이터 가져오기
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>게시판 목록</h1>
      <p>
        <a href="/logout">로그아웃</a>
        <button onClick={() => {props.setMode("BOARDWRITE"); }}>글작성</button>
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>글번호</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>글제목</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>작성자</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>작성일자</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{post.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{post.postTitle}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{post.postUserName}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {new Date(post.createdAt).toLocaleDateString()} {/* MySQL의 작성일자를 포맷합니다. */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BoardWrite(props) {
    // const [userName, setUsername] = useState(props.userName);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    return <>
        <div style={{ padding: '20px' }}>
        <h1>글 작성</h1>

            <div>
                <label>작성자:</label>
                <input type="text" value={props.userName} readOnly />
            </div>
            <div>
            <label>제목:</label>
            <input type="text" onChange={event => setTitle(event.target.value)} required />
            </div>
            <div>
            <label>내용:</label>
            <textarea onChange={event => setContent(event.target.value)} required />
            </div>
            <p><input type="submit" value="작성" onClick={() => {
                    const postData = {
                        postUserId: props.userName,
                        postTitle: title,
                        postContent: content
                    };
                    fetch("http://localhost:3001/write", {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(postData),
                    })
                    .then((res) => res.json())
                    .then((json) => {
                        if(json.postSuccess === "True"){
                          alert('글이 성공적으로 작성되었습니다.');
                          props.setMode('BOARD'); // 글 작성이 끝나면 게시판 목록으로 이동
                        }
                        else
                        {
                          alert(json.postSuccess)
                        }
                    })
                    .catch(error => {
                        console.error('Error posting data:', error);
                    });        
                }}/></p>
            <p><button onClick={() => { props.setMode("BOARD"); }}>취소</button></p>
        </div>
    </>
}

function Board(props) {
    const [mode, setMode] = useState("BOARD"); // 초기 모드를 "BOARD"로 설정
    const [userName, setuserName] = useState(props.userId);
  
    let content = null;

    if (mode === "BOARD") {
      content = <BoardList setMode={setMode} userName={userName}/>;
    } else if (mode === 'BOARDWRITE') {
      content = <BoardWrite setMode={setMode} userName={userName}/>; // userId를 BoardWrite에 전달
    }
  
    return (
      <div>
        {content}
      </div>
    );
  }
  
  export default Board;
