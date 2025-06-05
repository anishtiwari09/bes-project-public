import Link from "next/link";

export default function Header1() {
  return (
    <div className="flex-1 flex max-w-[fit-content] bg-[#7d4404] items-center">
      <Link className="flex flex-1" href={"/"}>
        <img src={"/Images/Logo/logo.png"} />
      </Link>
    </div>
  );
}
