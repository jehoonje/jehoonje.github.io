// IntroduceProject.jsx
import React from "react";
import styled from "styled-components";
import styles from "../styles/Layout.module.scss";

const VideoContainer = styled.div`
  overflow: hidden;
  border-radius: 20px;
  display: flex;
  border: 1px solid #333;
  background: rgba(3, 3, 3, 0.5);

  @media (max-width: 1024px) {
    width: 254px !important;
    height: auto !important;
  }

  @media (max-width: 768px) {
    width: 254px !important;
    height: auto !important;
  }

  @media (max-width: 480px) {
    width: 254px !important;
    height: auto !important;
  }
`;

const StyledVideo = styled.video`
  width: 254px;
  height: auto;
  object-fit: cover;
  border-radius: inherit;
`;

const DescriptionContainer = styled.div`
  max-width: 320px;
  @media (max-width: 767px) {
    max-width: 90%;
  }
`;

const IntroduceProject = ({ language }) => {
  const titleText = language === "English" ? "Campridge" : "캠프릿지";
  const categoryText = language === "English" ? "Lifestyle / Travel" : "라이프스타일 / 여행";

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

  return (
    <div className={styles.mainContainer}>
      <div className={styles.video}>
        <VideoContainer>
          <StyledVideo
            src="/videos/campridge_video.mp4"
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
        </DescriptionContainer>
      </div>
    </div>
  );
};

export default IntroduceProject;
