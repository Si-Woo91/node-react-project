import React, { useState, useEffect } from 'react';

function BoardList() {
  // 상태 변수 정의
  const [posts, setPosts] = useState([]);

  // 게시글 목록을 가져오는 함수
  const fetchPosts = () => {
    fetch('http://localhost:3001/posts') // Express 서버의 API 엔드포인트
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
      <p><a href="/logout">로그아웃</a> </p>
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
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>사용자 {post.username}</td>
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

function BoardWriter(){
    
}

export default BoardList;