// MinimalFlipExample.js
import React from "react";
import styled from "styled-components";

const FlipContainer = styled.div`
  width: 400px;         /* 원하는 크기로 조정 */
  height: 250px;        /* 원하는 크기로 조정 */
  perspective: 1000px;  /* 3D 공간을 만드는 관찰자 거리 */
`;

const FlipCard = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d; /* 3D 보존 */
  transition: transform 0.8s ease; /* 회전 애니메이션 시간/함수 */

  /* hover 시 Y축 방향으로 180도 회전 */
  &:hover {
    transform: rotateY(180deg);
  }
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* 뒤집혔을 때 숨기기 */
  top: 0;
  left: 0;
  display: flex;       /* 내용 정렬용 */
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const CardFront = styled(CardFace)`
  background-color: #fff; /* front 배경색 */
`;

const CardBack = styled(CardFace)`
  background-color: #fafafa; /* back 배경색 */
  transform: rotateY(180deg);
`;

const About = () => {
  return (
    <FlipContainer>
      <FlipCard>
        {/* ------- FRONT ------- */}
        <CardFront>
          FRONT (여기에 video 넣기)
        </CardFront>

        {/* ------- BACK -------- */}
        <CardBack>
          BACK (여기에 desc 넣기)
        </CardBack>
      </FlipCard>
    </FlipContainer>
  );
};

export default About;
