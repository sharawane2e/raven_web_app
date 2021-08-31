export interface PageNotFoundScreenProps {}

const PageNotFoundScreen: React.FC = () => {
  return (
    <div className="not-found">
      <h1>Requested URL is not found</h1>
    </div>
  );
};

export default PageNotFoundScreen;
