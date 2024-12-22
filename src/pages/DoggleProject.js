// DoggleProject.js
import React from "react";
import styled from "styled-components";
import styles from "../styles/Layout.module.scss";

// 가로 비율 10:6을 유지하기 위한 스타일
// 1) padding-top을 60%로 주어, 컨테이너가 항상 width 대비 60% 높이를 가지도록 설정
// 2) position: absolute 로 Video를 꽉 채움
const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 60%; /* 10:6 비율 => 6/10 = 0.6 */
  overflow: hidden;
  border-radius: 20px;
  display: flex;
  border: 1px solid #333;
  background: rgba(3, 3, 3, 0.5);

  @media (max-width: 1024px) {
    width: 254px !important;
    height: auto !important;
    padding-top: 60%; /* 여전히 비율 유지 */
  }

  @media (max-width: 768px) {
    width: 254px !important;
    height: auto !important;
    padding-top: 60%;
  }

  @media (max-width: 480px) {
    width: 254px !important;
    height: auto !important;
    padding-top: 60%;
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
  @media (max-width: 767px) {
    max-width: 90%;
  }
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

const DoggleProject = ({ language }) => {
  const titleText = language === "English" ? "Doggle" : "도글";
  const categoryText =
    language === "English" ? "Lifestyle / Pet" : "라이프스타일 / 반려동물";

  // 필요에 맞춰 수정하거나 간단히 작성하시면 됩니다.
  const descriptionText =
    language === "English"
      ? `Doggle is a community platform for dog owners. It focuses on location-based services, providing dog-friendly parks or vets, and allows users to share reviews and experiences. We aimed to keep a user-friendly UI and a simple but attractive design. It was developed for about 3 months, and is currently under beta testing.`
      : `도글은 반려견을 키우는 분들을 위한 커뮤니티 플랫폼입니다.
         위치 기반으로 반려견 친화 공원이나 병원을 안내하고,
         유저들 간에 리뷰와 경험을 공유할 수 있도록 제작되었습니다.
         직관적 UI와 심플한 디자인을 목표로 하였으며,
         약 3개월간 개발 후 현재 베타 테스트 중입니다.`;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.video}>
        <VideoContainer>
          {/* 영상 경로 doggle_video.mp4 */}
          <StyledVideo
            src="/videos/doggle_video.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </VideoContainer>
      </div>
      <div className={styles.desc}>
        <DescriptionContainer>
          <h2>{titleText}</h2>
          <h3>{categoryText}</h3>
          <p>{descriptionText}</p>

          <TagContainer>
            <Tag>ReactNative</Tag>
            <Tag>HTML/CSS/JS</Tag>
            <Tag>Java</Tag>
            <Tag>SpringBoot</Tag>
            <Tag>JPA</Tag>
            <Tag>AWS EC2</Tag>
            <Tag>RDS</Tag>
            <Tag>Maria DB</Tag>
          </TagContainer>
        </DescriptionContainer>
      </div>
    </div>
  );
};

export default DoggleProject;
