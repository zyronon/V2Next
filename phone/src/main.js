import core from "../../core.js";

core()
let Channel = {
  postMessage: (val) => {
    if (typeof val === "object") {
      return console.log(JSON.stringify(val))
    }
    console.log(val)
  }
}
$(window.win().doc).on('click', 'a', async (e) => {
  let {href, id, title} = window.parse.parseA(e.currentTarget);
  if (id) {
    e.preventDefault();
    Channel.postMessage(id);
    Channel.postMessage('开始请求');
    let url = window.baseUrl + '/t/' + id;
    let apiRes = await window.fetch(url + '?p=1');
    let htmlText = await apiRes.text();
    let bodyText = htmlText.match(/<body[^>]*>([\s\S]+?)<\/body>/g)
    let body = $(bodyText[0])
    let post = window.clone(window.initPost)
    post = await window.parse.getPostDetail(post, body, htmlText)

    console.log(post)
    // Channel.postMessage('页面内容' + htmlText);
    Channel.postMessage('帖子内容' + post);

    // $.post(url, {content: 'submit_content', once: 'post.value.once'}).then();
    return false;
  }
});