// src/pages/MainIntro.js
import React from "react";
import styles from "../styles/MainIntro.module.scss";

/**
 * @param {string} language - 언어 설정
 * @param {function} onClickMore - "더 보기" 버튼 클릭 핸들러 (필요 없으면 생략 가능)
 * @param {string} variant - "small"이면 Projects 내에서 사용될 작은 인트로
 */
function MainIntro({ language, onClickMore, variant = "large" }) {
  const introText =
    language === "English"
      ? "I am a developer who helps businesses grow through web and app development. I focus on creating simple."
      : "미니멀하면서도 효과적인 솔루션을 제안하며,<br/>사용자와 팀 모두가 만족할 수 있는 결과를 만듭니다.";
  const btnText = language === "English" ? "View Projects" : "프로젝트 보기";

  return (
    <div className={variant === "small" ? styles.mainIntroSmaller : styles.mainIntro}>
      <div
        className={styles.introText}
        dangerouslySetInnerHTML={{ __html: introText }}
      />
      {onClickMore && (
        <button onClick={onClickMore} className={styles.moreBtn}>
          {btnText}
        </button>
      )}
    </div>
  );
}

export default MainIntro;
