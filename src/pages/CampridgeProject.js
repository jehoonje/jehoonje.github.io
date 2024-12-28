// src/pages/CampridgeProject.js
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import styles from "../styles/Layout.module.scss";
import Modal from "../components/Modal";
import { GoArrowUpRight } from "react-icons/go";
import { TbHandClick } from "react-icons/tb";

// 스켈레톤 스타일 정의
const VideoSkeleton = styled.div`
  width: 284px;
  height: 142px; /* 영상의 종횡비에 맞게 조정하세요 */
  background-color: #ccc;
  border-radius: 20px;
  animation: shimmer 1.5s infinite;
  position: absolute; /* VideoContainer 내에서 절대 위치로 설정 */
  top: 0;
  left: 0;

  @keyframes shimmer {
    0% {
      background-position: -284px 0;
    }
    100% {
      background-position: 284px 0;
    }
  }

  background: linear-gradient(to right, #cccccc 0%, #dddddd 50%, #cccccc 100%);
  background-size: 508px 142px;
`;

// === styled-components ===
const VideoContainer = styled.div`
  overflow: hidden;
  border-radius: 20px;
  display: flex;
  border: 1px solid #333;
  background: rgba(3, 3, 3, 0.5);
  position: relative; /* 스켈레톤 위치를 위한 상대 위치 설정 */
`;

const StyledVideo = styled.video`
  width: 284px;
  height: auto;
  object-fit: cover;
  border-radius: inherit;
`;

const DescriptionContainer = styled.div`
  max-width: 320px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Tag = styled.span`
  background-color: #fff;
  color: #000;
  padding: 2px 8px;
  font-size: 14px;
  border: 1px solid #333;
  border-radius: 4px;
`;

const ToggleButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  white-space: pre-wrap; /* 줄바꿈을 허용 */
  word-wrap: break-word;
  margin-bottom: 16px;
`;

const ToggleButton = styled.button`
  background-color: ${(props) => (props.active ? "#3e3f4c" : "#ddd")};
  color: ${(props) => (props.active ? "#fff" : "#000")};
  border: none;
  font-size: 20px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  @media (max-width: 600px) {
    padding: 8px 5px;
    font-size: 14px;
  }
`;

/**
 * 이미지 클릭 시 큰 화면(모달 레이어)으로 보여주는 컴포넌트
 */
const ZoomableImageContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  cursor: pointer;

  img {
    width: 100%;
    display: block;
    max-width: 100%; /* 이미지가 컨테이너를 넘지 않도록 */
    height: auto;
  }
`;

const ZoomOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  img {
    max-width: 90%;
    max-height: 90%;
  }
`;

// 이미지 확대를 담당하는 컴포넌트
const ZoomableImage = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = () => {
    setIsZoomed(true);
  };

  const handleOverlayClick = () => {
    setIsZoomed(false);
  };

  return (
    <>
      <ZoomableImageContainer onClick={handleImageClick}>
        <img src={src} alt={alt} />
      </ZoomableImageContainer>

      {isZoomed && (
        <ZoomOverlay onClick={handleOverlayClick}>
          <img src={src} alt={alt} />
        </ZoomOverlay>
      )}
    </>
  );
};

/**
 * 모달 내부 콘텐츠를 감싸는 styled-component
 * 모바일 화면에서는 최대 너비를 300px로 제한
 */
const ModalContent = styled.div`
  width: 100%;
  // max-width: 800px; /* 기본 최대 너비 */
  box-sizing: border-box; /* 패딩과 보더를 너비에 포함 */
  padding: 16px; /* 내부 여백 추가 */

  /* 모달 내부의 pre 태그 스타일링 */
  pre {
    white-space: pre-wrap; /* 줄바꿈을 허용 */
    word-wrap: break-word; /* 긴 단어를 줄바꿈 */
    max-width: 100%; /* pre 태그가 컨테이너를 넘지 않도록 */
    overflow-x: auto; /* 필요한 경우 내부 스크롤 */
    background: #f6f6f6;
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
    font-family: "Courier New", Courier, monospace;
  }

  /* 모달 내부의 기타 콘텐츠가 넘치지 않도록 */
  img {
    max-width: 100%;
    height: auto;
  }
`;

const CampridgeProject = ({ language }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  /**
   * 기존 isFeaturePage(true/false) 대신, 다중 탭 관리를 위한 activeTab 사용
   * - 'feature'       : 기능 정보(Feature Information)
   * - 'troubleshoot'  : 트러블슈팅(Troubleshooting)
   * - 'flowchart'     : 기능 흐름(Flowchart)
   * - 'erd'           : ERD그램(ERD Diagram)
   */
  const [activeTab, setActiveTab] = useState("feature");

  // 영상 로딩 상태 추가
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  // "카테고리" 영역 토글 상태 추가
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const mainContainerRef = useRef(null);

  // 모달 열기/닫기
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 프로젝트 기본 정보 (영어 / 한글)
  const titleText = language === "English" ? "Campridge" : "캠프릿지";
  const projectDetails =
    language === "English" ? "Learn More" : "프로젝트 상세";
  const categoryText =
    language === "English" ? "Lifestyle / Travel" : "라이프스타일 / 여행";

  // 메인 설명
  const descriptionText =
    language === "English"
      ? `This is an outdoor map app made using public data. The main focus was on a user-friendly and intuitive UI for convenience.
         Its main function provides maps of your surroundings or places in Korea and allows you to filter markers to find only the desired information.
         Also, you can view detailed information about places from public data, write and share reviews to communicate with other users.
         Users can create accounts by signing up. 
         The production period was from October to December 2024, taking about 3 months. 
         It is currently about to be released on the Play Store.`
      : `공공 데이터를 활용해 제작한 아웃도어를 위한 지도 앱 입니다.
         유저 친화적이고 직관적인 UI로 간편성을 강조하려 기획 했고
         주 기능은 유저의 주변 또는 국내의 지도를 제공하며 마커 필터링 기능을 통해
         원하는 정보만 찾아 볼 수 있도록 구성되어있습니다.
         또한 데이터에서 제공하는 정보를 통해 장소의 상세한 정보 또한 알 수 있으며,
         리뷰를 작성하고 공유하여 유저들 간의 소통이 가능하도록 제작하였습니다.
         따라서 이에 따라 유저들은 가입을 통해 계정을 개설 할 수 있습니다.
         제작기간 2024년 10월 ~ 12월 까지 약 3개월 소요 되었습니다.
         현재 플레이스토어에 출시를 앞두고 있습니다.`;

  // 카테고리 div 클릭 시 열고 닫기 토글
  const handleCategoryClick = () => {
    setIsCategoryOpen((prev) => !prev);
  };

  // useEffect를 사용하여 isCategoryOpen 상태에 따라 maxHeight를 설정
  useEffect(() => {
    if (mainContainerRef.current) {
      if (isCategoryOpen) {
        mainContainerRef.current.style.maxHeight = `${mainContainerRef.current.scrollHeight}px`;
        mainContainerRef.current.style.opacity = "1";
      } else {
        mainContainerRef.current.style.maxHeight = "0px";
        mainContainerRef.current.style.opacity = "0";
      }
    }
  }, [isCategoryOpen]);

  // === 탭(모달) 콘텐츠: 기능 정보(Feature) ===
  const featureContent =
    language === "English" ? (
      <div>
        <h2>1. Overall Project Implementation Flow</h2>
        <p>
          1) <b>User Authentication / Login</b>
          <br />
          &nbsp;&nbsp;* Supports Kakao/Google OAuth & email (sign-up) methods in
          React Native.
          <br />
          &nbsp;&nbsp;* Upon authentication, requests the Spring Boot server and
          receives JWT(Access, Refresh) tokens.
        </p>
        <br />
        <p>
          2) <b>Boot Splash on App Launch</b>
          <br />
          &nbsp;&nbsp;* When running the app, displays a loading screen with
          RNBootSplash → Once data loading & map preparation is complete, the
          splash screen ends.
        </p>
        <br />
        <p>
          3) <b>Map Screen (WebView + Leaflet)</b>
          <br />
          &nbsp;&nbsp;* Loads map.html file via WebView in React Native.
          <br />
          &nbsp;&nbsp;* Based on Leaflet + OpenStreetMap, displays markers of
          various locations (campsites, beaches, fishing spots, rest areas,
          etc.).
          <br />
          &nbsp;&nbsp;* Receives JSON data from the backend server, sends it to
          WebView → display/cluster markers with MarkerClusterGroup.
        </p>
        <br />
        <p>
          4) <b>Favorites / Search / Detail Screen</b>
          <br />
          &nbsp;&nbsp;* Favorites is a separate layer + API.
          <br />
          &nbsp;&nbsp;* For search, send the query to SearchController →
          integrated search → display results in the app.
          <br />
          &nbsp;&nbsp;* When a marker is clicked, WebView → sends a message to
          RN → navigation.navigate(...) to enter the detail page.
        </p>
        <br />
        <p>
          5) <b>Data Flow & Scheduler</b>
          <br />
          &nbsp;&nbsp;* Loads initial data from public data APIs + client JSON,
          stores it in the DB.
          <br />
          &nbsp;&nbsp;* For traffic control, updates periodically via a
          scheduler.
          <br />
          &nbsp;&nbsp;* The app communicates with the server using
          AxiosInstance, requests data with useEffect / useFocusEffect, and
          manages state.
        </p>
        <br />
        <p>
          6) <b>My Page & Logout</b>
          <br />
          &nbsp;&nbsp;* My Page (profile picture, nickname modification), on
          logout clears JWT and Refresh Token.
        </p>
        <br />
        <br />
        <br />
        <h2>2. Frontend (React Native) Features & Technologies</h2>
        <br />
        <p>
          <b>(1) Authentication & Global State</b>
        </p>
        <br />
        <p>
          * Kakao/Google Login
          <br />
          &nbsp;&nbsp;* Uses Kakao SDK, Google SDK in RN for OAuth.
          <br />
          &nbsp;&nbsp;* After logging in, receives Access Token & Refresh Token
          and stores them in AuthContext.
        </p>
        <br />
        <p>
          * Email Sign-up
          <br />
          &nbsp;&nbsp;* Email verification (5 minutes expiration) → verified by
          VerificationToken.
          <br />
          &nbsp;&nbsp;* On successful sign-up, issues a JWT token and stores it
          inside the app.
        </p>
        <br />
        <p>
          * AuthContext
          <br />
          &nbsp;&nbsp;* Implements isLoggedIn, userId, checkAuthStatus(), etc.
          <br />
          &nbsp;&nbsp;* On screen transitions (checking userId validity) → if
          user already wrote a review, the button is disabled, etc.
        </p>
        <pre style={{ background: "#f6f6f6", padding: "8px" }}>
          {`jsx
// AuthContext.js
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (id) => {
    setUserId(id);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ userId, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// (Additional implementations for token storage, checkAuthStatus(), RefreshToken logic, etc.)
`}
        </pre>
        <br />
        <p>
          <b>(2) Map (WebView + Leaflet)</b>
        </p>
        <br />
        <p>
          * MapView.js:
          <br />
          &nbsp;&nbsp;* Loads map.html with Leaflet inside WebView.
          <br />
          &nbsp;&nbsp;* Communicates between RN ↔ JS(Leaflet) via postMessage /
          onMessage.
          <br />
          &nbsp;&nbsp;* Once the map is ready, receives a message type:
          'mapReady' → RN sends initial data (marker list, favorites list,
          etc.).
          <br />
          &nbsp;&nbsp;* When a marker is clicked, JS side sends message type:
          '...Selected' → RN navigates to detail screen.
        </p>
        <pre style={{ background: "#f6f6f6", padding: "8px" }}>
          {`jsx
// MapView.js
useEffect(() => {
  // Once all data is loaded
  if (mapReady && webviewRef.current) {
    webviewRef.current.postMessage(
      JSON.stringify({
        type: 'initialData',
        userLocation,
        campgroundsData,
        favoritesData,
        // ... etc.
      }),
    );
  }
}, [mapReady, campgroundsData, favoritesData]);

const onMessage = useCallback((event) => {
  const data = JSON.parse(event.nativeEvent.data);
  if (data.type === 'campgroundSelected') {
    navigation.navigate('CampingDetail', { campground: data.data });
  }
  // ...
}, [navigation]);
`}
        </pre>
        <br />
        <p>
          <b>(3) Favorites & Search</b>
        </p>
        <p>
          * Favorites
          <br />
          &nbsp;&nbsp;* Toggling the Favorites button, RN sends showFavorites =
          true → Leaflet adds/removes the favoriteMarkers layer.
          <br />
          &nbsp;&nbsp;* On the server side, /favorites/user/:userId fetches the
          list.
        </p>
        <p>
          * Search
          <br />
          &nbsp;&nbsp;* Sends query to SearchController → integrated search
          across multiple Repositories for campsites, fishing spots, etc. →
          returns DTO.
          <br />
          &nbsp;&nbsp;* RN displays the search results as markers on the map or
          as a list.
        </p>
        <br />
        <p>
          <b>(4) My Page & UI Flow</b>
        </p>
        <p>
          * Profile picture upload: uses RN ImagePicker (or expo-image-picker) →
          server upload to /users/profile-image.
          <br />
          * Nickname update: PATCH/PUT request to the server.
          <br />* Boot Splash: loads the app for the first time (data load + map
          preparation) → closes the splash screen.
        </p>
        <br />
        <br />
        <h2>3. Backend (Spring Boot) Features & Technologies</h2>
        <br />
        <p>
          <b>(1) Authentication/Authorization Structure</b>
        </p>
        <p>
          * SecurityConfig
          <br />
          &nbsp;&nbsp;* http.csrf().disable().cors().and()..., etc. for Spring
          Security settings.
          <br />
          &nbsp;&nbsp;* Adds JwtAuthenticationFilter before
          UsernamePasswordAuthenticationFilter, checks token & if expired,
          checks Refresh Token.
        </p>
        <p>
          * JwtTokenUtil
          <br />
          &nbsp;&nbsp;* generateAccessToken(email, userId, userName) → includes
          userId, userName in Claims.
          <br />
          &nbsp;&nbsp;* If the token is expired,
          refreshAccessToken(refreshToken) to renew.
        </p>
        <pre style={{ background: "#f6f6f6", padding: "8px" }}>
          {`java
// SecurityConfig.java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf().disable()
        .cors().and()
        .authorizeRequests()
        .antMatchers("/api/login", "/api/signup", ...).permitAll()
        .antMatchers("/api/favorites/**").authenticated()
        .anyRequest().authenticated();
        
    http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
`}
        </pre>
        <br />
        <p>
          <b>(2) Main APIs</b>
        </p>
        <p>
          * AuthController
          <br />
          &nbsp;&nbsp;* /api/signup → email verification completed → sign up.
          <br />
          &nbsp;&nbsp;* /api/login → verify password → issue JWT.
          <br />
          &nbsp;&nbsp;* /api/auth/kakao, /api/auth/google → verify OAuth tokens
          & link user info.
        </p>
        <p>
          * ReviewController
          <br />
          &nbsp;&nbsp;* /api/reviews/{`{contentType}`}/{`{contentId}`} →
          retrieve review list for that content.
          <br />
          &nbsp;&nbsp;* Prevent duplicate reviews, only the author/administrator
          can edit or delete.
          <br />
          &nbsp;&nbsp;* Average rating: /api/reviews/average/{`{contentType}`}/
          {`{contentId}`}
        </p>
        <p>
          * SearchController
          <br />
          &nbsp;&nbsp;* /api/search?query=... → returns integrated search
          results for campsites, fishing spots, etc.
        </p>
        <br />
        <p>
          <b>(3) Data Model & DB Management</b>
        </p>
        <p>
          * Entity
          <br />
          &nbsp;&nbsp;* User: email, password, userName, roles, etc.
          <br />
          &nbsp;&nbsp;* Review: user, contentType, contentId, rating, content,
          etc.
          <br />
          &nbsp;&nbsp;* VerificationToken: email, verificationCode, expiryDate,
          verified.
          <br />
          &nbsp;&nbsp;* Campground, Campsite, Beach... (based on public data)
        </p>
        <p>
          * Encoding: set to utf8mb4 to avoid broken Korean characters in AWS
          RDS.
          <br />* Scheduler: refreshes DB periodically to prevent API traffic
          issues.
        </p>
        <pre style={{ background: "#f6f6f6", padding: "8px" }}>
          {`java
// JwtTokenUtil.java
@Override
protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain filterChain) throws ServletException, IOException {
    final String authHeader = request.getHeader("Authorization");
    final String refreshHeader = request.getHeader("Refresh-Token");
    // ...
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
        try {
            email = jwtTokenUtil.getEmailFromToken(token);
        } catch (ExpiredJwtException e) {
            // if expired, use Refresh Token
            if (refreshHeader != null && jwtTokenUtil.validateToken(refreshHeader)) {
                // match from refreshTokenStore, reissue
                String newAccessToken = jwtTokenUtil.refreshAccessToken(refreshHeader);
                response.setHeader("Authorization", "Bearer " + newAccessToken);
                // ...
            }
        }
    }
    // ...
    filterChain.doFilter(request, response);
}
`}
        </pre>
        <br />
        <br />
        <h2>4. Example Scenario (Overall Flow)</h2>
        <br />
        <p>
          1. User runs the app → displays the boot splash.
          <br />
          2. On the login screen, sign up/login using Kakao/Google account or
          email.
          <br />
          &nbsp;&nbsp;&nbsp;* Receives Access/Refresh Token from the server →
          stored in AuthContext.
          <br />
          3. Enters the map screen (WebView) → loads place data (campsites,
          etc.) from the server → displays Leaflet markers.
          <br />
          4. User location updates (Geolocation) → sends updateLocation message
          to WebView → moves user marker.
          <br />
          5. Click on Favorites button → toggles favoriteMarkers layer on
          Leaflet.
          <br />
          &nbsp;&nbsp;&nbsp;* On the server side, /favorites/user/:userId is
          used to store/delete from DB.
          <br />
          6. Click a marker (e.g., a certain campsite) → popup → on tap, type:
          'campgroundSelected' → RN navigates to detail screen (photos, reviews,
          rating, etc.).
          <br />
          7. If the token is expired when writing a review, automatically use
          the Refresh Token to reissue a new token.
          <br />
          8. In My Page, update profile, nickname → reflected on the server.
          <br />
          9. On app exit and re-run, AuthContext checks the stored token → auto
          login → loads map again.
        </p>
        <br />
        <br />
        <br />
        <h2>5. Conclusion</h2>
        <br />
        <p>
          * Front-end (React Native):
          <br />
          &nbsp;&nbsp;* Uses WebView + Leaflet for free map implementation,
          multiple layers & a dedicated favorites layer, search/detail screens.
          <br />
          &nbsp;&nbsp;* Uses AuthContext for global state management, integrates
          Kakao/Google/Email sign-in.
        </p>
        <p>
          * Back-end (Spring Boot):
          <br />
          &nbsp;&nbsp;* Spring Security + JWT authentication system, manages
          Refresh Token, various endpoints (Review, Search, Auth, etc.).
          <br />
          &nbsp;&nbsp;* DB (MySQL/MariaDB) with utf8mb4 encoding, scheduler for
          public data API updates.
          <br />
          &nbsp;&nbsp;* Separates code layers (Controller/Service/Repository),
          designs RESTful for scalability.
        </p>
      </div>
    ) : (
      // ---- Korean Version (기존 한글 그대로) ----
      <div>
        <h2>1. 프로젝트 전체 구현 흐름</h2>
        <p>
          1) <b>사용자 인증 / 로그인</b>
          <br />
          &nbsp;&nbsp;* React Native에서 카카오/구글 OAuth & 이메일(회원가입)
          방식을 지원.
          <br />
          &nbsp;&nbsp;* 인증 시 Spring Boot 서버로 요청, JWT(Access, Refresh)
          토큰 발급받음.
        </p>
        <br />
        <p>
          2) <b>앱 실행 시 부트 스플래시</b>
          <br />
          &nbsp;&nbsp;* 앱 구동 시, RNBootSplash로 로딩 화면 → 데이터 로딩 &
          지도 준비 끝나면 스플래시 종료.
        </p>
        <br />
        <p>
          3) <b>지도 화면(WebView + Leaflet)</b>
          <br />
          &nbsp;&nbsp;* React Native에서 WebView로 map.html 파일을 로드.
          <br />
          &nbsp;&nbsp;* Leaflet + OpenStreetMap 기반, 각종 장소(캠핑장,
          해수욕장, 낚시터, 휴게소 등) 마커 표시.
          <br />
          &nbsp;&nbsp;* 백엔드 서버로부터 받은 JSON 데이터를 WebView에 전달 →
          MarkerClusterGroup으로 표시/클러스터링.
        </p>
        <br />
        <p>
          4) <b>즐겨찾기 / 검색 / 상세 화면</b>
          <br />
          &nbsp;&nbsp;* 즐겨찾기(Favorites)는 별도 레이어 + API.
          <br />
          &nbsp;&nbsp;* 검색 시 SearchController로 쿼리 전송 → 통합 검색 →
          결과를 앱에 표시.
          <br />
          &nbsp;&nbsp;* 마커 클릭 시 WebView → RN으로 메시지 전송 →
          navigation.navigate(...)로 상세 페이지 진입.
        </p>
        <br />
        <p>
          5) <b>데이터 흐름 & 스케줄러</b>
          <br />
          &nbsp;&nbsp;* 공공데이터 API + 클라이언트 JSON에서 초기 데이터를
          불러와 DB 저장.
          <br />
          &nbsp;&nbsp;* 트래픽 제한 방지 위해, 스케줄러로 정기 업데이트.
          <br />
          &nbsp;&nbsp;* 앱에서는 AxiosInstance로 서버 통신, useEffect /
          useFocusEffect로 데이터 요청 후 상태 관리.
        </p>
        <br />
        <p>
          6) <b>마이페이지 & 로그아웃</b>
          <br />
          &nbsp;&nbsp;* 마이페이지(프로필 사진, 닉네임 수정), 로그아웃 시 JWT 및
          Refresh Token 정리.
        </p>
        <br />
        <br />
        <br />
        <h2>2. 프론트엔드(React Native) 기능·기술 구현</h2>
        <br />
        <p>
          <b>(1) 인증 & 전역 상태</b>
        </p>
        <br />
        <p>
          * Kakao/Google 로그인
          <br />
          &nbsp;&nbsp;* RN에서 Kakao SDK, Google SDK를 이용해 OAuth.
          <br />
          &nbsp;&nbsp;* 로그인 후 Access Token & Refresh Token 발급받아
          AuthContext에 저장.
        </p>
        <br />
        <p>
          * 이메일 회원가입
          <br />
          &nbsp;&nbsp;* 이메일 인증(5분 만료) → VerificationToken으로 검증.
          <br />
          &nbsp;&nbsp;* 가입 성공 시, JWT 토큰 발급받고 앱 내부 저장.
        </p>
        <br />
        <p>
          * AuthContext
          <br />
          &nbsp;&nbsp;* isLoggedIn, userId, checkAuthStatus() 등 구현.
          <br />
          &nbsp;&nbsp;* 화면 전환 시(userId 유효성 체크) → 이미 리뷰 작성한 경우
          버튼 비활성, 등등.
        </p>
        <pre style={{ background: "#f6f6f6", padding: "8px" }}>
          {`jsx
// AuthContext.js
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (id) => {
    setUserId(id);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ userId, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// (토큰 보관, checkAuthStatus(), RefreshToken 로직 등은 추가로 구현)
`}
        </pre>
        <br />
        <p>
          <b>(2) 지도(WebView + Leaflet)</b>
        </p>
        <br />
        <p>
          * MapView.js:
          <br />
          &nbsp;&nbsp;* Leaflet를 담은 map.html을 WebView로 로드.
          <br />
          &nbsp;&nbsp;* postMessage / onMessage를 통해 RN ↔ JS(Leaflet) 간 통신.
          <br />
          &nbsp;&nbsp;* 지도가 준비되면 type: 'mapReady' 메시지 → RN에서 초기
          데이터(마커 목록, 즐겨찾기 목록 등) 전달.
          <br />
          &nbsp;&nbsp;* 마커 클릭 시 JS 쪽에서 type: '...Selected' 메시지 →
          RN에서 상세 화면 이동.
        </p>
        <pre style={{ background: "#f6f6f6", padding: "8px" }}>
          {`jsx
// MapView.js
useEffect(() => {
  // 데이터 모두 로드 후
  if (mapReady && webviewRef.current) {
    webviewRef.current.postMessage(
      JSON.stringify({
        type: 'initialData',
        userLocation,
        campgroundsData,
        favoritesData,
        // ... 기타
      }),
    );
  }
}, [mapReady, campgroundsData, favoritesData]);

const onMessage = useCallback((event) => {
  const data = JSON.parse(event.nativeEvent.data);
  if (data.type === 'campgroundSelected') {
    navigation.navigate('CampingDetail', { campground: data.data });
  }
  // ...
}, [navigation]);
`}
        </pre>
        <br />
        <p>
          <b>(3) 즐겨찾기 & 검색</b>
        </p>
        <p>
          * 즐겨찾기
          <br />
          &nbsp;&nbsp;* Favorites 버튼 토글 시, RN에서 showFavorites = true
          메시지 전송 → Leaflet에 favoriteMarkers 레이어 add/remove.
          <br />
          &nbsp;&nbsp;* 서버에는 /favorites/user/:userId API로 목록 가져옴.
        </p>
        <p>
          * 검색
          <br />
          &nbsp;&nbsp;* SearchController로 쿼리 전송 → 캠핑장, 야영장, 낚시터 등
          여러 Repository 통합 검색 → DTO 반환.
          <br />
          &nbsp;&nbsp;* RN에서는 결과 목록을 지도 위나 리스트 형태로 표시.
        </p>
        <br />
        <p>
          <b>(4) 마이페이지 & UI 흐름</b>
        </p>
        <p>
          * 프로필 사진 업로드: RN ImagePicker(또는 expo-image-picker) → 서버에
          /users/profile-image 업로드.
          <br />
          * 닉네임 수정: 서버에 PATCH/PUT 요청.
          <br />* 부트 스플래시: 앱 첫 실행 시 로딩 화면(데이터 로드 + 지도 준비
          후 종료).
        </p>
        <br />
        <br />
        <h2>3. 백엔드(Spring Boot) 기능·기술 구현</h2>
        <br />
        <p>
          <b>(1) 인증/인가 구조</b>
        </p>
        <p>
          * SecurityConfig
          <br />
          &nbsp;&nbsp;* http.csrf().disable().cors().and()... 등 Spring Security
          설정.
          <br />
          &nbsp;&nbsp;* JwtAuthenticationFilter를
          UsernamePasswordAuthenticationFilter 이전에 추가, 토큰 검사 & 만료 시
          Refresh Token 체크.
        </p>
        <p>
          * JwtTokenUtil
          <br />
          &nbsp;&nbsp;* generateAccessToken(email, userId, userName)로 userId,
          userName도 Claims에 담음.
          <br />
          &nbsp;&nbsp;* 토큰 만료 시 refreshAccessToken(refreshToken)로 갱신.
        </p>
        <pre style={{ background: "#f6f6f6", padding: "8px" }}>
          {`java
// SecurityConfig.java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf().disable()
        .cors().and()
        .authorizeRequests()
        .antMatchers("/api/login", "/api/signup", ...).permitAll()
        .antMatchers("/api/favorites/**").authenticated()
        .anyRequest().authenticated();
        
    http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
`}
        </pre>
        <br />
        <p>
          <b>(2) 주요 API</b>
        </p>
        <p>
          * AuthController
          <br />
          &nbsp;&nbsp;* /api/signup → 이메일 인증 완료 후 회원가입.
          <br />
          &nbsp;&nbsp;* /api/login → 비밀번호 검증 후 JWT 발급.
          <br />
          &nbsp;&nbsp;* /api/auth/kakao, /api/auth/google → OAuth 토큰 검증 &
          유저 정보 연동.
        </p>
        <p>
          * ReviewController
          <br />
          &nbsp;&nbsp;* /api/reviews/{`{contentType}`}/{`{contentId}`} → 해당
          컨텐츠 리뷰 목록 조회.
          <br />
          &nbsp;&nbsp;* 중복 리뷰 방지, 작성자/관리자만 수정·삭제 허용.
          <br />
          &nbsp;&nbsp;* 평균 별점 /api/reviews/average/{`{contentType}`}/
          {`{contentId}`}
        </p>
        <p>
          * SearchController
          <br />
          &nbsp;&nbsp;* /api/search?query=... → 캠핑장, 낚시터 등 공통 엔티티
          검색 결과 반환.
        </p>
        <br />
        <p>
          <b>(3) 데이터 모델 & DB 관리</b>
        </p>
        <p>
          * Entity
          <br />
          &nbsp;&nbsp;* User: email, password, userName, roles, etc.
          <br />
          &nbsp;&nbsp;* Review: user, contentType, contentId, rating, content,
          etc.
          <br />
          &nbsp;&nbsp;* VerificationToken: email, verificationCode, expiryDate,
          verified.
          <br />
          &nbsp;&nbsp;* Campground, Campsite, Beach... (공공데이터 기반)
        </p>
        <p>
          * Encoding: utf8mb4로 설정(AWS RDS 한글 깨짐 대응).
          <br />* 스케줄러: API 트래픽 제한 방지, 일정 주기로 DB 갱신.
        </p>
        <pre style={{ background: "#f6f6f6", padding: "8px" }}>
          {`java
// JwtTokenUtil.java
@Override
protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain filterChain) throws ServletException, IOException {
    final String authHeader = request.getHeader("Authorization");
    final String refreshHeader = request.getHeader("Refresh-Token");
    // ...
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
        try {
            email = jwtTokenUtil.getEmailFromToken(token);
        } catch (ExpiredJwtException e) {
            // 만료 시 Refresh Token 사용
            if (refreshHeader != null && jwtTokenUtil.validateToken(refreshHeader)) {
                // refreshTokenStore에서 매칭, 재발급
                String newAccessToken = jwtTokenUtil.refreshAccessToken(refreshHeader);
                response.setHeader("Authorization", "Bearer " + newAccessToken);
                // ...
            }
        }
    }
    // ...
    filterChain.doFilter(request, response);
}
`}
        </pre>
        <br />
        <br />
        <h2>4. 예시 시나리오 (전체 흐름)</h2>
        <br />
        <p>
          1. 사용자가 앱 실행 → 부트 스플래시 표시.
          <br />
          2. 로그인 화면에서 카카오/구글 계정 또는 이메일 가입/로그인.
          <br />
          &nbsp;&nbsp;&nbsp;* 서버로부터 Access/Refresh Token 수신 →
          AuthContext에 저장.
          <br />
          3. 지도 화면 진입(WebView) → 서버에서 장소 데이터(캠핑장 등) 로드 →
          Leaflet 마커 표시.
          <br />
          4. 사용자 위치(Geolocation) 업데이트 → WebView에 updateLocation 메시지
          → 유저 마커 이동.
          <br />
          5. 즐겨찾기 버튼 클릭 → Leaflet에서 favoriteMarkers 레이어 on/off
          <br />
          &nbsp;&nbsp;&nbsp;* 서버에는 /favorites/user/:userId로 DB 저장/삭제.
          <br />
          6. 마커(예: 특정 캠핑장) 클릭 → 팝업 → 터치 시 type:
          'campgroundSelected' → RN에서 상세 화면(사진, 리뷰, 평점 등).
          <br />
          7. 리뷰 작성 시 토큰 만료되었다면 Refresh Token 자동 사용, 새 토큰
          재발급.
          <br />
          8. 마이페이지에서 프로필 변경, 닉네임 수정 → 서버 반영.
          <br />
          9. 앱 종료 후 재실행 시, AuthContext가 저장된 토큰 확인 → 자동 로그인
          → 다시 지도 로드.
        </p>
        <br />
        <br />
        <br />
        <h2>5. 결론</h2>
        <br />
        <p>
          * Front-end(React Native):
          <br />
          &nbsp;&nbsp;* WebView + Leaflet로 무료 지도 구현, 다중 레이어·즐겨찾기
          전용 레이어, 검색/상세 화면.
          <br />
          &nbsp;&nbsp;* AuthContext로 전역 상태 관리 + 카카오/구글/이메일 로그인
          연동.
        </p>
        <p>
          * Back-end(Spring Boot):
          <br />
          &nbsp;&nbsp;* Spring Security + JWT 인증 체계, Refresh Token 관리,
          다양한 엔드포인트(Review, Search, Auth, 등).
          <br />
          &nbsp;&nbsp;* DB(MySQL/MariaDB) + utf8mb4 인코딩, 스케줄러로
          공공데이터 API 갱신.
          <br />
          &nbsp;&nbsp;* 코드 계층(Controller/Service/Repository) 분리, RESTful
          설계로 확장성 고려.
        </p>
      </div>
    );

  // === 탭(모달) 콘텐츠: 트러블슈팅(Troubleshoot) ===
  const troubleshootContent =
    language === "English" ? (
      <div>
        <h3>1. Trouble Shooting</h3>

        <p>
          <b>1) Service Key Encoding Error in API Calls</b>
          <br />
          * Issue: A 401 error occurred because the key was double-encoded when
          calling the public API
          <br />
          * Cause: The service key was already encoded, but RestTemplate +
          UriComponentsBuilder encoded it again
          <br />
          * Solution:
          <br />
          &nbsp;&nbsp;&nbsp;* Switched from RestTemplate to HttpClient,
          <br />
          &nbsp;&nbsp;&nbsp;* Used UriComponentsBuilder.build(false) to prevent
          additional encoding,
          <br />
          &nbsp;&nbsp;&nbsp;* Refined header/parsing logic
          <br />* Result: Normal API response (200), successful data parsing
        </p>
        <br />
        <p>
          <b>2) Favorites Layer Logic Error</b>
          <br />
          * Issue: Even though there was already a dedicated layer for
          favorites, it was handled like a normal marker → duplication/error
          <br />
          * Cause: The favoriteMarkers layer must be managed independently by
          map.addLayer() / map.removeLayer(), but it was mixed with normal
          markers
          <br />
          * Solution:
          <br />
          &nbsp;&nbsp;&nbsp;* Separated addFavoriteMarkers(),
          removeFavoriteMarkers() into distinct functions
          <br />
          &nbsp;&nbsp;&nbsp;* Controlled duplication using a favoritesAdded flag
          <br />* Result: Favorites markers are displayed/removed normally,
          conflicts with normal markers resolved
        </p>
        <br />
        <p>
          <b>3) Korean Characters Broken in AWS RDS</b>
          <br />
          * Issue: Korean characters were broken (�) when saving to MySQL
          <br />
          * Cause: DB charset was latin1
          <br />
          * Solution: Unified DB/table/columns to utf8mb4
          <br />* Result: Korean characters stored/retrieved normally
        </p>
        <br />
        <p>
          <b>4) Missing userId in JWT Token, Causing Review Reload Issue</b>
          <br />
          * Issue: After writing a review and navigating away, the review
          disappeared, and the "Add Review" button was re-enabled
          <br />
          * Cause: userId was not included in the JWT → user identification
          impossible
          <br />
          * Solution:
          <br />
          &nbsp;&nbsp;&nbsp;* Added userId to JWT claims when generating the
          token,
          <br />
          &nbsp;&nbsp;&nbsp;* Managed userId in AuthContext,
          <br />
          &nbsp;&nbsp;&nbsp;* Called checkAuthStatus() on screen focus to
          reconfirm review existence
          <br />* Result: The review remains, and the button is disabled for a
          user who has already written a review
        </p>
        <br />
        <p>
          <b>5) KakaoNavi Coordinate Transfer Issue</b>
          <br />
          * Issue: Unable to directly pass coordinates to KakaoNavi(Android
          Intent) in the RN environment
          <br />
          * Cause: KakaoNavi SDK requires native modules to call an Intent
          <br />
          * Solution:
          <br />
          &nbsp;&nbsp;&nbsp;* Created KakaoNaviModule.java in Java with
          @ReactMethod navigateTo(...)
          <br />
          &nbsp;&nbsp;&nbsp;* Invoked
          NativeModules.KakaoNaviModule.navigateTo(...) from JS
          <br />* Result: KakaoNavi integration works in RN, with exceptions
          handled if not installed
        </p>
        <br />
        <br />
      </div>
    ) : (
      // ---- Korean Version (기존 한글 그대로) ----
      <div>
        <h2>1. 트러블 슈팅</h2>

        <p>
          <b>1) API 호출 시 서비스 키 인코딩 오류</b>
          <br />
          * 이슈: 공공 API 호출 시 키가 중복 인코딩되어 401 오류 발생
          <br />
          * 원인: 이미 인코딩된 서비스 키를 RestTemplate +
          UriComponentsBuilder가 또 인코딩
          <br />
          * 해결:
          <br />
          &nbsp;&nbsp;&nbsp;* RestTemplate → HttpClient로 전환,
          <br />
          &nbsp;&nbsp;&nbsp;* UriComponentsBuilder.build(false)로 추가 인코딩
          방지,
          <br />
          &nbsp;&nbsp;&nbsp;* 헤더/파싱 로직 재정비
          <br />* 결과: API 정상 응답(200), 데이터 파싱 성공
        </p>
        <br />
        <p>
          <b>2) 즐겨찾기 레이어 로직 오류</b>
          <br />
          * 이슈: 이미 즐겨찾기 전용 레이어가 있음에도, 일반 마커 로직처럼 처리
          → 중복/오류
          <br />
          * 원인: favoriteMarkers 레이어를 map.addLayer() / map.removeLayer()로
          독립 관리해야 하는데, 일반 마커와 혼용
          <br />
          * 해결:
          <br />
          &nbsp;&nbsp;&nbsp;* addFavoriteMarkers(), removeFavoriteMarkers() 별도
          함수 분리
          <br />
          &nbsp;&nbsp;&nbsp;* favoritesAdded 플래그로 중복 제어
          <br />* 결과: 즐겨찾기 마커 정상 표시·제거, 일반 마커와 충돌 해소
        </p>
        <br />
        <p>
          <b>3) AWS RDS에서 한글 깨짐</b>
          <br />
          * 이슈: MySQL에 한글 저장 시 깨짐(�)
          <br />
          * 원인: DB 캐릭터셋이 latin1
          <br />
          * 해결: utf8mb4로 DB·테이블·컬럼 통일
          <br />* 결과: 한글 정상 저장·조회
        </p>
        <br />
        <p>
          <b>4) JWT 토큰에 userId 빠져 리뷰 재로딩 이슈</b>
          <br />
          * 이슈: 리뷰 작성 후 다른 화면 다녀오면 리뷰가 사라지고, "Add Review"
          버튼이 다시 활성화
          <br />
          * 원인: JWT에 userId 미포함 → 사용자 식별 불가
          <br />
          * 해결:
          <br />
          &nbsp;&nbsp;&nbsp;* 토큰 생성 시 userId 추가 Claims,
          <br />
          &nbsp;&nbsp;&nbsp;* AuthContext에서 userId 관리,
          <br />
          &nbsp;&nbsp;&nbsp;* 화면 포커스 시 checkAuthStatus()로 리뷰 존재 여부
          재확인
          <br />* 결과: 리뷰 유지, 이미 작성한 유저는 버튼 비활성화 정상 작동
        </p>
        <br />
        <p>
          <b>5) 카카오내비 좌표 전달 문제</b>
          <br />
          * 이슈: RN 환경에서 카카오내비(안드로이드 Intent)로 좌표 직접 전달
          불가
          <br />
          * 원인: 카카오내비 SDK는 네이티브 모듈 통해 Intent 호출 필요
          <br />
          * 해결:
          <br />
          &nbsp;&nbsp;&nbsp;* Java로 KakaoNaviModule.java 작성(@ReactMethod
          navigateTo(...))
          <br />
          &nbsp;&nbsp;&nbsp;* JS에서
          NativeModules.KakaoNaviModule.navigateTo(...) 호출
          <br />* 결과: RN에서 카카오내비 연동 가능, 미설치 시 예외처리도 구현
        </p>
        <br />
        <br />
      </div>
    );

  // === 탭(모달) 콘텐츠: 기능 흐름(Flowchart) ===
  // (이미지는 그대로, 탭 제목 및 부연 텍스트만 번역)
  const flowchartContent =
    language === "English" ? (
      <div>
        <h3>Flowchart</h3>
        <ZoomableImage src="/images/stage.png" alt="Flowchart" />
        <p style={{ marginTop: "12px" }}>
          Click the image above to view it in larger size.
        </p>
      </div>
    ) : (
      <div>
        <h2>기능 흐름</h2>
        <ZoomableImage src="/images/stage.png" alt="기능 흐름" />
        <p style={{ marginTop: "12px" }}>
          위 이미지를 클릭하면 확대해서 볼 수 있습니다.
        </p>
      </div>
    );

  // === 탭(모달) 콘텐츠: ERD그램(ERD Diagram) ===
  // (이미지는 그대로, 탭 제목 및 부연 텍스트만 번역)
  const erdContent =
    language === "English" ? (
      <div>
        <h3>ERD Diagram</h3>
        <ZoomableImage src="/images/erd.png" alt="ERD Diagram" />
        <p style={{ marginTop: "12px" }}>
          Click the image above to view it in larger size.
        </p>
      </div>
    ) : (
      <div>
        <h3>ERD그램</h3>
        <ZoomableImage src="/images/erd.png" alt="ERD 다이어그램" />
        <p style={{ marginTop: "12px" }}>
          위 이미지를 클릭하면 확대해서 볼 수 있습니다.
        </p>
      </div>
    );

  return (
    <>
      <div
      className={`${styles.category} ${isCategoryOpen ? styles.categoryOpen : ""}`}
      onClick={handleCategoryClick}
    >
      <p>APP</p>
      <div
        className={styles.clickContainer} // 추가: 스타일 적용을 위한 클래스
      >
        <p>Click</p>
      </div>
    </div>

      <div className={styles.mainContainerWrapper} ref={mainContainerRef}>
        <div className={styles.mainContainer}>
          <div className={styles.video} style={{ position: "relative" }}>
            <VideoContainer>
              {/* 스켈레톤 표시 */}
              {isVideoLoading && <VideoSkeleton />}

              <StyledVideo
                src="/videos/campridge_video.mp4"
                autoPlay
                muted
                loop
                playsInline
                onLoadedData={() => setIsVideoLoading(false)} // 영상 로드 완료 시 상태 업데이트
                style={{ display: isVideoLoading ? "none" : "block" }} // 로딩 중이면 영상 숨김
              />
            </VideoContainer>
          </div>

          <div className={styles.desc}>
            <DescriptionContainer>
              <h2>{titleText}</h2>
              <h3>{categoryText}</h3>
              <p>{descriptionText}</p>

              <TagContainer style={{ marginTop: "25px" }}>
                <Tag>ReactNative</Tag>
                <Tag>HTML/CSS/JS</Tag>
                <Tag>Java</Tag>
                <Tag>SpringBoot</Tag>
                <Tag>JPA</Tag>
                <Tag>AWS EC2</Tag>
                <Tag>RDS</Tag>
                <Tag>Maria DB</Tag>
              </TagContainer>

              <ButtonContainer>
                <button onClick={openModal}>
                  {projectDetails}
                  <GoArrowUpRight className={styles.icon} />
                </button>
              </ButtonContainer>
            </DescriptionContainer>
          </div>

          {/* 모달 */}
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title={language === "English" ? "Project Details" : "프로젝트 상세"}
          >
            {/* 모달 콘텐츠를 ModalContent로 감싸서 스타일 적용 */}
            <ModalContent>
              {/* 탭 전환 버튼 (4개) */}
              <ToggleButtonWrapper>
                <ToggleButton
                  active={activeTab === "feature"}
                  onClick={() => setActiveTab("feature")}
                >
                  {language === "English" ? "Feature Info" : "기능 정보"}
                </ToggleButton>

                <ToggleButton
                  active={activeTab === "troubleshoot"}
                  onClick={() => setActiveTab("troubleshoot")}
                >
                  {language === "English" ? "Troubleshooting" : "트러블슈팅"}
                </ToggleButton>

                <ToggleButton
                  active={activeTab === "flowchart"}
                  onClick={() => setActiveTab("flowchart")}
                >
                  {language === "English" ? "Flowchart" : "기능 흐름"}
                </ToggleButton>

                <ToggleButton
                  active={activeTab === "erd"}
                  onClick={() => setActiveTab("erd")}
                >
                  ERD
                </ToggleButton>

                <ToggleButton>
                  <a
                    href="https://github.com/jehoonje/campers"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "inherit" }} // 스타일 조정 가능
                  >
                    {language === "English" ? "Repository" : "레포지토리"}
                  </a>
                </ToggleButton>
              </ToggleButtonWrapper>

              {/* 탭 내용 분기 렌더링 */}
              {activeTab === "feature" && featureContent}
              {activeTab === "troubleshoot" && troubleshootContent}
              {activeTab === "flowchart" && flowchartContent}
              {activeTab === "erd" && erdContent}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default CampridgeProject;
