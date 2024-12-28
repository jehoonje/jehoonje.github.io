// src/pages/MainIntro.js
import React from "react";
import styles from "../styles/MainIntro.module.scss";

function MainIntro({ language }) {
  const introText =
    language === "English"
      ? "I am a developer who helps businesses grow through web and app development. I focus on creating simple."
      : "웹과 앱으로 의미 있는 변화를 이끄는 개발자입니다. <br />미니멀하면서도 효과적인 솔루션을 제안하며, <br />사용자와 팀 모두가 만족할 수 있는 결과를 만듭니다.";

  return (
    <>
      <introContainer>
        <div
          className={styles.intro}
          dangerouslySetInnerHTML={{ __html: introText }}
        />
      </introContainer>
    </>
  );
}

export default MainIntro;
