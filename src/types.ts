export interface Post {
  replyList: any[],
  nestedReplies: any[],
  nestedRedundReplies: any[],
  allReplyUsers: any[],
  username: string,
  member: any,
  node: any,
  headerTemplate: string,
  content_rendered: string,
  title: string,
  fr: string,
  id: string,
  createDate: string,
  type: string,
  once: string,
  replyCount: number,
  clickCount: number,
  thankCount: number,
  collectCount: number,
  isFavorite: boolean,
  isIgnore: boolean,
  isThanked: boolean,
  isReport: boolean,
  lastReadFloor: number
}

export interface User {

}

export interface Config {
  showToolbar: boolean,
  showPreviewBtn: boolean,
  autoOpenDetail: boolean,
  openTag: boolean,//给用户打标签
  clickPostItemOpenDetail: boolean,
  closePostDetailBySpace: boolean,//点击空白处关闭详情
  contentAutoCollapse: boolean,//正文超长自动折叠
  viewType: string,
  commentDisplayType: number,
  newTabOpen: boolean,//新标签打开
  base64: boolean,//base功能
  sov2ex: boolean,
  showTopReply: boolean,//显示高赞
  topReplyLoveMinCount: number,//高赞，统计最小限制
  topReplyCount: number,//高赞数量
  postWidth?: string,
  rememberLastReadFloor: boolean// 记录上次阅读楼层
  autoJumpLastReadFloor: boolean//自动跳转到上次阅读楼层
  autoSignin: boolean,
  customBgColor: string
  version: number
  collectBrowserNotice: boolean// 收藏时，浏览器提醒
}

export enum PageType {
  Home = "Home",
  Node = "Node",
  Post = "Post",
}

export interface Reply {
  level: number,
  thankCount: number,
  isThanked: boolean,
  isOp: boolean,
  isMod: boolean,
  id: string,
  reply_content: string,
  hideCallUserReplyContent: string,
  reply_text: string,
  replyUsers: any
  replyFloor: undefined
  date: string
  username: string
  avatar: string
  floor: number

}