import Image from "next/image";
import Link from "next/link";

export default function Header1() {
  return (
    <div className="flex items-center bg-[#7d4404]">
      <Link href="/" className="flex items-center">
        <Image
          src="/Images/Logo/logo.png"
          alt="Logo"
          width={458}
          height={90}
          priority
          className="h-auto w-[229px] md:w-[458px]"
        />
      </Link>
    </div>
  );
}
