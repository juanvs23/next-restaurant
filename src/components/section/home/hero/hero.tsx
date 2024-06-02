import styled from "styled-components";
import SponImage from "../../../common/SponImage";
import SliderComponent from "../../../swipers/slider";

const HeroWrapper = styled.section`
  display: flex;
  padding: 140px 0;
  align-items: center;
  .hero-text {
    h1 {
      font-size: 5.5rem;
      line-height: 1.2;
      color: var(--golden);
      letter-spacing: 8px;
      @media (max-width: 768px) {
        font-size: 3rem;
        letter-spacing: 2px;
      }
    }
    h3 {
      letter-spacing: 4px;
      @media (max-width: 768px) {
        font-size: 1.2rem;
        letter-spacing: 2px;
      }
    }
    display: flex;
    .tex-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      margin-right: 10%;
      span {
        text-orientation: sideways;
        writing-mode: horizontal-tb;
        transform: rotate(-90deg);
      }
      @media (max-width: 991px) {
        margin-right: 0%;
      }
    }
  }
  @media (max-width: 991px) {
    padding: 90px 0;
    .row {
      flex-direction: column-reverse;
    }
  }
`;

export default function HeroHome(): JSX.Element {
  return (
    <HeroWrapper id="home">
      <div className="container">
        <div className="row">
          <div className="element-50 hero-text">
            <div className="tex-left">
              <span>#Gericht</span>
              <span>#Bar</span>
            </div>
            <div className="text-central">
              <h3>Chase the new Flavour</h3>
              <SponImage justify="flex-start" />
              <h1>The key to Fine dining</h1>
              <p>
                Sit tellus lobortis sed senectus vivamus molestie. Condimentum
                volutpat morbi facilisis quam scelerisque sapien. Et, penatibus
                aliquam amet tellus
              </p>
              <div className="button-section">
                <a className="button" href="#menu">
                  Explore Menu
                </a>
              </div>
            </div>
          </div>
          <div className="element-50">
            <SliderComponent />
          </div>
        </div>
      </div>
    </HeroWrapper>
  );
}
