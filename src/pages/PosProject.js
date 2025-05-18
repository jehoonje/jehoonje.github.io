// src/pages/PosProject.js
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import styles from "../styles/Pos.module.scss";
import Modal from "../components/Modal";
import { GoArrowUpRight } from "react-icons/go";
import { useSwipeable } from "react-swipeable"; 

// 스켈레톤 스타일 정의
const VideoSkeleton = styled.div`
  width: 484px;
  height: 142px; /* 영상의 종횡비에 맞게 조정하세요 */
  background-color: #ccc;
  border-radius: 10px;
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
  border-radius: 10px;
  display: flex;
  border: 1px solid #333;
  background: rgba(3, 3, 3, 0.5);
  position: relative; /* 스켈레톤 위치를 위한 상대 위치 설정 */
`;

const StyledVideo = styled.video`
  width: 484px;
  height: auto;
  object-fit: cover;
  @media (max-width: 600px) {
    max-width: 344px;
  }
`;

const DescriptionContainer = styled.div`
  max-width: 450px;
  @media (max-width: 600px) {
    max-width: 320px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  color: #333;
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
  max-width: 80vh; /* 기본 최대 너비 */
  box-sizing: border-box; /* 패딩과 보더를 너비에 포함 */
  padding: 16px; /* 내부 여백 추가 */
  

  /* 모달 내부의 pre 태그 스타일링 */
  pre {
    white-space: pre-wrap; /* 줄바꿈을 허용 */
    word-wrap: break-word; /* 긴 단어를 줄바꿈 */
    max-width: 100%; /* pre 태그가 컨테이너를 넘지 않도록 */
    overflow-x: auto; /* 필요한 경우 내부 스크롤 */
    background: #333 !important; /* 배경색 지정 */
    color: #fff; /* 글자색 지정 */
    padding: 28px !important; /* 내부 여백 추가 */
    border-radius: 10px;
    font-size: 14px;
  }

  /* 모달 내부의 기타 콘텐츠가 넘치지 않도록 */
  img {
    max-width: 100%;
    height: auto;
  }
`;

const PosProject = ({ language }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  /**
   * 기존 isFeaturePage(true/false) 대신, 다중 탭 관리를 위한 activeTab 사용
   * - 'feature'       : 기능 정보(Feature Information)
   * - 'troubleshoot'  : 트러블슈팅(Troubleshooting)
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
  const titleText = language === "English" ? "POS System Web" : "매장 POS 시스템";
  const projectDetails =
    language === "English" ? "Learn More" : "프로젝트 상세";
  const categoryText =
    language === "English" ? "Service / Management" : "서비스 / 영업관리";
// 메인 설명
const descriptionText =
  language === "English"
    ? `This is a comprehensive POS (Point of Sale) and store management system built with Next.js and React.
       It allows store operators to easily register store information, configure products (menus) and categories,
       and manage real-time orders and payments. The system handles user authentication, store creation, order processing,
       payment management, receipt printing, and detailed sales reporting. Built with Zustand for state management and
       React Query for data fetching, the UI is enhanced with Framer Motion animations and styled with TailwindCSS.
       The system provides an all-in-one solution for store operations, from menu management to sales analysis.`
    : `•  Next.js와 React 기반의 영업 및 매장 관리 시스템 (POS)<br />
      •  사용자 인증, 매장 생성, 주문 처리, 결제, 영수증 출력, 매장 설정 등 매장의 전반적인 운영 지원<br />
      •  Zustand를 활용한 중앙 집중식 상태 관리 및 React Query를 통한 효율적인 데이터 패칭<br />
      •  Framer Motion을 통한 부드러운 애니메이션<br />
      •  다양한 결제 수단(현금, 카드) 지원 및 분할, 결제 기능<br />
      •  그리드 기반 메뉴 레이아웃과 드래그 앤 드롭 인터페이스로 직관적인 메뉴 관리<br />
      •  일별/월별 매출 보고서 및 주문 내역 분석 기능 제공`;

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
        1) <b>User Authentication & Login</b>
        <br />
        &nbsp;&nbsp;* Implements email-based authentication with JWT (Access Token & Refresh Token).
        <br />
        &nbsp;&nbsp;* Tokens are stored in localStorage and cookies for persistent sessions.
        <br />
        &nbsp;&nbsp;* Automatic token refresh mechanism through Axios interceptors prevents session expiration.
      </p>
      <br />
      <p>
        2) <b>Home & Store Selection</b>
        <br />
        &nbsp;&nbsp;* After login, users can select from multiple stores or create a new store.
        <br />
        &nbsp;&nbsp;* Store login requires a 4-digit PIN for security.
        <br />
        &nbsp;&nbsp;* System checks if the store is already open before allowing access.
        <br />
        &nbsp;&nbsp;* Multi-step store creation workflow with form validation and auto-save features.
      </p>
      <br />
      <p>
        3) <b>POS Screen</b>
        <br />
        &nbsp;&nbsp;* The main POS interface displays categories and menu items in a grid layout.
        <br />
        &nbsp;&nbsp;* Menu selection updates the order panel in real-time with swipeable menu items.
        <br />
        &nbsp;&nbsp;* Table/place selection via modal popup with customizable table grid layout.
        <br />
        &nbsp;&nbsp;* Uses menu caching to improve performance and reduce server load.
        <br />
        &nbsp;&nbsp;* Intelligent handling of existing orders when selecting previously used tables.
      </p>
      <br />
      <p>
        4) <b>Store Settings & Management</b>
        <br />
        &nbsp;&nbsp;* Settings page provides access to orders, item management, and store closure.
        <br />
        &nbsp;&nbsp;* Menu and category editing interfaces with drag-and-drop functionality using react-dnd.
        <br />
        &nbsp;&nbsp;* Visual color picker (HexColorPicker) for menu and category styling.
        <br />
        &nbsp;&nbsp;* Support for full-size and half-size menu items in the grid layout.
        <br />
        &nbsp;&nbsp;* End-of-day business closure with validation for incomplete orders.
      </p>
      <br />
      <p>
        5) <b>Order Management & Sales Reporting</b>
        <br />
        &nbsp;&nbsp;* View daily and monthly sales with detailed order information and calendar views.
        <br />
        &nbsp;&nbsp;* Filter by date range, view canceled orders, and print receipts.
        <br />
        &nbsp;&nbsp;* Infinite scroll for order history with efficient data fetching and intersection observers.
        <br />
        &nbsp;&nbsp;* Draggable calculator widget for quick calculations during business operations.
      </p>
      <br />
      <p>
        6) <b>Payment Processing</b>
        <br />
        &nbsp;&nbsp;* Supports cash and credit card payments with split payment options.
        <br />
        &nbsp;&nbsp;* Real-time change calculation with animated number transitions.
        <br />
        &nbsp;&nbsp;* Handles complex scenarios like partial payments and minimum payment thresholds.
        <br />
        &nbsp;&nbsp;* Refund functionality with comprehensive payment logs and history.
      </p>
      <br />
      <br />
      <br />
      <h2>2. Frontend (Next.js & React) Features & Technologies</h2>
      <br />
      <p>
        <b>(1) State Management with Zustand</b>
      </p>
      <br />
      <p>
        * Global Store State
        <br />
        &nbsp;&nbsp;* PosStore manages core operational data (orders, menus, categories, selection state).
        <br />
        &nbsp;&nbsp;* FormStore handles form data for store creation and configuration.
        <br />
        &nbsp;&nbsp;* PlaceStore manages table/seat configuration and arrangement.
        <br />
        &nbsp;&nbsp;* Persistent state between page navigations for a seamless user experience.
      </p>
      <br />
      <p>
        * Menu Caching & State Architecture
        <br />
        &nbsp;&nbsp;* Sophisticated caching system with menuCache object storing menu items by category ID.
        <br />
        &nbsp;&nbsp;* Multiple invalidation mechanisms to ensure data freshness after updates.
        <br />
        &nbsp;&nbsp;* Clear separation of concerns with specialized stores for different system aspects.
      </p>
      <br />
      <p>
        <b>(2) UI/UX with Framer Motion & TailwindCSS</b>
      </p>
      <br />
      <p>
        * Advanced Animation Systems
        <br />
        &nbsp;&nbsp;* AnimatePresence for controlled mounting/unmounting animations.
        <br />
        &nbsp;&nbsp;* Animated number transitions for price displays and calculations.
        <br />
        &nbsp;&nbsp;* Modal popups with fade-in/fade-out effects and backdrop blur.
        <br />
        &nbsp;&nbsp;* Swipeable list items with gesture-based delete functionality.
      </p>
      <p>
        * Interactive UI Elements
        <br />
        &nbsp;&nbsp;* Draggable calculator widget using mouse position tracking.
        <br />
        &nbsp;&nbsp;* HexColorPicker for intuitive color selection in menu and category styling.
        <br />
        &nbsp;&nbsp;* Grid-based layout system for organized menu placement and table management.
      </p>
      <br />
      <p>
        <b>(3) Data Fetching & Caching</b>
      </p>
      <p>
        * React Query / TanStack Query
        <br />
        &nbsp;&nbsp;* Efficient data fetching with automatic caching and stale-time configuration.
        <br />
        &nbsp;&nbsp;* InfiniteQuery for order history with optimized pagination.
        <br />
        &nbsp;&nbsp;* Intersection Observer API for efficient scroll-based data loading.
        <br />
        &nbsp;&nbsp;* Multi-level caching strategy that combines React Query and custom Zustand caching.
      </p>
      <br />
      <p>
        <b>(4) Component Architecture & Advanced UI Features</b>
      </p>
      <p>
        * Drag and Drop Implementation
        <br />
        &nbsp;&nbsp;* React DnD library for menu items and category arrangement.
        <br />
        &nbsp;&nbsp;* Custom drag system for the calculator modal using mouse events.
        <br />
        &nbsp;&nbsp;* Validation logic for drag-and-drop operations to prevent invalid arrangements.
      </p>
      <p>
        * Alert System
        <br />
        &nbsp;&nbsp;* Centralized alert modal with customizable message types and animations.
        <br />
        &nbsp;&nbsp;* Custom alert hooks for consistent alert management across the application.
      </p>
      <p>
        * Form & Input System
        <br />
        &nbsp;&nbsp;* Sophisticated input validation with debounced auto-save functionality.
        <br />
        &nbsp;&nbsp;* Integration with Kakao Address API for streamlined location input.
        <br />
        &nbsp;&nbsp;* Input masking for phone numbers, PIN codes, and other formatted data.
      </p>
      <br />
      <br />
      <h2>3. Backend Features & Technologies</h2>
      <br />
      <p>
        <b>(1) Authentication & Authorization</b>
      </p>
      <p>
        * JWT Authentication
        <br />
        &nbsp;&nbsp;* Access Token and Refresh Token implementation with secure storage.
        <br />
        &nbsp;&nbsp;* Automatic token refresh through Axios interceptors when expired.
        <br />
        &nbsp;&nbsp;* Token lifecycle management with login, refresh, and logout endpoints.
      </p>
      <p>
        * Security & Access Control
        <br />
        &nbsp;&nbsp;* Store-specific PIN code protection for operational security.
        <br />
        &nbsp;&nbsp;* API endpoint protection with JWT verification.
        <br />
        &nbsp;&nbsp;* Cross-site request forgery (CSRF) protection via custom headers.
      </p>
      <br />
      <p>
        <b>(2) API Structure & Integration</b>
      </p>
      <p>
        * RESTful Endpoints
        <br />
        &nbsp;&nbsp;* Store management: /api/stores - CRUD operations for store entities
        <br />
        &nbsp;&nbsp;* Menu & categories: /api/menus, /api/categories - Menu item and category management
        <br />
        &nbsp;&nbsp;* Order processing: /api/orders - Order creation, modification, and querying
        <br />
        &nbsp;&nbsp;* Payment handling: /api/pay - Payment processing and refund operations
        <br />
        &nbsp;&nbsp;* Report generation: /api/reports - Sales reporting and data analysis
        <br />
        &nbsp;&nbsp;* Places: /api/places - Table/seat management and configuration
      </p>
      <p>
        * External Service Integration
        <br />
        &nbsp;&nbsp;* Payment gateway API connection for credit card processing.
        <br />
        &nbsp;&nbsp;* Receipt generation and printing service integration.
        <br />
        &nbsp;&nbsp;* Kakao Address API for location/address input.
      </p>
      <br />
      <p>
        <b>(3) Data Model & Operations</b>
      </p>
      <p>
        * Complex Entity Relationships
        <br />
        &nbsp;&nbsp;* Store → Categories → Menu Items (hierarchical menu structure)
        <br />
        &nbsp;&nbsp;* Store → Places → Orders (space management and order assignment)
        <br />
        &nbsp;&nbsp;* Orders → Order Items → Payments (order composition and financial tracking)
        <br />
        &nbsp;&nbsp;* User → Stores (ownership and access management)
      </p>
      <p>
        * Business Logic Implementation
        <br />
        &nbsp;&nbsp;* Order state management (unpaid, completed, canceled)
        <br />
        &nbsp;&nbsp;* Split payment and refund processing logic
        <br />
        &nbsp;&nbsp;* End-of-day operations with validation for incomplete orders
        <br />
        &nbsp;&nbsp;* Sales data aggregation and reporting calculations
      </p>
      <br />
      <br />
      <h2>4. Advanced Features & Technical Highlights</h2>
      <br />
      <p>
        <b>(1) Menu Management System</b>
      </p>
      <p>
        * Grid-Based Layout
        <br />
        &nbsp;&nbsp;* 5x4 grid system for organizing menu items visually.
        <br />
        &nbsp;&nbsp;* Support for both full-size (1 cell) and half-size (1/2 cell) menu items.
        <br />
        &nbsp;&nbsp;* Visual validation to prevent invalid menu arrangements.
      </p>
      <p>
        * Drag-and-Drop Interface
        <br />
        &nbsp;&nbsp;* React DnD implementation for intuitive menu rearrangement.
        <br />
        &nbsp;&nbsp;* Automatic position tracking and server synchronization.
        <br />
        &nbsp;&nbsp;* Visual feedback during drag operations with hover effects.
      </p>
      <p>
        * Styling System
        <br />
        &nbsp;&nbsp;* Color picker for menu and category background customization.
        <br />
        &nbsp;&nbsp;* Dynamic CSS generation based on user selections.
        <br />
        &nbsp;&nbsp;* Color contrast management for text readability.
      </p>
      <br />
      <p>
        <b>(2) Order Processing Workflow</b>
      </p>
      <p>
        * Intelligent Order Handling
        <br />
        &nbsp;&nbsp;* Automatic detection of existing orders for tables.
        <br />
        &nbsp;&nbsp;* Merging of new selections with existing orders.
        <br />
        &nbsp;&nbsp;* Support for item quantity adjustment and removal.
      </p>
      <p>
        * Swipeable Interface
        <br />
        &nbsp;&nbsp;* Touch and mouse gesture support for menu item removal.
        <br />
        &nbsp;&nbsp;* Animated transitions during swipe interactions.
        <br />
        &nbsp;&nbsp;* Confirmation system to prevent accidental deletions.
      </p>
      <br />
      <p>
        <b>(3) Payment & Financial System</b>
      </p>
      <p>
        * Multi-Method Payment Processing
        <br />
        &nbsp;&nbsp;* Cash handling with automatic change calculation and denominations.
        <br />
        &nbsp;&nbsp;* Credit card processing with API integration and error handling.
        <br />
        &nbsp;&nbsp;* Split payment support for handling partial payments.
      </p>
      <p>
        * Financial Reporting
        <br />
        &nbsp;&nbsp;* Daily and monthly sales reports with detailed breakdowns.
        <br />
        &nbsp;&nbsp;* Interactive calendar view for historical data access.
        <br />
        &nbsp;&nbsp;* Payment method analytics and trend visualization.
      </p>
      <br />
      <p>
        <b>(4) Dynamic UI Components</b>
      </p>
      <p>
        * Interactive Calculator
        <br />
        &nbsp;&nbsp;* Draggable calculator widget for financial calculations.
        <br />
        &nbsp;&nbsp;* Full mathematical operations and memory functions.
        <br />
        &nbsp;&nbsp;* Positioning system to prevent off-screen placement.
      </p>
      <p>
        * Alert System
        <br />
        &nbsp;&nbsp;* Context-based alert display with multiple severity levels.
        <br />
        &nbsp;&nbsp;* Animated transitions for alert appearance and dismissal.
        <br />
        &nbsp;&nbsp;* Centralized alert management through custom hooks.
      </p>
      <br />
      <br />
      <h2>5. Example Scenario (Full Order Flow)</h2>
      <br />
      <p>
        1. User logs in → selects a store → enters 4-digit PIN.
        <br />
        2. System checks if the store is already open → if not, allows opening with timestamp recording.
        <br />
        3. On the POS screen, user selects a table/place for the order from the grid layout.
        <br />
        4. System automatically checks for existing unpaid orders for the selected table.
        <br />
        5. User clicks on category tabs and menu items to add to the order panel.
        <br />
        6. Selected items appear in the right panel with quantity controls and swipe-to-delete feature.
        <br />
        7. Once ready, user clicks "Order" to confirm or "Pay" to proceed to payment.
        <br />
        8. On the payment screen, cashier selects payment method (cash/card/split).
        <br />
        9. For cash payment, system calculates change with animated number display.
        <br />
        10. For card payment, processes via payment API with real-time status updates.
        <br />
        11. After successful payment, system offers to print a detailed receipt.
        <br />
        12. Order is marked as complete in the database and appears in the sales reports.
        <br />
        13. At end of day, manager can review daily reports and close the business after validating all orders are complete.
      </p>
      <br />
      <br />
      <h2>6. Project Structure & Component Architecture</h2>
      <br />
      <p>
        * Pages
        <br />
        &nbsp;&nbsp;* Authentication: Login
        <br />
        &nbsp;&nbsp;* Core Operations: Home, POS, Payment
        <br />
        &nbsp;&nbsp;* Management: Setting, EditMenu, EditCategory, Orders
        <br />
        &nbsp;&nbsp;* Setup: Create (for new stores)
      </p>
      <p>
        * Components
        <br />
        &nbsp;&nbsp;* UI Elements: Modal, AlertModal, Button, CategoryButton, MenuButton
        <br />
        &nbsp;&nbsp;* Interactive Components: CalculatorModal, HexColorPicker, GridCell, SwipeableItem
        <br />
        &nbsp;&nbsp;* Functional: SelectedMenuList, OrderList, OrderDetails, MonthlyCalendar
        <br />
        &nbsp;&nbsp;* Form Components: AddItemModal, ModifyItemModal, AddCategoryModal, ModifyCategoryModal
        <br />
        &nbsp;&nbsp;* Specialized: ReceiptModal, PlaceModal, SearchBar
      </p>
      <p>
        * Stores (Zustand)
        <br />
        &nbsp;&nbsp;* PosStore: Core operational state including orders, menus, tables, and selection
        <br />
        &nbsp;&nbsp;* FormStore: Form data and configuration settings for store creation/editing
        <br />
        &nbsp;&nbsp;* PlaceStore: Table/seat configuration and management
      </p>
      <p>
        * Utilities
        <br />
        &nbsp;&nbsp;* axiosInstance: API communication with interceptors for auth management
        <br />
        &nbsp;&nbsp;* Custom Hooks: useAlertModal and other state management abstractions
        <br />
        &nbsp;&nbsp;* Type Definitions: Typescript interfaces for data models
      </p>
    </div>
  ) : (
    <div>
      <h2>1. 프로젝트 전체 구현 흐름</h2>
      <p>
        1) <b>사용자 인증 / 로그인</b>
        <br />
        &nbsp;&nbsp;* 이메일 기반의 인증 시스템 구현, JWT(Access Token, Refresh Token) 활용.
        <br />
        &nbsp;&nbsp;* 토큰은 localStorage와 쿠키에 저장되어 세션 유지.
        <br />
        &nbsp;&nbsp;* Axios 인터셉터를 통한 자동 토큰 갱신 메커니즘으로 세션 만료 방지.
      </p>
      <br />
      <p>
        2) <b>홈 / 매장 선택</b>
        <br />
        &nbsp;&nbsp;* 로그인 후 사용자는 여러 매장 중 선택하거나 새 매장 생성 가능.
        <br />
        &nbsp;&nbsp;* 매장 로그인 시 보안을 위한 4자리 PIN 필요.
        <br />
        &nbsp;&nbsp;* 시스템이 매장 오픈 상태를 확인 후 접근 허용.
        <br />
        &nbsp;&nbsp;* 단계별 매장 생성 워크플로우와 자동 저장 기능 구현.
      </p>
      <br />
      <p>
        3) <b>POS 화면</b>
        <br />
        &nbsp;&nbsp;* POS 메인 인터페이스는 그리드 레이아웃으로 카테고리와 메뉴 항목 표시.
        <br />
        &nbsp;&nbsp;* 메뉴 선택 시 실시간으로 주문 패널 업데이트(스와이프 가능한 메뉴 아이템).
        <br />
        &nbsp;&nbsp;* 모달 팝업을 통한 테이블/장소 선택(맞춤형 테이블 그리드 레이아웃).
        <br />
        &nbsp;&nbsp;* 메뉴 캐싱을 통한 성능 향상 및 서버 부하 감소.
        <br />
        &nbsp;&nbsp;* 이전에 사용한 테이블을 선택할 때 기존 주문을 지능적으로 처리.
      </p>
      <br />
      <p>
        4) <b>매장 설정 및 관리</b>
        <br />
        &nbsp;&nbsp;* 설정 페이지에서 주문, 품목 관리, 매장 마감 등 접근 가능.
        <br />
        &nbsp;&nbsp;* react-dnd를 활용한 드래그 앤 드롭 기능이 있는 메뉴 및 카테고리 편집 인터페이스.
        <br />
        &nbsp;&nbsp;* 메뉴 및 카테고리 스타일링을 위한 비주얼 색상 선택기(HexColorPicker) 구현.
        <br />
        &nbsp;&nbsp;* 그리드 레이아웃에서 전체 크기와 절반 크기 메뉴 아이템 지원.
        <br />
        &nbsp;&nbsp;* 미완료 주문 검증을 통한 영업 종료 처리.
      </p>
      <br />
      <p>
        5) <b>주문 관리 및 매출 보고</b>
        <br />
        &nbsp;&nbsp;* 상세 주문 정보와 캘린더 뷰가 포함된 일별/월별 매출 조회.
        <br />
        &nbsp;&nbsp;* 날짜 범위 필터링, 취소된 주문 조회, 영수증 출력 기능.
        <br />
        &nbsp;&nbsp;* Intersection Observer를 활용한 효율적인 데이터 패칭과 무한 스크롤 구현.
        <br />
        &nbsp;&nbsp;* 영업 중 빠른 계산을 위한 드래그 가능한 계산기 위젯 제공.
      </p>
      <br />
      <p>
        6) <b>결제 처리</b>
        <br />
        &nbsp;&nbsp;* 현금 및 신용카드 결제 지원과 분할 결제 옵션.
        <br />
        &nbsp;&nbsp;* 애니메이션 숫자 전환 효과가 있는 실시간 잔돈 계산.
        <br />
        &nbsp;&nbsp;* 부분 결제 및 최소 결제 임계값과 같은 복잡한 시나리오 처리.
        <br />
        &nbsp;&nbsp;* 포괄적인 결제 로그 및 이력과 함께 환불 기능 제공.
      </p>
      <br />
      <br />
      <br />
      <h2>2. 프론트엔드(Next.js & React) 기능 및 기술</h2>
      <br />
      <p>
        <b>(1) Zustand를 활용한 상태 관리</b>
      </p>
      <br />
      <p>
        * 전역 스토어 상태
        <br />
        &nbsp;&nbsp;* PosStore: 핵심 운영 데이터(주문, 메뉴, 카테고리, 선택 상태) 관리.
        <br />
        &nbsp;&nbsp;* FormStore: 매장 생성 및 구성을 위한 폼 데이터 처리.
        <br />
        &nbsp;&nbsp;* PlaceStore: 테이블/좌석 구성 및 배치 관리.
        <br />
        &nbsp;&nbsp;* 페이지 이동 간 상태 유지로 원활한 사용자 경험 제공.
      </p>
      <br />
      <p>
        * 메뉴 캐싱 및 상태 아키텍처
        <br />
        &nbsp;&nbsp;* 카테고리 ID별로 메뉴 항목을 저장하는 menuCache 객체를 통한 정교한 캐싱 시스템.
        <br />
        &nbsp;&nbsp;* 업데이트 후 데이터 최신성을 보장하는 다양한 캐시 무효화 메커니즘.
        <br />
        &nbsp;&nbsp;* 시스템의 다양한 측면을 위한 특화된 스토어로 관심사 분리가 명확함.
      </p>
      <br />
      <p>
        <b>(2) Framer Motion & TailwindCSS를 이용한 UI/UX</b>
      </p>
      <br />
      <p>
        * 고급 애니메이션 시스템
        <br />
        &nbsp;&nbsp;* 제어된 마운팅/언마운팅 애니메이션을 위한 AnimatePresence 활용.
        <br />
        &nbsp;&nbsp;* 가격 표시 및 계산을 위한 애니메이션 숫자 전환 효과.
        <br />
        &nbsp;&nbsp;* 페이드인/페이드아웃 효과와 배경 블러 처리된 모달 팝업.
        <br />
        &nbsp;&nbsp;* 제스처 기반 삭제 기능이 있는 스와이프 가능한 목록 항목.
      </p>
      <p>
        * 인터랙티브 UI 요소
        <br />
        &nbsp;&nbsp;* 마우스 위치 추적을 사용한 드래그 가능한 계산기 위젯.
        <br />
        &nbsp;&nbsp;* 메뉴 및 카테고리 스타일링을 위한 직관적인 HexColorPicker.
        <br />
        &nbsp;&nbsp;* 체계적인 메뉴 배치 및 테이블 관리를 위한 그리드 기반 레이아웃 시스템.
      </p>
      <br />
      <p>
        <b>(3) 데이터 패칭 및 캐싱</b>
      </p>
      <p>
        * React Query / TanStack Query
        <br />
        &nbsp;&nbsp;* 자동 캐싱 및 stale-time 구성을 통한 효율적인 데이터 패칭.
        <br />
        &nbsp;&nbsp;* 최적화된 페이지네이션이 적용된 주문 내역용 InfiniteQuery.
        <br />
        &nbsp;&nbsp;* 효율적인 스크롤 기반 데이터 로딩을 위한 Intersection Observer API 활용.
        <br />
        &nbsp;&nbsp;* React Query와 커스텀 Zustand 캐싱을 결합한 다중 레벨 캐싱 전략.
      </p>
      <br />
      <p>
        <b>(4) 컴포넌트 아키텍처 및 고급 UI 기능</b>
      </p>
      <p>
        * 드래그 앤 드롭 구현
        <br />
        &nbsp;&nbsp;* 메뉴 항목 및 카테고리 배치를 위한 React DnD 라이브러리 활용.
        <br />
        &nbsp;&nbsp;* 마우스 이벤트를 사용한 계산기 모달용 커스텀 드래그 시스템.
        <br />
        &nbsp;&nbsp;* 잘못된 배치를 방지하기 위한 드래그 앤 드롭 작업의 유효성 검사 로직.
      </p>
      <p>
        * 알림 시스템
        <br />
        &nbsp;&nbsp;* 맞춤형 메시지 유형과 애니메이션이 있는 중앙화된 알림 모달.
        <br />
        &nbsp;&nbsp;* 애플리케이션 전체에서 일관된 알림 관리를 위한 커스텀 알림 훅.
      </p>
      <p>
        * 폼 및 입력 시스템
        <br />
        &nbsp;&nbsp;* 디바운스된 자동 저장 기능이 있는 정교한 입력 유효성 검사.
        <br />
        &nbsp;&nbsp;* 간소화된 위치 입력을 위한 카카오 주소 API 통합.
        <br />
        &nbsp;&nbsp;* 전화번호, PIN 코드 및 기타 형식화된 데이터를 위한 입력 마스킹.
      </p>
      <br />
      <br />
      <h2>3. 백엔드 기능 및 기술</h2>
      <br />
      <p>
        <b>(1) 인증 및 권한 부여</b>
      </p>
      <p>
        * JWT 인증
        <br />
        &nbsp;&nbsp;* 안전한 저장소를 갖춘 Access Token 및 Refresh Token 구현.
        <br />
        &nbsp;&nbsp;* 만료 시 Axios 인터셉터를 통한 자동 토큰 갱신.
        <br />
        &nbsp;&nbsp;* 로그인, 갱신 및 로그아웃 엔드포인트를 통한 토큰 수명주기 관리.
      </p>
      <p>
        * 보안 및 접근 제어
        <br />
        &nbsp;&nbsp;* 운영 보안을 위한 매장별 PIN 코드 보호.
        <br />
        &nbsp;&nbsp;* JWT 검증을 통한 API 엔드포인트 보호.
        <br />
        &nbsp;&nbsp;* 커스텀 헤더를 통한 교차 사이트 요청 위조(CSRF) 방지.
      </p>
      <br />
      <p>
        <b>(2) API 구조 및 통합</b>
      </p>
      <p>
        * RESTful 엔드포인트
        <br />
        &nbsp;&nbsp;* 매장 관리: /api/stores - 매장 엔터티에 대한 CRUD 작업
        <br />
        &nbsp;&nbsp;* 메뉴 및 카테고리: /api/menus, /api/categories - 메뉴 항목 및 카테고리 관리
        <br />
        &nbsp;&nbsp;* 주문 처리: /api/orders - 주문 생성, 수정 및 조회
        <br />
        &nbsp;&nbsp;* 결제 처리: /api/pay - 결제 처리 및 환불 작업
        <br />
        &nbsp;&nbsp;* 보고서 생성: /api/reports - 매출 보고 및 데이터 분석
        <br />
        &nbsp;&nbsp;* 장소: /api/places - 테이블/좌석 관리 및 구성
      </p>
      <p>
        * 외부 서비스 통합
        <br />
        &nbsp;&nbsp;* 신용카드 처리를 위한 결제 게이트웨이 API 연결.
        <br />
        &nbsp;&nbsp;* 영수증 생성 및 인쇄 서비스 통합.
        <br />
        &nbsp;&nbsp;* 위치/주소 입력을 위한 카카오 주소 API.
      </p>
      <br />
      <p>
        <b>(3) 데이터 모델 및 작업</b>
      </p>
      <p>
        * 복잡한 엔티티 관계
        <br />
        &nbsp;&nbsp;* 매장 → 카테고리 → 메뉴 항목 (계층적 메뉴 구조)
        <br />
        &nbsp;&nbsp;* 매장 → 장소 → 주문 (공간 관리 및 주문 할당)
        <br />
        &nbsp;&nbsp;* 주문 → 주문 항목 → 결제 (주문 구성 및 재무 추적)
        <br />
        &nbsp;&nbsp;* 사용자 → 매장 (소유권 및 접근 관리)
      </p>
      <p>
        * 비즈니스 로직 구현
        <br />
        &nbsp;&nbsp;* 주문 상태 관리 (미결제, 완료, 취소)
        <br />
        &nbsp;&nbsp;* 분할 결제 및 환불 처리 로직
        <br />
        &nbsp;&nbsp;* 미완료 주문 검증을 통한 일일 작업 종료
        <br />
        &nbsp;&nbsp;* 매출 데이터 집계 및 보고서 계산
      </p>
      <br />
      <br />
      <h2>4. 고급 기능 및 기술적 하이라이트</h2>
      <br />
      <p>
        <b>(1) 메뉴 관리 시스템</b>
      </p>
      <p>
        * 그리드 기반 레이아웃
        <br />
        &nbsp;&nbsp;* 메뉴 항목을 시각적으로 구성하기 위한 5x4 그리드 시스템.
        <br />
        &nbsp;&nbsp;* 전체 크기(1셀) 및 절반 크기(1/2셀) 메뉴 항목 지원.
        <br />
        &nbsp;&nbsp;* 잘못된 메뉴 배치를 방지하기 위한 시각적 유효성 검사.
      </p>
      <p>
        * 드래그 앤 드롭 인터페이스
        <br />
        &nbsp;&nbsp;* 직관적인 메뉴 재배치를 위한 React DnD 구현.
        <br />
        &nbsp;&nbsp;* 자동 위치 추적 및 서버 동기화.
        <br />
        &nbsp;&nbsp;* 호버 효과가 있는 드래그 작업 중 시각적 피드백.
      </p>
      <p>
        * 스타일링 시스템
        <br />
        &nbsp;&nbsp;* 메뉴 및 카테고리 배경 커스터마이징을 위한 색상 선택기.
        <br />
        &nbsp;&nbsp;* 사용자 선택에 따른 동적 CSS 생성.
        <br />
        &nbsp;&nbsp;* 텍스트 가독성을 위한 색상 대비 관리.
      </p>
      <br />
      <p>
        <b>(2) 주문 처리 워크플로우</b>
      </p>
      <p>
        * 지능적인 주문 처리
        <br />
        &nbsp;&nbsp;* 테이블의 기존 주문 자동 감지.
        <br />
        &nbsp;&nbsp;* 기존 주문과 새로운 선택 병합.
        <br />
        &nbsp;&nbsp;* 항목 수량 조정 및 제거 지원.
      </p>
      <p>
        * 스와이프 가능한 인터페이스
        <br />
        &nbsp;&nbsp;* 메뉴 항목 제거를 위한 터치 및 마우스 제스처 지원.
        <br />
        &nbsp;&nbsp;* 스와이프 상호작용 중 애니메이션 전환.
        <br />
        &nbsp;&nbsp;* 실수로 인한 삭제를 방지하기 위한 확인 시스템.
      </p>
      <br />
      <p>
        <b>(3) 결제 및 재무 시스템</b>
      </p>
      <p>
        * 다중 방식 결제 처리
        <br />
        &nbsp;&nbsp;* 자동 잔돈 계산 및 액면가를 포함한 현금 처리.
        <br />
        &nbsp;&nbsp;* API 통합 및 오류 처리 기능이 있는, 신용카드 처리.
        <br />
        &nbsp;&nbsp;* 부분 결제 처리를 위한 분할 결제 지원.
      </p>
      <p>
        * 재무 보고
        <br />
        &nbsp;&nbsp;* 상세 내역이 포함된 일별 및 월별 매출 보고서.
        <br />
        &nbsp;&nbsp;* 과거 데이터 액세스를 위한 인터랙티브 캘린더 뷰.
        <br />
        &nbsp;&nbsp;* 결제 방법 분석 및 추세 시각화.
      </p>
      <br />
      <p>
        <b>(4) 동적 UI 컴포넌트</b>
      </p>
      <p>
        * 인터랙티브 계산기
        <br />
        &nbsp;&nbsp;* 재무 계산을 위한 드래그 가능한 계산기 위젯.
        <br />
        &nbsp;&nbsp;* 완전한 수학 연산 및 메모리 기능.
        <br />
        &nbsp;&nbsp;* 화면 밖 배치를 방지하는 포지셔닝 시스템.
      </p>
      <p>
        * 알림 시스템
        <br />
        &nbsp;&nbsp;* 여러 심각도 수준을 갖춘 컨텍스트 기반 알림 표시.
        <br />
        &nbsp;&nbsp;* 알림 표시 및 해제를 위한 애니메이션 전환.
        <br />
        &nbsp;&nbsp;* 커스텀 훅을 통한 중앙화된 알림 관리.
      </p>
      <br />
      <br />
      <h2>5. 예시 시나리오 (전체 주문 흐름)</h2>
      <br />
      <p>
        1. 사용자 로그인 → 매장 선택 → 4자리 PIN 입력.
        <br />
        2. 시스템이 매장 오픈 상태 확인 → 미오픈 상태라면 타임스탬프 기록과 함께 오픈 허용.
        <br />
        3. POS 화면에서 사용자가 그리드 레이아웃에서 주문할 테이블/장소 선택.
        <br />
        4. 시스템이 선택한 테이블에 대한 기존 미결제 주문을 자동으로 확인.
        <br />
        5. 사용자는 카테고리 탭과 메뉴 항목을 클릭하여 주문 패널에 추가.
        <br />
        6. 선택한 항목은 수량 컨트롤 및 스와이프하여 삭제 기능과 함께 오른쪽 패널에 표시됨.
        <br />
        7. 준비가 완료되면 사용자는 "주문"을 클릭하여 확인하거나 "결제"를 클릭하여 결제 진행.
        <br />
        8. 결제 화면에서 캐셔는 결제 방법(현금/카드/분할)을 선택.
        <br />
        9. 현금 결제의 경우 시스템이 애니메이션 숫자 표시로 잔돈을 계산.
        <br />
        10. 카드 결제의 경우 실시간 상태 업데이트와 함께 결제 API를 통해 처리.
        <br />
        11. 결제 성공 후 시스템이 상세 영수증 출력 제안.
        <br />
        12. 주문은 데이터베이스에서 완료로 표시되고 매출 보고서에 나타남.
        <br />
        13. 영업 종료 시 모든 주문이 완료 되었을 경우 비즈니스를 마감할 수 있음.
      </p>
      <br />
      <br />
      <h2>6. 프로젝트 구조 및 컴포넌트 아키텍처</h2>
      <br />
      <p>
        * 페이지
        <br />
        &nbsp;&nbsp;* 인증: 로그인
        <br />
        &nbsp;&nbsp;* 핵심 운영: 홈, POS, 결제
        <br />
        &nbsp;&nbsp;* 관리: 설정, 메뉴 편집, 카테고리 편집, 주문
        <br />
        &nbsp;&nbsp;* 설정: 생성(새 매장용)
      </p>
      <p>
        * 컴포넌트
        <br />
        &nbsp;&nbsp;* UI 요소: Modal, AlertModal, Button, CategoryButton, MenuButton
        <br />
        &nbsp;&nbsp;* 인터랙티브 컴포넌트: CalculatorModal, HexColorPicker, GridCell, SwipeableItem
        <br />
        &nbsp;&nbsp;* 기능적: SelectedMenuList, OrderList, OrderDetails, MonthlyCalendar
        <br />
        &nbsp;&nbsp;* 폼 컴포넌트: AddItemModal, ModifyItemModal, AddCategoryModal, ModifyCategoryModal
        <br />
        &nbsp;&nbsp;* 특수: ReceiptModal, PlaceModal, SearchBar
      </p>
      <p>
        * 스토어(Zustand)
        <br />
        &nbsp;&nbsp;* PosStore: 주문, 메뉴, 테이블 및 선택을 포함한 핵심 운영 상태 관리
        <br />
        &nbsp;&nbsp;* FormStore: 매장 생성/편집을 위한 폼 데이터 및 구성 설정
        <br />
        &nbsp;&nbsp;* PlaceStore: 테이블/좌석 구성 및 관리
      </p>
      <p>
        * 유틸리티
        <br />
        &nbsp;&nbsp;* axiosInstance: 인증 관리를 위한 인터셉터가 있는 API 통신
        <br />
        &nbsp;&nbsp;* 커스텀 훅: useAlertModal 및 기타 상태 관리 추상화
        <br />
        &nbsp;&nbsp;* 타입 정의: 데이터 모델을 위한 Typescript 인터페이스
      </p>
    </div>
  );
  // === 탭(모달) 콘텐츠: 트러블슈팅(Troubleshoot) ===
  const troubleshootContent =
    language === "English" ? (
      <div>
        <h3>1. React State Management Troubleshooting</h3>

        <p>
          <b>1) Duplicated State Management in Order History Page</b>
          <br />
          * Issue: Order details weren't displaying in the middle section when clicking an order from the list
          <br />
          * Cause: Two separate states were managing the same data - sortedGroups and dailyOrders weren't synchronized
          <br />
          * Solution:
          <br />
          &nbsp;&nbsp;&nbsp;* Integrated state management by eliminating dailyOrders and relying solely on sortedGroups
          <br />
          &nbsp;&nbsp;&nbsp;* Modified useEffect to reference the unified data source:
          <br />
          <pre>{`
useEffect(() => {
  if (selectedOrderId && selectedDate) {
    const group = sortedGroups.find((g) => g.date === selectedDate);
    const order = group?.orders.find((o) => o.orderId === selectedOrderId);
    // Use the order data from the single source of truth
  }
}, [selectedOrderId, selectedDate, sortedGroups]);
          `}</pre>
          <br />* Result: Order details now properly display when clicking on orders in the list
        </p>
        <br />
        <p>
          <b>2) Missing menuId in POS System Order Data</b>
          <br />
          * Issue: Received menu data from server sometimes lacked menuId, breaking deletion and order processing
          <br />
          * Cause: Backend inconsistently provided menuId in API responses
          <br />
          * Solution:
          <br />
          &nbsp;&nbsp;&nbsp;* Implemented a menu caching system to store complete menu data
          <br />
          &nbsp;&nbsp;&nbsp;* Added a lookup mechanism to find missing menuIds by name:
          <br />
          <pre>{`
const selectedItems = data.menuDetail.map((menu: any) => {
  let menuId = menu.menuId ?? null;
  if (!menuId) {
    const allMenus = Object.values(get().menuCache).flat();
    const found = allMenus.find((m) => m.menuName === menu.menuName);
    if (found) menuId = found.menuId;
  }
  return { menuName: menu.menuName, price: menu.price, quantity: menu.quantity, menuId };
});
          `}</pre>
          <br />* Result: All menu items now have valid menuIds for complete order processing
        </p>
        <br />
        <p>
          <b>3) State Update Delay with Zustand in Password Input</b>
          <br />
          * Issue: Only 3 digits of a 4-digit password were being sent to the server despite user typing 4 digits
          <br />
          * Cause: React's asynchronous state updates caused submitPayload() to execute before password state was fully updated
          <br />
          * Solution:
          <br />
          &nbsp;&nbsp;&nbsp;* Used Zustand's getState() method to access the latest state directly:
          <br />
          <pre>{`
const submitPayload = async () => {
  // Instead of accessing password from component state
  const { storeName, storePlace, password } = useFormStore.getState();
  // Now we have the actual latest values
  console.log("Debug: password:", password); // All 4 digits show correctly
  
  // Send to server...
};
          `}</pre>
          <br />* Result: All 4 digits of the password now correctly transmitted to the server
        </p>
        <br />
        <p>
          <b>4) Performance Optimization with useMemo in Payment Page</b>
          <br />
          * Issue: Expensive calculations were running on every render in the payment page
          <br />
          * Cause: initialTotal and changes calculations were being recomputed unnecessarily on each render
          <br />
          * Solution:
          <br />
          &nbsp;&nbsp;&nbsp;* Applied useMemo to cache expensive calculations:
          <br />
          <pre>{`
const initialTotal = useMemo(() => {
  return selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
}, [selectedItems]);

const changes = useMemo(() => {
  return Math.max(0, charge + splitAmount - initialTotal);
}, [charge, splitAmount, initialTotal]);
          `}</pre>
          <br />* Result: Improved performance by preventing redundant calculations, especially noticeable with larger order lists
        </p>
        <br />
        <br />
      </div>
    ) : (
      // ---- Korean Version (번역) ----
      <div>
        <h2>1. React 상태 관리 트러블슈팅</h2>

        <p>
          <b>1) 주문 내역 페이지 이중 상태 관리 문제</b>
          <br />
          * 이슈: 주문 내역 페이지에서 주문을 클릭해도 중간 섹션이 빈 채로 남아 있었음
          <br />
          * 원인: sortedGroups와 dailyOrders라는 두 개의 상태가 동기화되지 않고 따로 놀았음
          <br />
          * 해결:
          <br />
          &nbsp;&nbsp;&nbsp;* dailyOrders를 없애고 sortedGroups만 남겨 상태를 통합
          <br />
          &nbsp;&nbsp;&nbsp;* useEffect를 수정하여 단일 데이터 소스에서 주문을 찾도록 개선:
          <br />
          <pre>{`
useEffect(() => {
  if (selectedOrderId && selectedDate) {
    const group = sortedGroups.find((g) => g.date === selectedDate);
    const order = group?.orders.find((o) => o.orderId === selectedOrderId);
    // 단일 소스에서 가져온 주문 데이터 사용
  }
}, [selectedOrderId, selectedDate, sortedGroups]);
          `}</pre>
          <br />* 결과: 주문 목록에서 클릭 시 중간 섹션에 상세 정보가 정상적으로 표시됨
        </p>
        <br />
        <p>
          <b>2) POS 시스템에서 menuId 누락 문제</b>
          <br />
          * 이슈: 서버에서 받은 데이터에 menuId가 빠져 있어 삭제나 주문 처리가 안 됨
          <br />
          * 원인: 백엔드에서 일관되지 않게 menuId를 제공함
          <br />
          * 해결:
          <br />
          &nbsp;&nbsp;&nbsp;* 메뉴 데이터를 캐시에 저장하는 시스템 구현
          <br />
          &nbsp;&nbsp;&nbsp;* 메뉴 이름으로 menuId를 찾는 검색 메커니즘 추가:
          <br />
          <pre>{`
const selectedItems = data.menuDetail.map((menu: any) => {
  let menuId = menu.menuId ?? null;
  if (!menuId) {
    const allMenus = Object.values(get().menuCache).flat();
    const found = allMenus.find((m) => m.menuName === menu.menuName);
    if (found) menuId = found.menuId;
  }
  return { menuName: menu.menuName, price: menu.price, quantity: menu.quantity, menuId };
});
          `}</pre>
          <br />* 결과: 모든 메뉴 항목이 유효한 menuId를 가져 완전한 주문 처리가 가능해짐
        </p>
        <br />
        <p>
          <b>3) Zustand와 React 상태 업데이트 지연 문제</b>
          <br />
          * 이슈: 4자리 비밀번호를 입력해도 서버로는 3자리만 전송됨
          <br />
          * 원인: React의 비동기 상태 업데이트로 인해 submitPayload() 실행 시점에 password 상태가 아직 업데이트되지 않음
          <br />
          * 해결:
          <br />
          &nbsp;&nbsp;&nbsp;* Zustand의 getState() 메서드를 사용하여 최신 상태 직접 접근:
          <br />
          <pre>{`
const submitPayload = async () => {
  // 컴포넌트 상태에서 password를 가져오는 대신
  const { storeName, storePlace, password } = useFormStore.getState();
  // 이제 실제 최신 값을 가져옴
  console.log("Debug: password:", password); // 4자리 모두 올바르게 표시
  
  // 서버로 전송...
};
          `}</pre>
          <br />* 결과: 4자리 비밀번호가 모두 서버로 정확히 전송됨
        </p>
        <br />
        <p>
          <b>4) useMemo를 활용한 결제 페이지 성능 최적화</b>
          <br />
          * 이슈: 결제 페이지에서 비용이 큰 계산이 매번 렌더링마다 반복 실행됨
          <br />
          * 원인: initialTotal과 changes 계산이 불필요하게 매 렌더링마다 재계산됨
          <br />
          * 해결:
          <br />
          &nbsp;&nbsp;&nbsp;* useMemo를 사용해 비용이 큰 계산을 메모이제이션:
          <br />
          <pre>{`
const initialTotal = useMemo(() => {
  return selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
}, [selectedItems]);

const changes = useMemo(() => {
  return Math.max(0, charge + splitAmount - initialTotal);
}, [charge, splitAmount, initialTotal]);
          `}</pre>
          <br />* 결과: 불필요한 연산이 줄어 성능이 개선됨, 특히 주문 항목이 많을 때 효과적
        </p>
        <br />
        <br />
      </div>
    );

  return (
    <>
      <div
      className={`${styles.category} ${isCategoryOpen ? styles.categoryOpen : ""}`}
      onClick={handleCategoryClick}
    >
      <p>WEB / Team Project - FE</p>
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
                src="/videos/pos_video.mp4"
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
              <p dangerouslySetInnerHTML={{ __html: descriptionText }} />


              <TagContainer style={{ marginTop: "25px" }}>
                <Tag>Next.js</Tag>
                <Tag>Typescript</Tag>
                <Tag>TailwindCSS</Tag>
                <Tag>Zustand</Tag>
                <Tag>TanStack</Tag>
                <Tag>Axios</Tag>
                <Tag>RESTfulAPI</Tag>
                <Tag>Framer Motion</Tag>
                <Tag>ReactDnd</Tag>
                <Tag>Vercel</Tag>
                <Tag>Cursor</Tag>
              </TagContainer>

              <ButtonContainer>
              <button style={{color: '#333',}} onClick={openModal}>
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
            {/* 스와이프 핸들러 적용 */}
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

                <ToggleButton>
                  <a
                    href="https://github.com/jehoonje/pos-system"
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
            </ModalContent>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default PosProject;
