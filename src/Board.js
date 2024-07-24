import './Board.css';
import React, { useState, useEffect } from 'react';

// 전체 게시물 목록
function BoardList(props) {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    fetch('http://localhost:3001/list')
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostClick = (id) => {
    props.setPostId(id); // 게시물 ID 설정
    props.setMode('BOARDDETAIL'); // 페이지 모드 변경
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>게시판 목록</h1>
      <p>
        <a href="/logout">로그아웃</a>
        <button onClick={() => { props.setMode("BOARDWRITE"); }}>글작성</button>
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
              <td style={{ border: '1px solid #ddd', padding: '8px', cursor: 'pointer'}}onClick={() => handlePostClick(post.id)}>{post.postTitle}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{post.postUserName}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {new Date(post.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// 게시물 작성 페이지
function BoardWrite(props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
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
      <p>
        <input type="submit" value="작성" onClick={() => {
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
              if (json.postSuccess === "True") {
                alert('글이 성공적으로 작성되었습니다.');
                props.setMode('BOARD');
              } else {
                alert(json.postSuccess);
              }
            })
            .catch(error => {
              console.error('Error posting data:', error);
            });
        }} />
      </p>
      <p><button onClick={() => { props.setMode("BOARD"); }}>취소</button></p>
    </div>
  );
}

// 게시물 상세페이지
function BoardDetail(props) {
  const [content, setContent] = useState("");
  const [post, setPost] = useState("");
  const postId = props.postId;
  const userName = props.userName;
  const [isEditing, setIsEditing] = useState(false); // 수정모드 (true : 수정모드, false : 게시물 상세내용 모드)
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchPost();
  }, [postId]);

  // 선택한 게시물 조회
  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:3001/${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const json = await response.json();
      setPost(json); // 상태 업데이트
      setEditTitle(json.postTitle);
      setEditContent(json.postContent);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  // 게시물 삭제 핸들러
  const handleDelete = async () => {
    try {
      // 비동기 요청을 보내고 결과를 기다림
      const response = await fetch(`http://localhost:3001/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // 응답이 성공적인지 확인
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // JSON 응답을 처리
      const data = await response.json();
      alert('게시물이 삭제되었습니다.');
      props.setMode('BOARD'); // 삭제 후 목록 페이지로 돌아가기
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // 게시물 수정 핸들러
  const handleUpdate = async () => {
    try {
      const updatedPost = {
        postTitle: editTitle,
        postContent: editContent
      };

      console.log(updatedPost);
      const response = await fetch(`http://localhost:3001/${postId}`, {
        method : 'PUT',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify(updatedPost)
      });

      if(!response.ok) {
        throw new Error('Network response was not ok');
      }

      await fetchPost(); // 업데이트된 게시물 데이터를 가져와 UI를 새로 고침
      setIsEditing(false); // 수정 모드 종료
      alert('게시물이 수정되었습니다.');
    }
    catch (error) {
      console.error('Error updating post:', error);
    }
  };

  // 취소버튼 핸들러
  const handleCancel = () =>{
    setIsEditing(false);
    setEditTitle(post.postTitle);
    setEditContent(post.postContent);
  }

  return (
    <div style={{ padding: '20px' }}>
      {isEditing ? (    // 삼항연산자로 게시물 상세내용 조회 인지 수정모드인지
        <>
          <div>
            <label>글제목:</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div>
          <div>
            <label>글내용:</label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          </div>
          <button onClick={handleUpdate}>수정완료</button>
          <button onClick={handleCancel}>취소</button>
        </>
      ) : (
        <>
          <h1>글제목 : {post.postTitle}</h1>
          <p>작성자 : {post.postUserName}</p>
          <p>글내용 : {post.postContent}</p>
          <button onClick={() => props.setMode('BOARD')}>목록으로</button>
          {post.postUserName === userName && (
            <>
              <button onClick={() => setIsEditing(true)}>수정</button>
              <button onClick={handleDelete}>삭제</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

function Board(props) {
  const [mode, setMode] = useState("BOARD");
  const [userName, setUserName] = useState(props.userId);
  const [postId, setPostId] = useState("");

  let content = null;

  if (mode === "BOARD") {
    content = <BoardList setMode={setMode} setPostId={setPostId} userName={userName} />;
  } else if (mode === 'BOARDWRITE') {
    content = <BoardWrite setMode={setMode} userName={userName} />;
  } else if (mode === 'BOARDDETAIL') {
    content = <BoardDetail setMode={setMode} postId={postId} userName={userName} />;
  }

  return (
    <div>
      {content}
    </div>
  );
}

export default Board;
