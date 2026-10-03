import "react";

declare module "react" {
  interface CSSProperties {
    /** Custom properties, e.g. `--d` for a stagger delay or `--cols` for a grid template. */
    [property: `--${string}`]: string | undefined;
  }
}
