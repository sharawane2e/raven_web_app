import { Backdrop, CircularProgress } from "@material-ui/core";
import React from "react";
import LoadingOverlay from "react-loading-overlay-ts";
import { Subtract } from "utility-types";

export interface WithLoaderProps {
  startLoading: (loadingText?: string, fullLoader?: boolean) => void;
  stopLoading: () => void;
}

function withLoader<T extends WithLoaderProps>(
  Component: React.ComponentType<T>
) {
  return class extends React.Component<Subtract<T, WithLoaderProps>> {
    state = { loading: false, loadingText: "Please wait", fullLoader: false };

    startLoading = (loadingText = "", fullLoader = false) => {
      this.setState({
        loading: true,
        loadingText: loadingText ? loadingText : this.state.loadingText,
        fullLoader,
      });
    };
    stopLoading = () => {
      this.setState({ loading: false });
    };

    render() {
      return this.state.fullLoader ? (
        <>
          <Backdrop open={this.state.loading} className="full-loader">
            <CircularProgress color="inherit" />
          </Backdrop>

          <Component
            {...(this.props as T)}
            startLoading={this.startLoading}
            stopLoading={this.stopLoading}
          />
        </>
      ) : (
        <LoadingOverlay
          active={this.state.loading}
          spinner
          text={this.state.loadingText}
        >
          <Component
            {...(this.props as T)}
            startLoading={this.startLoading}
            stopLoading={this.stopLoading}
          />
        </LoadingOverlay>
      );
    }
  };
}

export default withLoader;
