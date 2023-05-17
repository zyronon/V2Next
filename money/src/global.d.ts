import {Post} from "./types"

declare global {
  interface Window {
    initPost: Post,
    user: any,
    baseUrl: string,
    pageData: any,
    config: any,
    isNight: boolean,
    canParseV2exPage: boolean,
    pageType: string,

    clone(val: any): any

    postList: any[]

    parse: any
    cb: any

    win: any
    query: any
  }

  interface String {
    prependHello(): string;
  }
}

export {}
