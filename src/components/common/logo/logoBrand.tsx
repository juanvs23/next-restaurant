import Link from "next/link";

const LogoBrand = () => {
  return (
    <div className="text-golden">
      <Link className="text-golden no-underline text-2xl font-bold uppercase tracking-wide" href={"/"} style={{ fontFamily: "'Cormorant Upright', serif" }}>
        Gerícht
      </Link>
    </div>
  );
};
export default LogoBrand;
