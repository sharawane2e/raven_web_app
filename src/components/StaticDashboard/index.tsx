import Objectives from "../Objectives";
import Methodology from "../Methodology";
// import backgroundWithMethodology from "../../assets/images/backgroun_+_methodiology.png"

import {
  CarouselProvider,
  Slider,
  Slide,
  Dot,
  Image
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import BackgroundMethodology from "../BackgroundMethodology";
import BusinessObjective from "../BusinessObjective";

export interface StaticDashboardProps {
  onActionClick: () => void;
}
const StaticDashboard: React.FC<StaticDashboardProps> = (props) => {
  return (

    <div>
       {/* <img className="wid100" src={backgroundWithMethodology} /> */}
       {/* <BackgroundMethodology /> */}
       <BusinessObjective />
    </div>
    // <CarouselProvider
    //   naturalSlideWidth={100}
    //   naturalSlideHeight={125}
    //   totalSlides={1}
    //   isPlaying={true}
    //   playDirection={"forward"}
    //   interval={5000}
    // >

   
    //   <Slider>
    //      <Slide className="slide" index={1}>
    //      <img src={backgroundWithMethodology} />
    //     {/* <Image hasMasterSpinner src={backgroundWithMethodology} /> */}
    //     </Slide>
    //     {/* <Slide className="slide" index={0}>
    //       <Objectives />
    //     </Slide> */}
    //     {/* <Slide className="slide" index={1}>
    //       <Methodology />
    //     </Slide> */}
    //   </Slider>
    //   {/* <div className="dot-group"> */}

    //   {/* <Dot slide={0} />
    //   <Dot slide={1} /> */}
    //   {/* </div> */}
      
    // </CarouselProvider>
  );
};


export default StaticDashboard;
