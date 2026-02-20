import type { LinkDescriptor } from "react-router";

export declare namespace Route {
  type LinksFunction = () => LinkDescriptor[];
  interface ErrorBoundaryProps {
    error: unknown;
  }
}
