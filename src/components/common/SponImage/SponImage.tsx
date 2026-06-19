import Image from "next/image";
import Spoon from "@/public/spoon.svg";

interface PropsStyles {
  justify?: string;
}
function SponImage({ justify }: PropsStyles) {
  const justifyStyle = justify ? `justify-${justify}` : "justify-center";
  return (
    <div className={`flex ${justifyStyle}`}>
      <Image
        src={Spoon.src}
        height={Spoon.height}
        width={Spoon.width}
        alt="spoon"
        priority
      />
    </div>
  );
}

export default SponImage;
