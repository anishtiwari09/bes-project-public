// components/SocialFooter.js

import Link from 'next/link';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function SocialMediaFooter() {
  return (

    <div className="container mx-auto flex justify-center space-x-8 mt-4 mb-4 items-center">
      <Link
        href="https://x.com/besindiaexpo"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Twitter"
      >
        <img src="https://cdn.simpleicons.org/x/FFFFFF" alt="X" className="w-5 h-5" />

      </Link>
      <Link
        href="https://www.facebook.com/profile.php?id=61577322060235"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
      >
        <FacebookIcon className="text-white hover:text-blue-600 transition duration-300 cursor-pointer" fontSize="medium" />
      </Link>
      <Link
        href="https://www.instagram.com/besindiaexpo/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
      >
        <InstagramIcon
          // official brand color
          className="text-white hover:text-[#E1306C] hover:opacity-80 transition duration-300 cursor-pointer"

          fontSize="medium"
        />
      </Link>
      <Link
        href="https://www.linkedin.com/company/besindiaexpo"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
      >
        <LinkedInIcon className="text-white hover:text-blue-500 transition duration-300 cursor-pointer" fontSize="medium" />
      </Link>
      <Link
        href="https://www.youtube.com/@besindiaexpo"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="YouTube"
      >
        <YouTubeIcon className="text-white hover:text-red-500 transition duration-300 cursor-pointer" fontSize="medium" />
      </Link>
    </div>

  );
}
