// DoggleProject.js
import React, { useState } from "react";
import styled from "styled-components";
import styles from "../styles/Layout.module.scss";
import Modal from "../components/Modal"; // 모달 컴포넌트 import
import { GoArrowUpRight } from "react-icons/go";

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 60%;
  overflow: hidden;
  border-radius: 20px;
  display: flex;
  border: 1px solid #333;
  background: rgba(3, 3, 3, 0.5);
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

const DoggleProject = ({ language }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 열기
  const openModal = () => setIsModalOpen(true);
  // 모달 닫기
  const closeModal = () => setIsModalOpen(false);

  const titleText = language === "English" ? "Doggle" : "도글";
  const projectDetails =
    language === "English" ? "Learn More" : "프로젝트 상세";
  const categoryText =
    language === "English" ? "Lifestyle / Pet" : "라이프스타일 / 반려동물";

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
이 프로젝트는 7인 팀이 약 한 달간 협업하여 개발했으며,
배포까지 완료되었으나 현재는 서비스를 운영하지 않고 있습니다.
      `;

  return (
    <>
      <div className={styles.category}>
        <p>APP</p>
      </div>

      {/* 기존: 전체 컨테이너에서 onClick 제거 */}
      <div className={styles.mainContainer}>
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
        <div className={styles.desc}>
          <DescriptionContainer>
            <h2>{titleText}</h2>
            <h3>{categoryText}</h3>
            <p>{descriptionText}</p>

            <TagContainer
              style={{
                marginTop: "25px",
              }}
            >
              <Tag>React</Tag>
              <Tag>HTML/CSS/JS</Tag>
              <Tag>Java</Tag>
              <Tag>SpringBoot</Tag>
              <Tag>JPA</Tag>
              <Tag>AWS EC2</Tag>
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
        <Modal isOpen={isModalOpen} onClose={closeModal} title={titleText}>
          <p>
            여기에는 <strong>Doggle</strong> 프로젝트에 대한 상세 정보, 스크린샷
            등이 들어갈 수 있습니다.
          </p>
        </Modal>
      </div>
    </>
  );
};

export default DoggleProject;
