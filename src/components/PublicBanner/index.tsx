import DesignTopShape from "../../components/PublicBanner/designShape";
const PublicBanner: React.FC = () => {
  return (
    <div className="public-banner">
      <div className="public-banner__shape"><DesignTopShape /></div>
      <div className="public-banner__title">
        <span>HFS</span>
        <br />
        <span>OneOffice Pulse</span>
        <div className="public-banner__title__logstext">
            Don't just react to demand. Anticipate it
        </div>
      </div>
    </div>
  );
};

export default PublicBanner;
