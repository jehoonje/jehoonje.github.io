// DoggleProject.js

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import styles from "../styles/Layout.module.scss";
import Modal from "../components/Modal"; // 모달 컴포넌트
import { GoArrowUpRight } from "react-icons/go";
import { useSwipeable } from "react-swipeable";


// === styled-components ===
const VideoContainer = styled.div`
  position: relative;
  bottom: 50px;
  width: 100%;
  padding-top: 60%;
  overflow: hidden;
  border-radius: 20px;
  display: flex;
  border: 1px solid #333;
  background: rgba(3, 3, 3, 0.5);
  @media (max-width: 480px) {
    bottom: 0px !important;
    top: 20px;
  }
`;

const StyledVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
`;

const DescriptionContainer = styled.div`
  max-width: 320px;
`;

const ButtonContainer = styled.div`
  display: flex;
  color: #333 !important;
  justify-content: end;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
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

/**
 * 탭 전환 버튼 관련 styled-components
 */
const ToggleButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  white-space: pre-wrap;
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
 * 모달 내부 콘텐츠를 감싸는 styled-component
 */
const ModalContent = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  line-height: 1.6;
  min-height: 70vh;

  @media (max-width: 480px) {
    padding: 0px;
  }

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    max-width: 100%;
    overflow-x: auto;
    background: #333;
    color: #fff;
    padding: 28px;
    border-radius: 10px;
    font-size: 14px;
    font-family: "Poppins", sans-serif;
  }

  img {
    max-width: 100%;
    height: auto;
  }
`;

const DoggleProject = ({ language }) => {
  // 모달 열림/닫힘, 탭 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("feature");

  // "카테고리" 영역 토글 상태 추가
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const mainContainerRef = useRef(null);

  // 모달 열기/닫기
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
    
  // === 다국어 대응 ===
  const titleText = language === "English" ? "Doggle" : "도글";
  const projectDetails =
    language === "English" ? "Learn More" : "프로젝트 상세";
  const categoryText =
    language === "English" ? "Lifestyle / Pet" : "라이프스타일 / 반려동물";

  // === 프로젝트 소개 ===
  const descriptionText =
    language === "English"
      ? `Doggle is a comprehensive service platform designed for dog owners.
It emphasizes personalized features, allowing users to register their dogs and receive snack recommendations or purchase package deals.
Similar to a typical hotel commerce platform, it also offers hotel and daycare reservations exclusively for dogs.
Additionally, a community feature enables user interactions and information sharing.
Developed by a team of seven over approximately one month, the project was successfully deployed but is currently not in operation.`
      : `도글은 반려견을 키우는 분들을 위한 복합 서비스 플랫폼입니다.
반려견 정보를 등록하면 맞춤형 간식을 추천받고 패키지 형태로 구매할 수 있으며,
반려견 전용 호텔 및 유치원 예약 서비스도 제공합니다.
또한, 유저 간 커뮤니티 기능을 통해 반려견 관련 정보를 공유하고 소통할 수 있습니다.
이 프로젝트는 7인 팀이 약 한 달간 협업하여 개발했으며, 프론트엔드로 참여해 호텔예약, 결제 및 메인화면, 드로어 외 전체적인 디자인을 맡았습니다. 
배포까지 완료되었으나 현재는 서비스를 운영하지 않고 있습니다.
      `;

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

  const featureContent =
    language === "English" ? (
      <div>
        <h2>Frontend (Feature Implementation)</h2>
        <p>
          <b>1) Step Indicator (Reservations)</b>
          <br />
          &nbsp;&nbsp;- Visually represents each step of the reservation
          process.
          <br />
          &nbsp;&nbsp;- Users can clearly see which step (date selection →
          hotel list → room details → summary → confirmation) they are on.
        </p>
        <br />
        <p>
          <b>2) Hotel Rendering & Paging</b>
          <br />
          &nbsp;&nbsp;- Uses Redux for step-based reservation logic.
          <br />
          &nbsp;&nbsp;- Search by location, display hotels, room info, booking
          pages; fully responsive UI.
          <br />
          &nbsp;&nbsp;- Integrated with Kakao Address API, Kakao Map, and
          KakaoPay.
          <br />
          &nbsp;&nbsp;- Utilizes framer-motion, slick(slider) library for better
          UI/UX.
          <br />
          &nbsp;&nbsp;- Includes detailed booking info, review listing, etc.
        </p>
        <br />
        <p>
          <b>3) Design (Figma-based)</b>
          <br />
          &nbsp;&nbsp;- Created UI/UX mockups with Figma references.
          <br />
          &nbsp;&nbsp;- Main page (banner, responsive web), overall color/font
          concept, etc.
        </p>
        <br />
        <p>
          <b>4) Category (Motion Library)</b>
          <br />
          &nbsp;&nbsp;- Applied responsive animation effects to enhance UI.
          <br />
          &nbsp;&nbsp;- Used motion components for smooth transitions.
        </p>
      </div>
    ) : (
      // --- 한국어 버전 ---
      <div>
        <h2>프론트엔드 (기능 구현)</h2>
        <p>
          <b>1) 스텝 기능 (Step Indicator)</b>
          <br />
          &nbsp;&nbsp;- 예약 프로세스 상 각 단계를 시각적으로 표현해주는 스텝
          인디케이터
          <br />
          &nbsp;&nbsp;- 유저가 현재 어느 단계에 있는지 직관적으로 파악 가능
        </p>
        <br />
        <p>
          <b>2) 호텔 랜더링 & 예약 페이징</b>
          <br />
          &nbsp;&nbsp;- 리덕스 상태 관리를 통해 스텝 기반 예약 프로세스 처리
          <br />
          &nbsp;&nbsp;- 검색(위치) → 호텔 목록 → 객실 상세 → 예약 페이지 →
          반응형 UI
          <br />
          &nbsp;&nbsp;- 카카오 주소 검색 API, 카카오 지도, 카카오페이 연동
          <br />
          &nbsp;&nbsp;- framer-motion, slick(slider) 라이브러리를 통해 UI/UX
          개선
          <br />
          &nbsp;&nbsp;- 예약 상세/ 리뷰 조회 기능 등
        </p>
        <br />
        <p>
          <b>3) 디자인(Figma 활용)</b>
          <br />
          &nbsp;&nbsp;- 프로젝트 레퍼런스 및 피그마로 UI/UX 시안 구성
          <br />
          &nbsp;&nbsp;- 메인 페이지(배너, 반응형), 전체 색상/폰트 컨셉 등
        </p>
        <br />
        <p>
          <b>4) 카테고리(모션 라이브러리)</b>
          <br />
          &nbsp;&nbsp;- 반응형 애니메이션 효과로 UI 향상
          <br />
          &nbsp;&nbsp;- 모션 컴포넌트로 자연스러운 화면 전환
        </p>
    

      <br />
      <br />
      <h2>주요 코드 설명</h2>
      <p>
        <h2>1) 스탭 기능 (Step Indicator)</h2>
        
        - 예약 프로세스 상 각 단계를 시각적으로 표현하는 스텝 인디케이터를 구현
        <br />- 유저가 현재 어느 단계(날짜 선택 → 호텔 목록 → 객실 상세 → 예약
        요약 → 최종 확인)에 있는지 직관적으로 파악하고 이동
      </p>
      <pre>{`jsx
// StepIndicator.js
import React from 'react';
import styles from './StepIndicator.module.scss';

const StepIndicator = ({ step, onStepClick }) => {
  const stepLabels = ['Dates', 'Properties', 'Rooms', 'Summary', 'Confirm'];

  return (
    <div className={styles.stepIndicator}>
      {stepLabels.map((label, idx) => (
        <React.Fragment key={idx + 1}>
          {idx > 0 && (
            <div className={\`\${styles.stepLine} \${step > idx ? styles.active : ''}\`} />
          )}
          <div className={styles.stepContainer}>
            <div
              className={\`\${styles.stepNumber} \${step >= idx + 1 ? styles.active : ''} \${step > idx + 1 ? styles.completed : ''}\`}
              onClick={idx < step - 1 ? () => onStepClick(idx + 1) : null}
              style={{ cursor: idx < step - 1 ? 'pointer' : 'default' }}
            >
              {step >= idx + 1 ? idx + 1 : ''}
            </div>
            <div className={styles.stepLabel}>{label}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
`}</pre>
      <p>
        위의 <b>StepIndicator</b> 컴포넌트는 현재 스텝을 시각적으로 표시하며,
        이전 스텝으로의 이동을 가능하게 합니다. 리덕스 상태 관리(`step`)를 통해
        각 단계별로 화면을 전환합니다.
      </p><br/><br/>

      <p>
        <h2>2) 호텔 랜더링 & 예약 페이징</h2>
        
        - **리덕스** 상태 관리를 통해 스텝 기반 예약 프로세스 처리
        <br />
        - **검색**(위치) → **호텔 조회**(리스트) → **객실 조회** → **예약
        페이지** 랜더링(결제, 반응형 UI)
        <br />- **카카오 주소 검색, 카카오 지도, 카카오페이 연동** 등 다양한 API
        활용
      </p>
      <pre>{`jsx
// HotelPage.js (일부 발췌)
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotels, setStep } from '../../components/store/hotel/HotelPageSlice';
import StepIndicator from '../../components/hotel/StepIndicator';
import HotelList from '../../components/hotel/HotelList';
import HotelSearchForm from '../../components/hotel/HotelSearchForm';
import RoomDetail from '../../components/hotel/RoomDetail';
import BookingDetail from '../../components/hotel/BookingDetail';
import HotelConfirmation from '../../components/hotel/HotelConfirmation';
import styles from "./HotelPage.module.scss";

const HotelPage = () => {
  const dispatch = useDispatch();
  const { hotels, step, loading, error, selectedHotel } = useSelector(state => state.hotelPage);

  // 검색 후 호텔 리스트 로드
  const handleSearch = (location) => {
    dispatch(fetchHotels(location));
  };

  // 스텝 이동 함수
  const handleNextStep = () => {
    dispatch(setStep(Math.min(step + 1, 5)));
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.hotelReservationPage}>
      <StepIndicator step={step} onStepClick={(num) => dispatch(setStep(num))} />
      {step === 1 && (
        <HotelSearchForm onSearch={handleSearch} handleNextStep={handleNextStep} />
      )}
      {step === 2 && (
        <HotelList onShowProperty={(hotelId) => dispatch(setStep(3))} />
      )}
      {step === 3 && selectedHotel && (
        <RoomDetail hotel={selectedHotel} onBook={handleNextStep} getSliderSettings={(count) => ({
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: count < 3 ? count : 3,
          slidesToScroll: 1,
        })} />
      )}
      {step === 4 && selectedHotel && (
        <BookingDetail onPay={handleNextStep} />
      )}
      {step === 5 && selectedHotel && (
        <HotelConfirmation
          hotel={selectedHotel}
          selectedRoom={useSelector(state => state.hotelPage.selectedRoom)}
          startDate={useSelector(state => state.reservation.startDate)}
          endDate={useSelector(state => state.reservation.endDate)}
          totalPrice={useSelector(state => state.reservation.totalPrice)}
          user={useSelector(state => state.userEdit.userDetail)}
        />
      )}
    </div>
  );
};

export default HotelPage;
`}</pre>
      <p>
        <b>HotelPage</b> 컴포넌트는 예약 프로세스의 각 단계를 관리하며, 단계에
        따라 적절한 컴포넌트를 렌더링합니다. 리덕스 상태 관리(`step`)를 통해
        스텝을 전환하며, 각 단계별로 필요한 데이터를 로드하고 표시합니다.
      </p><br/><br/>

      <p>
        <h2>3) 카카오 API 활용 (주소 검색, 지도, 카카오페이)</h2>
        - 주소를 입력받아 Kakao Map Marker 표시
        <br />
        - `MapView` 컴포넌트: `kakao.maps.services.Geocoder()`로 주소→좌표 변환
        <br />- **카카오페이**는 결제 준비 요청 → **결제창** 리다이렉트 → 성공
        시 예약 확정
      </p>
      <pre>{`jsx
// MapView.js (일부)
import React, { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const MapView = ({ location, title }) => {
  const [coords, setCoords] = useState({ lat: 37.506320759000715, lng: 127.05368251210247 });
  const [map, setMap] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = \`https://dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=services\`;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(location, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const lat = result[0].y;
            const lng = result[0].x;
            setCoords({ lat, lng });
          } else {
            console.error('Geocode was not successful for the following reason: ' + status);
            // Fallback: 기본 좌표 설정
            setCoords({ lat: 37.5063, lng: 127.0536 });
          }
        });
      } else {
        console.error('Kakao maps library is not loaded');
        // Fallback: 기본 좌표 설정
        setCoords({ lat: 37.5063, lng: 127.0536 });
      }
    };

    script.onerror = () => {
      console.error('Kakao Maps script failed to load');
      // Fallback: 기본 좌표 설정
      setCoords({ lat: 37.5063, lng: 127.0536 });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [location]);

  const handleZoomIn = () => {
    if (map) {
      map.setLevel(map.getLevel() - 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setLevel(map.getLevel() + 1);
    }
  };

  let mapContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
  };

  const mapStyle = {
    width: '100%',
    height: '500px',
    maxWidth: '1400px', // 최대 너비 1400px 설정
    filter: 'sepia(10%) hue-rotate(0deg) saturate(60%) brightness(100%) contrast(100%)',
  };

  return (
    <div style={mapContainerStyle}>
      <Map
        center={coords}
        level={3}
        style={mapStyle}
        draggable={false}
        onCreate={setMap}
      >
        <MapMarker position={coords}>
          <div
            style={{
              color: '#9971ff',
              fontSize: '18px',
              fontWeight: '700',
              border: '2px solid #9971ff',
              borderRadius: '5px',
              padding: '5px 10px',
              background: '#ffffff',
            }}
          >
            {title}
          </div>
        </MapMarker>
      </Map>
      <div style={{ position: 'absolute', top: '10px', right: '550px', zIndex: 10 }}>
        <button onClick={handleZoomIn} style={buttonStyle}>➕</button>
        <button onClick={handleZoomOut} style={buttonStyle}>➖</button>
      </div>
    </div>
  );
};

const buttonStyle = {
  background: '#FFF',
  color: '#ffffff',
  border: 'none',
  padding: '10px',
  margin: '5px',
  fontSize: '25px',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default MapView;
`}</pre>
      <p>
        <b>MapView</b> 컴포넌트는 카카오 지도 API를 활용하여 입력된 주소를
        기반으로 위치를 표시합니다. 주소를 좌표로 변환하여 마커를 표시하고, 줌
        인/아웃 기능을 제공합니다.
      </p><br/><br/>

      <p>
        <h2>4) UI/UX 라이브러리 활용 (framer-motion, react-slick)</h2>
        - **framer-motion**: Drawer, 모달 등 애니메이션 효과 구현
        <br />- **react-slick**: 호텔 이미지 슬라이더 구현
      </p>
      <pre>{`jsx
// Drawer.js
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import styles from './Drawer.module.scss';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion";
import { PulseLoader } from "react-spinners";

import spinnerStyles from "../../layout/user/Spinner.module.scss";

const DrawerContainer = styled(motion.div)
  font-family: 'NotoSansKR';
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: auto;
  width: 440px;
  height: 100%;
  background-color: #14332C;
  z-index: 1400;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;

  @media (max-width: 400px) {
    width: 100%;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
;

const CloseButton = styled(motion.button)
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
;

const NavItem = styled.button
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  text-align: left;
  padding: 10px 0;
  width: 100%;
  cursor: pointer;
  &:hover {
    color: #ccc;
  }
;

const IconContainer = styled.div
  margin-top: auto;
  display: flex;
  gap: 10px;
  a {
    color: #fff;
    font-size: 24px;
    &:hover {
      color: #ccc;
    }
  }
;

/**
 * Drawer 컴포넌트
 */
const Drawer = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate
  const drawerRef = useRef(null);

  const handleNavClick = async (path) => {
    setLoading(true); // 로딩 시작
    try {
      // 비동기 작업 또는 페이지 로딩 처리
      await new Promise(resolve => setTimeout(resolve, 1000)); // 실제 비동기 작업으로 대체 가능
      navigate(path); // 페이지 이동
      setTimeout(() => {
        onClose(); // 페이지 이동 후 Drawer 닫기
      }, 300); // navigate 후 약간의 딜레이 후 onClose 호출
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 바탕화면 클릭 시 Drawer 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={spinnerStyles.spinnerContainer}>
            <PulseLoader
              className={spinnerStyles.loader}
              color="#0B593F" 
              loading={loading}
              size={18}
            />{" "}
          </div>
        </div>
      )}
      <DrawerContainer
        initial={{ x: '100%' }}  // Drawer가 화면 밖에 시작
        animate={{ x: open ? 0 : '100%' }}  // 열리고 닫힐 때 위치 변화
        transition={{
          type: 'spring',  // inertia 대신 spring 사용
          stiffness: 180,  // 스프링의 강성도
          damping: open ? 25 : 35,     // 감쇠 비율
          mass: 1,         // 질량
          restDelta: 0.001,  // 애니메이션 종료 조건
        }}
        open={open}
        ref={drawerRef}
      >
        {/* 닫기 버튼 */}
        <CloseButton
          open={open}
          onClick={onClose}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="x-shape"></div>
        </CloseButton>
        {/* 네비게이션 링크 */}
        <NavItem onClick={() => handleNavClick("/")}>Home</NavItem>
        <NavItem onClick={() => handleNavClick("/mypage")}>My Page</NavItem>
        <NavItem onClick={() => handleNavClick("/hotel")}>Hotel</NavItem>
        <NavItem onClick={() => handleNavClick("/treats")}>Shop</NavItem>
        <NavItem onClick={() => handleNavClick("/board")}>Community</NavItem>
        {/* 소셜 아이콘 */}
        <IconContainer className="navIcons">
          <a href="mailto:example@example.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </IconContainer>
      </DrawerContainer>
      {/* Top 및 Bottom Drawer 애니메이션 */}
      <TopDrawerContainer
        initial={{ y: '-100%' }}  // 위에서 시작
        animate={{ y: open ? 0 : '-100%' }}  // 열리고 닫힐 때 위치 변화
        transition={{
          type: 'spring',  // inertia 대신 spring 사용
          stiffness: 180,  // 스프링의 강성도
          damping: open ? 27 : 33,     // 감쇠 비율
          mass: 1,         // 질량
          restDelta: 0.001,  // 애니메이션 종료 조건
        }}
        open={open}
      >
      </TopDrawerContainer>
      <BottomDrawerContainer
        initial={{ y: '100%' }}  // 아래에서 시작
        animate={{ y: open ? 0 : '100%' }}  // 열리고 닫힐 때 위치 변화
        transition={{
          type: 'spring',  // inertia 대신 spring 사용
          stiffness: 180,  // 스프링의 강성도
          damping: open ? 27 : 33,      // 감쇠 비율
          mass: 1,         // 질량
          restDelta: 0.001,  // 애니메이션 종료 조건
        }}
        open={open}
      >
      </BottomDrawerContainer>
    </>
  );
};

export default Drawer;
`}</pre>
      <p>
        <b>Drawer</b> 컴포넌트는 **framer-motion**을 활용하여 애니메이션 효과를
        구현하였습니다. Drawer가 열리고 닫힐 때 자연스러운 스프링 애니메이션을
        적용하여 사용자 경험을 향상시킵니다. 또한, **react-slick**이나
        **Swiper**와 함께 사용하여 슬라이더 효과를 적용할 수 있습니다.
      </p><br/><br/>

      <p>
        <h2>5) 예약 상세조회, 리뷰 조회 랜더링</h2>
        
        - 예약 목록 페이지 → 예약 상세 페이지에서 **리뷰** 확인 및 작성
        <br />- **ReviewList** 컴포넌트에서 리뷰 등록/수정/삭제 기능 구현
      </p>
      <pre>{`jsx
// ReviewList.js
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviewsByHotelId } from '../store/hotel/HotelReviewSlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import styles from './ReviewList.module.scss';
import { FaStar } from 'react-icons/fa';

const renderStars = (rate) => {
    return Array(rate)
        .fill()
        .map((_, index) => (
            <FaStar key={index} className={styles.starIcon} />
        ));
};

const sliderSettings = {
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: 20,
    pagination: false,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    speed: 500,
    loop: true,
    modules: [Pagination, Navigation],
    breakpoints: {
        400: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween:10,
            loop: true,
        },
    },
};

const ReviewList = ({ hotelId }) => {
    const dispatch = useDispatch();
    const { loading, error, reviewsByHotelId } = useSelector((state) => state.reviews);
    const reviews = reviewsByHotelId[hotelId] || []; // 현재 호텔의 리뷰 가져오기

    useEffect(() => {
        if (hotelId) {
            dispatch(fetchReviewsByHotelId(hotelId));
        }
    }, [dispatch, hotelId]);

    const sortedReviews = useMemo(() => {
        return reviews.length > 0 ? [...reviews].sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)) : [];
    }, [reviews]);

    if (loading) {
        return <p className={styles.reviewLoading}>Loading reviews...</p>;
    }

    if (error) {
        return <p className={styles.reviewLoading}>Error loading reviews: {error.message}</p>;
    }

    if (reviews.length === 0) {
        return <p className={styles.reviewLoading}>리뷰가 없습니다!</p>;
    }

    return (
        <div className={styles.reviewList}>
            <Swiper {...sliderSettings}>
                {sortedReviews.map((review) => (
                    <SwiperSlide key={review.id} className={styles.review}>
                        <p className={styles.reviewContent}>{review.reviewContent}</p>
                        <div className={styles.reviewDetails}>
                            <p className={styles.reviewRate}>Rating: {renderStars(review.rate)}</p>
                            <p className={styles.reviewDate}>Date: {new Date(review.reviewDate).toLocaleDateString()}</p>
                            <p className={styles.reviewUser}>User: {review.nickName}</p>
                        </div>
                    </SwiperSlide>
                ))}
                <div className={\`swiper-button-prev \${styles.swiperButtonPrev}\`}></div>
                <div className={\`swiper-button-next \${styles.swiperButtonNext}\`}></div>
            </Swiper>
        </div>
    );
};

export default ReviewList;
`}</pre>
      <p>
        <b>ReviewList</b> 컴포넌트는 **Swiper**를 활용하여 리뷰를 슬라이더
        형태로 표시합니다. **react-redux**를 통해 리뷰 데이터를 관리하며,
        **FaStar** 아이콘을 사용하여 평점을 시각적으로 표현합니다.
      </p><br/><br/>

      <p>
        <h2>6) 프로젝트 메인 페이지 랜더링 / 디자인 / 배너</h2>
        
        - 홈(메인) 화면에서 **Swiper**로 배너 / 광고 / 이벤트 표시
        <br />- **Drawer**(햄버거 메뉴) 사용하여 화면 전환 시 자연스러운 모션
      </p>
      <pre>{`jsx
// DoggleProject.js (Drawer 사용 예시)
import Drawer from '../../components/Drawer';

const DoggleProject = ({ language }) => {
  // ... 기존 상태 및 함수

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      {/* ... 기존 코드 */}
      <button onClick={toggleDrawer} className={styles.drawerToggle}>
        메뉴 열기
      </button>
      <Drawer open={isDrawerOpen} onClose={toggleDrawer} />
      {/* ... 기존 코드 */}
    </>
  );
};

export default DoggleProject;
`}</pre>
      <p>
        <b>Drawer</b> 컴포넌트는 **framer-motion**을 활용하여 애니메이션 효과를
        구현하였습니다. Drawer가 열리고 닫힐 때 자연스러운 스프링 애니메이션을
        적용하여 사용자 경험을 향상시킵니다. 또한, **react-slick**이나
        **Swiper**와 함께 사용하여 슬라이더 효과를 적용할 수 있습니다.
      </p><br/><br/>
    </div>
  );
  

  // ===================================
  // 2) [탭 콘텐츠] Architecture
  // ===================================
  const architectureContent =
    language === "English" ? (
      <div>
        <h2>Architecture</h2>
        <p>
          The overall project architecture of Doggle.  
          React + Redux (Frontend) / Spring Boot (Backend) / AWS EC2 deployment / Kakao APIs integration
        </p>
        <img src="/images/architecture.png" alt="Doggle Architecture" />
      </div>
    ) : (
      <div>
        <h2>아키 텍쳐</h2>
        <p>
          도글 프로젝트의 전체 아키텍처입니다.
          <br />
          React + Redux(프론트) / Spring Boot(백엔드) / AWS EC2 배포 / 카카오
          API 연동
        </p>
        <img src="/images/architecture.png" alt="Doggle Architecture" />
      </div>
    );

  // ===================================
  // 3) [탭 콘텐츠] ERD Diagram
  // ===================================
  const erdContent =
    language === "English" ? (
      <div>
        <h2>ER Diagram</h2>
        <p>
          The overall database structure for the Doggle project.
          <br />
          MySQL(MariaDB) + JPA used in actual deployment.
        </p>
        <img src="/images/erd_dog.png" alt="Doggle ERD" />
      </div>
    ) : (
      <div>
        <h2>ER Diagram</h2>
        <p>프로젝트 전체의 데이터베이스 구조입니다.</p>
        <img src="/images/erd_dog.png" alt="Doggle ERD" />
        <p>실제 DB에서는 MySQL(MariaDB) + JPA를 사용했습니다.</p>
      </div>
    );

  return (
    <>
      <div
      className={`${styles.category} ${isCategoryOpen ? styles.categoryOpen : ""}`}
      onClick={handleCategoryClick}
    >
      <p>WEB / Team Project</p>
      <div
        className={styles.clickContainer} // 추가: 스타일 적용을 위한 클래스
      >
        <p>Click</p>
      </div>
    </div>

      <div className={styles.mainContainerWrapper} ref={mainContainerRef}>
        <div className={styles.mainContainer}>
          {/* 프로젝트 대표 영상/이미지 */}
          <div className={styles.video}>
            <VideoContainer>
              <StyledVideo
                src="/videos/doggle_video.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
            </VideoContainer>
          </div>

          {/* 소개/설명 박스 */}
          <div className={styles.desc}>
            <DescriptionContainer>
              <h2>{titleText}</h2>
              <h3>{categoryText}</h3>
              <p>{descriptionText}</p>
              <TagContainer style={{ marginTop: "25px" }}>
                <Tag>React</Tag>
                <Tag>Redux</Tag>
                <Tag>Html/Sass/JS</Tag>
                <Tag>Java</Tag>
                <Tag>SpringBoot</Tag>
                <Tag>MySQL</Tag>
                <Tag>AWS EC2</Tag>
                <Tag>카카오 API</Tag>
                {/* 필요에 따라 태그(사용 기술) 추가 */}
              </TagContainer>

              <ButtonContainer>
                <button style={{color: '#333',}} onClick={openModal}>
                  {projectDetails}
                  <GoArrowUpRight className={styles.icon} />
                </button>
              </ButtonContainer>
            </DescriptionContainer>
          </div>

          {/* 탭형식 모달 */}
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title="프로젝트 상세"
          >
            {/* 스와이프 핸들러 적용 */}
            <ModalContent>
              {/* 탭 전환 버튼 */}
              <ToggleButtonWrapper>
                <ToggleButton
                  active={activeTab === "feature"}
                  onClick={() => setActiveTab("feature")}
                >
                  {language === "English" ? "Feature Info" : "기능 구현"}
                </ToggleButton>

                <ToggleButton
                  active={activeTab === "architecture"}
                  onClick={() => setActiveTab("architecture")}
                >
                  {language === "English" ? "Architecture" : "아키 텍쳐"}
                </ToggleButton>

                <ToggleButton
                  active={activeTab === "erd"}
                  onClick={() => setActiveTab("erd")}
                >
                  ERD
                </ToggleButton>

                <ToggleButton>
                  <a
                    href="https://github.com/full-stack-final-project-team3"
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
              {activeTab === "architecture" && architectureContent}
              {activeTab === "erd" && erdContent}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default DoggleProject;
