"use client";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function SocialNetwork() {
  const socials = [
    {
      socialNetwork: "facebook",
      url: "https://www.facebook.com",
      title: "Facebook",
      icon: FaFacebookF,
    },
    {
      socialNetwork: "Twitter",
      url: "https://www.twitter.com",
      title: "Twitter",
      icon: FaTwitter,
    },
    {
      socialNetwork: "Instagram",
      url: "https://www.instagram.com",
      title: "Instagram",
      icon: FaInstagram,
    },
  ];
  return (
    <aside className="flex justify-center gap-5">
      {socials.map((social, i) => {
        return (
          <a
            key={i}
            href={social.url}
            title={social.title}
            target="_blank"
            rel="noopener noreferrer"
            className="text-golden2 hover:text-golden transition-all duration-500"
          >
            <social.icon />
          </a>
        );
      })}
    </aside>
  );
}
