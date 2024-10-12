import pinia from "pinia"

declare module "pinia" {
  export interface PiniaCustomProperties {
    $router: Router
  }
}
