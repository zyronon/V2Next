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