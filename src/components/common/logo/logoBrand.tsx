import Link from "next/link";
import "./logoBrand.scss";

const LogoBrand = () => {
  return (
    <div className="logo text-golden">
      <Link className="text-golden" href={"/"}>
        Gerícht
      </Link>
    </div>
  );
};
export default LogoBrand;
