import {SponImage} from "@/components/common";
import { Components } from "@/components/frontend";

import './hero.scss'


export default function HeroHome(): JSX.Element {
  return (
    <section id="home" className="min-h-screen py-16">
      <div className="container">
        <div className="row">
          <div className="element-50 hero-text pb-16 xl:pb-0">
            <div className="tex-left">
              <span>#Gericht</span>
              <span>#Bar</span>
            </div>
            <div className="text-central">
              <h3 className="text-white">Chase the new Flavour</h3>
              <SponImage justify="start" />
              <h1 className="text-golden">The key to Fine dining</h1>
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
            <Components.slider.HomeSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
