"use client";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import "./socialNetWork.scss";

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
    <aside className="social-network-wrapper">
      {socials.map((social, i) => {
        return (
          <a
            key={i}
            href={social.url}
            title={social.title}
            target="_blank"
            rel="noopener noreferrer"
          >
            <social.icon />
          </a>
        );
      })}
    </aside>
  );
}
