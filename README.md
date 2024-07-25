# node.js / express / react / mysql을 활용한 게시판

# 📖 목차

1. [프로젝트 소개](#-프로젝트-소개)
2. [기술스택](#-기술스택)
3. [화면구성 및 기능](#%EF%B8%8F-화면구성-및-기능)
<!-- 
4. [트러블 슈팅](#-트러블-슈팅)
-->


<br><br>

# 📃 프로젝트 소개
node.js, react, express를 사용하여 간단한 게시판 구현하기


<br><br>

# 🚨 기술스택

<img src="https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white"/>&nbsp;
<img src="https://img.shields.io/badge/github-FC6D26?style=for-the-badge&logo=github&logoColor=white">&nbsp;
<img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB">&nbsp;
<img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white">&nbsp;
<img src="https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white">&nbsp;


<br><br>
[목차🔺](#-목차)


<br><br>
# 🖥️ 화면구성 및 기능
<table>
  <thead>
    <tr>
      <th style="text-align: center;">로그인 페이지</th>
      <th style="text-align: center;">회원가입 페이지</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
	      <img src="https://github.com/user-attachments/assets/283ac291-23cf-41f9-a850-d11a594faeec">
      </td>
      <td align="center">
	      <img src="https://github.com/user-attachments/assets/ba4c7e72-d65d-49e8-92cd-93e80978d229">
      </td>
    </tr>
  </tbody>
</table>

- 로그인
  - **로그인 실패**: <br>
     등록된 아이디가 아닐경우 -> '아이디 정보가 일치하지 않습니다.' 라는 메시지 출력 <br>
     비밀번호가 틀릴 경우 -> ' '로그인 정보가 일치하지 않습니다.' 라는 메시지 출력 <br> 
  - **로그인 성공**: 서버에서 로그인 여부 확인 및 세션 확인하여 게시판 페이지로 이동

- 회원가입 
  - **비밀번호 암호화 및 안전한 저장**: bcrypt를 사용해서 비밀번호를 암호화하여 사용자의 비밀번호를 안전하게 해시화하고 데이터베이스에 저장.
  - **중복 확인**: 이미 등록된 아이디를 입력 후 진행시 중복 여부를 확인.
  </br></br>

<table>
  <thead>
    <tr>
      <th style="text-align: center;">게시글 목록</th>
      <th style="text-align: center;">게시글 작성페이지</th>
      <th style="text-align: center;">게시글 상세페이지</th>
      <th style="text-align: center;">게시글 수정페이지</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td align="center">
	        <img src="https://github.com/user-attachments/assets/a9d984f5-de26-416b-890f-f7e6335f0e67">
        </td>
        <td align="center">
	        <img src="https://github.com/user-attachments/assets/4808c346-2734-4ebb-a410-7414588b484b">
        </td>
        <td align="center">
	        <img src="https://github.com/user-attachments/assets/624fa259-c001-46bc-9e13-20be4f14d736">
        </td>
        <td align="center">
	        <img src="https://github.com/user-attachments/assets/3ff6c4bf-39e6-49a3-974c-155512d31eab">
        </td>
    </tr>
  </tbody>
</table>

- 게시판 
  - **게시글 목록**: DB에서 조회된 모든 게시물을 조회.
  - **게시글 작성페이지**: 로그인 한 사용자가 글을 작성 할 수 있음. 글제목, 내용을 필수로 입력을 해야 한다. 입력 후 DB에 저장
  - **게시글 상세페이지**: 로그인 한 사용자와 작성자가 일치 할 시 삭제 및 수정 버튼이 활성화. 목록으로 버튼 클릭시 게시글 목록 페이지로 이동. 삭제 버튼 클릭시 DB에서 로그인한 사용자와 작성자를 비교, 게시글의 번호를 기준으로 삭제
  - **게시글 수정페이지**: 게시글 제목 및 내용 수정 가능. 수정 완료 버튼 클릭시 DB에서 수정이 되고 수정된 내용을 보여줌.


<br><br>
[목차🔺](#-목차)

<!-- 
# ✅ 트러블 슈팅



</details>

<br><br>
[목차🔺](#-목차)

-->