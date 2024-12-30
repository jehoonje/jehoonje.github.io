// src/components/About.jsx
import React, { useState } from "react";
import styles from "../styles/About.module.scss";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";

const About = () => {
  // RootLayout (혹은 부모 컴포넌트)에서 전달받은 language
  const { language } = useOutletContext();

  // 이미지 로딩 상태
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // 한국어 자기소개
  const descriptionKr = `안녕하세요. 웹과 앱으로 의미 있는 변화를 발견하는 개발자 임제훈 입니다. 

연극 대학을 중퇴한 뒤, 7년간 국내외 호스피탈리티 업계에서 근무하고, 미래를 위한 변화를 만들기 위해 노력하며, 이제는 개발자로서 나아가기 위해 노력하고 있습니다.

  다양한 환경에서의 경험을 바탕으로 사용자 중심의 서비스를 만들기 위해 노력하고 있습니다. 미니멀하면서도 효과적인 솔루션을 제안하며, 사용자와 팀 모두가 만족할 수 있는 결과를 만듭니다. 감사합니다.`;

  // 영어 자기소개
  const descriptionEn = `Hello! I'm Alex Lim, a developer who discovers meaningful changes through web and app development.

After leaving my Theater Arts major, I spent seven years working in the Korean and international hospitality industry, striving to shape a better future. Now, I'm committed to growing every day as a developer.

Drawing from my diverse experiences, I focus on creating user-centric services. I also propose minimal yet effective solutions, delivering outcomes that satisfy both users and the team. 

Thank you.`;

  // language 값에 따라 보여줄 텍스트 결정
  const description = language === "English" ? descriptionEn : descriptionKr;

  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          {!isImageLoaded && <div className={styles.imageSkeleton}></div>}
          <img
            src="/images/profile.jpeg"
            alt="Profile"
            className={`${styles.profileImage} ${isImageLoaded ? styles.showImage : styles.hideImage}`}
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>
        {/* 줄바꿈 처리를 위해 CSS에서 white-space: pre-line; 등을 적용해 주세요. */}
        <p className={styles.description}>{description}</p>
      </div>
    </motion.div>
  );
};

export default About;
