import { ComponentType } from "react";

export interface CustomSkeletonProps {
  loading: boolean;
  loaderSkeleton: ComponentType | undefined;
  skeletonCount?: number;
}

const CustomSkeleton: React.FC<CustomSkeletonProps> = (props) => {
  const {
    loading,
    children,
    loaderSkeleton: LoaderSekelton,
    skeletonCount = 1,
  } = props;
  // debugger;
  let Loader: ComponentType[] | null = [];
  if (LoaderSekelton) {
    for (let index = 0; index < skeletonCount; index++) {
      //@ts-ignore
      Loader.push(<LoaderSekelton />);
    }
  } else {
    Loader = null;
  }

  return <div>{loading ? Loader : children}</div>;
};

export default CustomSkeleton;
