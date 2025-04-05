'use client'
import styled from "styled-components";
import VideoComponent from "@/components/frontend/components/video/videoComponent";
import bggallery from "@/public/gallery/fondo.jpg";
import {SponImage} from "@/components/common";
import InstagramCaroussel from "@/components/frontend/components/sliders/instagramCarousel/instagramCaroussel";

import image1 from "@/public/gallery/rammen-1.jpg";
import image2 from "@/public/gallery/whisky-2.jpg";
import image3 from "@/public/gallery/egg-3.jpg";
import image4 from "@/public/gallery/soup-4.jpg";
import image5 from "@/public/gallery/waffle-5.jpg";

const HomeGalleryWrapper = styled.section`
  background-image: url(${bggallery.src});
  background-size: cover;
  .gallery-container {
    display: flex;
    gap: 20px;
    align-items: center;
    min-height: 447px;
    justify-content: center;
    .call-to-action-gallery {
      width: 30%;
      .text-content {
        padding: 12%;
      }
    }

    .instagram-gallery {
      width: 70%;
      overflow: hidden;
      padding-top: 40px;
      padding-bottom: 20px;
    }
    @media (max-width: 767px) {
      flex-direction: column;
      .call-to-action-gallery {
        width: 100%;
        .text-content {
          padding: 12%;
        }
      }

      .instagram-gallery {
        width: 100%;
        overflow: hidden;
      }
    }
  }
`;

export default function HomeGallery() {
  const imagesList = [image1, image2, image3, image4, image5];
  return (
    <HomeGalleryWrapper id="gallery">
      <VideoComponent
        videoUrl={'/gallery/restaurant.mp4'}
        typeVideo={"video/mp4"}
        showcontrol={false}
        mutedControl={true}
        autoPlayed={false}
      />
      <div className="gallery-container">
        <div className="call-to-action-gallery">
          <div className="text-content">
            <h3>Instagram</h3>
            <SponImage justify="start" />
            <h2>Photo Gallery</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat
              mattis ipsum turpis elit elit scelerisque egestas mu.
            </p>
            <div className="button-container">
              <a href="#find" className="button">
                View More
              </a>
            </div>
          </div>
        </div>
        <div className="instagram-gallery">
          <InstagramCaroussel images={imagesList} />
        </div>
      </div>
    </HomeGalleryWrapper>
  );
}
