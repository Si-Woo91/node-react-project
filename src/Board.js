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
      <div className='writeBtn'>
        <button onClick={() => { props.setMode("BOARDWRITE"); }} >작성하기</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', width: '10%', padding: '8px'}}>글번호</th>
            <th style={{ border: '1px solid #ddd', width: '50%', padding: '8px'}}>글제목</th>
            <th style={{ border: '1px solid #ddd', width: '20%', padding: '8px'}}>작성자</th>
            <th style={{ border: '1px solid #ddd', width: '20%', padding: '8px'}}>작성일자</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td style={{ border: '1px solid #ddd', width: '10%', padding: '8px'}}>{post.id}</td>
              <td style={{ border: '1px solid #ddd', width: '50%', padding: '8px', cursor: 'pointer'}}onClick={() => handlePostClick(post.id)}>{post.postTitle}</td>
              <td style={{ border: '1px solid #ddd', width: '20%', padding: '8px' }}>{post.postUserName}</td>
              <td style={{ border: '1px solid #ddd', width: '20%', padding: '8px' }}>
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
    <div className="board-write">
      <h1>게시물 작성 하기</h1>
      <div className="form-group">
        <label>작성자</label>
        <input type="text" value={props.userName} readOnly />
      </div>
      <div className="form-group">
        <label>제목</label>
        <input type="text" onChange={event => setTitle(event.target.value)} required />
      </div>
      <div className="form-group">
        <label>내용</label>
        <textarea onChange={event => setContent(event.target.value)} required />
      </div>
      <div className="form-actions">
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
        <button onClick={() => { props.setMode("BOARD"); }}>취소</button>
      </div>
    </div>
  );
}

// 게시물 상세페이지
function BoardDetail(props) {
  const [post, setPost] = useState({});
  const postId = props.postId;
  const userName = props.userName;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchPost();
  }, [postId]);

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
      setPost(json);
      setEditTitle(json.postTitle);
      setEditContent(json.postContent);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const sendData = {
        userName : userName
      }

      const response = await fetch(`http://localhost:3001/${postId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(sendData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await response.json();
      alert('게시물이 삭제되었습니다.');
      props.setMode('BOARD');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedPost = {
        postTitle: editTitle,
        postContent: editContent
      };

      const response = await fetch(`http://localhost:3001/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await fetchPost();
      setIsEditing(false);
      alert('게시물이 수정되었습니다.');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(post.postTitle);
    setEditContent(post.postContent);
  };

  return (
    <div className="board-detail">
      {isEditing ? (
        <>
          <div className="form-group">
            <label>글제목:</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>글내용:</label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button onClick={handleUpdate}>수정완료</button>
            <button onClick={handleCancel}>취소</button>
          </div>
        </>
      ) : (
        <>
          <div className="form-group">
            <label>글제목:</label>
            <input type="text" value={post.postTitle} readOnly />
          </div>
          <div className="form-group">
            <label>작성자:</label>
            <input type="text" value={post.postUserName} readOnly />
          </div>
          <div className="form-group">
            <label>글내용:</label>
            <textarea value={post.postContent} readOnly />
          </div>
          <div className="form-actions">
            <button onClick={() => props.setMode('BOARD')}>목록으로</button>
            {post.postUserName === userName && (
              <>
                <button onClick={handleDelete}>삭제</button>
                <button onClick={() => setIsEditing(true)}>수정</button>
              </>
            )}
          </div>
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
      <header className="header">
        <a href="/logout" className="logout-link">로그아웃</a>
      </header>
      {content}
    </div>
  );
}

export default Board;
