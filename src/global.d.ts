import {Config, PageType, Post} from "./types"

declare global {
  interface Window {
    initPost: Post,
    user: any,
    targetUserName: string,//目标用户名字（用于在member界面添加标签）
    baseUrl: string,
    pageData: any,
    config: Config,
    currentVersion:number,
    isNight: boolean,
    canParseV2exPage: boolean,
    pageType?: PageType,
    clone: (val: any) => any
    postList: any[]
    parse: {
      parsePostContent: Function,
      getPostAllReplies: Function,
      fetchPostOtherPageReplies: Function,
      parsePageReplies: Function,
      parseReplyContent: Function,
      getPostDetail: Function,
      getAllReply: Function,
      createNestedList: Function,
      createNestedRedundantList: Function,
      findChildren: Function,
      parsePagePostList: Function,
      parseA: Function,
      createNoteItem: Function,
      editNoteItem: Function,
      saveTags: Function,
      saveReadList: Function,
      saveImgurList: Function,
      checkPhotoLink2Img: Function,
      checkPostReplies: Promise,
      openNewTab: Function,
    }
    cb: any
    win: any
    query: any
    stopMe: boolean
  }
}

export {}
