"use client";
import Image from "next/image";

import styled from "styled-components";
import Spoon from "@/public/spoon.svg";

const SpoonWrapper = styled.div<PropsStyles>`
  display: flex;
  justify-content: ${(props) => `${props.justify ? props.justify : "center"}`};
`;
interface PropsStyles {
  justify?: string;
}
function SponImage({ justify }: PropsStyles) {
  return (
    <SpoonWrapper justify={justify}>
      <Image
        src={Spoon.src}
        height={Spoon.height}
        width={Spoon.width}
        alt="spoon"
        priority
      />
    </SpoonWrapper>
  );
}

export default SponImage;
