import DesignTopShape from "../../components/PublicBanner/designShape";
const PublicBanner: React.FC = () => {
  return (
    <div className="public-banner">
      <div className="public-banner__title">
        <h1 className="public-banner__title__heading">
        <span className="brandColor">Dashboards</span> for
          <br />
        inquisitive minds
        </h1>
        {/*<div className="public-banner__title__logstext">
          Don't just react to demand. Anticipate it
          </div>*/}
      </div>
    </div>
  );
};

export default PublicBanner;
