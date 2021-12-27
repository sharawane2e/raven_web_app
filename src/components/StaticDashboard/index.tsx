import Objectives from "../Objectives";
import Methodology from "../Methodology";

import {
  CarouselProvider,
  Slider,
  Slide,
  Dot,
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
      interval={5000}
    >

   
      <Slider>
        <Slide className="slide" index={0}>
          <Objectives />
        </Slide>
        <Slide className="slide" index={1}>
          <Methodology />
        </Slide>
      </Slider>
      <div className="dot-group">

      <Dot slide={0} />
      <Dot slide={1} />
      </div>
      
    </CarouselProvider>
  );
};


export default StaticDashboard;
