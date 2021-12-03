import { Grid } from "@material-ui/core";
import DoshboardChart from "../../assets/svg/statics-chart.svg";
import Carousel from "react-material-ui-carousel";
import SlideFirst from "../../assets/svg/slide1.svg";
import Slidesecond from "../../assets/svg/slide2.svg";
import Objectives from "../Objectives";
import Methodology from "../Methodology";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

export interface StaticDashboardProps {
  onActionClick: () => void;
}
const StaticDashboard: React.FC<StaticDashboardProps> = (props) => {
  return (
    <CarouselProvider
      naturalSlideWidth={100}
      naturalSlideHeight={125}
      totalSlides={2}
      isPlaying={true}
      playDirection={"forward"}
      interval={10000}
    >
      <Slider>
        <Slide index={0}>
          <Objectives />
        </Slide>
        <Slide index={1}>
          <Methodology />
        </Slide>
      </Slider>
      <div className="slide-navigation">
        <ButtonBack className="nav_button">&nbsp;</ButtonBack>
        <ButtonNext className="nav_button">&nbsp;</ButtonNext>
      </div>
    </CarouselProvider>
  );
};

export default StaticDashboard;
