export default function () {
  window.baseUrl = location.origin;
  window.initPost = {
    allReplyUsers: [],
    content_rendered: "",
    createDate: "",
    fr: "",
    replyList: [],
    nestedReplies: [],
    username: '',
    member: {},
    node: {},
    headerTemplate: '',
    title: '',
    id: '',
    type: 'post',
    once: '',
    replyCount: 0,
    clickCount: 0,
    thankCount: 0,
    collectCount: 0,
    lastReadFloor: 0,
    isFavorite: false,
    isIgnore: false,
    isThanked: false,
    isReport: false
  };
  window.win = function () {
    return window;
  };
  window.isMobile = (() => {
    let flag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return flag;
  })()
  window.isLogin = (() => {
    let top2 = $('#site-header #site-header-menu #menu-body .top:nth-child(2)')
    if (top2 && top2.textContent !== '注册') {
      return true
    }
    return false
  })()
  window.win().doc = window.win().document;
  window.win().query = (v) => window.win().document.querySelector(v);
  window.query = (v) => window.win().document.querySelector(v);
  window.clone = (val) => JSON.parse(JSON.stringify(val));
  window.user = {
    tagPrefix: '--用户标签--',
    tags: {},
    tagsId: '',
    username: '',
    avatar: '',
    readPrefix: '--已读楼层--',
    readNoteItemId: '',
    readList: {}
  };
  window.pageType = undefined;
  window.pageData = {pageNo: 1};
  window.config = {
    showToolbar: true,
    showPreviewBtn: true,
    autoOpenDetail: true,
    openTag: true,
    clickPostItemOpenDetail: true,
    closePostDetailBySpace: true,
    contentAutoCollapse: true,
    viewType: 'table',
    commentDisplayType: 0,
    newTabOpen: false,
    base64: true,
    sov2ex: false,
    postWidth: '',
    showTopReply: true,
    topReplyLoveMinCount: 3,
    topReplyCount: 3,
    autoJumpLastReadFloor: false,
    rememberLastReadFloor: true,
    autoSignin: true,
    customBgColor: '',
    version: 1,
    collectBrowserNotice: false
  };
  window.isNight = $('.Night').length === 1;
  window.cb = null;
  window.postList = [];
  window.parse = {
    //解析帖子内容
    async parsePostContent(post, body, htmlText) {
      let once = htmlText.match(/var once = "([\d]+)";/);
      // console.log(once)
      if (once && once[1]) {
        post.once = once[1];
      }
      post.isReport = htmlText.includes('你已对本主题进行了报告');
      if (window.isMobile) {
        let Wrapper = body.filter('#Wrapper')
        if (!post.title || !post.content_rendered) {
          let aName = Wrapper.find('.header small.gray a:nth-child(1)');
          if (aName.length) {
            post.member.username = aName[0].innerText;
          }
        }
      }else {
        if (!post.title || !post.content_rendered) {
          let main = body.find('#Main');
          let aName = main.find('.header small.gray a:nth-child(1)');
          if (aName.length) {
            post.member.username = aName[0].innerText;
          }
        }
      }

      let topic_buttons = body.find('.topic_buttons');
      if (topic_buttons.length) {
        let favoriteNode = topic_buttons.find('.tb:first');
        if (favoriteNode.length) {
          post.isFavorite = favoriteNode[0].innerText === '取消收藏';
        }
        let ignoreNode = topic_buttons.find('.tb:nth-child(3)');
        if (ignoreNode.length) {
          post.isIgnore = ignoreNode[0].innerText === '取消忽略';
        }
        //
        let thankNode = topic_buttons.find('#topic_thank .tb');
        if (!thankNode.length) {
          post.isThanked = true;
        }
        let topic_stats = topic_buttons.find('.topic_stats');
        //topic_stats = $(`<div class="fr topic_stats" style="padding-top: 4px;">9569 次点击 &nbsp;∙&nbsp; 28 人收藏 &nbsp; ∙&nbsp; 1 人感谢 &nbsp; </div>`)
        //收藏数、感谢数
        if (topic_stats.length) {
          let text = topic_stats[0].innerText;
          let reg1 = text.matchAll(/([\d]+)[\s]*人收藏/g);
          let collectCountReg = [...reg1];
          if (collectCountReg.length) {
            post.collectCount = Number(collectCountReg[0][1]);
          }
          reg1 = text.matchAll(/([\d]+)[\s]*likes/g);
          collectCountReg = [...reg1];
          if (collectCountReg.length) {
            post.collectCount = Number(collectCountReg[0][1]);
          }
          // console.log([...collectCountReg])
          let reg2 = text.matchAll(/([\d]+)[\s]*人感谢/g);
          let thankCountReg = [...reg2];
          if (thankCountReg.length) {
            post.thankCount = Number(thankCountReg[0][1]);
          }
          let reg3 = text.matchAll(/([\d]+)[\s]*次点击/g);
          let clickCountReg = [...reg3];
          if (clickCountReg.length) {
            post.clickCount = Number(clickCountReg[0][1]);
          }
          reg3 = text.matchAll(/([\d]+)[\s]*views/g);
          clickCountReg = [...reg3];
          if (clickCountReg.length) {
            post.clickCount = Number(clickCountReg[0][1]);
          }
          // console.log([...thankCountReg])
        }
      }
      // console.log('基本信息', post)
      let header = body.find('#Main .box').first();
      let temp = header.clone();
      temp.find('.topic_buttons').remove();
      let html = temp.html();
      html = this.checkPhotoLink2Img(html);
      // console.log('html', html)
      post.headerTemplate = html;
      return post;
    },
    //获取帖子所有回复
    async getPostAllReplies(post, body, htmlText, pageNo = 1) {
      var _a, _b;
      if (body.find('#no-comments-yet').length) {
        return post;
      }

      let boxs;
      let replyBox
      if (window.isMobile) {
        boxs = body.filter('#Wrapper').find('.content .box')
        if (boxs.length >= 3) replyBox = boxs[2]
        else replyBox = boxs[1]
      } else {
        boxs = body.find('#Main > .box')
        replyBox = boxs[1]
      }
      let cells = replyBox.querySelectorAll('.cell');
      cells = Array.from(cells);

      if (window.isMobile) {
        post.fr = boxs[1].querySelector('.inner').innerHTML;
      } else {
        if (cells.length) {
          post.fr = cells[0].querySelector('.cell .fr').innerHTML;
        }
      }

      //获取创建时间
      let snow = cells[0].querySelector('.snow');
      post.createDate = snow?.nextSibling?.nodeValue?.trim() || ''

      let repliesMap = [];
      if (cells[1].id) {
        repliesMap.push({i: pageNo, replyList: this.parsePageReplies(cells.slice(1))});
        let replyList = this.getAllReply(repliesMap);
        post.replyList = replyList;
        post.replyCount = replyList.length;
        post.allReplyUsers = Array.from(new Set(replyList.map((v) => v.username)));
        let nestedList = this.createNestedList(replyList, post.allReplyUsers);
        if (nestedList) post.nestedReplies = nestedList;
        return post;
      } else {
        let promiseList = [];
        // console.log(this.current.repliesMap)
        return new Promise((resolve, reject) => {
          repliesMap.push({i: pageNo, replyList: this.parsePageReplies(cells.slice(2, cells.length - 1))});
          let pages = cells[1].querySelectorAll('a');
          pages = Array.from(pages);
          // console.log(pages)
          let url = window.baseUrl + '/t/' + post.id;
          for (let i = 0; i < pages.length; i++) {
            let currentPageNo = Number(pages[i].innerText);
            if (currentPageNo == pageNo)
              continue;
            promiseList.push(this.fetchPostOtherPageReplies(url + '?p=' + currentPageNo, currentPageNo));
          }
          Promise.allSettled(promiseList).then((results) => {
            // @ts-ignore
            results.filter((result) => result.status === "fulfilled").map(v => repliesMap.push(v.value));
            let replyList = this.getAllReply(repliesMap);
            post.replyList = replyList;
            post.replyCount = replyList.length;
            post.allReplyUsers = Array.from(new Set(replyList.map((v) => v.username)));
            let nestedList = this.createNestedList(replyList, post.allReplyUsers);
            if (nestedList)
              post.nestedReplies = nestedList;
            resolve(post);
          });
        });
      }
    },
    //请求帖子其他页的回复
    fetchPostOtherPageReplies(href, pageNo) {
      return new Promise(resolve => {
        $.get(href).then(res => {
          let s = res.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
          let box = $(s[0]).find('#Main .box')[1];
          let cells = box.querySelectorAll('.cell');
          cells = Array.from(cells);
          resolve({i: pageNo, replyList: this.parsePageReplies(cells.slice(2, cells.length - 1))});
        }).catch((r) => {
          if (r.status === 403) {
            cbChecker({type: 'restorePost', value: null});
          }
        });
      });
    },
    //解析页面的回复
    parsePageReplies(nodes) {
      let replyList = [];
      nodes.forEach((node, index) => {
        if (!node.id)
          return;
        let item = {
          level: 0,
          thankCount: 0,
          isThanked: false,
          isOp: false,
          id: node.id.replace('r_', '')
        };
        let reply_content = node.querySelector('.reply_content');
        // console.log('reply_content',reply_content)
        item.reply_content = this.checkPhotoLink2Img(reply_content.innerHTML);
        item.reply_text = reply_content.textContent;
        let {users, floor} = this.parseReplyContent(item.reply_content);
        item.replyUsers = users;
        item.replyFloor = floor;
        let ago = node.querySelector(window.isMobile ? '.fade' : '.ago');
        item.date = ago.textContent;
        let userNode = node.querySelector('strong a');
        item.username = userNode.textContent;
        let avatar = node.querySelector('td img');
        // @ts-ignore
        item.avatar = avatar.src;
        let no = node.querySelector('.no');
        item.floor = Number(no.textContent);
        let thank_area = node.querySelector('.thank_area');
        if (thank_area) {
          item.isThanked = thank_area.classList.contains('thanked');
        }
        let small = node.querySelector('.small');
        if (small) {
          item.thankCount = Number(small.textContent);
        }
        let op = node.querySelector('.op');
        if (op) {
          item.isOp = true;
        }
        let mod = node.querySelector('.mod');
        if (mod) {
          item.isMod = true;
        }
        // console.log('item', item)
        replyList.push(item);
      });
      return replyList;
    },
    //解析回复内容，解析出@用户，回复楼层。用于后续生成嵌套楼层
    parseReplyContent(str) {
      if (!str)
        return;
      let users = [];
      let getUsername = (userStr) => {
        let endIndex = userStr.indexOf('">');
        if (endIndex > -1) {
          let user = userStr.substring(0, endIndex);
          if (!users.find((i) => i === user)) {
            users.push(user);
          }
        }
      };
      // str = `@<a hr a> #4 @<a1 href="/member/Eiden1">Eiden1</a1>   @<a href="/member/Eiden111">Eiden21</a> #11   这也是执行阶段，所谓的安装也是程序业务的 setup 。<br>windows 、Android 并没有系统级的 CD-KEY 。`
      let userReg = /@<a href="\/member\/([\s\S]+?)<\/a>/g;
      let has = str.matchAll(userReg);
      let res2 = [...has];
      // console.log('总匹配', res2)
      if (res2.length > 1) {
        res2.map(item => {
          getUsername(item[1]);
        });
      }
      if (res2.length === 1) {
        getUsername(res2[0][1]);
      }
      // console.log('用户', users)
      // console.log('楼层', floor)
      let floor = -1;
      //只有@一个人的时候才去查找是否指定楼层号。
      if (users.length === 1) {
        let floorReg = /@<a href="\/member\/[\s\S]+?<\/a>[\s]+#([\d]+)/g;
        let hasFloor = str.matchAll(floorReg);
        let res = [...hasFloor];
        // console.log('总匹配', res)
        if (res.length) {
          floor = Number(res[0][1]);
        }
      }
      return {users, floor};
    },
    //获取帖子详情
    async getPostDetail(post, body, htmlText, pageNo = 1) {
      post = await this.parsePostContent(post, body, htmlText);
      return await this.getPostAllReplies(post, body, htmlText, pageNo);
    },
    getAllReply(repliesMap = []) {
      return repliesMap.sort((a, b) => a.i - b.i).reduce((pre, i) => {
        pre = pre.concat(i.replyList);
        return pre;
      }, []);
    },
    //生成嵌套回复
    createNestedList(allList = []) {
      if (!allList.length)
        return [];
      if ((Date.now() - window.win().lastCallDate) < 1000) {
        // console.log('短时间内，重复调用,因为监听了replies,所以打开时会触发两次。第二次不管他')
        return false;
      }
      // console.log('cal-createNestedList', Date.now())
      let list = window.clone(allList);
      let nestedList = [];
      list.map((item, index) => {
        let startList = list.slice(0, index);
        //用于918489这种情况，@不存在的人
        let startReplyUsers = Array.from(new Set(startList.map((v) => v.username)));
        let endList = list.slice(index + 1);
        if (index === 0) {
          nestedList.push(this.findChildren(item, endList, list));
        } else {
          if (!item.isUse) {
            //是否是一级回复
            let isOneLevelReply = false;
            if (item.replyUsers.length) {
              if (item.replyUsers.length > 1) {
                isOneLevelReply = true;
              } else {
                isOneLevelReply = !startReplyUsers.find(v => v === item.replyUsers[0]);
              }
            } else {
              isOneLevelReply = true;
            }
            if (isOneLevelReply) {
              item.level === 0;
              nestedList.push(this.findChildren(item, endList, list));
            }
          }
        }
      });
      // console.log('replies长度', allList)
      // console.log('nestedList长度', nestedList)
      window.win().lastCallDate = Date.now();
      return nestedList;
    },
    //查找子回复
    findChildren(item, endList, all) {
      var _a;
      const fn = (child, endList2, parent) => {
        child.level = parent.level + 1;
        let rIndex = all.findIndex(v => v.floor === child.floor);
        if (rIndex > -1) {
          all[rIndex].isUse = true;
        }
        parent.children.push(this.findChildren(child, endList2, all));
      };
      // console.log('endList', endList)
      item.children = [];
      // if (item.floor === 46) debugger
      let floorReplyList = [];
      //先找到指定楼层的回复，再去循环查找子回复
      //原因：问题930155，有图
      for (let i = 0; i < endList.length; i++) {
        let currentItem = endList[i];
        //如果已被使用，直接跳过
        if (currentItem.isUse)
          continue;
        if (currentItem.replyFloor === item.floor) {
          //必须楼层对应的名字和@人的名字相同。因为经常出现不相同的情况
          if (currentItem.replyUsers.length === 1 && currentItem.replyUsers[0] === item.username) {
            //先标记为使用，不然遇到“问题930155”，会出现重复回复
            currentItem.isUse = true;
            floorReplyList.push({endList: endList.slice(i + 1), currentItem});
            //问题930155：这里不能直接找子级，如果item为A，currentItem为B，但随后A又回复了B，然后C回复A。这样直接找子级就会把C归类到B的子回复，而不是直接A的子回复
            //截图：930155.png
            // fn(currentItem, endList.slice(i + 1), item)
          } else {
            currentItem.isWrong = true;
          }
        }
      }
      //从后往前找
      //原因：问题933080，有图
      floorReplyList.reverse().map(({currentItem, endList}) => {
        fn(currentItem, endList, item);
      });
      //下一个我的下标，如果有下一个我，那么当前item的子回复应在当前和下个我的区间内查找
      let nextMeIndex = endList.findIndex(v => {
        var _a;
        //必须是下一个不是”自己回复自己“的自己
        //原因：问题887644（1-2），有图
        return (v.username === item.username) && (((_a = v.replyUsers) === null || _a === void 0 ? void 0 : _a[0]) !== item.username);
      });
      let findList = nextMeIndex > -1 ? endList.slice(0, nextMeIndex) : endList;
      for (let i = 0; i < findList.length; i++) {
        let currentItem = findList[i];
        //如果已被使用，直接跳过
        if (currentItem.isUse)
          continue;
        if (currentItem.replyUsers.length === 1) {
          //如果这条数据指定了楼层，并且名字也能匹配上，那么直接忽略
          //原因：问题887644-3，有图
          if (currentItem.replyFloor !== -1) {
            if (((_a = all[currentItem.replyFloor - 1]) === null || _a === void 0 ? void 0 : _a.username) === currentItem.replyUsers[0]) {
              continue;
            }
          }
          let endList2 = endList.slice(i + 1);
          //如果是下一条是同一人的回复，那么跳出循环
          if (currentItem.username === item.username) {
            //自己回复自己的特殊情况
            if (currentItem.replyUsers[0] === item.username) {
              fn(currentItem, endList2, item);
            }
            break;
          } else {
            if (currentItem.replyUsers[0] === item.username) {
              fn(currentItem, endList2, item);
            }
          }
        } else {
          //下一条是同一人的回复，并且均未@人。直接跳过
          if (currentItem.username === item.username)
            break;
        }
      }
      //排序，因为指定楼层时，是从后往前找的
      item.children = item.children.sort((a, b) => a.floor - b.floor);
      return item;
    },
    //解析页面帖子列表
    parsePagePostList(list, box) {
      list.forEach(itemDom => {
        let item = window.clone(window.initPost);
        let item_title = itemDom.querySelector('.item_title a');
        let {href, id} = window.parse.parseA(item_title);
        item.id = id;
        item.href = href;
        item.url = location.origin + '/api/topics/show.json?id=' + item.id;
        itemDom.classList.add('post-item');
        itemDom.classList.add(`id_${id}`);
        itemDom.dataset['href'] = href;
        itemDom.dataset['id'] = id;
        window.postList.push(item);
      });
      Promise.allSettled(window.postList.map(item => $.get(item.url))).then(res => {
        let ok = res.filter((r) => r.status === "fulfilled").map((v) => v.value[0]);
        // let fail = res.filter((r) => r.status === "rejected")
        box.style.boxShadow = 'unset';
        box.style.background = 'unset';
        if (window.config.viewType === 'card') {
          list.forEach(itemDom => itemDom.classList.add('preview'));
        }
        ok.map(postItem => {
          if (postItem === null || postItem === void 0 ? void 0 : postItem.id) {
            let itemDom = box.querySelector(`.id_${postItem.id}`);
            if (window.config.showPreviewBtn) {
              //添加切换按钮
              let td = itemDom.querySelector('td:nth-child(4)');
              td.style.position = 'relative';
              let toggle = document.createElement('div');
              toggle.dataset['id'] = postItem.id;
              toggle.classList.add('toggle');
              toggle.innerText = '点击展开/收起';
              td.append(toggle);
            }
            let index = window.postList.findIndex(v => v.id == postItem.id);
            if (index > -1) {
              let obj = window.postList[index];
              window.postList[index] = Object.assign({}, obj, postItem);
              if (postItem.content_rendered) {
                let a = document.createElement('a');
                a.href = obj.href;
                a.classList.add('post-content');
                let div = document.createElement('div');
                div.innerHTML = postItem.content_rendered;
                a.append(div);
                // console.log(div.clientHeight)
                itemDom.append(a);
              }
            }
          }
        });
        cbChecker({type: 'syncData'});
      });
    },
    parseA(a) {
      let href = a.href;
      let id;
      if (href.includes('/t/')) {
        id = href.substring(href.indexOf('/t/') + 3, href.indexOf('/t/') + 9);
      }
      return {href, id, title: a.innerText};
    },
    //创建记事本子条目
    async createNoteItem(itemName) {
      return new Promise(async (resolve) => {
        let data = new FormData();
        data.append('content', itemName);
        data.append('parent_id', 0);
        data.append('syntax', 0);
        let apiRes = await window.win().fetch(`${window.baseUrl}/notes/new`, {method: 'post', body: data});
        console.log(apiRes);
        if (apiRes.redirected && apiRes.status === 200) {
          resolve(apiRes.url.substr(-5));
          return;
        }
        resolve(null);
      });
    },
    //编辑记事本子条目
    async editNoteItem(val, id) {
      let data = new FormData();
      data.append('content', val);
      data.append('syntax', 0);
      let apiRes = await window.fetch(`${window.baseUrl}/notes/edit/${id}`, {
        method: 'post', body: data
      });
      return apiRes.redirected && apiRes.status === 200;
    },
    //标签操作
    async saveTags(val) {
      return await this.editNoteItem(window.user.tagPrefix + JSON.stringify(val), window.user.tagsId);
    },
    //已读楼层操作
    async saveReadList(val) {
      return await this.editNoteItem(window.user.readPrefix + JSON.stringify(val), window.user.readNoteItemId);
    },
    //图片链接转Img标签
    checkPhotoLink2Img(str) {
      if (!str)
        return;
      try {
        let imgWebs = [
          /<a((?!<a).)*href="https?:\/\/((?!<a).)*imgur.com((?!<a).)*>(((?!<a).)*)<\/a>/g,
          /<a((?!<a).)*href="https?:\/\/((?!<a).)*\.(gif|png|jpg|jpeg|GIF|PNG|JPG|JPEG)((?!<a).)*>(((?!<a).)*)<\/a>/g,
        ];
        imgWebs.map((v, i) => {
          let has = str.matchAll(v);
          let res2 = [...has];
          // console.log('总匹配', res2)
          res2.map(r => {
            let p = i === 0 ? r[4] : r[5];
            if (p) {
              let link = p.toLowerCase();
              let src = p;
              if (link.includes('.png') ||
                link.includes('.jpg') ||
                link.includes('.jpeg') ||
                link.includes('.gif')) {
              } else {
                src = p + '.png';
              }
              str = str.replace(r[0], `<img src="${src}" data-originUrl="${p}" data-notice="这个img标签由v2ex-超级增强脚本解析" style="max-width: 100%">`);
            }
          });
        });
      } catch (e) {
        console.log('正则解析html里面的a标签的图片链接出错了');
      }
      return str;
    }
  };
}