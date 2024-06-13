const inputs = document.querySelectorAll(".input");

function addcl() {
  let parent = this.parentNode.parentNode;
  parent.classList.add("focus");
}

function remcl() {
  let parent = this.parentNode.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach(input => {
  input.addEventListener("focus", addcl);
  input.addEventListener("blur", remcl);
});

function loginWithKakao() {
    // 기존 세션을 명확히 종료하기 위해 로그아웃
    Kakao.Auth.logout(function() {
        console.log('로그아웃 성공');
        forceLogin();
    });
}

function forceLogin() {
    // 새로운 로그인 창을 띄우도록 설정
    Kakao.Auth.authorize({
        redirectUri: 'http://localhost:8080/4_main.html', // 설정한 리디렉트 URL
        prompt: 'login' // 항상 로그인 창을 띄우도록 설정
    });
}

function performLogin() {
    Kakao.Auth.login({
        scope: 'profile_nickname,account_email', // 추가 동의 항목
        success: function(authObj) {
            console.log(authObj);
            // 로그인 성공 시 사용자 정보 가져오기
            Kakao.API.request({
                url: '/v2/user/me',
                success: function(res) {
                    console.log(res);
                    const kakaoNickname = res.properties.nickname;
                    localStorage.setItem('kakaoNickname', kakaoNickname); // 카카오 닉네임 저장
                    window.location.href = "4_main.html"; // 로그인 후 이동할 페이지
                },
                fail: function(error) {
                    console.log(error);
                }
            });
        },
        fail: function(err) {
            console.log(err);
        }
    });
}
