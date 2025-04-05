import Image from "next/image";
import Spoon from "@/public/spoon.svg";
import './SponImage.scss'


interface PropsStyles {
  justify?: string;
}
function SponImage({ justify }: PropsStyles) {
    const justifyStyle = justify ? `justify-${justify}` : "justify-center"
  return (
    <div className={`SpoonWrapper ${justifyStyle}`}>
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
