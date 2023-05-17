export interface Post {
  replyList: any[],
  nestedReplies: any[],
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
  showTopReply: boolean,
  postWidth?: string,
}

export enum PageType {
  Home = "Home",
  Node = "Node",
  Post = "Post",
}

export interface Reply {
  thankCount: number,
  isThanked: boolean,
  isOp: boolean,
  isMod: boolean,
  id: string,
  reply_content: string,
  reply_text: string,
  replyUsers: any
  replyFloor: undefined
  date: string
  username: string
  avatar: string
  floor: number

}