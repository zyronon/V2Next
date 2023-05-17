import {Config, PageType, Post} from "./types"

declare global {
  interface Window {
    initPost: Post,
    user: any,
    baseUrl: string,
    pageData: any,
    config: Config,
    isNight: boolean,
    canParseV2exPage: boolean,
    pageType?: PageType,

    clone(val: any): any

    postList: any[]

    parse: any
    cb: any

    win: any
    query: any
  }
}

export {}
