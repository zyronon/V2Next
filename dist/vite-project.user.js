// ==UserScript==
// @name         V2EX - 超级增强
// @namespace    http://tampermonkey.net/
// @version      6.5
// @author       zyronon
// @description  楼中楼回复(支持感谢数排序)、简洁模式、自动签到、快捷回复图片和表情、列表预览内容、点击帖子弹框展示详情、对用户打标签、回复上下文、记录上次阅读位置、自定义背景、使用 SOV2EX 搜索、正文超长自动折叠、划词 base64 解码、一键@所有人,@管理员、操作按钮(感谢、收藏、回复、隐藏)异步请求、支持黑暗模式
// @license      GPL License
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @downloadURL  https://github.com/zyronon/v2ex-script/raw/master/dist/vite-project.user.js
// @updateURL    https://github.com/zyronon/v2ex-script/raw/master/dist/vite-project.user.js
// @match        https://v2ex.com/
// @match        https://v2ex.com/?tab=*
// @match        https://v2ex.com/t/*
// @match        https://v2ex.com/recent*
// @match        https://v2ex.com/go/*
// @match        https://*.v2ex.com/
// @match        https://*.v2ex.com/?tab=*
// @match        https://*.v2ex.com/t/*
// @match        https://*.v2ex.com/recent*
// @match        https://*.v2ex.com/go/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.global.prod.js
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// ==/UserScript==

(t=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=t,document.head.append(e)})(' .v-enter-active,.v-leave-active{transition:opacity .3s ease}.v-enter-from,.v-leave-to{opacity:0}.username{font-weight:700;font-size:1.4rem;margin-right:1rem}.op{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;margin-right:1rem;transform:scale(.8)}.mod{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;transform:scale(.8);background:#1484cd;color:#fff;margin-right:1rem}.my-tag{font-size:1.4rem;color:red;margin-left:1rem}.my-tag:hover .remove{display:inline}.my-tag .remove{cursor:pointer;margin-left:.5rem;display:none}.floor{margin-left:1rem;font-size:1.2rem;line-height:1rem;border-radius:1rem;display:inline-block;background-color:#f0f0f0;color:#ccc;padding:.2rem .5rem;cursor:default}html,body{font-size:62.5%}.flex{display:flex;align-items:center;justify-content:space-between}.flex-end{justify-content:flex-end}.flex-center{justify-content:center}.p1{padding:1rem}.p0{padding:0!important}.post-author{display:flex;align-items:center;position:relative;color:#ccc!important}.post-author>.username{font-size:1.2rem}.sticky{position:sticky;bottom:0}.sticky[stuck]{box-shadow:0 2px 20px #00000059}a{color:#778087;text-decoration:none;cursor:pointer}a:hover{text-decoration:underline}.base-loading{border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle infinite 1s linear}.loading-c{border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle infinite 1s linear;width:3rem;height:3rem}.loading-b{border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle infinite 1s linear;border-color:#ffffff rgba(178,177,177,.2) rgba(178,177,177,.2) rgba(178,177,177,.2);width:3rem;height:3rem}@keyframes circle{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.button{cursor:pointer;padding:.4rem 2.4rem;border-radius:5px;display:inline-flex;justify-content:center;align-items:center;font-weight:700;font-size:1.2rem;color:#fff;background:#40a9ff;border:1px solid #40a9ff;user-select:none}.button:hover{opacity:.9}.button.info{color:#000;border:1px solid #40a9ff;background:white}.button.gray{color:#f5f5f5;border:1px solid #b6b6b6;background:#b6b6b6}.button.light{color:gray;border:1px solid #e2e2e2;background:#e2e2e2}.button:before{content:" ";border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle infinite 1s linear;border-color:#fff transparent transparent transparent;width:1rem;height:1rem;margin-right:1rem;display:none}.button.loading{cursor:not-allowed;opacity:.5}.button.loading:before{display:block}.button.disabled{cursor:not-allowed;color:#c6c6c6;background:#8d8d8d;border:1px solid transparent}.button.isNight{color:#c6c6c6;background:#2b4054;border:1px solid transparent}.tool{position:relative;margin-left:1rem;display:flex;align-items:center;font-size:1.2rem;font-weight:700;border-radius:.3rem;cursor:pointer;height:2.4rem;padding:0 .5rem}.tool:before{content:" ";border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle infinite 1s linear;border-color:transparent #929596 #929596 #929596;width:1rem;height:1rem;margin-left:1rem;display:none}.tool.loading{cursor:not-allowed;opacity:.5}.tool.loading:before{display:block}.tool.loading:hover{background:unset}.tool>svg{width:1.6rem!important;height:1.6rem!important;margin-right:.4rem;box-sizing:border-box;border-radius:.2rem}.tool:hover{background:#e8e8e8}.tool.no-hover{cursor:default}.tool.no-hover:hover{background:unset}.my-node{border-radius:.2rem;padding:.4rem;font-size:1rem;color:#999;background:#f5f5f5;cursor:pointer}.my-node:hover{text-decoration:none;background:#e2e2e2}.msgs{position:fixed;margin-left:calc(50% - 25rem);width:50rem;z-index:9999;bottom:0;left:0;right:0}.msg{cursor:default;margin-bottom:2rem;background:white;display:flex;color:#000;font-size:1.4rem;box-sizing:border-box;border-radius:.4rem;box-shadow:0 0 1rem 1px silver}.msg.success .left{background:#40a9ff}.msg.warning .left{background:#c8c002}.msg.error .left{background:red}.msg .left{border-radius:.4rem 0 0 .4rem;display:flex;align-items:center;background:#40a9ff}.msg .left svg{margin:0 .3rem;cursor:pointer}.msg .right{flex:1;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center}.line{border-bottom:1px solid #e2e2e2}.my-box{box-shadow:0 2px 3px #0000001a;border-radius:.4rem;background:white;margin-bottom:2rem;width:100%;overflow:hidden;box-sizing:border-box}.my-cell{padding:.6rem 1rem;font-size:1.4rem;line-height:150%;text-align:left;border-bottom:1px solid #e2e2e2}.f14{font-size:1.4rem}.switch{width:4.5rem;height:2rem;border-radius:2rem;position:relative;display:flex;align-items:center;transition:all .3s}.switch.light{border:1px solid #e2e2e2}.switch.light.active{background:#e2e2e2}.switch.light.active:before{right:.2rem;background:white}.switch.light:before{background:#e2e2e2}.switch.gray{border:1px solid #ccc}.switch.gray.active{background:#ccc}.switch.gray.active:before{right:.2rem;background:white}.switch.gray:before{background:#ccc}.switch.isNight{border:1px solid #31475e}.switch.isNight.active{background:#31475e}.switch.isNight.active:before{right:.2rem;background:gray}.switch.isNight:before{background:#31475e}.switch:before{position:absolute;content:" ";transition:all .3s;right:calc(100% - 2rem);width:1.8rem;height:1.8rem;border-radius:50%}.modal{position:fixed;z-index:100;width:100vw;height:100vh;left:0;top:0;display:flex;justify-content:center;align-items:center}.modal .title{font-size:2.4rem;margin-bottom:1rem;text-align:center}.modal .option{display:flex;justify-content:space-between;align-items:center;padding:.6rem 0}.modal .mask{position:fixed;width:100vw;height:100vh;left:0;top:0;background:rgba(0,0,0,.3)}.radio-group2{display:inline-flex;border-radius:.5rem;overflow:hidden;border:1px solid #e2e2e2}.radio-group2 .radio{cursor:pointer;background:transparent;padding:.3rem 1rem;border-left:1px solid #e2e2e2;color:#9ca1a4;font-size:1.2rem}.radio-group2 .radio:first-child{border-left:none}.radio-group2 .active{background:#e2e2e2;color:gray}.radio-group2.isNight{border:1px solid #454847}.radio-group2.isNight .radio{border-left:1px solid #454847;color:#fff}.radio-group2.isNight .active{background:#31475e}.pop-confirm{position:relative;display:inline-flex;justify-content:center}.tip{position:fixed;background:black;color:#fff;max-width:10rem;font-size:1.4rem;padding:.7rem 1rem;border-radius:.5rem;transform:translate(-50%);z-index:999}input{height:3rem;outline:unset;border:1px solid #e1e1e1;padding:0 .5rem;border-radius:5px;box-sizing:border-box}.isNight .wrapper[data-v-f67a59b5]{background:#22303f!important}.isNight .wrapper .title[data-v-f67a59b5],.isNight .wrapper .option-title[data-v-f67a59b5],.isNight .wrapper .option>span[data-v-f67a59b5]{color:#a9a9a9}.isNight .wrapper .notice[data-v-f67a59b5]{color:gray!important}.setting-modal .wrapper[data-v-f67a59b5]{z-index:9;background:#f1f1f1;border-radius:.8rem;font-size:1.4rem;padding:2rem;max-height:80vh;max-width:83vw;overflow:auto}.setting-modal .wrapper .sub-title[data-v-f67a59b5]{color:gray;font-size:1.4rem}.setting-modal .wrapper .option-title[data-v-f67a59b5]{text-align:start;font-size:1.6rem;font-weight:700;margin-top:1.5rem}.setting-modal .wrapper .body[data-v-f67a59b5]{display:flex;gap:3rem}.setting-modal .wrapper .body .option-list[data-v-f67a59b5]{width:50rem}.setting-modal .wrapper .notice[data-v-f67a59b5]{font-size:12px;padding-left:3rem;text-align:left}.setting-modal .wrapper .notice a[data-v-f67a59b5]{color:#00f}.pop-confirm-content[data-v-8df5d12b]{position:fixed;background:white;padding:1.5rem;box-shadow:0 0 12px #0003;border-radius:.4rem;transform:translate(-50%,calc(-100% - 1rem));z-index:999}.pop-confirm-content .text[data-v-8df5d12b]{color:#000;text-align:start;font-size:1.4rem;width:15rem;min-width:15rem}.pop-confirm-content .options[data-v-8df5d12b]{margin-top:1.5rem;display:flex;justify-content:flex-end;align-items:center;gap:1rem;font-size:1rem}.pop-confirm-content .options div[data-v-8df5d12b]{cursor:pointer}.pop-confirm-content .options .main[data-v-8df5d12b]{color:gray;background:#e2e2e2;padding:.3rem .8rem;border-radius:.2rem}.point[data-v-810a119b]{margin-left:1rem;font-size:1.2rem;min-width:4rem;border-radius:.4rem 0 0 .4rem;display:flex;align-items:center;flex-direction:row!important;padding:0!important}.point .up[data-v-810a119b]{display:flex;flex-direction:column;align-items:center;justify-content:center}.point .num[data-v-810a119b]{margin-left:.2rem;font-weight:700;color:#000;user-select:none}.point svg[data-v-810a119b]{width:2rem;padding:.4rem;border-radius:.2rem}.point svg[data-v-810a119b]:hover{background:#e5e5e5}.point svg.disabled[data-v-810a119b]{cursor:not-allowed}.point svg.disabled[data-v-810a119b]:hover{background:unset!important}.Author[data-v-9f527c77]{display:flex;align-items:center;justify-content:space-between;font-size:1.2rem;position:relative}.Author.expand[data-v-9f527c77]{margin-bottom:0}.Author .Author-left[data-v-9f527c77]{display:flex;align-items:center;max-width:90%}.Author .Author-left .username[data-v-9f527c77]{font-size:1.4rem;margin-right:1rem}.Author .Author-left .expand-icon[data-v-9f527c77]{cursor:pointer;margin-right:.8rem;width:2rem;height:2rem;transform:rotate(90deg)}.Author .Author-left .avatar[data-v-9f527c77]{margin-right:1rem;display:flex}.Author .Author-left .avatar img[data-v-9f527c77]{width:2.8rem;height:2.8rem;border-radius:.4rem}.Author .Author-left .texts[data-v-9f527c77]{flex:1}.Author .Author-left .op[data-v-9f527c77]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;margin-right:1rem;transform:scale(.8)}.Author .Author-left .dup[data-v-9f527c77]{display:inline-block;background-color:transparent;color:red;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid red;font-size:1.2rem;font-weight:700;margin-right:1rem;transform:scale(.8)}.Author .Author-left .mod[data-v-9f527c77]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;transform:scale(.8);background:#1484cd;color:#fff;margin-right:1rem}.Author .Author-left .my-tag[data-v-9f527c77]{font-size:1.4rem;color:red;margin-left:1rem}.Author .Author-left .my-tag:hover .remove[data-v-9f527c77]{display:inline}.Author .Author-left .my-tag .remove[data-v-9f527c77]{cursor:pointer;margin-left:.5rem;display:none}.Author .Author-left .add-tag[data-v-9f527c77]{font-size:2.5rem;transform:translateY(.2rem);line-height:1rem;display:inline-block;margin-left:1rem;cursor:pointer;display:none}.Author:hover .add-tag[data-v-9f527c77]{display:inline-block}.Author .Author-right[data-v-9f527c77]{position:absolute;right:0;display:flex;align-items:center}.Author .Author-right .toolbar[data-v-9f527c77]{display:flex;align-items:center;color:#929596;opacity:0}.Author .Author-right .toolbar[data-v-9f527c77]:hover{background:white;opacity:1}.Author .Author-right .floor[data-v-9f527c77]{margin-left:1rem;font-size:1.2rem;line-height:1rem;border-radius:1rem;display:inline-block;background-color:#f0f0f0;color:#ccc;padding:.2rem .5rem;cursor:default}.Author .Author-right .isDev[data-v-9f527c77]{color:#000!important}.post-editor-wrapper[data-v-5a28bd5d]{width:100%;box-sizing:border-box;position:relative;overflow:hidden;transition:all .3s}.post-editor-wrapper.reply-post .post-editor[data-v-5a28bd5d]{border:1px solid #e2e2e2;border-radius:.4rem}.post-editor-wrapper.reply-post.isFocus .post-editor[data-v-5a28bd5d]{border:1px solid #968b8b}.post-editor-wrapper.reply-comment[data-v-5a28bd5d]{border:1px solid #e2e2e2;border-radius:.4rem;overflow:hidden}.post-editor-wrapper.reply-comment.isFocus[data-v-5a28bd5d]{border:1px solid #968b8b}.post-editor-wrapper.reply-comment .toolbar[data-v-5a28bd5d]{background:#f6f7f8}.post-editor-wrapper .post-editor[data-v-5a28bd5d]{transition:border .3s;width:100%;max-width:100%;padding:.6rem 1.4rem;box-sizing:border-box;border:none;outline:none;font-family:Avenir,Helvetica,Arial,sans-serif;font-size:1.4rem;min-height:13rem;resize:none}.post-editor-wrapper .toolbar[data-v-5a28bd5d]{box-sizing:border-box;padding:.5rem 1rem;width:100%;position:relative;display:flex;justify-content:space-between;align-items:center}.post-editor-wrapper .toolbar .left[data-v-5a28bd5d]{display:flex;gap:1rem}.post-editor-wrapper .toolbar .left svg[data-v-5a28bd5d]{cursor:pointer}.post-editor-wrapper .toolbar .left .upload input[data-v-5a28bd5d]{cursor:pointer;position:absolute;width:20px;height:20px;opacity:0}.post-editor-wrapper .toolbar span[data-v-5a28bd5d]{color:gray;font-size:1.3rem}.post-editor-wrapper .get-cursor[data-v-5a28bd5d]{transition:border .3s;width:100%;max-width:100%;padding:.6rem 1.4rem;box-sizing:border-box;border:none;outline:none;font-family:Avenir,Helvetica,Arial,sans-serif;font-size:1.4rem;min-height:13rem;resize:none;position:absolute;top:0;z-index:-100}.post-editor-wrapper .emoticon-pack[data-v-5a28bd5d]{z-index:999999999;border-radius:1rem;padding:1rem;width:31rem;max-width:31rem;height:30rem;max-height:30rem;overflow:auto;background:white;border:1px solid #e2e8f0;box-shadow:0 9px 24px -3px #0000000f,0 4px 8px -1px #0000001f;position:fixed;bottom:11rem;left:14rem}.post-editor-wrapper .emoticon-pack i[data-v-5a28bd5d]{cursor:pointer;position:absolute;right:2rem;font-size:2rem;color:#e2e2e2}.post-editor-wrapper .emoticon-pack .list[data-v-5a28bd5d]{margin:1rem 0}.post-editor-wrapper .emoticon-pack img[data-v-5a28bd5d]{cursor:pointer;width:3rem;height:3rem;padding:.5rem}.post-editor-wrapper .emoticon-pack span[data-v-5a28bd5d]{display:inline-block;cursor:pointer;font-size:2.3rem;padding:.5rem}.isNight .emoticon-pack[data-v-5a28bd5d]{background:#18222d;border:1px solid #737373}.v-enter-active[data-v-8ffbfeb2],.v-leave-active[data-v-8ffbfeb2]{transition:opacity .3s ease}.v-enter-from[data-v-8ffbfeb2],.v-leave-to[data-v-8ffbfeb2]{opacity:0}.username[data-v-8ffbfeb2]{font-weight:700;font-size:1.4rem;margin-right:1rem}.op[data-v-8ffbfeb2]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;margin-right:1rem;transform:scale(.8)}.mod[data-v-8ffbfeb2]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;transform:scale(.8);background:#1484cd;color:#fff;margin-right:1rem}.my-tag[data-v-8ffbfeb2]{font-size:1.4rem;color:red;margin-left:1rem}.my-tag:hover .remove[data-v-8ffbfeb2]{display:inline}.my-tag .remove[data-v-8ffbfeb2]{cursor:pointer;margin-left:.5rem;display:none}.floor[data-v-8ffbfeb2]{margin-left:1rem;font-size:1.2rem;line-height:1rem;border-radius:1rem;display:inline-block;background-color:#f0f0f0;color:#ccc;padding:.2rem .5rem;cursor:default}html[data-v-8ffbfeb2],body[data-v-8ffbfeb2]{font-size:62.5%}.flex[data-v-8ffbfeb2]{display:flex;align-items:center;justify-content:space-between}.flex-end[data-v-8ffbfeb2]{justify-content:flex-end}.flex-center[data-v-8ffbfeb2]{justify-content:center}.p1[data-v-8ffbfeb2]{padding:1rem}.p0[data-v-8ffbfeb2]{padding:0!important}.post-author[data-v-8ffbfeb2]{display:flex;align-items:center;position:relative;color:#ccc!important}.post-author>.username[data-v-8ffbfeb2]{font-size:1.2rem}.sticky[data-v-8ffbfeb2]{position:sticky;bottom:0}.sticky[stuck][data-v-8ffbfeb2]{box-shadow:0 2px 20px #00000059}a[data-v-8ffbfeb2]{color:#778087;text-decoration:none;cursor:pointer}a[data-v-8ffbfeb2]:hover{text-decoration:underline}.base-loading[data-v-8ffbfeb2]{border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle-8ffbfeb2 infinite 1s linear}.loading-c[data-v-8ffbfeb2]{border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle-8ffbfeb2 infinite 1s linear;width:3rem;height:3rem}.loading-b[data-v-8ffbfeb2]{border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle-8ffbfeb2 infinite 1s linear;border-color:#ffffff rgba(178,177,177,.2) rgba(178,177,177,.2) rgba(178,177,177,.2);width:3rem;height:3rem}@keyframes circle-8ffbfeb2{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.button[data-v-8ffbfeb2]{cursor:pointer;padding:.4rem 2.4rem;border-radius:5px;display:inline-flex;justify-content:center;align-items:center;font-weight:700;font-size:1.2rem;color:#fff;background:#40a9ff;border:1px solid #40a9ff;user-select:none}.button[data-v-8ffbfeb2]:hover{opacity:.9}.button.info[data-v-8ffbfeb2]{color:#000;border:1px solid #40a9ff;background:white}.button.gray[data-v-8ffbfeb2]{color:#f5f5f5;border:1px solid #b6b6b6;background:#b6b6b6}.button.light[data-v-8ffbfeb2]{color:gray;border:1px solid #e2e2e2;background:#e2e2e2}.button[data-v-8ffbfeb2]:before{content:" ";border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle-8ffbfeb2 infinite 1s linear;border-color:#fff transparent transparent transparent;width:1rem;height:1rem;margin-right:1rem;display:none}.button.loading[data-v-8ffbfeb2]{cursor:not-allowed;opacity:.5}.button.loading[data-v-8ffbfeb2]:before{display:block}.button.disabled[data-v-8ffbfeb2]{cursor:not-allowed;color:#c6c6c6;background:#8d8d8d;border:1px solid transparent}.button.isNight[data-v-8ffbfeb2]{color:#c6c6c6;background:#2b4054;border:1px solid transparent}.tool[data-v-8ffbfeb2]{position:relative;margin-left:1rem;display:flex;align-items:center;font-size:1.2rem;font-weight:700;border-radius:.3rem;cursor:pointer;height:2.4rem;padding:0 .5rem}.tool[data-v-8ffbfeb2]:before{content:" ";border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle-8ffbfeb2 infinite 1s linear;border-color:transparent #929596 #929596 #929596;width:1rem;height:1rem;margin-left:1rem;display:none}.tool.loading[data-v-8ffbfeb2]{cursor:not-allowed;opacity:.5}.tool.loading[data-v-8ffbfeb2]:before{display:block}.tool.loading[data-v-8ffbfeb2]:hover{background:unset}.tool>svg[data-v-8ffbfeb2]{width:1.6rem!important;height:1.6rem!important;margin-right:.4rem;box-sizing:border-box;border-radius:.2rem}.tool[data-v-8ffbfeb2]:hover{background:#e8e8e8}.tool.no-hover[data-v-8ffbfeb2]{cursor:default}.tool.no-hover[data-v-8ffbfeb2]:hover{background:unset}.my-node[data-v-8ffbfeb2]{border-radius:.2rem;padding:.4rem;font-size:1rem;color:#999;background:#f5f5f5;cursor:pointer}.my-node[data-v-8ffbfeb2]:hover{text-decoration:none;background:#e2e2e2}.msgs[data-v-8ffbfeb2]{position:fixed;margin-left:calc(50% - 25rem);width:50rem;z-index:9999;bottom:0;left:0;right:0}.msg[data-v-8ffbfeb2]{cursor:default;margin-bottom:2rem;background:white;display:flex;color:#000;font-size:1.4rem;box-sizing:border-box;border-radius:.4rem;box-shadow:0 0 1rem 1px silver}.msg.success .left[data-v-8ffbfeb2]{background:#40a9ff}.msg.warning .left[data-v-8ffbfeb2]{background:#c8c002}.msg.error .left[data-v-8ffbfeb2]{background:red}.msg .left[data-v-8ffbfeb2]{border-radius:.4rem 0 0 .4rem;display:flex;align-items:center;background:#40a9ff}.msg .left svg[data-v-8ffbfeb2]{margin:0 .3rem;cursor:pointer}.msg .right[data-v-8ffbfeb2]{flex:1;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center}.line[data-v-8ffbfeb2]{border-bottom:1px solid #e2e2e2}.my-box[data-v-8ffbfeb2]{box-shadow:0 2px 3px #0000001a;border-radius:.4rem;background:white;margin-bottom:2rem;width:100%;overflow:hidden;box-sizing:border-box}.my-cell[data-v-8ffbfeb2]{padding:.6rem 1rem;font-size:1.4rem;line-height:150%;text-align:left;border-bottom:1px solid #e2e2e2}.f14[data-v-8ffbfeb2]{font-size:1.4rem}.switch[data-v-8ffbfeb2]{width:4.5rem;height:2rem;border-radius:2rem;position:relative;display:flex;align-items:center;transition:all .3s}.switch.light[data-v-8ffbfeb2]{border:1px solid #e2e2e2}.switch.light.active[data-v-8ffbfeb2]{background:#e2e2e2}.switch.light.active[data-v-8ffbfeb2]:before{right:.2rem;background:white}.switch.light[data-v-8ffbfeb2]:before{background:#e2e2e2}.switch.gray[data-v-8ffbfeb2]{border:1px solid #ccc}.switch.gray.active[data-v-8ffbfeb2]{background:#ccc}.switch.gray.active[data-v-8ffbfeb2]:before{right:.2rem;background:white}.switch.gray[data-v-8ffbfeb2]:before{background:#ccc}.switch.isNight[data-v-8ffbfeb2]{border:1px solid #31475e}.switch.isNight.active[data-v-8ffbfeb2]{background:#31475e}.switch.isNight.active[data-v-8ffbfeb2]:before{right:.2rem;background:gray}.switch.isNight[data-v-8ffbfeb2]:before{background:#31475e}.switch[data-v-8ffbfeb2]:before{position:absolute;content:" ";transition:all .3s;right:calc(100% - 2rem);width:1.8rem;height:1.8rem;border-radius:50%}.modal[data-v-8ffbfeb2]{position:fixed;z-index:100;width:100vw;height:100vh;left:0;top:0;display:flex;justify-content:center;align-items:center}.modal .title[data-v-8ffbfeb2]{font-size:2.4rem;margin-bottom:1rem;text-align:center}.modal .option[data-v-8ffbfeb2]{display:flex;justify-content:space-between;align-items:center;padding:.6rem 0}.modal .mask[data-v-8ffbfeb2]{position:fixed;width:100vw;height:100vh;left:0;top:0;background:rgba(0,0,0,.3)}.radio-group2[data-v-8ffbfeb2]{display:inline-flex;border-radius:.5rem;overflow:hidden;border:1px solid #e2e2e2}.radio-group2 .radio[data-v-8ffbfeb2]{cursor:pointer;background:transparent;padding:.3rem 1rem;border-left:1px solid #e2e2e2;color:#9ca1a4;font-size:1.2rem}.radio-group2 .radio[data-v-8ffbfeb2]:first-child{border-left:none}.radio-group2 .active[data-v-8ffbfeb2]{background:#e2e2e2;color:gray}.radio-group2.isNight[data-v-8ffbfeb2]{border:1px solid #454847}.radio-group2.isNight .radio[data-v-8ffbfeb2]{border-left:1px solid #454847;color:#fff}.radio-group2.isNight .active[data-v-8ffbfeb2]{background:#31475e}.pop-confirm[data-v-8ffbfeb2]{position:relative;display:inline-flex;justify-content:center}.tip[data-v-8ffbfeb2]{position:fixed;background:black;color:#fff;max-width:10rem;font-size:1.4rem;padding:.7rem 1rem;border-radius:.5rem;transform:translate(-50%);z-index:999}input[data-v-8ffbfeb2]{height:3rem;outline:unset;border:1px solid #e1e1e1;padding:0 .5rem;border-radius:5px;box-sizing:border-box}.html-wrapper[data-v-8ffbfeb2]{position:relative}.html-wrapper .mask[data-v-8ffbfeb2]{max-height:90rem;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,#000 80%,transparent)}.html-wrapper .expand[data-v-8ffbfeb2]{position:absolute;z-index:1;bottom:2rem;padding:.2rem 1.5rem;border-radius:2rem;border:1px solid gray;background:white;color:gray;left:50%;transform:translate(-50%);cursor:pointer}.comment[data-v-7fe2bffd]{width:100%;box-sizing:border-box;margin-top:.6rem}.comment.isLevelOne[data-v-7fe2bffd]{border-bottom:1px solid #ececec;padding:.8rem 1rem;margin-top:0}.comment.ding[data-v-7fe2bffd]{background:rgba(255,255,0,.3)!important}.comment.isSimple .avatar[data-v-7fe2bffd],.comment.isSimple .expand-line[data-v-7fe2bffd]{display:none}.comment.isSimple .simple-wrapper[data-v-7fe2bffd]{padding-left:2.8rem}.comment.isSimple .w[data-v-7fe2bffd]{padding-left:0!important;padding-top:.5rem}.comment .comment-content-w .more[data-v-7fe2bffd]{text-align:center;margin:2rem 0}.comment .comment-content[data-v-7fe2bffd]{display:flex;position:relative}.comment .comment-content .expand-line[data-v-7fe2bffd]{cursor:pointer;margin-top:.6rem;width:2.8rem;min-width:2.8rem;position:relative}.comment .comment-content .expand-line[data-v-7fe2bffd]:after{position:absolute;left:50%;content:" ";height:100%;width:0;border-right:1px solid #ececec}.comment .comment-content .expand-line[data-v-7fe2bffd]:hover:after{border-right:2px solid #0079D3}.comment .comment-content .right[data-v-7fe2bffd]{flex:1;width:calc(100% - 3rem)}.comment .comment-content .right .w[data-v-7fe2bffd]{padding-left:1rem}.comment .comment-content .right .w .post-editor-wrapper[data-v-7fe2bffd]{margin-top:1rem}.wrong-wrapper[data-v-7fe2bffd]{font-size:1.4rem;margin-bottom:1rem}.wrong-wrapper span[data-v-7fe2bffd]{cursor:pointer}.wrong-wrapper .del-line[data-v-7fe2bffd]{text-decoration:line-through}.wrong-wrapper .wrong-icon[data-v-7fe2bffd]{margin-left:.5rem}.wrong-wrapper .warning[data-v-7fe2bffd]{border-top:1px solid #e1e1e1;border-bottom:1px solid #e1e1e1;padding:1rem 0;margin-top:1rem;font-size:1.2rem;color:red}.toolbar[data-v-07fa3ae8]{display:flex;align-items:center;color:#929596}.comment[data-v-0b71f2b8]{width:100%;box-sizing:border-box;display:flex;gap:1rem;padding:1rem;border-bottom:1px solid #e2e2e2}.comment.isSimple .avatar[data-v-0b71f2b8]{display:none}.comment.isSimple .reply_content[data-v-0b71f2b8]{margin-top:.5rem!important}.comment .avatar[data-v-0b71f2b8]{display:flex}.comment .avatar img[data-v-0b71f2b8]{width:3.8rem;height:3.8rem;border-radius:.3rem}.comment .comment-body[data-v-0b71f2b8]{flex:1;display:flex;flex-direction:column}.comment .comment-body .texts[data-v-0b71f2b8]{display:flex;align-items:center}.comment .comment-body .reply_content[data-v-0b71f2b8]{margin-top:1rem;max-width:calc(100% - 5rem)}.comment .isRight[data-v-0b71f2b8]{align-items:flex-end}.comment .isRight .op[data-v-0b71f2b8],.comment .isRight .mod[data-v-0b71f2b8],.comment .isRight .username[data-v-0b71f2b8]{margin:0 0 0 1rem}.comment .Author-right[data-v-0b71f2b8]{display:flex;flex-direction:column;align-items:center}.comment .Author-right .floor[data-v-0b71f2b8]{margin-left:0}.comment .Author-right .jump[data-v-0b71f2b8]{color:#929596;margin-left:0}.comment .point[data-v-0b71f2b8]{margin:0 .5rem;font-size:1.4rem;display:flex;gap:.5rem;align-items:center;font-weight:700;color:#000}.sticky{position:sticky;bottom:-2px;z-index:2}.sticky[stuck]{box-shadow:0 2px 20px #00000059!important}.Post[data-v-ad1d5ea7]{position:unset!important;background:transparent!important;overflow:unset!important}.Post .main[data-v-ad1d5ea7]{background:transparent!important;padding:unset!important;width:100%!important}.Post .close-btn[data-v-ad1d5ea7]{display:none}.post-detail[data-v-ad1d5ea7]{text-align:start;position:fixed;z-index:99;left:0;right:0;bottom:0;top:0;background:rgba(46,47,48,.8);overflow:auto;font-size:1.4rem;display:flex;justify-content:center;flex-wrap:wrap}.post-detail.isNight[data-v-ad1d5ea7]{background:rgba(46,47,48,.8)}.post-detail.isNight .main[data-v-ad1d5ea7]{background:#22303f}.post-detail.isNight .main .toolbar-wrapper[data-v-ad1d5ea7]{border-top:unset!important}.post-detail.isNight .main .button.gray[data-v-ad1d5ea7]{background:#18222d!important;border:1px solid #18222d!important}.post-detail.isNight .main .relationReply[data-v-ad1d5ea7]{color:#fff}.post-detail.isNight .main .relationReply .comments[data-v-ad1d5ea7],.post-detail.isNight .main .relationReply .my-cell[data-v-ad1d5ea7]{background:#18222d}.post-detail.isNight .main .relationReply .comment[data-v-ad1d5ea7]{border-bottom:1px solid #22303f}.post-detail.isNight .main .my-box[data-v-ad1d5ea7]{color:#fff;background:#18222d}.post-detail.isNight .main .my-box .title[data-v-ad1d5ea7],.post-detail.isNight .main .my-box .content[data-v-ad1d5ea7]{color:#d1d5d9!important}.post-detail.isNight .main .my-box .base-info[data-v-ad1d5ea7],.post-detail.isNight .main .my-box .content[data-v-ad1d5ea7]{border:1px solid #22303f!important}.post-detail.isNight .main[data-v-ad1d5ea7] .subtle .fade{color:#b2c3d4!important}.post-detail.isNight .main[data-v-ad1d5ea7] .subtle .topic_content{color:#d1d5d9!important}.post-detail.isNight .main .my-cell[data-v-ad1d5ea7]{border-bottom:1px solid #22303f!important}.post-detail.isNight .main[data-v-ad1d5ea7] .isLevelOne{border-bottom:1px solid #22303f}.post-detail.isNight .main[data-v-ad1d5ea7] .comment .expand-line:after{border-right:1px solid #22303f!important}.post-detail.isNight .main[data-v-ad1d5ea7] .comment .expand-line:hover:after{border-right:2px solid #0079D3!important}.post-detail.isNight .main[data-v-ad1d5ea7] .comment .comment-content .w>.text{color:#d1d5d9!important}.post-detail.isNight .main[data-v-ad1d5ea7] .Author-right .toolbar:hover{background:#18222d!important}.post-detail.isNight .main[data-v-ad1d5ea7] .Author-right .tool{background:#22303f!important}.post-detail.isNight .main[data-v-ad1d5ea7] .point svg:hover{background:#22303f}.post-detail.isNight .main[data-v-ad1d5ea7] .point .num{color:#d1d5d9!important}.post-detail.isNight .main[data-v-ad1d5ea7] .floor{background:#393f4e!important;color:#d1d5d9!important}.post-detail.isNight .main .editor-wrapper[data-v-ad1d5ea7]{background:#393f4e!important}.post-detail.isNight .main[data-v-ad1d5ea7] .post-editor-wrapper .post-editor{background:#18222d;border:transparent;color:#fff}.post-detail.isNight .main[data-v-ad1d5ea7] .post-editor-wrapper .toolbar{background:#393f4e!important}.post-detail.isNight .main .call-list[data-v-ad1d5ea7]{background:#22303f}.post-detail.isNight .main .call-list .call-item[data-v-ad1d5ea7]{border-top:1px solid #18222d}.post-detail.isNight .main .call-list .call-item .select[data-v-ad1d5ea7],.post-detail.isNight .main .call-list .call-item[data-v-ad1d5ea7]:hover,.post-detail.isNight .main .call-list .call-item.select[data-v-ad1d5ea7]{background-color:#393f4e;text-decoration:none}.post-detail.isNight .main .scroll-to[data-v-ad1d5ea7],.post-detail.isNight .main .close-btn[data-v-ad1d5ea7],.post-detail.isNight .main .scroll-top[data-v-ad1d5ea7],.post-detail.isNight .main .top-reply[data-v-ad1d5ea7]{color:#9caec7}.post-detail .main[data-v-ad1d5ea7]{display:flex;justify-content:flex-end;padding:3rem 8rem 15rem;background:#e2e2e2;position:relative;outline:none}.post-detail .main .main-wrapper[data-v-ad1d5ea7]{width:77rem;padding-bottom:2rem;display:flex;flex-direction:column;align-items:center;position:relative}.post-detail .main .main-wrapper .post-wrapper .toolbar-wrapper[data-v-ad1d5ea7]{border-top:1px solid #e2e2e2;height:3.4rem;padding-left:.6rem;display:flex;align-items:center}.post-detail .main .main-wrapper .editor-wrapper .float[data-v-ad1d5ea7]{margin-right:2rem}.post-detail .main .main-wrapper .editor-wrapper .w[data-v-ad1d5ea7]{padding:1.2rem}.post-detail .main .main-wrapper .comment-wrapper .comments[data-v-ad1d5ea7]{width:100%;box-sizing:border-box}.post-detail .main .main-wrapper .loading-wrapper[data-v-ad1d5ea7]{height:20rem;display:flex;justify-content:center;align-items:center}.post-detail .main .main-wrapper #no-comments-yet[data-v-ad1d5ea7]{color:#a9a9a9;font-weight:700;text-align:center;width:100%;margin-bottom:2rem;box-sizing:border-box}.post-detail .main .relationReply[data-v-ad1d5ea7]{position:fixed;width:25vw;top:6.5rem;bottom:15rem;z-index:99;transform:translate(calc(100% + 2rem));font-size:2rem;overflow:hidden}.post-detail .main .relationReply .my-cell[data-v-ad1d5ea7]{background:white;border-radius:.5rem .5rem 0 0}.post-detail .main .relationReply .comments[data-v-ad1d5ea7]{max-height:calc(100% - 4.2rem);overflow:auto;background:white;border-radius:0 0 .5rem .5rem}.post-detail .main .call-list[data-v-ad1d5ea7]{z-index:9;position:absolute;top:12rem;border:1px solid #ccc;background-color:#fff;box-shadow:0 5px 15px #0000001a;overflow:hidden;max-height:30rem;min-width:8rem;box-sizing:content-box}.post-detail .main .call-list .call-item[data-v-ad1d5ea7]{border-top:1px solid #ccc;height:3rem;display:flex;padding:0 1rem;align-items:center;cursor:pointer;font-size:14px;box-sizing:border-box}.post-detail .main .call-list .call-item .select[data-v-ad1d5ea7],.post-detail .main .call-list .call-item[data-v-ad1d5ea7]:hover,.post-detail .main .call-list .call-item.select[data-v-ad1d5ea7]{background-color:#f0f0f0;text-decoration:none}.post-detail .main .call-list .call-item[data-v-ad1d5ea7]:nth-child(1){border-top:1px solid transparent}@media screen and (max-width: 1500px){.post-detail .main-wrapper[data-v-ad1d5ea7]{width:65vw!important}}@media screen and (max-width: 1280px){.post-detail .main-wrapper[data-v-ad1d5ea7]{width:75vw!important}}.post-detail .scroll-top[data-v-ad1d5ea7]{position:fixed;bottom:10rem;z-index:99;padding:.6rem .2rem;width:3.5rem;transform:translate(6rem);font-size:2rem;background:#f1f1f1;border:none;color:#a9a9a9}.post-detail .scroll-to[data-v-ad1d5ea7]{position:fixed;bottom:10rem;z-index:99;padding:.6rem .2rem;width:3.5rem;transform:translate(6rem);font-size:2rem;background:#f1f1f1;border:none;color:#a9a9a9;bottom:15rem;display:flex;flex-direction:column}.post-detail .scroll-to input[data-v-ad1d5ea7]{margin-top:.5rem;height:2rem;width:3.3rem;font-size:1.4rem;text-align:center;color:gray}.post-detail .read-notice[data-v-ad1d5ea7]{display:flex;align-items:center;color:gray}.post-detail .read-notice .jump[data-v-ad1d5ea7]{background:#f1f1f1;color:gray;padding:.3rem 1rem;border-radius:.4rem;margin:0 1rem;cursor:pointer}.post-detail .close-btn[data-v-ad1d5ea7]{color:#b6b6b6;cursor:pointer;position:fixed;top:3rem;transform:translate(4rem);font-size:2rem}.post-detail .top-reply[data-v-ad1d5ea7]{color:#e2e2e2;cursor:pointer;font-size:2rem;display:flex}.post-detail .top-reply i[data-v-ad1d5ea7]{padding:0 1rem}.isNight[data-v-19fe372d]{background:#22303f!important;color:#ccc!important}.base64_tooltip[data-v-19fe372d]{box-shadow:0 3px 6px -4px #0000001f,0 6px 16px #00000014,0 9px 28px 8px #0000000d;background:white;min-height:2.2rem;max-width:20rem;padding:.8rem;position:fixed;z-index:9998;display:flex;align-items:center;border-radius:.5rem;cursor:pointer;line-break:anywhere;font-size:1.4rem;color:#000}.base64_tooltip svg[data-v-19fe372d]{margin-left:1rem;min-width:1.8rem}.base64_tooltip .button[data-v-19fe372d]{margin-top:1rem;margin-left:2rem}.isNight .wrapper[data-v-b28a2e5e]{background:#22303f!important}.isNight .wrapper .title[data-v-b28a2e5e]{color:gray}.isNight .wrapper .option[data-v-b28a2e5e]{color:#fff!important}.isNight .wrapper .option span[data-v-b28a2e5e]{color:gray!important}.isNight .wrapper .white[data-v-b28a2e5e]{color:#fff!important}.tag-modal .wrapper[data-v-b28a2e5e]{z-index:9;background:#f1f1f1;border-radius:.8rem;font-size:1.4rem;padding:2rem 6rem 4rem;width:25rem}.tag-modal .wrapper .btns[data-v-b28a2e5e]{margin-top:1.5rem;display:flex;justify-content:flex-end;align-items:center;gap:1.5rem;font-size:1rem}.tag-modal .wrapper .btns div[data-v-b28a2e5e]{cursor:pointer}.tag-modal .wrapper .btns .main[data-v-b28a2e5e]{color:gray;background:#e2e2e2;padding:.5rem 1.2rem;border-radius:.4rem}.msgs[data-v-95974c3e]{position:fixed;margin-left:calc(50% - 25rem);width:50rem;z-index:9999;bottom:0;left:0;right:0}.isNight .open-post[data-v-658ce414],.isNight .nav[data-v-658ce414]{color:#fff;background:#18222d;border-bottom:1px solid #22303f}.card[data-v-658ce414]{border-radius:0 0 .4rem .4rem;overflow:hidden}.nav[data-v-658ce414]{font-size:1.4rem;background:white;padding:1rem;border-bottom:1px solid #e2e2e2} ');

(function (vue) {
  'use strict';

  var PageType = /* @__PURE__ */ ((PageType2) => {
    PageType2["Home"] = "Home";
    PageType2["Node"] = "Node";
    PageType2["Post"] = "Post";
    return PageType2;
  })(PageType || {});
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$f = {
    name: "Tooltip",
    props: {
      title: {
        type: String,
        default() {
          return "";
        }
      }
    },
    data() {
      return {
        show: false
      };
    },
    methods: {
      hoverIn(e) {
        let rect = e.target.getBoundingClientRect();
        this.show = true;
        vue.nextTick(() => {
          let tip = this.$refs.tip.getBoundingClientRect();
          this.$refs.tip.style.top = rect.top - tip.height - 5 + "px";
          this.$refs.tip.style.left = rect.left + rect.width / 2 + "px";
        });
      }
    }
  };
  const _hoisted_1$f = { class: "pop-confirm" };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$f, [
      (vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
        vue.createVNode(vue.Transition, null, {
          default: vue.withCtx(() => [
            $data.show ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: "tip",
              ref: "tip"
            }, vue.toDisplayString($props.title), 513)) : vue.createCommentVNode("", true)
          ]),
          _: 1
        })
      ])),
      vue.createElementVNode("span", {
        onMouseenter: _cache[0] || (_cache[0] = (...args) => $options.hoverIn && $options.hoverIn(...args)),
        onMouseleave: _cache[1] || (_cache[1] = ($event) => $data.show = false)
      }, [
        vue.renderSlot(_ctx.$slots, "default")
      ], 32)
    ]);
  }
  const Tooltip = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$9]]);
  const _sfc_main$e = {
    name: "Setting",
    components: {
      Tooltip
    },
    inject: ["isNight"],
    props: {
      modelValue: {
        type: Object,
        default() {
          return {};
        }
      },
      show: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    data() {
      return {
        config: window.clone(this.modelValue)
      };
    },
    watch: {
      config: {
        handler(n) {
          n.topReplyLoveMinCount = Math.trunc(n.topReplyLoveMinCount);
          if (n.topReplyLoveMinCount < 0) {
            n.topReplyLoveMinCount = 1;
          }
          this.$emit("update:modelValue", n);
        },
        deep: true
      }
    },
    created() {
    }
  };
  const _withScopeId$8 = (n) => (vue.pushScopeId("data-v-f67a59b5"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$e = { class: "wrapper" };
  const _hoisted_2$d = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "title" }, " 脚本设置 ", -1));
  const _hoisted_3$a = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "sub-title" }, " 设置自动保存到本地，下次打开依然生效 ", -1));
  const _hoisted_4$8 = { class: "body" };
  const _hoisted_5$7 = { class: "option-list" };
  const _hoisted_6$7 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "option-title" }, "列表:", -1));
  const _hoisted_7$6 = { class: "option" };
  const _hoisted_8$6 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "列表帖子展示方式：", -1));
  const _hoisted_9$6 = { class: "option" };
  const _hoisted_10$6 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "列表hover时显示预览按钮：", -1));
  const _hoisted_11$6 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "notice" }, " 此项需要刷新页面才能生效 ", -1));
  const _hoisted_12$6 = { class: "option" };
  const _hoisted_13$6 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "点击列表的帖子，打开详情弹框 ：", -1));
  const _hoisted_14$6 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "notice" }, " 若关闭此项，点击列表的帖子时，不会打开弹框，会跳转网页 ", -1));
  const _hoisted_15$6 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "option-title" }, "帖子:", -1));
  const _hoisted_16$5 = { class: "option" };
  const _hoisted_17$5 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "回复展示方式：", -1));
  const _hoisted_18$5 = { class: "option" };
  const _hoisted_19$4 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "单独打开帖子时默认显示楼中楼 ：", -1));
  const _hoisted_20$4 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "notice" }, " 单独打开这种地址 https://v2ex.com/t/xxxx 时，是否默认显示楼中楼 ", -1));
  const _hoisted_21$3 = { class: "option" };
  const _hoisted_22$3 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "点击左右两侧透明处关闭帖子详情弹框：", -1));
  const _hoisted_23$3 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "option-title" }, "点赞:", -1));
  const _hoisted_24$2 = { class: "option" };
  const _hoisted_25$3 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "显示高赞回复：", -1));
  const _hoisted_26$2 = { class: "option" };
  const _hoisted_27$1 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "最多显示多少个高赞回复：", -1));
  const _hoisted_28$1 = { class: "option" };
  const _hoisted_29$1 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "最少需要多少赞才能被判定为高赞：", -1));
  const _hoisted_30$1 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "option-title" }, "记忆阅读:", -1));
  const _hoisted_31$1 = { class: "option" };
  const _hoisted_32$1 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "记录上次阅读楼层（误差1层左右）：", -1));
  const _hoisted_33$1 = { class: "option" };
  const _hoisted_34$1 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "打开帖子自动跳转到上次阅读楼层：", -1));
  const _hoisted_35$1 = { class: "option-list" };
  const _hoisted_36$1 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "option-title" }, "其他:", -1));
  const _hoisted_37 = { class: "option" };
  const _hoisted_38 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "显示工具栏：", -1));
  const _hoisted_39 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "notice" }, [
    /* @__PURE__ */ vue.createTextVNode(" 关闭此项会隐藏以下三个工具栏 "),
    /* @__PURE__ */ vue.createElementVNode("div", null, " 1. 首页”卡片/表格“ "),
    /* @__PURE__ */ vue.createElementVNode("div", null, " 2. 详情页”楼中楼/只看楼主/感谢/V2原版“ "),
    /* @__PURE__ */ vue.createElementVNode("div", null, " 3. 单独打开帖子时”点击显示楼中楼“ ")
  ], -1));
  const _hoisted_40 = { class: "option" };
  const _hoisted_41 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "新标签页打开链接 ：", -1));
  const _hoisted_42 = { class: "option" };
  const _hoisted_43 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "用户打标签(跨平台，数据保存在自己的记事本)：", -1));
  const _hoisted_44 = { class: "option" };
  const _hoisted_45 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "正文超长自动折叠：", -1));
  const _hoisted_46 = { class: "option" };
  const _hoisted_47 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "划词显示Base64解码框：", -1));
  const _hoisted_48 = { class: "option" };
  const _hoisted_49 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "使用 SOV2EX 搜索：", -1));
  const _hoisted_50 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "notice" }, " 此项需要刷新页面才能生效 ", -1));
  const _hoisted_51 = { class: "option" };
  const _hoisted_52 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "帖子宽度：", -1));
  const _hoisted_53 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "notice" }, [
    /* @__PURE__ */ vue.createTextVNode(" 默认为77rem。接受合法的width值： "),
    /* @__PURE__ */ vue.createElementVNode("a", {
      href: "https://vue3js.cn/interview/css/em_px_rem_vh_vw.html#%E4%BA%8C%E3%80%81%E5%8D%95%E4%BD%8D",
      target: "_blank"
    }, "rem、px、vw、vh"),
    /* @__PURE__ */ vue.createTextVNode("。 vw代表屏幕百分比，如想要屏幕的66%，请填写66vw ")
  ], -1));
  const _hoisted_54 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "notice" }, " 提示：此项设置以后，单独打开详情页时会出现帖子突然变宽（窄）的问题，暂时无解 ", -1));
  const _hoisted_55 = { class: "option" };
  const _hoisted_56 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "自动签到：", -1));
  const _hoisted_57 = { class: "option" };
  const _hoisted_58 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "自定义背景：", -1));
  const _hoisted_59 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "notice" }, [
    /* @__PURE__ */ vue.createTextVNode(" 接受一个合法的css color值：例如"),
    /* @__PURE__ */ vue.createElementVNode("a", {
      href: "https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value",
      target: "_blank"
    }, "red、#ffffff、rgb(222,222,22)"),
    /* @__PURE__ */ vue.createTextVNode("等等。 没图片时的背景默认为 #e2e2e2。 ")
  ], -1));
  const _hoisted_60 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "notice" }, " 此项需要刷新页面才能生效 ", -1));
  const _hoisted_61 = { class: "option" };
  const _hoisted_62 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "收藏时提醒添加到书签：", -1));
  const _hoisted_63 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "notice" }, " V站的帐号一旦被封了，就无法登录了，账号里的收藏也就看不到了 ", -1));
  const _hoisted_64 = { class: "option" };
  const _hoisted_65 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "简洁模式：", -1));
  const _hoisted_66 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "notice" }, " 此项需要刷新页面才能生效 ", -1));
  const _hoisted_67 = { class: "option" };
  const _hoisted_68 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "隐藏名字：", -1));
  const _hoisted_69 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "notice" }, " 此项需要刷新页面才能生效 ", -1));
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Tooltip = vue.resolveComponent("Tooltip");
    return vue.openBlock(), vue.createBlock(vue.Transition, null, {
      default: vue.withCtx(() => [
        $props.show ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(["setting-modal modal", { isNight: $options.isNight }])
        }, [
          vue.createElementVNode("div", {
            class: "mask",
            onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:show", false))
          }),
          vue.createElementVNode("div", _hoisted_1$e, [
            _hoisted_2$d,
            _hoisted_3$a,
            vue.createElementVNode("div", _hoisted_4$8, [
              vue.createElementVNode("div", _hoisted_5$7, [
                _hoisted_6$7,
                vue.createElementVNode("div", _hoisted_7$6, [
                  _hoisted_8$6,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["radio-group2", { isNight: $options.isNight }])
                  }, [
                    vue.createElementVNode("div", {
                      class: vue.normalizeClass(["radio", $data.config.viewType === "table" ? "active" : ""]),
                      onClick: _cache[1] || (_cache[1] = ($event) => $data.config.viewType = "table")
                    }, "表格 ", 2),
                    vue.createElementVNode("div", {
                      class: vue.normalizeClass(["radio", $data.config.viewType === "card" ? "active" : ""]),
                      onClick: _cache[2] || (_cache[2] = ($event) => $data.config.viewType = "card")
                    }, "卡片 ", 2)
                  ], 2)
                ]),
                vue.createElementVNode("div", _hoisted_9$6, [
                  _hoisted_10$6,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["switch gray", { active: $data.config.showPreviewBtn, isNight: $options.isNight }]),
                    onClick: _cache[3] || (_cache[3] = ($event) => $data.config.showPreviewBtn = !$data.config.showPreviewBtn)
                  }, null, 2)
                ]),
                _hoisted_11$6,
                vue.createElementVNode("div", _hoisted_12$6, [
                  _hoisted_13$6,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["switch gray", { active: $data.config.clickPostItemOpenDetail, isNight: $options.isNight }]),
                    onClick: _cache[4] || (_cache[4] = ($event) => $data.config.clickPostItemOpenDetail = !$data.config.clickPostItemOpenDetail)
                  }, null, 2)
                ]),
                _hoisted_14$6,
                _hoisted_15$6,
                vue.createElementVNode("div", _hoisted_16$5, [
                  _hoisted_17$5,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["radio-group2", { isNight: $options.isNight }])
                  }, [
                    vue.createVNode(_component_Tooltip, { title: "不隐藏@用户" }, {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("div", {
                          class: vue.normalizeClass(["radio", $data.config.commentDisplayType === 0 ? "active" : ""]),
                          onClick: _cache[5] || (_cache[5] = ($event) => $data.config.commentDisplayType = 0)
                        }, "楼中楼(@) ", 2)
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_Tooltip, { title: "隐藏第一个@用户，双击内容可显示原文" }, {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("div", {
                          class: vue.normalizeClass(["radio", $data.config.commentDisplayType === 4 ? "active" : ""]),
                          onClick: _cache[6] || (_cache[6] = ($event) => $data.config.commentDisplayType = 4)
                        }, "楼中楼 ", 2)
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_Tooltip, { title: "重复显示楼中楼的回复" }, {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("div", {
                          class: vue.normalizeClass(["radio", $data.config.commentDisplayType === 5 ? "active" : ""]),
                          onClick: _cache[7] || (_cache[7] = ($event) => $data.config.commentDisplayType = 5)
                        }, "冗余楼中楼 ", 2)
                      ]),
                      _: 1
                    }),
                    vue.createElementVNode("div", {
                      class: vue.normalizeClass(["radio", $data.config.commentDisplayType === 1 ? "active" : ""]),
                      onClick: _cache[8] || (_cache[8] = ($event) => $data.config.commentDisplayType = 1)
                    }, "感谢 ", 2),
                    vue.createElementVNode("div", {
                      class: vue.normalizeClass(["radio", $data.config.commentDisplayType === 3 ? "active" : ""]),
                      onClick: _cache[9] || (_cache[9] = ($event) => $data.config.commentDisplayType = 3)
                    }, "只看楼主 ", 2),
                    vue.createElementVNode("div", {
                      class: vue.normalizeClass(["radio", $data.config.commentDisplayType === 2 ? "active" : ""]),
                      onClick: _cache[10] || (_cache[10] = ($event) => $data.config.commentDisplayType = 2)
                    }, "V2原版 ", 2)
                  ], 2)
                ]),
                vue.createElementVNode("div", _hoisted_18$5, [
                  _hoisted_19$4,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["switch gray", { active: $data.config.autoOpenDetail, isNight: $options.isNight }]),
                    onClick: _cache[11] || (_cache[11] = ($event) => $data.config.autoOpenDetail = !$data.config.autoOpenDetail)
                  }, null, 2)
                ]),
                _hoisted_20$4,
                vue.createElementVNode("div", _hoisted_21$3, [
                  _hoisted_22$3,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["switch gray", { active: $data.config.closePostDetailBySpace, isNight: $options.isNight }]),
                    onClick: _cache[12] || (_cache[12] = ($event) => $data.config.closePostDetailBySpace = !$data.config.closePostDetailBySpace)
                  }, null, 2)
                ]),
                _hoisted_23$3,
                vue.createElementVNode("div", _hoisted_24$2, [
                  _hoisted_25$3,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["switch gray", { active: $data.config.showTopReply, isNight: $options.isNight }]),
                    onClick: _cache[13] || (_cache[13] = ($event) => $data.config.showTopReply = !$data.config.showTopReply)
                  }, null, 2)
                ]),
                vue.createElementVNode("div", _hoisted_26$2, [
                  _hoisted_27$1,
                  vue.withDirectives(vue.createElementVNode("input", {
                    type: "number",
                    min: "1",
                    "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $data.config.topReplyCount = $event)
                  }, null, 512), [
                    [vue.vModelText, $data.config.topReplyCount]
                  ])
                ]),
                vue.createElementVNode("div", _hoisted_28$1, [
                  _hoisted_29$1,
                  vue.withDirectives(vue.createElementVNode("input", {
                    type: "number",
                    min: "1",
                    "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => $data.config.topReplyLoveMinCount = $event)
                  }, null, 512), [
                    [vue.vModelText, $data.config.topReplyLoveMinCount]
                  ])
                ]),
                _hoisted_30$1,
                vue.createElementVNode("div", _hoisted_31$1, [
                  _hoisted_32$1,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["switch gray", { active: $data.config.rememberLastReadFloor, isNight: $options.isNight }]),
                    onClick: _cache[16] || (_cache[16] = ($event) => {
                      $data.config.rememberLastReadFloor = !$data.config.rememberLastReadFloor;
                      $data.config.autoJumpLastReadFloor = false;
                    })
                  }, null, 2)
                ]),
                vue.createElementVNode("div", _hoisted_33$1, [
                  _hoisted_34$1,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["switch gray", { active: $data.config.autoJumpLastReadFloor, isNight: $options.isNight }]),
                    onClick: _cache[17] || (_cache[17] = ($event) => $data.config.autoJumpLastReadFloor = !$data.config.autoJumpLastReadFloor)
                  }, null, 2)
                ])
              ]),
              vue.createElementVNode("div", _hoisted_35$1, [
                _hoisted_36$1,
                vue.createElementVNode("div", _hoisted_37, [
                  _hoisted_38,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["switch gray", { active: $data.config.showToolbar, isNight: $options.isNight }]),
                    onClick: _cache[18] || (_cache[18] = ($event) => $data.config.showToolbar = !$data.config.showToolbar)
                  }, null, 2)
                ]),
                _hoisted_39,
                vue.createElementVNode("div", _hoisted_40, [
                  _hoisted_41,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["switch gray", { active: $data.config.newTabOpen, isNight: $options.isNight }]),
                    onClick: _cache[19] || (_cache[19] = ($event) => {
                      $data.config.newTabOpen = !$data.config.newTabOpen;
                      $data.config.clickPostItemOpenDetail = !$data.config.newTabOpen;
                    })
                  }, null, 2)
                ]),
                vue.createElementVNode("div", _hoisted_42, [
                  _hoisted_43,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["switch gray", { active: $data.config.openTag, isNight: $options.isNight }]),
                    onClick: _cache[20] || (_cache[20] = ($event) => $data.config.openTag = !$data.config.openTag)
                  }, null, 2)
                ]),
                vue.createElementVNode("div", _hoisted_44, [
                  _hoisted_45,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["switch gray", { active: $data.config.contentAutoCollapse, isNight: $options.isNight }]),
                    onClick: _cache[21] || (_cache[21] = ($event) => $data.config.contentAutoCollapse = !$data.config.contentAutoCollapse)
                  }, null, 2)
                ]),
                vue.createElementVNode("div", _hoisted_46, [
                  _hoisted_47,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["switch gray", { active: $data.config.base64, isNight: $options.isNight }]),
                    onClick: _cache[22] || (_cache[22] = ($event) => $data.config.base64 = !$data.config.base64)
                  }, null, 2)
                ]),
                vue.createElementVNode("div", _hoisted_48, [
                  _hoisted_49,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["switch gray", { active: $data.config.sov2ex, isNight: $options.isNight }]),
                    onClick: _cache[23] || (_cache[23] = ($event) => $data.config.sov2ex = !$data.config.sov2ex)
                  }, null, 2)
                ]),
                _hoisted_50,
                vue.createElementVNode("div", _hoisted_51, [
                  _hoisted_52,
                  vue.withDirectives(vue.createElementVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => $data.config.postWidth = $event)
                  }, null, 512), [
                    [vue.vModelText, $data.config.postWidth]
                  ])
                ]),
                _hoisted_53,
                _hoisted_54,
                vue.createElementVNode("div", _hoisted_55, [
                  _hoisted_56,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["switch gray", { active: $data.config.autoSignin, isNight: $options.isNight }]),
                    onClick: _cache[25] || (_cache[25] = ($event) => $data.config.autoSignin = !$data.config.autoSignin)
                  }, null, 2)
                ]),
                vue.createElementVNode("div", _hoisted_57, [
                  _hoisted_58,
                  vue.withDirectives(vue.createElementVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => $data.config.customBgColor = $event)
                  }, null, 512), [
                    [vue.vModelText, $data.config.customBgColor]
                  ])
                ]),
                _hoisted_59,
                _hoisted_60,
                vue.createElementVNode("div", _hoisted_61, [
                  _hoisted_62,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["switch gray", { active: $data.config.collectBrowserNotice, isNight: $options.isNight }]),
                    onClick: _cache[27] || (_cache[27] = ($event) => $data.config.collectBrowserNotice = !$data.config.collectBrowserNotice)
                  }, null, 2)
                ]),
                _hoisted_63,
                vue.createElementVNode("div", _hoisted_64, [
                  _hoisted_65,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["switch gray", { active: $data.config.simple, isNight: $options.isNight }]),
                    onClick: _cache[28] || (_cache[28] = ($event) => $data.config.simple = !$data.config.simple)
                  }, null, 2)
                ]),
                _hoisted_66,
                vue.createElementVNode("div", _hoisted_67, [
                  _hoisted_68,
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["switch gray", { active: $data.config.hideName, isNight: $options.isNight }]),
                    onClick: _cache[29] || (_cache[29] = ($event) => $data.config.hideName = !$data.config.hideName)
                  }, null, 2)
                ]),
                _hoisted_69
              ])
            ])
          ])
        ], 2)) : vue.createCommentVNode("", true)
      ]),
      _: 1
    });
  }
  const Setting = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$8], ["__scopeId", "data-v-f67a59b5"]]);
  const eventBus = {
    eventMap: /* @__PURE__ */ new Map(),
    on(eventType, cb) {
      let cbs = this.eventMap.get(eventType);
      if (cbs) {
        cbs.push(cb);
      } else {
        cbs = [cb];
      }
      this.eventMap.set(eventType, cbs);
    },
    emit(eventType, val) {
      let cbs = this.eventMap.get(eventType);
      if (cbs) {
        cbs.map((cb) => cb(val));
      }
    },
    off(eventType) {
      let cbs = this.eventMap.has(eventType);
      if (cbs) {
        this.eventMap.delete(eventType);
      }
    },
    clear() {
      this.eventMap = /* @__PURE__ */ new Map();
    }
  };
  const CMD = {
    SHOW_TOOLTIP: "SHOW_TOOLTIP",
    SHOW_MSG: "SHOW_MSG",
    SET_CALL: "SET_CALL",
    SHOW_CALL: "SHOW_CALL",
    REFRESH_ONCE: "REFRESH_ONCE",
    ADD_REPLY: "ADD_REPLY",
    IGNORE: "IGNORE",
    MERGE: "MERGE",
    REMOVE: "REMOVE",
    CHANGE_COMMENT_THANK: "CHANGE_COMMENT_THANK",
    CHANGE_POST_THANK: "CHANGE_POST_THANK",
    ADD_TAG: "ADD_TAG",
    REMOVE_TAG: "REMOVE_TAG",
    RELATION_REPLY: "RELATION_REPLY",
    JUMP: "JUMP",
    ADD_READ: "ADD_READ"
  };
  const _sfc_main$d = {
    name: "PopConfirm",
    props: {
      title: {
        type: String,
        default() {
          return "";
        }
      },
      disabled: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    data() {
      return {
        show: false
      };
    },
    methods: {
      showPop(e) {
        if (this.disabled)
          return;
        let rect = e.target.getBoundingClientRect();
        this.show = true;
        vue.nextTick(() => {
          this.$refs.tip.style.top = rect.top + "px";
          this.$refs.tip.style.left = rect.left + rect.width / 2 - 50 + "px";
        });
      },
      confirm() {
        this.show = false;
        this.$emit("confirm");
      }
    }
  };
  const _hoisted_1$d = { class: "pop-confirm" };
  const _hoisted_2$c = {
    key: 0,
    ref: "tip",
    class: "pop-confirm-content"
  };
  const _hoisted_3$9 = { class: "text" };
  const _hoisted_4$7 = { class: "options" };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$d, [
      (vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
        vue.createVNode(vue.Transition, null, {
          default: vue.withCtx(() => [
            $data.show ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$c, [
              vue.createElementVNode("div", _hoisted_3$9, vue.toDisplayString($props.title), 1),
              vue.createElementVNode("div", _hoisted_4$7, [
                vue.createElementVNode("div", {
                  onClick: _cache[0] || (_cache[0] = ($event) => $data.show = false)
                }, "取消"),
                vue.createElementVNode("div", {
                  class: "main",
                  onClick: _cache[1] || (_cache[1] = (...args) => $options.confirm && $options.confirm(...args))
                }, "确认")
              ])
            ], 512)) : vue.createCommentVNode("", true)
          ]),
          _: 1
        })
      ])),
      vue.createElementVNode("span", {
        onClick: _cache[2] || (_cache[2] = (...args) => $options.showPop && $options.showPop(...args))
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ])
    ]);
  }
  const PopConfirm = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$7], ["__scopeId", "data-v-8df5d12b"]]);
  const loveColor = "rgb(224,42,42)";
  const _sfc_main$c = {
    name: "Point",
    components: { PopConfirm },
    inject: ["post", "isLogin"],
    props: {
      item: {
        type: Object,
        default() {
          return {};
        }
      },
      full: {
        type: Boolean,
        default() {
          return true;
        }
      },
      apiUrl: ""
    },
    computed: {
      disabled() {
        return this.item.username === window.user.username || this.item.isThanked || !this.isLogin;
      }
    },
    methods: {
      getColor() {
        if (this.item.isThanked)
          return loveColor;
        return this.full ? loveColor : "#929596";
      },
      getIsFull() {
        if (this.item.isThanked)
          return loveColor;
        return this.full ? loveColor : "none";
      },
      thankError() {
        if (this.item.username === window.user.username) {
          return eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "不能感谢自己" });
        }
        if (this.item.isThanked) {
          return eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "已经感谢过了" });
        }
        if (!this.isLogin) {
          return eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "请先登录！" });
        }
      },
      async thank() {
        this.$emit("addThank");
        let url = `${window.baseUrl}/thank/${this.apiUrl}?once=${this.post.once}`;
        $.post(url).then((res) => {
          if (!res.success) {
            this.$emit("recallThank");
            eventBus.emit(CMD.SHOW_MSG, { type: "error", text: res.message });
          }
          eventBus.emit(CMD.REFRESH_ONCE, res.once);
        }, (err) => {
          this.$emit("recallThank");
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "感谢失败" });
          eventBus.emit(CMD.REFRESH_ONCE);
        });
      }
    }
  };
  const _hoisted_1$c = { class: "point" };
  const _hoisted_2$b = ["fill", "stroke"];
  const _hoisted_3$8 = { class: "num" };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_PopConfirm = vue.resolveComponent("PopConfirm");
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$c, [
      vue.createVNode(_component_PopConfirm, {
        disabled: $options.disabled,
        title: `确认花费 10 个铜币向 @${$props.item.username} 的这条回复发送感谢？`,
        onConfirm: $options.thank
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("div", {
            class: "up",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.thankError && $options.thankError(...args))
          }, [
            (vue.openBlock(), vue.createElementBlock("svg", {
              class: vue.normalizeClass({ disabled: $options.disabled }),
              width: "19",
              height: "19",
              viewBox: "0 0 48 48",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg"
            }, [
              vue.createElementVNode("path", {
                d: "M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z",
                fill: $options.getIsFull(),
                stroke: $options.getColor(),
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, null, 8, _hoisted_2$b)
            ], 2))
          ])
        ]),
        _: 1
      }, 8, ["disabled", "title", "onConfirm"]),
      vue.createElementVNode("div", _hoisted_3$8, vue.toDisplayString($props.item.thankCount ? $props.item.thankCount : "感谢"), 1)
    ]);
  }
  const Point = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$6], ["__scopeId", "data-v-810a119b"]]);
  const _sfc_main$b = {
    name: "Author",
    components: { PopConfirm, Point },
    inject: ["isLogin", "tags", "config"],
    props: {
      modelValue: false,
      comment: {
        type: Object,
        default() {
          return {};
        }
      },
      type: {
        type: String,
        default() {
          return "list";
        }
      }
    },
    computed: {
      isDev() {
        return false;
      },
      pointInfo() {
        return {
          isThanked: this.comment.isThanked,
          thankCount: this.comment.thankCount,
          username: this.comment.username
        };
      },
      myTags() {
        return this.tags[this.comment.username] ?? [];
      },
      context() {
        return this.comment.replyUsers.length;
      }
    },
    methods: {
      jump() {
        eventBus.emit(CMD.JUMP, this.comment.floor);
      },
      showRelationReply() {
        if (!this.comment.replyUsers.length) {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "该回复无上下文" });
          return;
        }
        eventBus.emit(CMD.RELATION_REPLY, {
          left: this.comment.replyUsers,
          right: this.comment.username,
          rightFloor: this.comment.floor
        });
      },
      addTag() {
        eventBus.emit(CMD.ADD_TAG, this.comment.username);
      },
      removeTag(tag) {
        eventBus.emit(CMD.REMOVE_TAG, { username: this.comment.username, tag });
      },
      checkIsLogin(emitName = "") {
        if (!this.isLogin) {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "请先登录！" });
          return false;
        }
        this.$emit(emitName);
        return true;
      },
      addThank() {
        eventBus.emit(CMD.CHANGE_COMMENT_THANK, { id: this.comment.id, type: "add" });
      },
      recallThank() {
        eventBus.emit(CMD.CHANGE_COMMENT_THANK, { id: this.comment.id, type: "recall" });
      }
    }
  };
  const _withScopeId$7 = (n) => (vue.pushScopeId("data-v-9f527c77"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$b = { class: "Author-left" };
  const _hoisted_2$a = /* @__PURE__ */ _withScopeId$7(() => /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M22 42H6V26",
    stroke: "#177EC9",
    "stroke-width": "4",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, null, -1));
  const _hoisted_3$7 = /* @__PURE__ */ _withScopeId$7(() => /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M26 6H42V22",
    stroke: "#177EC9",
    "stroke-width": "4",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, null, -1));
  const _hoisted_4$6 = [
    _hoisted_2$a,
    _hoisted_3$7
  ];
  const _hoisted_5$6 = ["href"];
  const _hoisted_6$6 = ["src"];
  const _hoisted_7$5 = { class: "texts" };
  const _hoisted_8$5 = ["href"];
  const _hoisted_9$5 = {
    key: 0,
    class: "op"
  };
  const _hoisted_10$5 = {
    key: 1,
    class: "dup"
  };
  const _hoisted_11$5 = {
    key: 2,
    class: "mod"
  };
  const _hoisted_12$5 = { class: "ago" };
  const _hoisted_13$5 = { class: "my-tag" };
  const _hoisted_14$5 = /* @__PURE__ */ _withScopeId$7(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "fa fa-tag" }, null, -1));
  const _hoisted_15$5 = ["onClick"];
  const _hoisted_16$4 = { class: "Author-right" };
  const _hoisted_17$4 = {
    key: 0,
    class: "toolbar"
  };
  const _hoisted_18$4 = /* @__PURE__ */ _withScopeId$7(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "tool" }, [
    /* @__PURE__ */ vue.createElementVNode("span", null, "隐藏")
  ], -1));
  const _hoisted_19$3 = /* @__PURE__ */ _withScopeId$7(() => /* @__PURE__ */ vue.createElementVNode("span", null, "上下文", -1));
  const _hoisted_20$3 = [
    _hoisted_19$3
  ];
  const _hoisted_21$2 = /* @__PURE__ */ _withScopeId$7(() => /* @__PURE__ */ vue.createElementVNode("span", null, "跳转", -1));
  const _hoisted_22$2 = [
    _hoisted_21$2
  ];
  const _hoisted_23$2 = /* @__PURE__ */ vue.createStaticVNode('<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-9f527c77><path d="M4 6H44V36H29L24 41L19 36H4V6Z" fill="none" stroke="#929596" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-9f527c77></path><path d="M23 21H25.0025" stroke="#929596" stroke-width="2" stroke-linecap="round" data-v-9f527c77></path><path d="M33.001 21H34.9999" stroke="#929596" stroke-width="2" stroke-linecap="round" data-v-9f527c77></path><path d="M13.001 21H14.9999" stroke="#929596" stroke-width="2" stroke-linecap="round" data-v-9f527c77></path></svg><span data-v-9f527c77>回复</span>', 2);
  const _hoisted_25$2 = [
    _hoisted_23$2
  ];
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_PopConfirm = vue.resolveComponent("PopConfirm");
    const _component_Point = vue.resolveComponent("Point");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["Author", { expand: !$props.modelValue }])
    }, [
      vue.createElementVNode("div", _hoisted_1$b, [
        !$props.modelValue ? (vue.openBlock(), vue.createElementBlock("svg", {
          key: 0,
          class: "expand-icon",
          onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", true)),
          width: "24",
          height: "24",
          viewBox: "0 0 48 48",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        }, _hoisted_4$6)) : vue.createCommentVNode("", true),
        !$options.config.simple ? (vue.openBlock(), vue.createElementBlock("a", {
          key: 1,
          class: "avatar",
          href: `/member/${$props.comment.username}`
        }, [
          vue.createElementVNode("img", {
            src: $props.comment.avatar,
            alt: ""
          }, null, 8, _hoisted_6$6)
        ], 8, _hoisted_5$6)) : vue.createCommentVNode("", true),
        vue.createElementVNode("span", _hoisted_7$5, [
          vue.createElementVNode("strong", null, [
            vue.createElementVNode("a", {
              href: `/member/${$props.comment.username}`,
              class: "username"
            }, vue.toDisplayString($props.comment.username), 9, _hoisted_8$5)
          ]),
          $props.comment.isOp ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_9$5, "OP")) : vue.createCommentVNode("", true),
          $props.comment.isDup ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10$5, "DUP")) : vue.createCommentVNode("", true),
          $props.comment.isMod ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11$5, "MOD")) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", _hoisted_12$5, vue.toDisplayString($props.comment.date), 1),
          $options.isLogin && $options.config.openTag ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 3 }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.myTags, (i) => {
              return vue.openBlock(), vue.createElementBlock("span", _hoisted_13$5, [
                _hoisted_14$5,
                vue.createElementVNode("span", null, vue.toDisplayString(i), 1),
                vue.createElementVNode("i", {
                  class: "fa fa-trash-o remove",
                  onClick: ($event) => $options.removeTag(i)
                }, null, 8, _hoisted_15$5)
              ]);
            }), 256)),
            vue.createElementVNode("span", {
              class: "add-tag ago",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.addTag && $options.addTag(...args)),
              title: "添加标签"
            }, "+")
          ], 64)) : vue.createCommentVNode("", true)
        ])
      ]),
      vue.createElementVNode("div", _hoisted_16$4, [
        $options.isLogin ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_17$4, [
          vue.createVNode(_component_PopConfirm, {
            title: "确认隐藏这条回复?",
            onConfirm: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("hide"))
          }, {
            default: vue.withCtx(() => [
              _hoisted_18$4
            ]),
            _: 1
          }),
          $options.context ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "tool",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.showRelationReply && $options.showRelationReply(...args))
          }, _hoisted_20$3)) : vue.createCommentVNode("", true),
          $props.type === "top" ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 1,
            class: "tool",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.jump && $options.jump(...args))
          }, _hoisted_22$2)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", {
            class: "tool",
            onClick: _cache[5] || (_cache[5] = ($event) => $options.checkIsLogin("reply"))
          }, _hoisted_25$2),
          vue.withDirectives(vue.createVNode(_component_Point, {
            item: $options.pointInfo,
            onAddThank: $options.addThank,
            onRecallThank: $options.recallThank,
            "api-url": "reply/" + $props.comment.id
          }, null, 8, ["item", "onAddThank", "onRecallThank", "api-url"]), [
            [vue.vShow, !$props.comment.thankCount]
          ])
        ])) : vue.createCommentVNode("", true),
        vue.withDirectives(vue.createVNode(_component_Point, {
          item: $options.pointInfo,
          onAddThank: $options.addThank,
          onRecallThank: $options.recallThank,
          "api-url": "reply/" + $props.comment.id
        }, null, 8, ["item", "onAddThank", "onRecallThank", "api-url"]), [
          [vue.vShow, $props.comment.thankCount]
        ]),
        vue.createElementVNode("div", {
          class: vue.normalizeClass(["floor", { isDev: $options.isDev }])
        }, vue.toDisplayString($options.isDev ? `a${$props.comment.floor}-` : $props.comment.floor), 3)
      ])
    ], 2);
  }
  const Author = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$5], ["__scopeId", "data-v-9f527c77"]]);
  const _withScopeId$6 = (n) => (vue.pushScopeId("data-v-5a28bd5d"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$a = { class: "get-cursor" };
  const _hoisted_2$9 = ["innerHTML"];
  const _hoisted_3$6 = { class: "toolbar" };
  const _hoisted_4$5 = { class: "left" };
  const _hoisted_5$5 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z",
    fill: "none",
    stroke: "#929596",
    "stroke-width": "2",
    "stroke-linejoin": "round"
  }, null, -1));
  const _hoisted_6$5 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M24 35C29 35 31 31 31 31H17C17 31 19 35 24 35Z",
    stroke: "#929596",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, null, -1));
  const _hoisted_7$4 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M31 18V22",
    stroke: "#929596",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, null, -1));
  const _hoisted_8$4 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M17 18V22",
    stroke: "#929596",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, null, -1));
  const _hoisted_9$4 = [
    _hoisted_5$5,
    _hoisted_6$5,
    _hoisted_7$4,
    _hoisted_8$4
  ];
  const _hoisted_10$4 = { class: "upload" };
  const _hoisted_11$4 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ vue.createElementVNode("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", {
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d: "M5 10C5 8.89543 5.89543 8 7 8L41 8C42.1046 8 43 8.89543 43 10V38C43 39.1046 42.1046 40 41 40H7C5.89543 40 5 39.1046 5 38V10Z",
      stroke: "#929596",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }),
    /* @__PURE__ */ vue.createElementVNode("path", {
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d: "M14.5 18C15.3284 18 16 17.3284 16 16.5C16 15.6716 15.3284 15 14.5 15C13.6716 15 13 15.6716 13 16.5C13 17.3284 13.6716 18 14.5 18Z",
      stroke: "#929596",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }),
    /* @__PURE__ */ vue.createElementVNode("path", {
      d: "M15 24L20 28L26 21L43 34V38C43 39.1046 42.1046 40 41 40H7C5.89543 40 5 39.1046 5 38V34L15 24Z",
      fill: "none",
      stroke: "#929596",
      "stroke-width": "2",
      "stroke-linejoin": "round"
    })
  ], -1));
  const _hoisted_12$4 = {
    key: 0,
    style: { "color": "black", "font-size": "1.4rem" }
  };
  const _hoisted_13$4 = { class: "right" };
  const _hoisted_14$4 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "title" }, "经典表情", -1));
  const _hoisted_15$4 = { class: "list" };
  const _hoisted_16$3 = ["src", "onClick"];
  const _hoisted_17$3 = { class: "emoji" };
  const _hoisted_18$3 = { class: "title" };
  const _hoisted_19$2 = { class: "list" };
  const _hoisted_20$2 = ["onClick"];
  const _sfc_main$a = {
    __name: "PostEditor",
    props: {
      replyUser: null,
      replyFloor: null,
      useType: {
        type: String,
        default() {
          return "reply-comment";
        }
      }
    },
    emits: ["close"],
    setup(__props, { expose, emit: emits }) {
      const props = __props;
      const { replyUser, replyFloor, useType } = props;
      const replyInfo = replyUser ? `@${replyUser} #${replyFloor} ` : "";
      const post = vue.inject("post");
      const show = vue.inject("show");
      const isNight = vue.inject("isNight");
      vue.inject("pageType");
      const allReplyUsers = vue.inject("allReplyUsers");
      let isFocus = vue.ref(false);
      const loading = vue.ref(false);
      const uploadLoading = vue.ref(false);
      const isShowEmoticons = vue.ref(false);
      const editorId = vue.ref("editorId_" + Date.now());
      const content = vue.ref(replyInfo);
      const txtRef = vue.ref(null);
      const cursorRef = vue.ref(null);
      const emoticonsRef = vue.ref(null);
      const none = vue.ref('<span style="white-space:pre-wrap;"> </span>');
      const emojiEmoticons = [
        {
          title: "小黄脸",
          list: [
            "😀",
            "😁",
            "😂",
            "🤣",
            "😅",
            "😊",
            "😋",
            "😘",
            "🥰",
            "😗",
            "🤩",
            "🤔",
            "🤨",
            "😐",
            "😑",
            "🙄",
            "😏",
            "😪",
            "😫",
            "🥱",
            "😜",
            "😒",
            "😔",
            "😨",
            "😰",
            "😱",
            "🥵",
            "😡",
            "🥳",
            "🥺",
            "🤭",
            "🧐",
            "😎",
            "🤓",
            "😭",
            "🤑",
            "🤮"
          ]
        },
        {
          title: "手势",
          list: [
            "🙋",
            "🙎",
            "🙅",
            "🙇",
            "🤷",
            "🤏",
            "👉",
            "✌️",
            "🤘",
            "🤙",
            "👌",
            "🤌",
            "👍",
            "👎",
            "👋",
            "🤝",
            "🙏",
            "👏"
          ]
        },
        {
          title: "庆祝",
          list: ["✨", "🎉", "🎊"]
        },
        {
          title: "其他",
          list: ["👻", "🤡", "🐔", "👀", "💩", "🐴", "🦄", "🐧", "🐶", "🐒", "🙈", "🙉", "🙊", "🐵"]
        }
      ];
      const classicsEmoticons = [
        {
          name: "[狗头]",
          low: "https://i.imgur.com/io2SM1h.png",
          high: "https://i.imgur.com/0icl60r.png"
        },
        {
          name: "[马]",
          low: "https://i.imgur.com/8EKZv7I.png",
          high: "https://i.imgur.com/ANFUX52.png"
        },
        {
          name: "[不高兴]",
          low: "https://i.imgur.com/huX6coX.png",
          high: "https://i.imgur.com/N7JEuvc.png"
        },
        {
          name: "[呵呵]",
          low: "https://i.imgur.com/RvoLAbX.png",
          high: "https://i.imgur.com/xSzIqrK.png"
        },
        {
          name: "[真棒]",
          low: "https://i.imgur.com/xr1UOz1.png",
          high: "https://i.imgur.com/w8YEw9Q.png"
        },
        {
          name: "[鄙视]",
          low: "https://i.imgur.com/u6jlqVq.png",
          high: "https://i.imgur.com/8JFNANq.png"
        },
        {
          name: "[疑问]",
          low: "https://i.imgur.com/F29pmQ6.png",
          high: "https://i.imgur.com/EbbTQAR.png"
        },
        {
          name: "[吐舌]",
          low: "https://i.imgur.com/InmIzl9.png",
          high: "https://i.imgur.com/Ovj56Cd.png"
        },
        // {
        //   name: '[嘲笑]',
        //   low: 'https://i.imgur.com/BaWcsMR.png',
        //   high: 'https://i.imgur.com/0OGfJw4.png'
        // },
        // {
        //   name: '[滑稽]',
        //   low: 'https://i.imgur.com/lmbN0yI.png',
        //   high: 'https://i.imgur.com/Pc0wH85.png'
        // },
        {
          name: "[笑眼]",
          low: "https://i.imgur.com/ZveiiGy.png",
          high: "https://i.imgur.com/PI1CfEr.png"
        },
        {
          name: "[狂汗]",
          low: "https://i.imgur.com/veWihk6.png",
          high: "https://i.imgur.com/3LtHdQv.png"
        },
        {
          name: "[大哭]",
          low: "https://i.imgur.com/hu4oR6C.png",
          high: "https://i.imgur.com/b4X9XLE.png"
        },
        {
          name: "[喷]",
          low: "https://i.imgur.com/bkw3VRr.png",
          high: "https://i.imgur.com/wnZL13L.png"
        },
        {
          name: "[苦笑]",
          low: "https://i.imgur.com/VUWFktU.png",
          high: "https://i.imgur.com/NAfspZ1.png"
        },
        {
          name: "[喝酒]",
          low: "https://i.imgur.com/2ZZSapE.png",
          high: "https://i.imgur.com/rVbSVak.png"
        },
        {
          name: "[吃瓜]",
          low: "https://i.imgur.com/ee8Lq7H.png",
          high: "https://i.imgur.com/0L26og9.png"
        },
        {
          name: "[捂脸]",
          low: "https://i.imgur.com/krir4IG.png",
          high: "https://i.imgur.com/qqBqgVm.png"
        },
        {
          name: "[呕]",
          low: "https://i.imgur.com/6CUiUxv.png",
          high: "https://i.imgur.com/kgdxRsG.png"
        },
        {
          name: "[阴险]",
          low: "https://i.imgur.com/MA8YqTP.png",
          high: "https://i.imgur.com/e94jbaT.png"
        },
        {
          name: "[怒]",
          low: "https://i.imgur.com/n4kWfGB.png",
          high: "https://i.imgur.com/iMXxNxh.png"
        },
        {
          name: "[衰]",
          low: "https://i.imgur.com/voHFDyQ.png",
          high: "https://i.imgur.com/XffE6gu.png"
        },
        {
          name: "[合十]",
          low: "https://i.imgur.com/I8x3ang.png",
          high: "https://i.imgur.com/T4rJVee.png"
        },
        {
          name: "[赞]",
          low: "https://i.imgur.com/lG44yUl.png",
          high: "https://i.imgur.com/AoF5PLp.png"
        },
        {
          name: "[踩]",
          low: "https://i.imgur.com/cJp0uKZ.png",
          high: "https://i.imgur.com/1XYGfXj.png"
        },
        {
          name: "[爱心]",
          low: "https://i.imgur.com/sLENaF5.png",
          high: "https://i.imgur.com/dND56oX.png"
        },
        {
          name: "[心碎]",
          low: "https://i.imgur.com/AZxJzve.png",
          high: "https://i.imgur.com/RiUsPci.png"
        }
      ];
      const imgurClientIdPool = [
        "3107b9ef8b316f3",
        "442b04f26eefc8a",
        "59cfebe717c09e4",
        "60605aad4a62882",
        "6c65ab1d3f5452a",
        "83e123737849aa9",
        "9311f6be1c10160",
        "c4a4a563f698595",
        "81be04b9e4a08ce"
      ];
      expose({ content });
      const editorClass = vue.computed(() => {
        return [useType, isFocus.value ? "isFocus" : "", isNight.value ? "isNight" : ""];
      });
      const cursorHtml = vue.computed(() => {
        var _a;
        if (!txtRef.value || !content.value)
          return "";
        let index2 = ((_a = txtRef.value) == null ? void 0 : _a.selectionStart) || 0;
        return content.value.substring(0, index2).replace(/</g, "<").replace(/>/g, ">").replace(/\n/g, "<br/>").replace(/\s/g, none.value);
      });
      const disabled = vue.computed(() => {
        if (content.value) {
          return content.value === replyInfo;
        } else {
          return true;
        }
      });
      function drop(e) {
        e.preventDefault();
        upload(e.dataTransfer.files[0]);
      }
      async function upload(file) {
        if (!file)
          return;
        if (uploadLoading.value)
          return;
        uploadLoading.value = true;
        const formData = new FormData();
        formData.append("image", file);
        const randomIndex = Math.floor(Math.random() * imgurClientIdPool.length);
        const clidenId = imgurClientIdPool[randomIndex];
        const res = await fetch("https://api.imgur.com/3/upload", {
          method: "POST",
          headers: { Authorization: `Client-ID ${clidenId}` },
          body: formData
        });
        uploadLoading.value = false;
        if (res.ok) {
          const resData = await res.json();
          if (resData.success) {
            return insert(" " + resData.data.link + " ");
          }
        }
        eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "上传失败" });
      }
      async function submit() {
        if (disabled.value || loading.value)
          return;
        loading.value = true;
        let submit_content = content.value.replace(/\[((?!\[).)+\]/g, function(match) {
          let item2 = classicsEmoticons.find((v) => v.name === match);
          if (item2) {
            return item2.low + " ";
          }
          return match;
        });
        let show_content = content.value.replace(/https?:\/\/(i\.)?imgur\.com\/((?!http).)+\.(gif|png|jpg|jpeg|GIF|PNG|JPG|JPEG)/g, function(match) {
          return `<img src="${match}" data-originUrl="${match}" data-notice="这个img标签由v2ex-超级增强脚本解析" style="max-width: 100%">`;
        });
        show_content = show_content.replace(/\[((?!\[).)+\]/g, function(match) {
          let item2 = classicsEmoticons.find((v) => v.name === match);
          if (item2) {
            return `<a target="_blank" href="${item2.low}" rel="nofollow noopener"><img src="${item2.low}" class="embedded_image" rel="noreferrer"></a> `;
          }
          return match;
        });
        let matchUsers = show_content.match(/@([\w]+?[\s])/g);
        if (matchUsers) {
          matchUsers.map((i) => {
            let username = i.replace("@", "").replace(" ", "");
            show_content = show_content.replace(username, `<a href="/member/${username}">${username}</a>`);
          });
        }
        show_content = show_content.replaceAll("\n", "<br/>");
        console.log("show_content", show_content);
        let item = {
          thankCount: 0,
          isThanked: false,
          isOp: post.value.username === window.user.username,
          isDup: false,
          id: Date.now(),
          username: window.user.username,
          avatar: window.user.avatar,
          date: "几秒前",
          floor: post.value.replyCount + 1,
          reply_content: show_content ?? "",
          children: [],
          replyUsers: replyUser ? [replyUser] : [],
          replyFloor: replyFloor || -1,
          level: useType === "reply-comment" ? 1 : 0
        };
        item.hideCallUserReplyContent = item.reply_content;
        if (item.replyUsers.length === 1) {
          item.hideCallUserReplyContent = item.reply_content.replace(/@<a href="\/member\/[\s\S]+?<\/a>(\s#[\d]+)?\s(<br>)?/, () => "");
        }
        let url = `${window.baseUrl}/t/${post.value.id}`;
        $.post(url, { content: submit_content, once: post.value.once }).then(
          (res) => {
            loading.value = false;
            let r = res.search("你上一条回复的内容和这条相同");
            if (r > -1)
              return eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "你上一条回复的内容和这条相同" });
            r = res.search("请不要在每一个回复中都包括外链，这看起来像是在 spamming");
            if (r > -1)
              return eventBus.emit(CMD.SHOW_MSG, {
                type: "error",
                text: "请不要在每一个回复中都包括外链，这看起来像是在 spamming"
              });
            let r2 = res.search("创建新回复");
            if (r2 > -1) {
              eventBus.emit(CMD.REFRESH_ONCE, res);
              eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "回复失败" });
              let clientWidth = window.win().document.body.clientWidth;
              let windowWidth = 1200;
              let left = clientWidth / 2 - windowWidth / 2;
              let newWin = window.win().open("about:blank", "hello", `width=${windowWidth},height=600,left=${left},top=100`);
              newWin.document.write(res);
              return;
            }
            content.value = replyInfo;
            emits("close");
            eventBus.emit(CMD.REFRESH_ONCE, res);
            eventBus.emit(CMD.SHOW_MSG, { type: "success", text: "回复成功" });
            eventBus.emit(CMD.ADD_REPLY, item);
          },
          (err) => {
            console.log("err", err);
            loading.value = false;
            eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "回复失败" });
          }
        ).catch((r) => {
          console.log("cathc", r);
        });
      }
      function showEmoticons(e) {
        if (isShowEmoticons.value) {
          return isShowEmoticons.value = false;
        }
        let rect = e.currentTarget.getBoundingClientRect();
        emoticonsRef.value.style.left = rect.left + 30 + "px";
        emoticonsRef.value.style.bottom = window.innerHeight - rect.top - 20 + "px";
        isShowEmoticons.value = true;
      }
      function off() {
        eventBus.emit(CMD.SHOW_CALL, { show: false });
        eventBus.off(CMD.SET_CALL);
      }
      function checkHeight() {
        txtRef.value.style.height = 0;
        txtRef.value.style.height = txtRef.value.scrollHeight + "px";
      }
      function insert(str) {
        let cursorPos = txtRef.value.selectionStart;
        let start = content.value.slice(0, cursorPos);
        let end = content.value.slice(cursorPos, content.value.length);
        content.value = start + str + end;
        let moveCursorPos = start.length + str.length;
        setTimeout(() => {
          txtRef.value.focus();
          txtRef.value.setSelectionRange(moveCursorPos, moveCursorPos);
          checkHeight();
        });
      }
      function showCallPopover(text) {
        let r = cursorRef.value.getBoundingClientRect();
        eventBus.emit(CMD.SHOW_CALL, { show: true, top: r.top, left: r.left, text });
        eventBus.off(CMD.SET_CALL);
        eventBus.on(CMD.SET_CALL, (e) => {
          let cursorPos = txtRef.value.selectionStart;
          let start = content.value.slice(0, cursorPos);
          let end = content.value.slice(cursorPos, content.value.length);
          let lastCallPos = start.lastIndexOf("@");
          start = content.value.slice(0, lastCallPos + 1);
          if (e === "管理员") {
            e = "Livid @Kai @Olivia @GordianZ @sparanoid";
          }
          if (e === "所有人") {
            e = allReplyUsers.value.map((v, i) => {
              if (i)
                return "@" + v;
              else
                return v;
            }).join(" ");
          }
          content.value = start + e + " " + end;
          let moveCursorPos = start.length + e.length + 1;
          setTimeout(() => {
            txtRef.value.setSelectionRange(moveCursorPos, moveCursorPos);
            checkHeight();
          });
          eventBus.off(CMD.SET_CALL);
        });
      }
      function onKeydown(e) {
        let code = e.keyCode;
        switch (code) {
          case 8:
            if (content.value === "@") {
              off();
            }
            break;
          case 37:
          case 38:
          case 39:
          case 40:
            setTimeout(() => onInput({ data: "" }), 100);
            break;
          case 27:
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
          case 13:
            if (e.ctrlKey)
              submit();
            break;
        }
      }
      function onInput(e) {
        let cursorPos = txtRef.value.selectionStart;
        if (!content.value)
          return;
        if (e.data === " ") {
          return off();
        }
        if (e.data === "@") {
          if (content.value.length !== 1) {
            if (content.value[cursorPos - 2] === " " || content.value[cursorPos - 2] === "\n") {
              return showCallPopover("");
            }
          } else {
            return showCallPopover("");
          }
          off();
        } else {
          let judgeStr = content.value.slice(0, cursorPos);
          let lastCallPos = judgeStr.lastIndexOf("@");
          if (lastCallPos === -1) {
            return off();
          }
          let callStr = judgeStr.slice(lastCallPos, cursorPos);
          let hasSpace = callStr.includes(" ");
          if (hasSpace) {
            off();
          } else {
            if (lastCallPos === 0) {
              return showCallPopover(callStr.replace("@", ""));
            }
            if (content.value.length !== 1) {
              if (content.value[lastCallPos - 1] === " " || content.value[lastCallPos - 1] === "\n") {
                return showCallPopover(callStr.replace("@", ""));
              }
            } else {
              return showCallPopover(callStr.replace("@", ""));
            }
            off();
          }
        }
      }
      function onPaste(e) {
        const dataTransferItemList = e.clipboardData.items;
        const items = [].slice.call(dataTransferItemList).filter(function(item) {
          return item.type.indexOf("image") !== -1;
        });
        if (items.length === 0) {
          return;
        }
        const dataTransferItem = items[0];
        const blob = dataTransferItem.getAsFile();
        upload(blob);
      }
      function onBlur() {
        document.removeEventListener("paste", onPaste);
        isFocus.value = false;
      }
      function onFocusin() {
        document.addEventListener("paste", onPaste);
      }
      vue.watch(() => show, (n) => {
        if (n.value)
          isShowEmoticons.value = false;
      }, { deep: true });
      vue.onMounted(() => {
        $(`.${editorId.value}`).each(function() {
          this.setAttribute("style", "height:" + this.scrollHeight + "px;overflow-y:hidden;");
        }).on("input", function() {
          this.style.height = 0;
          this.style.height = this.scrollHeight + "px";
        });
        if (useType === "reply-comment") {
          txtRef.value && txtRef.value.focus();
        }
      });
      vue.onBeforeUnmount(() => {
        $(`.${editorId.value}`).off();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(["post-editor-wrapper", vue.unref(editorClass)])
        }, [
          vue.withDirectives(vue.createElementVNode("textarea", {
            class: vue.normalizeClass(["post-editor", editorId.value]),
            ref_key: "txtRef",
            ref: txtRef,
            onFocus: _cache[0] || (_cache[0] = ($event) => vue.isRef(isFocus) ? isFocus.value = true : isFocus = true),
            onBlur,
            onFocusin,
            placeholder: "请尽量让自己的回复能够对别人有帮助",
            onInput,
            onKeydown,
            onDrop: drop,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => content.value = $event)
          }, null, 34), [
            [vue.vModelText, content.value]
          ]),
          vue.createElementVNode("div", _hoisted_1$a, [
            vue.createElementVNode("span", { innerHTML: vue.unref(cursorHtml) }, null, 8, _hoisted_2$9),
            vue.createElementVNode("span", {
              class: "cursor",
              ref_key: "cursorRef",
              ref: cursorRef
            }, "|", 512)
          ]),
          vue.createElementVNode("div", _hoisted_3$6, [
            vue.createElementVNode("div", _hoisted_4$5, [
              (vue.openBlock(), vue.createElementBlock("svg", {
                onClick: showEmoticons,
                width: "20",
                height: "20",
                viewBox: "0 0 48 48",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg"
              }, _hoisted_9$4)),
              vue.createElementVNode("div", _hoisted_10$4, [
                vue.createElementVNode("input", {
                  type: "file",
                  accept: "image/*",
                  onChange: _cache[2] || (_cache[2] = (e) => upload(e.currentTarget.files[0]))
                }, null, 32),
                _hoisted_11$4
              ]),
              uploadLoading.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_12$4, "上传中.....")) : vue.createCommentVNode("", true)
            ]),
            vue.createElementVNode("div", _hoisted_13$4, [
              vue.unref(useType) === "reply-comment" ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                style: { "margin-right": "1rem", "cursor": "pointer" },
                onClick: _cache[3] || (_cache[3] = ($event) => emits("close"))
              }, "关闭")) : vue.createCommentVNode("", true),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(["button", { disabled: vue.unref(disabled), loading: loading.value }]),
                onClick: submit
              }, "回复 ", 2)
            ])
          ]),
          vue.withDirectives(vue.createElementVNode("div", {
            class: "emoticon-pack",
            ref_key: "emoticonsRef",
            ref: emoticonsRef
          }, [
            vue.createElementVNode("i", {
              class: "fa fa-times",
              "aria-hidden": "true",
              onClick: _cache[4] || (_cache[4] = ($event) => isShowEmoticons.value = false)
            }),
            _hoisted_14$4,
            vue.createElementVNode("div", _hoisted_15$4, [
              (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(classicsEmoticons, (item) => {
                return vue.createElementVNode("img", {
                  src: item.high,
                  onClick: ($event) => {
                    insert(item.name);
                    isShowEmoticons.value = false;
                  }
                }, null, 8, _hoisted_16$3);
              }), 64))
            ]),
            vue.createElementVNode("div", _hoisted_17$3, [
              (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(emojiEmoticons, (item) => {
                return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
                  vue.createElementVNode("div", _hoisted_18$3, vue.toDisplayString(item.title), 1),
                  vue.createElementVNode("div", _hoisted_19$2, [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(item.list, (emoji) => {
                      return vue.openBlock(), vue.createElementBlock("span", {
                        onClick: ($event) => {
                          insert(emoji);
                          isShowEmoticons.value = false;
                        }
                      }, vue.toDisplayString(emoji), 9, _hoisted_20$2);
                    }), 256))
                  ])
                ], 64);
              }), 64))
            ])
          ], 512), [
            [vue.vShow, isShowEmoticons.value]
          ])
        ], 2);
      };
    }
  };
  const PostEditor = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-5a28bd5d"]]);
  const _hoisted_1$9 = {
    key: 0,
    class: "html-wrapper"
  };
  const _hoisted_2$8 = ["innerHTML"];
  const _sfc_main$9 = {
    __name: "BaseHtmlRender",
    props: ["html"],
    setup(__props) {
      const props = __props;
      const config2 = vue.inject("config");
      const contentRef = vue.ref(null);
      const checkHeight = 900;
      const mask = vue.ref(false);
      const handOpen = vue.ref(false);
      function mouseup(e) {
        if (!config2.value.base64)
          return;
        let selectionText = window.win().getSelection().toString();
        if (selectionText) {
          let r = selectionText.match(/([A-Za-z0-9+/=]+)/g);
          if (r) {
            if (r[0].length < 4)
              return;
            eventBus.emit(CMD.SHOW_TOOLTIP, { text: r[0], e });
          }
        }
      }
      vue.watch(config2.value, (newVale) => {
        if (!newVale.contentAutoCollapse) {
          mask.value = false;
        }
      });
      vue.watch([() => contentRef.value, () => props.html], () => {
        if (!contentRef.value || !props.html)
          return;
        if (!config2.value.contentAutoCollapse)
          return;
        contentRef.value.querySelectorAll("img").forEach((item) => {
          item.removeEventListener("load", checkContentHeight);
          item.addEventListener("load", checkContentHeight);
        });
        checkContentHeight();
      }, { immediate: true, flush: "post" });
      function checkContentHeight() {
        if (handOpen.value)
          return;
        let rect = contentRef.value.getBoundingClientRect();
        mask.value = rect.height >= checkHeight;
      }
      return (_ctx, _cache) => {
        return props.html ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$9, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass({ mask: mask.value })
          }, [
            vue.createElementVNode("div", {
              ref_key: "contentRef",
              ref: contentRef,
              innerHTML: props.html,
              onMouseup: mouseup
            }, null, 40, _hoisted_2$8)
          ], 2),
          mask.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "expand",
            onClick: _cache[0] || (_cache[0] = ($event) => {
              mask.value = false;
              handOpen.value = true;
            })
          }, "展开")) : vue.createCommentVNode("", true)
        ])) : vue.createCommentVNode("", true);
      };
    }
  };
  const BaseHtmlRender = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-8ffbfeb2"]]);
  const _sfc_main$8 = {
    name: "Comment",
    components: { BaseHtmlRender, Author, PostEditor, Point },
    inject: ["post", "postDetailWidth", "show", "isNight", "config"],
    props: {
      modelValue: {
        reply_content: ""
      },
      type: {
        type: String,
        default() {
          return "list";
        }
      }
    },
    data() {
      return {
        showOrigin: false,
        edit: false,
        ding: false,
        expand: true,
        expandWrong: false,
        replyInfo: `@${this.modelValue.username} #${this.modelValue.floor} `,
        cssStyle: null,
        floor: this.modelValue.floor
      };
    },
    watch: {
      show(e) {
        if (e) {
          this.edit = false;
        }
      },
      postDetailWidth(n, o) {
        this.checkIsTooLong(n);
      }
    },
    computed: {
      myClass() {
        return {
          isOp: this.modelValue.isOp,
          isSimple: this.config.simple,
          ding: this.ding,
          isLevelOne: this.modelValue.level === 0,
          ["c_" + this.floor]: this.type !== "top"
        };
      }
    },
    mounted() {
      this.checkIsTooLong(this.postDetailWidth);
    },
    methods: {
      checkIsTooLong(postDetailWidth) {
        if (postDetailWidth !== 0) {
          let rect = this.$refs.comment.getBoundingClientRect();
          let ban = postDetailWidth / 2;
          console.log("ban", ban);
          if (ban < rect.width && rect.width < ban + 25 && this.modelValue.children.length) {
            this.expand = false;
            let padding = 2;
            this.cssStyle = {
              padding: "1rem 0",
              width: `calc(${postDetailWidth}px - ${padding}rem)`,
              transform: `translateX(calc(${rect.width - postDetailWidth}px + ${padding}rem))`,
              background: this.isNight ? "#18222d" : "white"
            };
          }
        }
      },
      //高亮一下
      showDing() {
        this.ding = true;
        setTimeout(() => {
          this.ding = false;
        }, 2e3);
      },
      hide() {
        let url = `${window.baseUrl}/ignore/reply/${this.modelValue.id}?once=${this.post.once}`;
        eventBus.emit(CMD.REMOVE, this.modelValue.floor);
        $.post(url).then((res) => {
          eventBus.emit(CMD.REFRESH_ONCE);
          eventBus.emit(CMD.SHOW_MSG, { type: "success", text: "隐藏成功" });
        }, (err) => {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "隐藏成功,仅本次有效（接口调用失败！）" });
        });
      },
      toggle() {
        this.expand = !this.expand;
      },
      toggleContent() {
        if (this.modelValue.level === 0)
          return;
        this.showOrigin = !this.showOrigin;
      }
    }
  };
  const _withScopeId$5 = (n) => (vue.pushScopeId("data-v-7fe2bffd"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$8 = ["data-floor"];
  const _hoisted_2$7 = { class: "comment-content" };
  const _hoisted_3$5 = { class: "right" };
  const _hoisted_4$4 = { class: "w" };
  const _hoisted_5$4 = {
    key: 0,
    class: "wrong-wrapper"
  };
  const _hoisted_6$4 = ["href"];
  const _hoisted_7$3 = { class: "del-line" };
  const _hoisted_8$3 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("i", {
    class: "fa fa-question-circle-o wrong-icon",
    "aria-hidden": "true"
  }, null, -1));
  const _hoisted_9$3 = {
    key: 0,
    class: "warning"
  };
  const _hoisted_10$3 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_11$3 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_12$3 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_13$3 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_14$3 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_15$3 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("a", {
    href: "https://github.com/zyronon/v2ex-script/discussions/7",
    target: "_blank"
  }, "这里", -1));
  const _hoisted_16$2 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("p", null, "---原文---", -1));
  const _hoisted_17$2 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("p", null, "-----------", -1));
  const _hoisted_18$2 = { class: "simple-wrapper" };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Author = vue.resolveComponent("Author");
    const _component_BaseHtmlRender = vue.resolveComponent("BaseHtmlRender");
    const _component_PostEditor = vue.resolveComponent("PostEditor");
    const _component_Comment = vue.resolveComponent("Comment", true);
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["comment", $options.myClass]),
      ref: "comment",
      "data-floor": $data.floor
    }, [
      vue.createVNode(_component_Author, {
        modelValue: $data.expand,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.expand = $event),
        comment: $props.modelValue,
        onReply: _cache[1] || (_cache[1] = ($event) => $data.edit = !$data.edit),
        type: $props.type,
        onHide: $options.hide
      }, null, 8, ["modelValue", "comment", "type", "onHide"]),
      $data.cssStyle && !$data.expand ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: "more ago",
        onClick: _cache[2] || (_cache[2] = ($event) => $data.expand = !$data.expand)
      }, " 由于嵌套回复层级太深，自动将后续回复隐藏 ")) : vue.createCommentVNode("", true),
      $data.expand ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: "comment-content-w",
        style: vue.normalizeStyle($data.cssStyle)
      }, [
        $data.cssStyle ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: "more ago",
          onClick: _cache[3] || (_cache[3] = ($event) => $data.expand = !$data.expand)
        }, " 由于嵌套回复层级太深，自动将以下回复移至可见范围 ")) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", _hoisted_2$7, [
          vue.createElementVNode("div", {
            class: "left expand-line",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.toggle && $options.toggle(...args))
          }),
          vue.createElementVNode("div", _hoisted_3$5, [
            vue.createElementVNode("div", _hoisted_4$4, [
              $props.modelValue.isWrong ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5$4, [
                vue.createElementVNode("span", {
                  onClick: _cache[5] || (_cache[5] = ($event) => $data.expandWrong = !$data.expandWrong),
                  title: "点击楼层号查看提示"
                }, [
                  vue.createElementVNode("a", {
                    href: "/member/" + $props.modelValue.replyUsers[0]
                  }, "@" + vue.toDisplayString($props.modelValue.replyUsers[0]) + "  ", 9, _hoisted_6$4),
                  vue.createElementVNode("span", _hoisted_7$3, "#" + vue.toDisplayString($props.modelValue.replyFloor), 1),
                  _hoisted_8$3
                ]),
                $data.expandWrong ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_9$3, [
                  vue.createTextVNode(" 这条回复似乎有点问题，指定的楼层号与@的人对应不上 "),
                  _hoisted_10$3,
                  vue.createTextVNode(" 原因可能有下面几种： "),
                  _hoisted_11$3,
                  vue.createTextVNode(" 一、屏蔽用户导致楼层塌陷：你屏蔽了A，自A以后的回复的楼层号都会减1 "),
                  _hoisted_12$3,
                  vue.createTextVNode(" 二、忽略回复导致楼层塌陷：原理同上 "),
                  _hoisted_13$3,
                  vue.createTextVNode(" 三、层主回复时指定错了楼层号（同一，层主屏蔽了别人，导致楼层塌陷） "),
                  _hoisted_14$3,
                  vue.createTextVNode(" 四、脚本解析错误，请在"),
                  _hoisted_15$3,
                  vue.createTextVNode("反馈 ")
                ])) : vue.createCommentVNode("", true)
              ])) : vue.createCommentVNode("", true),
              $options.config.commentDisplayType === 4 ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                $data.showOrigin ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  onDblclick: _cache[6] || (_cache[6] = (...args) => $options.toggleContent && $options.toggleContent(...args))
                }, [
                  _hoisted_16$2,
                  vue.createVNode(_component_BaseHtmlRender, {
                    class: "reply_content",
                    html: $props.modelValue.reply_content
                  }, null, 8, ["html"]),
                  _hoisted_17$2
                ], 32)) : vue.createCommentVNode("", true),
                vue.createVNode(_component_BaseHtmlRender, {
                  class: "reply_content",
                  onDblclick: $options.toggleContent,
                  html: $props.modelValue.hideCallUserReplyContent
                }, null, 8, ["onDblclick", "html"])
              ], 64)) : (vue.openBlock(), vue.createBlock(_component_BaseHtmlRender, {
                key: 2,
                class: "reply_content",
                html: $props.modelValue.reply_content
              }, null, 8, ["html"])),
              $data.edit ? (vue.openBlock(), vue.createBlock(_component_PostEditor, {
                key: 3,
                onClose: _cache[7] || (_cache[7] = ($event) => $data.edit = false),
                replyInfo: $data.replyInfo,
                replyUser: $props.modelValue.username,
                replyFloor: $props.modelValue.floor
              }, null, 8, ["replyInfo", "replyUser", "replyFloor"])) : vue.createCommentVNode("", true)
            ]),
            vue.createElementVNode("div", _hoisted_18$2, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.modelValue.children, (item, index2) => {
                return vue.openBlock(), vue.createBlock(_component_Comment, {
                  modelValue: $props.modelValue.children[index2],
                  "onUpdate:modelValue": ($event) => $props.modelValue.children[index2] = $event,
                  key: index2
                }, null, 8, ["modelValue", "onUpdate:modelValue"]);
              }), 128))
            ])
          ])
        ]),
        $data.cssStyle ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: "more ago",
          onClick: _cache[8] || (_cache[8] = ($event) => $data.expand = !$data.expand)
        }, " 由于嵌套回复层级太深，自动将以上回复移至可见范围 ")) : vue.createCommentVNode("", true)
      ], 4)) : vue.createCommentVNode("", true)
    ], 10, _hoisted_1$8);
  }
  const Comment = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$4], ["__scopeId", "data-v-7fe2bffd"]]);
  const _sfc_main$7 = {
    name: "Toolbar",
    inject: [
      "isLogin",
      "post",
      "pageType"
    ],
    data() {
      return {
        timer: null,
        loading: false,
        loading2: false,
        loading3: false
      };
    },
    methods: {
      checkIsLogin(emitName = "") {
        if (!this.isLogin) {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "请先登录！" });
          return false;
        }
        this.$emit(emitName);
        return true;
      },
      getColor(val) {
        return val ? "#ff4500" : "#929596";
      },
      getIsFull(val) {
        return val ? "#ff4500" : "none";
      },
      tweet() {
        if (!this.checkIsLogin())
          return;
        let username = window.user.username;
        let url = `https://twitter.com/intent/tweet?url=${window.baseUrl}/t/${this.post.id}?r=${username}&related=v2ex&text=${this.post.title}`;
        window.win().open(url, "_blank", "width=550,height=370");
      },
      report() {
        if (!this.checkIsLogin())
          return;
        if (!this.isLogin)
          return;
        if (this.post.isReport)
          return;
        let username = window.user.username;
        let url = `https://twitter.com/share?url=${window.baseUrl}/t/${this.post.id}?r=${username}&amp;related=v2ex&amp;hashtags=apple&amp;text=${this.post.title}`;
        window.win().open(url, "_blank", "width=550,height=370");
      },
      async toggleIgnore() {
        if (!this.checkIsLogin())
          return;
        let url = `${window.baseUrl}/${this.post.isIgnore ? "unignore" : "ignore"}/topic/${this.post.id}?once=${this.post.once}`;
        if (this.pageType === "post") {
          this.loading2 = true;
          let apiRes = await window.win().fetch(url);
          if (apiRes.redirected) {
            if (!this.post.isIgnore) {
              window.win().location = window.baseUrl;
            }
            eventBus.emit(CMD.SHOW_MSG, { type: "success", text: this.post.isIgnore ? "取消成功" : "忽略成功" });
            eventBus.emit(CMD.MERGE, { isIgnore: !this.post.isIgnore });
          } else {
            eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "忽略失败" });
          }
          this.loading2 = false;
        } else {
          if (this.post.isIgnore) {
            this.loading2 = true;
          } else {
            eventBus.emit(CMD.IGNORE);
          }
          let apiRes = await window.win().fetch(url);
          if (apiRes.redirected) {
            if (this.post.isIgnore) {
              eventBus.emit(CMD.REFRESH_ONCE);
            }
            eventBus.emit(CMD.SHOW_MSG, { type: "success", text: this.post.isIgnore ? "取消成功" : "忽略成功" });
            eventBus.emit(CMD.MERGE, { isIgnore: !this.post.isIgnore });
          } else {
            eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "忽略成功,仅本次有效（接口调用失败！）" });
          }
          this.loading2 = false;
        }
      },
      async toggleFavorite() {
        if (!this.post.isFavorite && config.collectBrowserNotice) {
          alert("请按Command/Cmd/CTRL + D添加到书签");
        }
        if (!this.checkIsLogin())
          return;
        this.loading = true;
        let url = `${window.baseUrl}/${this.post.isFavorite ? "unfavorite" : "favorite"}/topic/${this.post.id}?once=${this.post.once}`;
        let apiRes = await window.win().fetch(url);
        this.loading = false;
        if (apiRes.redirected) {
          let htmlText = await apiRes.text();
          if (htmlText.search(this.post.isFavorite ? "加入收藏" : "取消收藏")) {
            eventBus.emit(CMD.MERGE, { collectCount: this.post.isFavorite ? this.post.collectCount - 1 : this.post.collectCount + 1 });
            eventBus.emit(CMD.SHOW_MSG, { type: "success", text: this.post.isFavorite ? "取消成功" : "收藏成功" });
            eventBus.emit(CMD.REFRESH_ONCE, htmlText);
            eventBus.emit(CMD.MERGE, { isFavorite: !this.post.isFavorite });
            return;
          }
        }
        eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "操作失败" });
      }
    }
  };
  const _withScopeId$4 = (n) => (vue.pushScopeId("data-v-07fa3ae8"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$7 = { class: "toolbar" };
  const _hoisted_2$6 = /* @__PURE__ */ vue.createStaticVNode('<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-07fa3ae8><path d="M4 6H44V36H29L24 41L19 36H4V6Z" fill="none" stroke="#929596" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-07fa3ae8></path><path d="M23 21H25.0025" stroke="#929596" stroke-width="2" stroke-linecap="round" data-v-07fa3ae8></path><path d="M33.001 21H34.9999" stroke="#929596" stroke-width="2" stroke-linecap="round" data-v-07fa3ae8></path><path d="M13.001 21H14.9999" stroke="#929596" stroke-width="2" stroke-linecap="round" data-v-07fa3ae8></path></svg><span data-v-07fa3ae8>回复</span>', 2);
  const _hoisted_4$3 = [
    _hoisted_2$6
  ];
  const _hoisted_5$3 = {
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };
  const _hoisted_6$3 = ["fill", "stroke"];
  const _hoisted_7$2 = {
    key: 1,
    class: "tool no-hover"
  };
  const _hoisted_8$2 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("svg", {
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", {
      d: "M28 6H42V20",
      stroke: "#929596",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }),
    /* @__PURE__ */ vue.createElementVNode("path", {
      d: "M42 29.4737V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9C6 7.34315 7.34315 6 9 6L18 6",
      stroke: "#929596",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }),
    /* @__PURE__ */ vue.createElementVNode("path", {
      d: "M25.7998 22.1999L41.0998 6.8999",
      stroke: "#929596",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    })
  ], -1));
  const _hoisted_9$2 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("span", null, "Tweet", -1));
  const _hoisted_10$2 = [
    _hoisted_8$2,
    _hoisted_9$2
  ];
  const _hoisted_11$2 = {
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };
  const _hoisted_12$2 = ["fill", "stroke"];
  const _hoisted_13$2 = ["fill", "stroke"];
  const _hoisted_14$2 = ["fill", "stroke"];
  const _hoisted_15$2 = /* @__PURE__ */ vue.createStaticVNode('<svg width="19" height="19" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-07fa3ae8><path d="M36 35H12V21C12 14.3726 17.3726 9 24 9C30.6274 9 36 14.3726 36 21V35Z" fill="#929596" stroke="#929596" stroke-width="4" stroke-linejoin="round" data-v-07fa3ae8></path><path d="M8 42H40" stroke="#929596" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" data-v-07fa3ae8></path><path d="M4 13L7 14" stroke="#929596" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" data-v-07fa3ae8></path><path d="M13 3.9999L14 6.9999" stroke="#929596" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" data-v-07fa3ae8></path><path d="M10.0001 9.99989L7.00009 6.99989" stroke="#929596" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" data-v-07fa3ae8></path></svg>', 1);
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$7, [
      vue.createElementVNode("div", {
        class: "tool",
        onClick: _cache[0] || (_cache[0] = ($event) => $options.checkIsLogin("reply"))
      }, _hoisted_4$3),
      $options.post.once ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(["tool", { loading: $data.loading }]),
        onClick: _cache[1] || (_cache[1] = (...args) => $options.toggleFavorite && $options.toggleFavorite(...args))
      }, [
        (vue.openBlock(), vue.createElementBlock("svg", _hoisted_5$3, [
          vue.createElementVNode("path", {
            d: "M23.9986 5L17.8856 17.4776L4 19.4911L14.0589 29.3251L11.6544 43L23.9986 36.4192L36.3454 43L33.9586 29.3251L44 19.4911L30.1913 17.4776L23.9986 5Z",
            fill: $options.getIsFull($options.post.isFavorite),
            stroke: $options.getColor($options.post.isFavorite),
            "stroke-width": "2",
            "stroke-linejoin": "round"
          }, null, 8, _hoisted_6$3)
        ])),
        vue.createElementVNode("span", null, vue.toDisplayString($options.post.isFavorite ? "取消收藏" : "加入收藏"), 1)
      ], 2)) : vue.createCommentVNode("", true),
      $options.post.once && $options.post.collectCount !== 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7$2, [
        vue.createElementVNode("span", null, vue.toDisplayString($options.post.collectCount + "人收藏"), 1)
      ])) : vue.createCommentVNode("", true),
      vue.createElementVNode("div", {
        class: "tool",
        onClick: _cache[2] || (_cache[2] = (...args) => $options.tweet && $options.tweet(...args))
      }, _hoisted_10$2),
      $options.post.once ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 2,
        class: vue.normalizeClass(["tool", { "loading": $data.loading2 }]),
        onClick: _cache[3] || (_cache[3] = (...args) => $options.toggleIgnore && $options.toggleIgnore(...args))
      }, [
        (vue.openBlock(), vue.createElementBlock("svg", _hoisted_11$2, [
          vue.createElementVNode("path", {
            fill: $options.getIsFull($options.post.isIgnore),
            stroke: $options.getColor($options.post.isIgnore),
            d: "M9.85786 18C6.23858 21 4 24 4 24C4 24 12.9543 36 24 36C25.3699 36 26.7076 35.8154 28 35.4921M20.0318 12.5C21.3144 12.1816 22.6414 12 24 12C35.0457 12 44 24 44 24C44 24 41.7614 27 38.1421 30",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, null, 8, _hoisted_12$2),
          vue.createElementVNode("path", {
            fill: $options.getIsFull($options.post.isIgnore),
            d: "M20.3142 20.6211C19.4981 21.5109 19 22.6972 19 23.9998C19 26.7612 21.2386 28.9998 24 28.9998C25.3627 28.9998 26.5981 28.4546 27.5 27.5705",
            stroke: $options.getColor($options.post.isIgnore),
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, null, 8, _hoisted_13$2),
          vue.createElementVNode("path", {
            d: "M42 42L6 6",
            fill: $options.getIsFull($options.post.isIgnore),
            stroke: $options.getColor($options.post.isIgnore),
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, null, 8, _hoisted_14$2)
        ])),
        vue.createElementVNode("span", null, vue.toDisplayString($options.post.isIgnore ? "取消忽略" : "忽略主题"), 1)
      ], 2)) : vue.createCommentVNode("", true),
      $options.post.once && $options.post.isLogin ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 3,
        class: vue.normalizeClass(["tool", { "loading": $data.loading3, "no-hover": $options.post.isLogin }]),
        onClick: _cache[4] || (_cache[4] = (...args) => $options.report && $options.report(...args))
      }, [
        _hoisted_15$2,
        vue.createElementVNode("span", null, vue.toDisplayString($options.post.isReport ? "你已对本主题进行了报告" : "报告这个主题"), 1)
      ], 2)) : vue.createCommentVNode("", true)
    ]);
  }
  const Toolbar = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$3], ["__scopeId", "data-v-07fa3ae8"]]);
  const _withScopeId$3 = (n) => (vue.pushScopeId("data-v-0b71f2b8"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$6 = ["href"];
  const _hoisted_2$5 = ["src"];
  const _hoisted_3$4 = { class: "texts" };
  const _hoisted_4$2 = {
    key: 0,
    class: "point"
  };
  const _hoisted_5$2 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ vue.createElementVNode("svg", {
    width: "19",
    height: "19",
    viewBox: "0 0 48 48",
    fill: "none"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", {
      d: "M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z",
      fill: "#E02A2A",
      stroke: "#E02A2A",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    })
  ], -1));
  const _hoisted_6$2 = { class: "num" };
  const _hoisted_7$1 = { class: "my-tag" };
  const _hoisted_8$1 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "fa fa-tag" }, null, -1));
  const _hoisted_9$1 = {
    key: 2,
    class: "ago"
  };
  const _hoisted_10$1 = {
    key: 3,
    class: "mod"
  };
  const _hoisted_11$1 = {
    key: 4,
    class: "op"
  };
  const _hoisted_12$1 = ["href"];
  const _hoisted_13$1 = {
    key: 5,
    class: "op"
  };
  const _hoisted_14$1 = {
    key: 6,
    class: "mod"
  };
  const _hoisted_15$1 = {
    key: 7,
    class: "ago"
  };
  const _hoisted_16$1 = { class: "my-tag" };
  const _hoisted_17$1 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "fa fa-tag" }, null, -1));
  const _hoisted_18$1 = {
    key: 9,
    class: "point"
  };
  const _hoisted_19$1 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ vue.createElementVNode("svg", {
    width: "19",
    height: "19",
    viewBox: "0 0 48 48",
    fill: "none"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", {
      d: "M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z",
      fill: "#E02A2A",
      stroke: "#E02A2A",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    })
  ], -1));
  const _hoisted_20$1 = { class: "num" };
  const _hoisted_21$1 = ["href"];
  const _hoisted_22$1 = ["src"];
  const _hoisted_23$1 = { class: "Author-right" };
  const _hoisted_24$1 = { class: "floor" };
  const _hoisted_25$1 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ vue.createElementVNode("span", null, "跳转", -1));
  const _hoisted_26$1 = [
    _hoisted_25$1
  ];
  const _sfc_main$6 = {
    __name: "SingleComment",
    props: {
      comment: {
        reply_content: ""
      },
      isRight: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    setup(__props) {
      const props = __props;
      const config2 = vue.inject("config");
      const isLogin = vue.inject("isLogin");
      const tags = vue.inject("tags");
      const myTags = vue.computed(() => {
        return tags[props.comment.username] ?? [];
      });
      function jump() {
        eventBus.emit(CMD.JUMP, props.comment.floor);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(["comment", { isSimple: vue.unref(config2).simple }]),
          ref: "comment"
        }, [
          !__props.isRight ? (vue.openBlock(), vue.createElementBlock("a", {
            key: 0,
            class: "avatar",
            href: `/member/${__props.comment.username}`
          }, [
            vue.createElementVNode("img", {
              src: __props.comment.avatar,
              alt: ""
            }, null, 8, _hoisted_2$5)
          ], 8, _hoisted_1$6)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["comment-body", { isRight: __props.isRight }])
          }, [
            vue.createElementVNode("div", _hoisted_3$4, [
              __props.comment.thankCount && __props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$2, [
                _hoisted_5$2,
                vue.createElementVNode("div", _hoisted_6$2, vue.toDisplayString(__props.comment.thankCount), 1)
              ])) : vue.createCommentVNode("", true),
              vue.unref(isLogin) && vue.unref(config2).openTag && __props.isRight ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(vue.unref(myTags), (i) => {
                return vue.openBlock(), vue.createElementBlock("span", _hoisted_7$1, [
                  _hoisted_8$1,
                  vue.createElementVNode("span", null, vue.toDisplayString(i), 1)
                ]);
              }), 256)) : vue.createCommentVNode("", true),
              __props.isRight ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_9$1, vue.toDisplayString(__props.comment.date), 1)) : vue.createCommentVNode("", true),
              __props.comment.isMod && __props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10$1, "MOD")) : vue.createCommentVNode("", true),
              __props.comment.isOp && __props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11$1, "OP")) : vue.createCommentVNode("", true),
              vue.createElementVNode("a", {
                href: `/member/${__props.comment.username}`,
                class: "username"
              }, vue.toDisplayString(__props.comment.username), 9, _hoisted_12$1),
              __props.comment.isOp && !__props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_13$1, "OP")) : vue.createCommentVNode("", true),
              __props.comment.isMod && !__props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_14$1, "MOD")) : vue.createCommentVNode("", true),
              !__props.isRight ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_15$1, vue.toDisplayString(__props.comment.date), 1)) : vue.createCommentVNode("", true),
              vue.unref(isLogin) && vue.unref(config2).openTag && !__props.isRight ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 8 }, vue.renderList(vue.unref(myTags), (i) => {
                return vue.openBlock(), vue.createElementBlock("span", _hoisted_16$1, [
                  _hoisted_17$1,
                  vue.createElementVNode("span", null, vue.toDisplayString(i), 1)
                ]);
              }), 256)) : vue.createCommentVNode("", true),
              __props.comment.thankCount && !__props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_18$1, [
                _hoisted_19$1,
                vue.createElementVNode("div", _hoisted_20$1, vue.toDisplayString(__props.comment.thankCount), 1)
              ])) : vue.createCommentVNode("", true)
            ]),
            vue.createVNode(vue.unref(BaseHtmlRender), {
              class: "reply_content",
              html: __props.comment.reply_content
            }, null, 8, ["html"])
          ], 2),
          __props.isRight ? (vue.openBlock(), vue.createElementBlock("a", {
            key: 1,
            class: "avatar",
            href: `/member/${__props.comment.username}`
          }, [
            vue.createElementVNode("img", {
              src: __props.comment.avatar,
              alt: ""
            }, null, 8, _hoisted_22$1)
          ], 8, _hoisted_21$1)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", _hoisted_23$1, [
            vue.createElementVNode("div", _hoisted_24$1, vue.toDisplayString(__props.comment.floor), 1),
            vue.createElementVNode("div", {
              class: "tool jump",
              onClick: jump
            }, _hoisted_26$1)
          ])
        ], 2);
      };
    }
  };
  const SingleComment = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-0b71f2b8"]]);
  function debounce(fn, delay, scope) {
    let timer = null;
    return function() {
      let context = scope || this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(context, args);
        timer = null;
      }, delay);
    };
  }
  const _sfc_main$5 = {
    name: "detail",
    components: {
      SingleComment,
      PopConfirm,
      Comment,
      PostEditor,
      Point,
      Toolbar,
      BaseHtmlRender,
      Tooltip
    },
    inject: ["allReplyUsers", "post", "isLogin", "config", "pageType", "isNight", "showConfig"],
    provide() {
      return {
        postDetailWidth: vue.computed(() => this.postDetailWidth)
      };
    },
    props: {
      modelValue: {
        type: Boolean,
        default() {
          return false;
        }
      },
      loading: {
        type: Boolean,
        default() {
          return false;
        }
      },
      displayType: 0
    },
    data() {
      return {
        isSticky: false,
        selectCallIndex: 0,
        postDetailWidth: 0,
        showCallList: false,
        showRelationReply: false,
        replyText: "",
        callStyle: {
          top: 0,
          left: 0
        },
        targetUser: {
          left: [],
          right: "",
          rightFloor: -1
        },
        debounceScroll: () => {
        },
        read: {
          floor: 0,
          total: 0
        },
        currentFloor: 1
      };
    },
    computed: {
      isPost() {
        return this.pageType === PageType.Post;
      },
      filterCallList() {
        if (this.showCallList) {
          let list = ["管理员", "所有人"].concat(this.allReplyUsers);
          if (this.replyText)
            return list.filter((i) => i.search(this.replyText) > -1);
          return list;
        }
        return [];
      },
      topReply() {
        return this.post.replyList.filter((v) => v.thankCount >= this.config.topReplyLoveMinCount).sort((a, b) => b.thankCount - a.thankCount).slice(0, this.config.topReplyCount);
      },
      replyList() {
        if ([0, 4].includes(this.displayType))
          return this.post.nestedReplies;
        if (this.displayType === 1) {
          return window.clone(this.post.nestedReplies).sort((a, b) => b.thankCount - a.thankCount);
        }
        if (this.displayType === 2)
          return this.post.replyList;
        if (this.displayType === 5)
          return this.post.nestedRedundReplies;
        if (this.displayType === 3)
          return this.post.replyList.filter((v) => {
            var _a;
            return v.username === ((_a = this.post.member) == null ? void 0 : _a.username);
          });
        return [];
      },
      //关联回复
      relationReply() {
        if (this.targetUser.left.length && this.targetUser.right) {
          return this.post.replyList.filter((v) => {
            if (this.targetUser.left.includes(v.username)) {
              if (v.floor > this.targetUser.rightFloor) {
                if (v.replyUsers.includes(this.targetUser.right)) {
                  return true;
                }
              } else {
                return true;
              }
            }
            if (v.username === this.targetUser.right) {
              for (let i = 0; i < this.targetUser.left.length; i++) {
                if (v.replyUsers.includes(this.targetUser.left[i])) {
                  return true;
                }
              }
            }
          });
        }
        return [];
      }
    },
    watch: {
      "post.id"(n, o) {
        if (this.$refs["post-editor"]) {
          this.$refs["post-editor"].content = "";
          vue.nextTick(() => {
            var _a, _b;
            (_b = (_a = this.$refs) == null ? void 0 : _a.detail) == null ? void 0 : _b.scrollTo({ top: 0 });
          });
        }
      },
      modelValue: {
        handler(newVal) {
          if (this.isPost)
            return;
          if (newVal) {
            document.body.style.overflow = "hidden";
            this.read = this.post.read;
            this.currentFloor = 1;
            vue.nextTick(() => {
              var _a, _b;
              (_b = (_a = this.$refs) == null ? void 0 : _a.main) == null ? void 0 : _b.focus();
            });
          } else {
            this.$emit("saveReadList");
            document.body.style.overflow = "unset";
            this.isSticky = false;
            this.showRelationReply = false;
            if ((this.pageType === PageType.Home || this.pageType === PageType.Node) && window.location.pathname !== "/") {
              window.history.back();
            }
          }
        }
      }
    },
    mounted() {
      setTimeout(() => {
        var _a;
        this.postDetailWidth = ((_a = this.$refs.mainWrapper) == null ? void 0 : _a.getBoundingClientRect().width) || 0;
      });
      this.debounceScroll = debounce(this.scroll, 300, false);
      if (this.isLogin) {
        const observer = new IntersectionObserver(
          ([e]) => e.target.toggleAttribute("stuck", e.intersectionRatio < 1),
          { threshold: [1] }
        );
        observer.observe(this.$refs.replyBox);
        window.addEventListener("keydown", this.onKeyDown);
      }
      eventBus.on(CMD.SHOW_CALL, (val) => {
        if (val.show) {
          this.showCallList = true;
          this.replyText = val.text;
          if (this.isPost) {
            this.callStyle.top = val.top + $(window.win()).scrollTop() + -40 + "px";
          } else {
            this.callStyle.top = val.top + $(".post-detail").scrollTop() + 15 + "px";
          }
          this.callStyle.left = val.left - $(".main")[0].getBoundingClientRect().left + 10 + "px";
          if (this.selectCallIndex >= this.filterCallList.length) {
            this.selectCallIndex = 0;
          }
        } else {
          this.replyText = "";
          this.showCallList = false;
          this.selectCallIndex = 0;
        }
      });
      eventBus.on(CMD.RELATION_REPLY, (val) => {
        this.targetUser = val;
        this.showRelationReply = true;
      });
      eventBus.on(CMD.JUMP, this.jump);
      if (this.isPost) {
        window.addEventListener("scroll", this.debounceScroll);
      }
    },
    beforeUnmount() {
      window.removeEventListener("keydown", this.onKeyDown);
      eventBus.off(CMD.SHOW_CALL);
    },
    methods: {
      scroll() {
        if (!this.config.rememberLastReadFloor)
          return;
        let height = window.innerHeight * 0.3;
        let comments = $(".comments  .comment");
        let forCount = 0;
        for (let i = 0; i < comments.length; i++) {
          forCount++;
          let ins = comments[i];
          let rect = ins.getBoundingClientRect();
          if (rect.top > height) {
            let lastReadFloor = Number(ins.dataset["floor"]);
            console.log("当前阅读楼层", lastReadFloor);
            eventBus.emit(CMD.ADD_READ, {
              floor: lastReadFloor > 3 ? lastReadFloor : 0,
              total: this.post.replyList.length
            });
            if (lastReadFloor > 3) {
              this.read.floor = 0;
            }
            break;
          }
        }
        if (forCount === comments.length) {
          console.log("看到最后了");
          eventBus.emit(CMD.ADD_READ, {
            floor: forCount,
            total: this.post.replyList.length
          });
        }
      },
      stop(e) {
      },
      jump(floor) {
        try {
          floor = Number(floor);
        } catch (e) {
        }
        if (!floor)
          return;
        if (!this.post.replyList.length) {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "没有回复可跳转！" });
          this.read.floor = 0;
          return;
        }
        if (floor > this.post.replyList.length) {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "没有找到对应回复！" });
          this.read.floor = 0;
          return;
        }
        let comment = $(`.c_${floor}`);
        if (!comment.length) {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "没有找到对应回复！" });
          this.read.floor = 0;
          return;
        }
        comment[0].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        comment.addClass("ding");
        this.read.floor = 0;
        this.currentFloor = floor + 1;
        setTimeout(() => {
          comment.removeClass("ding");
        }, 2e3);
      },
      jumpLastRead(floor) {
        if (this.config.autoJumpLastReadFloor) {
          if (!floor)
            return;
          setTimeout(() => {
            console.log("上次跳转", floor);
            this.jump(floor);
            eventBus.emit(CMD.SHOW_MSG, { type: "success", text: "已跳转到上次阅读位置" });
          }, 300);
        }
      },
      collapseTopReplyList() {
        $(this.$refs.topReply).slideToggle("fast");
      },
      goBottom() {
        this.isSticky = false;
        setTimeout(() => {
          if (this.isPost) {
            let body = $("body , html");
            let scrollHeight = body.prop("scrollHeight");
            body.animate({ scrollTop: scrollHeight - 850 }, 300);
          } else {
            this.$refs.detail.scrollTo({ top: this.$refs.detail.scrollHeight, behavior: "smooth" });
          }
        });
      },
      close(from) {
        if (this.isPost)
          return;
        if (from === "space") {
          if (this.config.closePostDetailBySpace) {
            this.$emit("update:modelValue", false);
          }
        } else {
          this.$emit("update:modelValue", false);
        }
      },
      setCall(e) {
        eventBus.emit(CMD.SET_CALL, e);
        this.showCallList = false;
      },
      onKeyDown(e) {
        if (!this.modelValue)
          return;
        if (!this.showCallList)
          return;
        let length = this.filterCallList.slice(0, 10).length;
        if (e.keyCode === 13) {
          this.setCall(this.filterCallList[this.selectCallIndex]);
          e.preventDefault();
        }
        if (e.keyCode === 38) {
          this.selectCallIndex--;
          if (this.selectCallIndex < 0) {
            this.selectCallIndex = length - 1;
          }
          e.preventDefault();
        }
        if (e.keyCode === 40) {
          this.selectCallIndex++;
          if (this.selectCallIndex > length - 1) {
            this.selectCallIndex = 0;
          }
          e.preventDefault();
        }
      },
      changeOption(item) {
        this.$emit("update:displayType", item);
      },
      addThank() {
        eventBus.emit(CMD.CHANGE_POST_THANK, { id: this.post.id, type: "add" });
      },
      recallThank() {
        eventBus.emit(CMD.CHANGE_POST_THANK, { id: this.post.id, type: "recall" });
      },
      scrollTop() {
        if (this.isPost) {
          $("body , html").animate({ scrollTop: 0 }, 300);
        } else {
          this.$refs.detail.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }
  };
  const _withScopeId$2 = (n) => (vue.pushScopeId("data-v-ad1d5ea7"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$5 = { class: "my-box post-wrapper" };
  const _hoisted_2$4 = { class: "toolbar-wrapper" };
  const _hoisted_3$3 = {
    key: 0,
    class: "my-box"
  };
  const _hoisted_4$1 = { class: "my-cell flex" };
  const _hoisted_5$1 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("span", { class: "gray" }, "高赞回复", -1));
  const _hoisted_6$1 = { class: "top-reply" };
  const _hoisted_7 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "fa fa-times" }, null, -1));
  const _hoisted_8 = { ref: "topReply" };
  const _hoisted_9 = { class: "my-box comment-wrapper" };
  const _hoisted_10 = {
    key: 0,
    class: "my-cell flex"
  };
  const _hoisted_11 = {
    key: 0,
    class: "read-notice"
  };
  const _hoisted_12 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("span", null, "上次打开：", -1));
  const _hoisted_13 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "fa fa-long-arrow-down" }, null, -1));
  const _hoisted_14 = [
    _hoisted_13
  ];
  const _hoisted_15 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "fa fa-long-arrow-down" }, null, -1));
  const _hoisted_16 = [
    _hoisted_15
  ];
  const _hoisted_17 = { class: "my-cell flex" };
  const _hoisted_18 = { class: "gray" };
  const _hoisted_19 = { key: 0 };
  const _hoisted_20 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("strong", { class: "snow" }, "•", -1));
  const _hoisted_21 = ["innerHTML"];
  const _hoisted_22 = {
    key: 0,
    class: "loading-wrapper"
  };
  const _hoisted_23 = {
    key: 1,
    class: "comments"
  };
  const _hoisted_24 = {
    key: 1,
    id: "no-comments-yet"
  };
  const _hoisted_25 = { class: "my-cell flex" };
  const _hoisted_26 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("span", null, "添加一条新回复", -1));
  const _hoisted_27 = { class: "notice-right" };
  const _hoisted_28 = { class: "w" };
  const _hoisted_29 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("span", { class: "gray" }, "上下文", -1));
  const _hoisted_30 = { class: "top-reply" };
  const _hoisted_31 = ["onClick"];
  const _hoisted_32 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("i", {
    class: "fa fa-times",
    "aria-hidden": "true"
  }, null, -1));
  const _hoisted_33 = [
    _hoisted_32
  ];
  const _hoisted_34 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("i", {
    class: "fa fa-long-arrow-up",
    "aria-hidden": "true"
  }, null, -1));
  const _hoisted_35 = [
    _hoisted_34
  ];
  const _hoisted_36 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "fa fa-long-arrow-down" }, null, -1));
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BaseHtmlRender = vue.resolveComponent("BaseHtmlRender");
    const _component_Point = vue.resolveComponent("Point");
    const _component_Toolbar = vue.resolveComponent("Toolbar");
    const _component_Tooltip = vue.resolveComponent("Tooltip");
    const _component_PopConfirm = vue.resolveComponent("PopConfirm");
    const _component_Comment = vue.resolveComponent("Comment");
    const _component_PostEditor = vue.resolveComponent("PostEditor");
    const _component_SingleComment = vue.resolveComponent("SingleComment");
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["post-detail", [$options.isNight ? "isNight" : "", $options.pageType]]),
      ref: "detail",
      onKeydown: _cache[25] || (_cache[25] = vue.withKeys(($event) => $options.close(), ["esc"])),
      onScroll: _cache[26] || (_cache[26] = (...args) => $data.debounceScroll && $data.debounceScroll(...args)),
      onClick: _cache[27] || (_cache[27] = ($event) => $options.close("space"))
    }, [
      vue.createElementVNode("div", {
        ref: "main",
        class: "main",
        tabindex: "1",
        onClick: _cache[24] || (_cache[24] = vue.withModifiers((...args) => $options.stop && $options.stop(...args), ["stop"]))
      }, [
        vue.createElementVNode("div", {
          class: "main-wrapper",
          ref: "mainWrapper",
          style: vue.normalizeStyle({ width: $options.config.postWidth })
        }, [
          vue.createElementVNode("div", _hoisted_1$5, [
            vue.createVNode(_component_BaseHtmlRender, {
              html: $options.post.headerTemplate
            }, null, 8, ["html"]),
            vue.createElementVNode("div", _hoisted_2$4, [
              vue.createVNode(_component_Point, {
                onAddThank: $options.addThank,
                onRecallThank: $options.recallThank,
                full: false,
                item: {
                  isThanked: $options.post.isThanked,
                  thankCount: $options.post.thankCount,
                  username: $options.post.username
                },
                "api-url": "topic/" + $options.post.id
              }, null, 8, ["onAddThank", "onRecallThank", "item", "api-url"]),
              vue.createVNode(_component_Toolbar, {
                onReply: _cache[0] || (_cache[0] = ($event) => $data.isSticky = !$data.isSticky)
              })
            ])
          ]),
          $options.topReply.length && $options.config.showTopReply ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$3, [
            vue.createElementVNode("div", _hoisted_4$1, [
              _hoisted_5$1,
              vue.createElementVNode("div", _hoisted_6$1, [
                vue.createVNode(_component_Tooltip, {
                  title: `统计点赞数大于等于${$options.config.topReplyLoveMinCount}个的回复，可在设置中调整`
                }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("i", {
                      class: "fa fa-info",
                      onClick: _cache[1] || (_cache[1] = ($event) => $options.showConfig())
                    })
                  ]),
                  _: 1
                }, 8, ["title"]),
                vue.createVNode(_component_PopConfirm, {
                  title: "关闭后不再默认显示，可在设置里重新打开，确认关闭？",
                  onConfirm: _cache[2] || (_cache[2] = ($event) => $options.config.showTopReply = false)
                }, {
                  default: vue.withCtx(() => [
                    _hoisted_7
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_Tooltip, { title: "收起高赞回复" }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("i", {
                      class: "fa fa-compress",
                      onClick: _cache[3] || (_cache[3] = (...args) => $options.collapseTopReplyList && $options.collapseTopReplyList(...args))
                    })
                  ]),
                  _: 1
                })
              ])
            ]),
            vue.createElementVNode("div", _hoisted_8, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.topReply, (item, index2) => {
                return vue.openBlock(), vue.createBlock(_component_Comment, {
                  key: item.floor,
                  type: "top",
                  modelValue: $options.topReply[index2],
                  "onUpdate:modelValue": ($event) => $options.topReply[index2] = $event
                }, null, 8, ["modelValue", "onUpdate:modelValue"]);
              }), 128))
            ], 512)
          ])) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", _hoisted_9, [
            $options.post.replyList.length || $props.loading ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
              $options.config.showToolbar ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10, [
                vue.createElementVNode("div", {
                  class: vue.normalizeClass(["radio-group2", { isNight: $options.isNight }])
                }, [
                  vue.createVNode(_component_Tooltip, { title: "不隐藏@用户" }, {
                    default: vue.withCtx(() => [
                      vue.createElementVNode("div", {
                        class: vue.normalizeClass(["radio", $props.displayType === 0 ? "active" : ""]),
                        onClick: _cache[4] || (_cache[4] = ($event) => $options.changeOption(0))
                      }, "楼中楼(@) ", 2)
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_Tooltip, { title: "隐藏第一个@用户，双击内容可显示原文" }, {
                    default: vue.withCtx(() => [
                      vue.createElementVNode("div", {
                        class: vue.normalizeClass(["radio", $props.displayType === 4 ? "active" : ""]),
                        onClick: _cache[5] || (_cache[5] = ($event) => $options.changeOption(4))
                      }, "楼中楼 ", 2)
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_Tooltip, { title: "重复显示楼中楼的回复" }, {
                    default: vue.withCtx(() => [
                      vue.createElementVNode("div", {
                        class: vue.normalizeClass(["radio", $props.displayType === 5 ? "active" : ""]),
                        onClick: _cache[6] || (_cache[6] = ($event) => $options.changeOption(5))
                      }, "冗余楼中楼 ", 2)
                    ]),
                    _: 1
                  }),
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["radio", $props.displayType === 1 ? "active" : ""]),
                    onClick: _cache[7] || (_cache[7] = ($event) => $options.changeOption(1))
                  }, "感谢 ", 2),
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["radio", $props.displayType === 3 ? "active" : ""]),
                    onClick: _cache[8] || (_cache[8] = ($event) => $options.changeOption(3))
                  }, "只看楼主 ", 2),
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["radio", $props.displayType === 2 ? "active" : ""]),
                    onClick: _cache[9] || (_cache[9] = ($event) => $options.changeOption(2))
                  }, "V2原版 ", 2)
                ], 2),
                $data.read.floor || $data.read.total ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11, [
                  _hoisted_12,
                  $data.read.floor ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                    vue.createElementVNode("span", null, [
                      vue.createTextVNode("阅读到"),
                      vue.createElementVNode("b", null, vue.toDisplayString($data.read.floor), 1),
                      vue.createTextVNode("楼")
                    ]),
                    vue.createElementVNode("div", {
                      class: "jump jump1",
                      onClick: _cache[10] || (_cache[10] = ($event) => $options.jump($data.read.floor))
                    }, _hoisted_14)
                  ], 64)) : vue.createCommentVNode("", true),
                  vue.createElementVNode("span", null, [
                    vue.createTextVNode("总楼层"),
                    vue.createElementVNode("b", null, vue.toDisplayString($data.read.total), 1)
                  ]),
                  vue.createElementVNode("div", {
                    class: "jump",
                    onClick: _cache[11] || (_cache[11] = ($event) => $options.jump($data.read.total))
                  }, _hoisted_16)
                ])) : vue.createCommentVNode("", true)
              ])) : vue.createCommentVNode("", true),
              vue.createElementVNode("div", _hoisted_17, [
                vue.createElementVNode("span", _hoisted_18, [
                  vue.createTextVNode(vue.toDisplayString($options.post.replyCount) + " 条回复 ", 1),
                  $options.post.createDate ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_19, [
                    vue.createTextVNode("  "),
                    _hoisted_20,
                    vue.createTextVNode("  " + vue.toDisplayString($options.post.createDate), 1)
                  ])) : vue.createCommentVNode("", true)
                ]),
                vue.createElementVNode("div", {
                  class: "fr",
                  innerHTML: $options.post.fr
                }, null, 8, _hoisted_21)
              ])
            ], 64)) : vue.createCommentVNode("", true),
            $options.replyList.length || $props.loading ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
              $props.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_22, [
                vue.createElementVNode("div", {
                  class: vue.normalizeClass([$options.isNight ? "loading-b" : "loading-c"])
                }, null, 2)
              ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_23, [
                $props.modelValue ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList($options.replyList, (item, index2) => {
                  return vue.openBlock(), vue.createBlock(_component_Comment, {
                    key: item.floor,
                    modelValue: $options.replyList[index2],
                    "onUpdate:modelValue": ($event) => $options.replyList[index2] = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]);
                }), 128)) : vue.createCommentVNode("", true)
              ]))
            ], 64)) : vue.createCommentVNode("", true)
          ]),
          !($options.replyList.length || $props.loading) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_24, "目前尚无回复")) : vue.createCommentVNode("", true),
          $options.isLogin ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 2,
            class: vue.normalizeClass(["my-box editor-wrapper", { "sticky": $data.isSticky }]),
            ref: "replyBox"
          }, [
            vue.createElementVNode("div", _hoisted_25, [
              _hoisted_26,
              vue.createElementVNode("div", _hoisted_27, [
                $data.isSticky ? (vue.openBlock(), vue.createElementBlock("a", {
                  key: 0,
                  class: "float",
                  onClick: _cache[12] || (_cache[12] = ($event) => $data.isSticky = false)
                }, "取消回复框停靠")) : vue.createCommentVNode("", true),
                vue.createElementVNode("a", {
                  onClick: _cache[13] || (_cache[13] = (...args) => $options.scrollTop && $options.scrollTop(...args))
                }, "回到顶部")
              ])
            ]),
            vue.createElementVNode("div", _hoisted_28, [
              vue.createVNode(_component_PostEditor, {
                onClose: $options.goBottom,
                ref: "post-editor",
                useType: "reply-post",
                onClick: _cache[14] || (_cache[14] = ($event) => $data.isSticky = true)
              }, null, 8, ["onClose"])
            ])
          ], 2)) : vue.createCommentVNode("", true)
        ], 4),
        $data.showRelationReply ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: "relationReply",
          onClick: _cache[18] || (_cache[18] = ($event) => $options.close("space"))
        }, [
          vue.createElementVNode("div", {
            class: "my-cell flex",
            onClick: _cache[16] || (_cache[16] = vue.withModifiers((...args) => $options.stop && $options.stop(...args), ["stop"]))
          }, [
            _hoisted_29,
            vue.createElementVNode("div", _hoisted_30, [
              vue.createElementVNode("i", {
                class: "fa fa-times",
                onClick: _cache[15] || (_cache[15] = ($event) => $data.showRelationReply = false)
              })
            ])
          ]),
          vue.createElementVNode("div", {
            class: "comments",
            onClick: _cache[17] || (_cache[17] = vue.withModifiers((...args) => $options.stop && $options.stop(...args), ["stop"]))
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.relationReply, (item, index2) => {
              return vue.openBlock(), vue.createBlock(_component_SingleComment, {
                "is-right": item.username === $data.targetUser.right,
                key: item.floor,
                comment: item
              }, null, 8, ["is-right", "comment"]);
            }), 128))
          ])
        ])) : vue.createCommentVNode("", true),
        $data.showCallList && $options.filterCallList.length ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: "call-list",
          style: vue.normalizeStyle($data.callStyle)
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.filterCallList.slice(0, 10), (item, index2) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              class: vue.normalizeClass(["call-item", { select: index2 === $data.selectCallIndex }]),
              onClick: ($event) => $options.setCall(item)
            }, [
              vue.createElementVNode("a", null, vue.toDisplayString(item), 1)
            ], 10, _hoisted_31);
          }), 256))
        ], 4)) : vue.createCommentVNode("", true),
        $options.config.closePostDetailBySpace ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 2,
          class: "close-btn",
          onClick: _cache[19] || (_cache[19] = ($event) => $options.close("btn"))
        }, _hoisted_33)) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", {
          class: "scroll-top button",
          onClick: _cache[20] || (_cache[20] = vue.withModifiers((...args) => $options.scrollTop && $options.scrollTop(...args), ["stop"]))
        }, _hoisted_35),
        vue.createElementVNode("div", {
          class: "scroll-to button",
          onClick: _cache[23] || (_cache[23] = vue.withModifiers(($event) => $options.jump($data.currentFloor), ["stop"]))
        }, [
          _hoisted_36,
          vue.withDirectives(vue.createElementVNode("input", {
            type: "text",
            "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => $data.currentFloor = $event),
            onClick: _cache[22] || (_cache[22] = vue.withModifiers((...args) => $options.stop && $options.stop(...args), ["stop"]))
          }, null, 512), [
            [vue.vModelText, $data.currentFloor]
          ])
        ])
      ], 512)
    ], 34)), [
      [vue.vShow, $props.modelValue]
    ]);
  }
  const PostDetail = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$2], ["__scopeId", "data-v-ad1d5ea7"]]);
  const _withScopeId$1 = (n) => (vue.pushScopeId("data-v-19fe372d"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$4 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", {
      d: "M17 32L19.1875 27M31 32L28.8125 27M19.1875 27L24 16L28.8125 27M19.1875 27H28.8125",
      stroke: "#929596",
      "stroke-width": "4",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }),
    /* @__PURE__ */ vue.createElementVNode("path", {
      d: "M43.1999 20C41.3468 10.871 33.2758 4 23.5999 4C13.9241 4 5.85308 10.871 4 20L10 18",
      stroke: "#929596",
      "stroke-width": "4",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }),
    /* @__PURE__ */ vue.createElementVNode("path", {
      d: "M4 28C5.85308 37.129 13.9241 44 23.5999 44C33.2758 44 41.3468 37.129 43.1999 28L38 30",
      stroke: "#929596",
      "stroke-width": "4",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    })
  ], -1));
  const _hoisted_2$3 = { key: 1 };
  const _sfc_main$4 = {
    __name: "Base64Tooltip",
    setup(__props) {
      const tooltip = vue.ref(null);
      const show = vue.ref(false);
      const originalText = vue.ref("");
      const decodeText = vue.ref("");
      const styleObject = vue.reactive({
        left: "-100vw",
        top: "-100vh"
      });
      vue.onMounted(() => {
        eventBus.on(CMD.SHOW_TOOLTIP, ({ text, e }) => {
          setTimeout(() => show.value = true);
          originalText.value = text;
          decodeText.value = "";
          styleObject.left = e.clientX + "px";
          styleObject.top = e.clientY + 20 + "px";
        });
        window.addEventListener("click", (e) => {
          if (!tooltip.value)
            return;
          if (!tooltip.value.contains(e.target) && show.value) {
            show.value = false;
          }
        }, { capture: true });
        const fn = () => show.value && (show.value = false);
        $(".post-detail", window.win().doc).on("scroll", fn);
      });
      function copy() {
        if (window.win().navigator.clipboard) {
          window.win().navigator.clipboard.writeText(decodeText.value);
          eventBus.emit(CMD.SHOW_MSG, { type: "success", text: "复制成功" });
        } else {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "复制失败！浏览器不支持！" });
        }
      }
      function base64ToArrayBuffer(base64) {
        let binary_string = window.atob(base64);
        let len = binary_string.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
      }
      function decode() {
        try {
          new Blob([base64ToArrayBuffer(originalText.value)]).text().then((r) => {
            decodeText.value = r;
          });
        } catch (e) {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "Base64解码失败！不是标准数据！" });
        }
      }
      return (_ctx, _cache) => {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          class: "base64_tooltip",
          style: vue.normalizeStyle(styleObject),
          onClick: decode,
          ref_key: "tooltip",
          ref: tooltip
        }, [
          !decodeText.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
            vue.createTextVNode(" Base64解码：" + vue.toDisplayString(originalText.value) + " ", 1),
            _hoisted_1$4
          ], 64)) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$3, [
            vue.createElementVNode("span", null, vue.toDisplayString(decodeText.value), 1),
            vue.createElementVNode("div", {
              class: "button",
              onClick: copy
            }, "点击复制")
          ]))
        ], 4)), [
          [vue.vShow, show.value]
        ]);
      };
    }
  };
  const Base64Tooltip = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-19fe372d"]]);
  const _sfc_main$3 = {
    name: "Msg",
    props: {
      type: "",
      text: ""
    },
    created() {
      setTimeout(() => {
        this.$emit("close");
      }, 3e3);
    }
  };
  const _hoisted_1$3 = /* @__PURE__ */ vue.createElementVNode("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", {
      d: "M14 14L34 34",
      stroke: "#ffffff",
      "stroke-width": "4",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }),
    /* @__PURE__ */ vue.createElementVNode("path", {
      d: "M14 34L34 14",
      stroke: "#ffffff",
      "stroke-width": "4",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    })
  ], -1);
  const _hoisted_2$2 = [
    _hoisted_1$3
  ];
  const _hoisted_3$2 = { class: "right" };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["msg", $props.type])
    }, [
      vue.createElementVNode("div", {
        class: "left",
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
      }, _hoisted_2$2),
      vue.createElementVNode("div", _hoisted_3$2, vue.toDisplayString($props.text), 1)
    ], 2);
  }
  const Msg = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$1]]);
  const _withScopeId = (n) => (vue.pushScopeId("data-v-b28a2e5e"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$2 = { class: "wrapper" };
  const _hoisted_2$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "title" }, " 添加标签 ", -1));
  const _hoisted_3$1 = { class: "option" };
  const _hoisted_4 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", null, "用户：", -1));
  const _hoisted_5 = ["onKeydown"];
  const _hoisted_6 = { class: "btns" };
  const _sfc_main$2 = {
    __name: "TagModal",
    props: ["tags"],
    emits: ["update:tags"],
    setup(__props, { emit }) {
      const props = __props;
      const tagModal = vue.reactive({
        show: false,
        currentUsername: "",
        tag: ""
      });
      const isNight = vue.inject("isNight");
      const input = vue.ref < HTMLInputElement > null;
      vue.onMounted(() => {
        eventBus.on(CMD.ADD_TAG, (username) => {
          tagModal.currentUsername = username;
          tagModal.show = true;
          vue.nextTick(() => {
            input.value.focus();
          });
        });
      });
      async function addTag() {
        let oldTag = window.clone(props.tags);
        let tempTag = window.clone(props.tags);
        let userTags = tempTag[tagModal.currentUsername] ?? [];
        let rIndex = userTags.findIndex((v) => v === tagModal.tag);
        if (rIndex > -1) {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "标签已存在！" });
          return;
        } else {
          userTags.push(tagModal.tag);
        }
        tempTag[tagModal.currentUsername] = userTags;
        emit("update:tags", tempTag);
        tagModal.tag = "";
        tagModal.show = false;
        let res = await window.parse.saveTags(tempTag);
        if (!res) {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "标签添加失败！" });
          emit("update:tags", oldTag);
        }
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, null, {
          default: vue.withCtx(() => [
            tagModal.show ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: vue.normalizeClass(["tag-modal modal", { isNight: vue.unref(isNight) }])
            }, [
              vue.createElementVNode("div", {
                class: "mask",
                onClick: _cache[0] || (_cache[0] = vue.withModifiers(($event) => tagModal.show = false, ["stop"]))
              }),
              vue.createElementVNode("div", _hoisted_1$2, [
                _hoisted_2$1,
                vue.createElementVNode("div", _hoisted_3$1, [
                  _hoisted_4,
                  vue.createElementVNode("div", null, vue.toDisplayString(tagModal.currentUsername), 1)
                ]),
                vue.withDirectives(vue.createElementVNode("input", {
                  type: "text",
                  ref: "input",
                  style: { "width": "100%" },
                  autofocus: "",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => tagModal.tag = $event),
                  onKeydown: vue.withKeys(addTag, ["enter"])
                }, null, 40, _hoisted_5), [
                  [vue.vModelText, tagModal.tag]
                ]),
                vue.createElementVNode("div", _hoisted_6, [
                  vue.createElementVNode("div", {
                    class: "white",
                    onClick: _cache[2] || (_cache[2] = ($event) => tagModal.show = false)
                  }, "取消"),
                  vue.createElementVNode("div", {
                    class: "main",
                    onClick: addTag
                  }, "确定")
                ])
              ])
            ], 2)) : vue.createCommentVNode("", true)
          ]),
          _: 1
        });
      };
    }
  };
  const TagModal = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-b28a2e5e"]]);
  const _hoisted_1$1 = { class: "msgs" };
  const _sfc_main$1 = {
    __name: "MsgModal",
    setup(__props) {
      const msgList = vue.reactive([
        // {type: 'success', text: '123', id: Date.now()}
      ]);
      vue.onMounted(() => {
        eventBus.on(CMD.SHOW_MSG, (val) => {
          msgList.push({ ...val, id: Date.now() });
        });
      });
      function removeMsg(id) {
        let rIndex = msgList.findIndex((item) => item.id === id);
        if (rIndex > -1) {
          msgList.splice(rIndex, 1);
        }
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(msgList, (v) => {
            return vue.openBlock(), vue.createBlock(Msg, {
              key: v.id,
              type: v.type,
              text: v.text,
              onClose: ($event) => removeMsg(v.id)
            }, null, 8, ["type", "text", "onClose"]);
          }), 128))
        ]);
      };
    }
  };
  const MsgModal = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-95974c3e"]]);
  const _sfc_main = {
    components: { MsgModal, TagModal, Tooltip, Setting, PostDetail, Base64Tooltip, Msg },
    provide() {
      return {
        isLogin: vue.computed(() => this.isLogin),
        isNight: vue.computed(() => this.isNight),
        pageType: vue.computed(() => this.pageType),
        tags: vue.computed(() => this.tags),
        show: vue.computed(() => this.show),
        post: vue.computed(() => this.current),
        config: vue.computed(() => this.config),
        allReplyUsers: vue.computed(() => {
          var _a, _b, _c;
          if ((_a = this.current) == null ? void 0 : _a.replyList) {
            return Array.from(new Set(((_c = (_b = this.current) == null ? void 0 : _b.replyList) == null ? void 0 : _c.map((v) => v.username)) ?? []));
          }
          return [];
        }),
        showConfig: this.showConfig
      };
    },
    data() {
      return {
        loading: window.pageType === PageType.Post,
        loadMore: false,
        isLogin: !!window.user.username,
        pageType: window.pageType,
        isNight: window.isNight,
        stopMe: false,
        //停止使用脚本
        show: false,
        current: window.clone(window.initPost),
        list: [],
        config: window.clone(window.config),
        tags: window.user.tags,
        readList: window.user.readList,
        configModal: {
          show: false
        },
        tagModal: {
          show: false,
          currentUsername: "",
          tag: ""
        }
      };
    },
    computed: {
      isList() {
        return this.pageType !== PageType.Post;
      },
      isPost() {
        return this.pageType === PageType.Post;
      }
    },
    watch: {
      "current.replyList": {
        handler(newVal, oldVal) {
          if (newVal.length) {
            this.current.replyCount = newVal.length;
            let res = window.parse.createNestedList(newVal, this.current.allReplyUsers);
            if (res) {
              this.current.nestedReplies = res;
            }
            let dup_res = window.parse.createNestedRedundantList(newVal, this.current.allReplyUsers);
            if (dup_res) {
              this.current.nestedRedundReplies = dup_res;
            }
          } else {
            this.current.replyCount = 0;
            this.current.nestedReplies = [];
            this.current.nestedRedundReplies = [];
          }
          if (this.list) {
            let rIndex = this.list.findIndex((i) => i.id === this.current.id);
            if (rIndex > -1) {
              this.list[rIndex].replyCount = newVal.length;
            }
          }
        },
        deep: true
      },
      config: {
        handler(newVal) {
          let config2 = { [window.user.username ?? "default"]: newVal };
          localStorage.setItem("v2ex-config", JSON.stringify(config2));
          window.config = newVal;
        },
        deep: true
      },
      tags(newVal) {
        window.user.tags = newVal;
      },
      "config.viewType"(newVal) {
        if (!newVal)
          return;
        if (newVal === "card") {
          $(".post-item").each(function() {
            $(this).addClass("preview");
          });
        } else {
          $(".post-item").each(function() {
            $(this).removeClass("preview");
          });
        }
      }
    },
    created() {
      window.cb = this.winCb;
      if (window.win().canParseV2exPage) {
        if (this.isList)
          ;
      }
      $(document).on("click", "a", (e) => {
        if (this.stopMe)
          return true;
        let { href, id, title } = window.parse.parseA(e.currentTarget);
        if (this.clickPost(e, id, href, title)) {
          return false;
        }
      });
      let that = this;
      $(document).on("click", ".post-item", function(e) {
        if (this.classList.contains("preview")) {
          if (e.target.tagName !== "A" && e.target.tagName !== "IMG" && !e.target.classList.contains("toggle")) {
            console.log("点空白处");
            let id = this.dataset["id"];
            let href = this.dataset["href"];
            if (that.clickPost(e, id, href)) {
              return false;
            } else {
              location.href = href;
            }
          }
        }
      });
      $(document).on("click", ".toggle", (e) => {
        let id = e.currentTarget.dataset["id"];
        let itemDom = window.win().query(`.id_${id}`);
        if (itemDom.classList.contains("preview")) {
          itemDom.classList.remove("preview");
        } else {
          itemDom.classList.add("preview");
        }
      });
      window.onpopstate = (event) => {
        if (event.state) {
          if (!this.show)
            this.show = true;
        } else {
          if (this.show)
            this.show = false;
        }
      };
      window.onbeforeunload = () => {
        this.saveReadList();
      };
      this.initEvent();
    },
    beforeUnmount() {
      eventBus.clear();
    },
    methods: {
      saveReadList() {
        window.parse.saveReadList(this.readList);
      },
      clickPost(e, id, href, title = "") {
        var _a, _b, _c, _d, _e, _f;
        if (id) {
          if (this.config.clickPostItemOpenDetail) {
            let index2 = this.list.findIndex((v) => v.id == id);
            let postItem = this.clone(window.initPost);
            if (index2 > -1) {
              postItem = this.list[index2];
            } else {
              postItem.title = title ?? "加载中";
            }
            postItem.id = id;
            postItem.href = href;
            if (!postItem.headerTemplate) {
              let template = `
            <div class="header">
              <div class="fr">
                <a href="/member/${((_a = postItem == null ? void 0 : postItem.member) == null ? void 0 : _a.username) ?? ""}">
                  <img src="${((_b = postItem == null ? void 0 : postItem.member) == null ? void 0 : _b.avatar_large) ?? ""}" class="avatar"
                       border="0"
                       align="default" width="73" style="width: 73px; max-height: 73px;" alt="${((_c = postItem == null ? void 0 : postItem.member) == null ? void 0 : _c.username) ?? ""}">
                </a>
              </div>
              <a href="/public">V2EX</a> <span class="chevron">&nbsp;›&nbsp;</span> <a href="${((_d = postItem == null ? void 0 : postItem.node) == null ? void 0 : _d.url) ?? ""}">${((_e = postItem == null ? void 0 : postItem.node) == null ? void 0 : _e.title) ?? ""}</a>
              <div class="sep10"></div>
              <h1>${(postItem == null ? void 0 : postItem.title) || "加载中..."}</h1>
              <div id="topic_930514_votes" class="votes">
                <a href="javascript:" onclick="null" class="vote">
                  <li class="fa fa-chevron-up"></li>
                  &nbsp;
                </a> &nbsp;
                <a href="javascript:" onclick="null" class="vote">
                  <li class="fa fa-chevron-down"></li>
                </a>
              </div> &nbsp;
              <small class="gray">
                <a href="/member/zyronon">${((_f = postItem == null ? void 0 : postItem.member) == null ? void 0 : _f.username) ?? ""}</a> ·
                <span title="2023-04-07 11:32:28 +08:00">1 天前</span> · 0 次点击
              </small>
            </div>
            <div class="cell">
              <div class="topic_content">
                <div class="markdown_body">
                 ${(postItem == null ? void 0 : postItem.content_rendered) ?? ""}
                </div>
              </div>
            </div>
            `;
              postItem.headerTemplate = template;
            }
            this.getPostDetail(postItem);
            e.preventDefault();
            return true;
          }
          if (this.config.newTabOpen) {
            let tempId = "a_blank_" + Date.now();
            let a = win().doc.createElement("a");
            a.setAttribute("href", href);
            a.setAttribute("target", "_blank");
            a.setAttribute("id", tempId);
            if (!win().doc.getElementById(tempId)) {
              win().doc.body.appendChild(a);
            }
            a.click();
            return true;
          }
        }
      },
      showPost() {
        this.show = true;
        $(`#Wrapper #Main .box:lt(3)`).each(function() {
          $(this).hide();
        });
      },
      showConfig() {
        this.configModal.show = true;
      },
      async winCb({ type, value }) {
        if (type === "openSetting") {
          this.configModal.show = true;
        }
        if (type === "restorePost") {
          if (this.stopMe)
            return;
          this.stopMe = true;
          this.show = false;
          this.loading = false;
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "脚本无法查看此页面！" });
          $(`#Wrapper #Main .box:lt(3)`).each(function() {
            $(this).show();
          });
        }
        if (type === "postContent") {
          if (this.stopMe)
            return;
          this.current = Object.assign(this.clone(this.current), this.clone(value));
          if (this.config.autoOpenDetail) {
            this.showPost();
          }
        }
        if (type === "postReplies") {
          if (this.stopMe)
            return;
          this.current = Object.assign(this.clone(this.current), this.clone(value));
          console.log("当前帖子", this.current);
          this.loading = false;
        }
        if (type === "syncData") {
          this.list = window.postList;
          this.config = window.config;
          this.tags = window.user.tags;
          this.readList = window.user.readList;
          this.current.read = this.readList[this.current.id] ?? {};
          if (this.show && this.isPost && this.current.read.floor) {
            this.$refs.postDetail.read = this.current.read;
          }
          console.log("this.readList", this.readList);
        }
      },
      clone(val) {
        return window.clone(val);
      },
      initEvent() {
        eventBus.on(CMD.CHANGE_COMMENT_THANK, (val) => {
          console.log("CHANGE_COMMENT_THANK", val);
          const { id, type } = val;
          let currentI = this.current.replyList.findIndex((i) => i.id === id);
          if (currentI > -1) {
            this.current.replyList[currentI].isThanked = type === "add";
            if (type === "add") {
              this.current.replyList[currentI].thankCount++;
            } else {
              this.current.replyList[currentI].thankCount--;
            }
          }
        });
        eventBus.on(CMD.CHANGE_POST_THANK, (val) => {
          const { id, type } = val;
          this.current.isThanked = type === "add";
          if (type === "add") {
            this.current.thankCount++;
          } else {
            this.current.thankCount--;
          }
          let currentI = this.list.findIndex((i) => i.id === id);
          if (currentI > -1) {
            this.list[currentI].isThanked = type === "add";
            if (type === "add") {
              this.list[currentI].thankCount++;
            } else {
              this.list[currentI].thankCount++;
            }
          }
        });
        eventBus.on(CMD.REMOVE, (val) => {
          let removeIndex = this.current.replyList.findIndex((i) => i.floor === val);
          if (removeIndex > -1) {
            this.current.replyList.splice(removeIndex, 1);
          }
          let rIndex = this.list.findIndex((i) => i.id === this.current.id);
          if (rIndex > -1) {
            this.list[rIndex] = Object.assign(this.list[rIndex], val);
          }
        });
        eventBus.on(CMD.IGNORE, () => {
          this.show = false;
          let rIndex = this.list.findIndex((i) => i.id === this.current.id);
          if (rIndex > -1) {
            this.list.splice(rIndex, 1);
          }
          this.current = this.clone(window.initPost);
        });
        eventBus.on(CMD.MERGE, (val) => {
          this.current = Object.assign(this.current, val);
          let rIndex = this.list.findIndex((i) => i.id === this.current.id);
          if (rIndex > -1) {
            this.list[rIndex] = Object.assign(this.list[rIndex], val);
          }
        });
        eventBus.on(CMD.ADD_READ, (val) => {
          this.readList[this.current.id] = val;
        });
        eventBus.on(CMD.ADD_REPLY, (item) => {
          this.current.replyList.push(item);
        });
        eventBus.on(CMD.REFRESH_ONCE, async (once) => {
          if (once) {
            if (typeof once === "string") {
              let res = once.match(/var once = "([\d]+)";/);
              if (res && res[1]) {
                this.current.once = Number(res[1]);
                return;
              }
            }
            if (typeof once === "number") {
              this.current.once = once;
              return;
            }
          }
          window.fetchOnce().then((r) => {
            this.current.once = r;
          });
        });
        eventBus.on(CMD.REMOVE_TAG, async ({ username, tag }) => {
          let oldTag = this.clone(this.tags);
          let tags = this.tags[username] ?? [];
          let rIndex = tags.findIndex((v) => v === tag);
          if (rIndex > -1) {
            tags.splice(rIndex, 1);
          }
          this.tags[username] = tags;
          let res = await window.parse.saveTags(this.tags);
          if (!res) {
            eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "标签删除失败！" });
            this.tags = oldTag;
          }
        });
      },
      async getPostDetail(post, event) {
        this.current = Object.assign({}, window.initPost, post);
        this.current.read = this.readList[this.current.id] ?? { floor: 0, total: 0 };
        this.show = true;
        let url = window.baseUrl + "/t/" + post.id;
        document.body.style.overflow = "hidden";
        window.history.pushState({}, 0, post.href ?? url);
        window.document.title = post.title ?? "V2EX";
        let alreadyHasReply = this.current.replyList.length;
        if (alreadyHasReply) {
          this.$refs.postDetail.jumpLastRead(this.current.read.floor);
        } else {
          this.loading = true;
        }
        let apiRes = await window.fetch(url + "?p=1");
        if (apiRes.status === 404) {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "主题未找到" });
          return this.loading = false;
        }
        if (apiRes.status === 403) {
          this.loading = false;
          this.show = false;
          window.open(`https://www.v2ex.com/t/${post.id}?p=1&script=0`, "_black");
          return;
        }
        if (apiRes.redirected) {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "没有权限" });
          return this.loading = false;
        }
        let htmlText = await apiRes.text();
        let hasPermission = htmlText.search("你要查看的页面需要先登录");
        if (hasPermission > -1) {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "你要查看的页面需要先登录" });
          return this.loading = false;
        }
        let bodyText = htmlText.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
        let body = $(bodyText[0]);
        this.current = await window.parse.getPostDetail(this.current, body, htmlText);
        if (this.current.replyList.length) {
          let index2 = this.list.findIndex((v) => v.id == post.id);
          if (index2 > -1) {
            this.list[index2].replyList = this.current.replyList;
            this.list[index2].nestedReplies = this.current.nestedReplies;
            this.list[index2].once = this.current.once;
            this.list[index2].createDate = this.current.createDate;
          } else {
            this.list.push(this.clone(this.current));
          }
        }
        this.loading = false;
        if (!alreadyHasReply) {
          vue.nextTick(() => {
            this.$refs.postDetail.jumpLastRead(this.current.read.floor);
          });
        }
        console.log("当前帖子", this.current);
      }
    }
  };
  const _hoisted_1 = {
    key: 0,
    class: "nav flex flex-end"
  };
  const _hoisted_2 = {
    key: 1,
    class: "my-box flex f14 open-post",
    style: { "margin": "2rem 0 0 0", "padding": "1rem" }
  };
  const _hoisted_3 = { class: "flex" };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Setting = vue.resolveComponent("Setting");
    const _component_TagModal = vue.resolveComponent("TagModal");
    const _component_PostDetail = vue.resolveComponent("PostDetail");
    const _component_Base64Tooltip = vue.resolveComponent("Base64Tooltip");
    const _component_MsgModal = vue.resolveComponent("MsgModal");
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createVNode(_component_Setting, {
        modelValue: $data.config,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.config = $event),
        show: $data.configModal.show,
        "onUpdate:show": _cache[1] || (_cache[1] = ($event) => $data.configModal.show = $event)
      }, null, 8, ["modelValue", "show"]),
      vue.createVNode(_component_TagModal, {
        tags: $data.tags,
        "onUpdate:tags": _cache[2] || (_cache[2] = ($event) => $data.tags = $event)
      }, null, 8, ["tags"]),
      vue.createVNode(_component_PostDetail, {
        modelValue: $data.show,
        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.show = $event),
        ref: "postDetail",
        displayType: $data.config.commentDisplayType,
        "onUpdate:displayType": _cache[4] || (_cache[4] = ($event) => $data.config.commentDisplayType = $event),
        onSaveReadList: $options.saveReadList,
        loading: $data.loading
      }, null, 8, ["modelValue", "displayType", "onSaveReadList", "loading"]),
      vue.createVNode(_component_Base64Tooltip),
      vue.createVNode(_component_MsgModal),
      !$data.stopMe && $data.config.showToolbar ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(["toolbar", [$data.isNight ? "isNight" : "", $data.config["viewType"]]])
      }, [
        $options.isList ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["radio-group2", { isNight: $data.isNight }])
          }, [
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["radio", $data.config.viewType === "table" ? "active" : ""]),
              onClick: _cache[5] || (_cache[5] = ($event) => $data.config.viewType = "table")
            }, "表格 ", 2),
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["radio", $data.config.viewType === "card" ? "active" : ""]),
              onClick: _cache[6] || (_cache[6] = ($event) => $data.config.viewType = "card")
            }, "卡片 ", 2)
          ], 2)
        ])) : vue.createCommentVNode("", true),
        !$options.isList && !$data.show ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [
          vue.createElementVNode("div", _hoisted_3, [
            vue.createTextVNode(" 默认显示楼中楼 ： "),
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["switch light", { active: $data.config.autoOpenDetail }]),
              onClick: _cache[7] || (_cache[7] = ($event) => $data.config.autoOpenDetail = !$data.config.autoOpenDetail)
            }, null, 2)
          ]),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["button light", { loading: $data.loading, isNight: $data.isNight }]),
            onClick: _cache[8] || (_cache[8] = (...args) => $options.showPost && $options.showPost(...args))
          }, " 点击显示楼中楼 ", 2)
        ])) : vue.createCommentVNode("", true)
      ], 2)) : vue.createCommentVNode("", true)
    ], 64);
  }
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-658ce414"]]);
  var _GM_notification = /* @__PURE__ */ (() => typeof GM_notification != "undefined" ? GM_notification : void 0)();
  var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  let $section = document.createElement("section");
  $section.id = "app";
  function run() {
    window.baseUrl = location.origin;
    window.initPost = {
      allReplyUsers: [],
      content_rendered: "",
      createDate: "",
      fr: "",
      replyList: [],
      nestedReplies: [],
      nestedRedundReplies: [],
      username: "",
      member: {},
      node: {},
      headerTemplate: "",
      title: "",
      id: "",
      type: "post",
      once: "",
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
    window.win = function() {
      return window;
    };
    window.win().doc = window.win().document;
    window.win().query = (v) => window.win().document.querySelector(v);
    window.query = (v) => window.win().document.querySelector(v);
    window.clone = (val) => JSON.parse(JSON.stringify(val));
    window.user = {
      tagPrefix: "--用户标签--",
      tags: {},
      tagsId: "",
      username: "",
      avatar: "",
      readPrefix: "--已读楼层--",
      readNoteItemId: "",
      readList: {}
    };
    window.pageType = void 0;
    window.pageData = { pageNo: 1 };
    window.config = {
      showToolbar: true,
      showPreviewBtn: true,
      autoOpenDetail: true,
      openTag: true,
      //给用户打标签
      clickPostItemOpenDetail: true,
      closePostDetailBySpace: true,
      //点击空白处关闭详情
      contentAutoCollapse: true,
      //正文超长自动折叠
      viewType: "table",
      commentDisplayType: 4,
      newTabOpen: false,
      //新标签打开
      base64: true,
      //base功能
      sov2ex: false,
      postWidth: "",
      showTopReply: true,
      topReplyLoveMinCount: 3,
      topReplyCount: 3,
      autoJumpLastReadFloor: false,
      rememberLastReadFloor: true,
      autoSignin: true,
      customBgColor: "",
      version: 1,
      collectBrowserNotice: false,
      simple: false,
      hideName: false
    };
    window.isNight = $(".Night").length === 1;
    window.cb = null;
    window.postList = [];
    window.parse = {
      //解析帖子内容
      async parsePostContent(post, body, htmlText) {
        let once = htmlText.match(/var once = "([\d]+)";/);
        if (once && once[1]) {
          post.once = once[1];
        }
        post.isReport = htmlText.includes("你已对本主题进行了报告");
        if (!post.title || !post.content_rendered) {
          let main = body.find("#Main");
          let aName = main.find(".header small.gray a:nth-child(1)");
          if (aName) {
            post.member.username = aName[0].innerText;
          }
        }
        let topic_buttons = body.find(".topic_buttons");
        if (topic_buttons.length) {
          let favoriteNode = topic_buttons.find(".tb:first");
          if (favoriteNode.length) {
            post.isFavorite = favoriteNode[0].innerText === "取消收藏";
          }
          let ignoreNode = topic_buttons.find(".tb:nth-child(3)");
          if (ignoreNode.length) {
            post.isIgnore = ignoreNode[0].innerText === "取消忽略";
          }
          let thankNode = topic_buttons.find("#topic_thank .tb");
          if (!thankNode.length) {
            post.isThanked = true;
          }
          let topic_stats = topic_buttons.find(".topic_stats");
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
          }
        }
        let header = body.find("#Main .box").first();
        let temp = header.clone();
        temp.find(".topic_buttons").remove();
        let html = temp.html();
        html = this.checkPhotoLink2Img(html);
        post.headerTemplate = html;
        return post;
      },
      //获取帖子所有回复
      async getPostAllReplies(post, body, htmlText, pageNo = 1) {
        var _a, _b;
        if (body.find("#no-comments-yet").length) {
          return post;
        }
        let box = body.find("#Main > .box")[1];
        let cells = box.querySelectorAll(".cell");
        if (cells && cells.length) {
          post.fr = cells[0].querySelector(".cell .fr").innerHTML;
          cells = Array.from(cells);
        }
        let snow = cells[0].querySelector(".snow");
        post.createDate = ((_b = (_a = snow == null ? void 0 : snow.nextSibling) == null ? void 0 : _a.nodeValue) == null ? void 0 : _b.trim()) || "";
        let repliesMap = [];
        if (cells[1].id) {
          repliesMap.push({ i: pageNo, replyList: this.parsePageReplies(cells.slice(1)) });
          let replyList = this.getAllReply(repliesMap);
          post.replyList = replyList;
          post.replyCount = replyList.length;
          post.allReplyUsers = Array.from(new Set(replyList.map((v) => v.username)));
          let nestedList = this.createNestedList(replyList, post.allReplyUsers);
          let nestedRedundantList = this.createNestedRedundantList(replyList, post.allReplyUsers);
          if (nestedList)
            post.nestedReplies = nestedList;
          if (nestedRedundantList)
            post.nestedRedundReplies = nestedRedundantList;
          return post;
        } else {
          let promiseList = [];
          return new Promise((resolve, reject) => {
            repliesMap.push({ i: pageNo, replyList: this.parsePageReplies(cells.slice(2, cells.length - 1)) });
            let pages = cells[1].querySelectorAll("a");
            pages = Array.from(pages);
            let url = window.baseUrl + "/t/" + post.id;
            for (let i = 0; i < pages.length; i++) {
              let currentPageNo = Number(pages[i].innerText);
              if (currentPageNo == pageNo)
                continue;
              promiseList.push(this.fetchPostOtherPageReplies(url + "?p=" + currentPageNo, currentPageNo));
            }
            Promise.allSettled(promiseList).then(
              (results) => {
                results.filter((result) => result.status === "fulfilled").map((v) => repliesMap.push(v.value));
                let replyList = this.getAllReply(repliesMap);
                post.replyList = replyList;
                post.replyCount = replyList.length;
                post.allReplyUsers = Array.from(new Set(replyList.map((v) => v.username)));
                let nestedList = this.createNestedList(replyList, post.allReplyUsers);
                let nestedRedundantList = this.createNestedRedundantList(replyList, post.allReplyUsers);
                if (nestedList)
                  post.nestedReplies = nestedList;
                if (nestedRedundantList)
                  post.nestedRedundReplies = nestedRedundantList;
                resolve(post);
              }
            );
          });
        }
      },
      //请求帖子其他页的回复
      fetchPostOtherPageReplies(href, pageNo) {
        return new Promise((resolve) => {
          $.get(href).then((res) => {
            let s = res.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
            let box = $(s[0]).find("#Main .box")[1];
            let cells = box.querySelectorAll(".cell");
            cells = Array.from(cells);
            resolve({ i: pageNo, replyList: this.parsePageReplies(cells.slice(2, cells.length - 1)) });
          }).catch((r) => {
            if (r.status === 403) {
              cbChecker({ type: "restorePost", value: null });
            }
          });
        });
      },
      //解析页面的回复
      parsePageReplies(nodes) {
        let replyList = [];
        nodes.forEach((node, index2) => {
          if (!node.id)
            return;
          let item = {
            level: 0,
            thankCount: 0,
            isThanked: false,
            isOp: false,
            isDup: false,
            id: node.id.replace("r_", "")
          };
          let reply_content = node.querySelector(".reply_content");
          item.reply_content = this.checkPhotoLink2Img(reply_content.innerHTML);
          item.reply_text = reply_content.textContent;
          let { users, floor } = this.parseReplyContent(item.reply_content);
          item.hideCallUserReplyContent = item.reply_content;
          if (users.length === 1) {
            item.hideCallUserReplyContent = item.reply_content.replace(/@<a href="\/member\/[\s\S]+?<\/a>(\s#[\d]+)?\s(<br>)?/, () => "");
          }
          item.replyUsers = users;
          item.replyFloor = floor;
          let ago = node.querySelector(".ago");
          item.date = ago.textContent;
          let userNode = node.querySelector("strong a");
          item.username = userNode.textContent;
          let avatar = node.querySelector("td img");
          item.avatar = avatar.src;
          let no = node.querySelector(".no");
          item.floor = Number(no.textContent);
          let thank_area = node.querySelector(".thank_area");
          if (thank_area) {
            item.isThanked = thank_area.classList.contains("thanked");
          }
          let small = node.querySelector(".small");
          if (small) {
            item.thankCount = Number(small.textContent);
          }
          let op = node.querySelector(".op");
          if (op) {
            item.isOp = true;
          }
          let mod = node.querySelector(".mod");
          if (mod) {
            item.isMod = true;
          }
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
        let userReg = /@<a href="\/member\/([\s\S]+?)<\/a>/g;
        let has = str.matchAll(userReg);
        let res2 = [...has];
        if (res2.length > 1) {
          res2.map((item) => {
            getUsername(item[1]);
          });
        }
        if (res2.length === 1) {
          getUsername(res2[0][1]);
        }
        let floor = -1;
        if (users.length === 1) {
          let floorReg = /@<a href="\/member\/[\s\S]+?<\/a>[\s]+#([\d]+)/g;
          let hasFloor = str.matchAll(floorReg);
          let res = [...hasFloor];
          if (res.length) {
            floor = Number(res[0][1]);
          }
        }
        return { users, floor };
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
        if (Date.now() - window.win().lastCallDate < 1e3) {
          return false;
        }
        let list = window.clone(allList);
        let nestedList = [];
        list.map((item, index2) => {
          let startList = list.slice(0, index2);
          let startReplyUsers = Array.from(new Set(startList.map((v) => v.username)));
          let endList = list.slice(index2 + 1);
          if (index2 === 0) {
            nestedList.push(this.findChildren(item, endList, list));
          } else {
            if (!item.isUse) {
              let isOneLevelReply = false;
              if (item.replyUsers.length) {
                if (item.replyUsers.length > 1) {
                  isOneLevelReply = true;
                } else {
                  isOneLevelReply = !startReplyUsers.find((v) => v === item.replyUsers[0]);
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
        return nestedList;
      },
      //生成嵌套冗余回复
      createNestedRedundantList(allList = []) {
        if (!allList.length)
          return [];
        if (Date.now() - window.win().lastCallDate < 1e3) {
          return false;
        }
        let list = window.clone(allList);
        let nestedList = [];
        list.map((item, index2) => {
          let startList = list.slice(0, index2);
          let startReplyUsers = Array.from(new Set(startList.map((v) => v.username)));
          let endList = list.slice(index2 + 1);
          if (index2 === 0) {
            nestedList.push(this.findChildren(item, endList, list));
          } else {
            if (!item.isUse) {
              let isOneLevelReply = false;
              if (item.replyUsers.length) {
                if (item.replyUsers.length > 1) {
                  isOneLevelReply = true;
                } else {
                  isOneLevelReply = !startReplyUsers.find((v) => v === item.replyUsers[0]);
                }
              } else {
                isOneLevelReply = true;
              }
              if (isOneLevelReply) {
                item.level === 0;
                nestedList.push(this.findChildren(item, endList, list));
              }
            } else {
              let newItem = window.clone(item);
              newItem.children = [];
              newItem.level = 0;
              newItem.isDup = true;
              nestedList.push(newItem);
            }
          }
        });
        window.win().lastCallDate = Date.now();
        return nestedList;
      },
      //查找子回复
      findChildren(item, endList, all) {
        var _a;
        const fn = (child, endList2, parent) => {
          child.level = parent.level + 1;
          let rIndex = all.findIndex((v) => v.floor === child.floor);
          if (rIndex > -1) {
            all[rIndex].isUse = true;
          }
          parent.children.push(this.findChildren(child, endList2, all));
        };
        item.children = [];
        let floorReplyList = [];
        for (let i = 0; i < endList.length; i++) {
          let currentItem = endList[i];
          if (currentItem.isUse)
            continue;
          if (currentItem.replyFloor === item.floor) {
            if (currentItem.replyUsers.length === 1 && currentItem.replyUsers[0] === item.username) {
              currentItem.isUse = true;
              floorReplyList.push({ endList: endList.slice(i + 1), currentItem });
            } else {
              currentItem.isWrong = true;
            }
          }
        }
        floorReplyList.reverse().map(({ currentItem, endList: endList2 }) => {
          fn(currentItem, endList2, item);
        });
        let nextMeIndex = endList.findIndex((v) => {
          var _a2;
          return v.username === item.username && ((_a2 = v.replyUsers) == null ? void 0 : _a2[0]) !== item.username;
        });
        let findList = nextMeIndex > -1 ? endList.slice(0, nextMeIndex) : endList;
        for (let i = 0; i < findList.length; i++) {
          let currentItem = findList[i];
          if (currentItem.isUse)
            continue;
          if (currentItem.replyUsers.length === 1) {
            if (currentItem.replyFloor !== -1) {
              if (((_a = all[currentItem.replyFloor - 1]) == null ? void 0 : _a.username) === currentItem.replyUsers[0]) {
                continue;
              }
            }
            let endList2 = endList.slice(i + 1);
            if (currentItem.username === item.username) {
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
            if (currentItem.username === item.username)
              break;
          }
        }
        item.children = item.children.sort((a, b) => a.floor - b.floor);
        return item;
      },
      //解析页面帖子列表
      parsePagePostList(list, box) {
        list.forEach((itemDom) => {
          let item = window.clone(window.initPost);
          let item_title = itemDom.querySelector(".item_title a");
          let { href, id } = window.parse.parseA(item_title);
          item.id = id;
          item.href = href;
          item.url = location.origin + "/api/topics/show.json?id=" + item.id;
          itemDom.classList.add("post-item");
          itemDom.classList.add(`id_${id}`);
          itemDom.dataset["href"] = href;
          itemDom.dataset["id"] = id;
          window.postList.push(item);
        });
        Promise.allSettled(window.postList.map((item) => $.get(item.url))).then((res) => {
          let ok = res.filter((r) => r.status === "fulfilled").map((v) => v.value[0]);
          box.style.boxShadow = "unset";
          box.style.background = "unset";
          if (window.config.viewType === "card") {
            list.forEach((itemDom) => itemDom.classList.add("preview"));
          }
          ok.map((postItem) => {
            if (postItem == null ? void 0 : postItem.id) {
              let itemDom = box.querySelector(`.id_${postItem.id}`);
              if (window.config.showPreviewBtn) {
                let td = itemDom.querySelector("td:nth-child(4)");
                td.style.position = "relative";
                let toggle = document.createElement("div");
                toggle.dataset["id"] = postItem.id;
                toggle.classList.add("toggle");
                toggle.innerText = "点击展开/收起";
                td.append(toggle);
              }
              let index2 = window.postList.findIndex((v) => v.id == postItem.id);
              if (index2 > -1) {
                let obj = window.postList[index2];
                window.postList[index2] = Object.assign({}, obj, postItem);
                if (postItem.content_rendered) {
                  let a = document.createElement("a");
                  a.href = obj.href;
                  a.classList.add("post-content");
                  let div = document.createElement("div");
                  div.innerHTML = postItem.content_rendered;
                  a.append(div);
                  itemDom.append(a);
                }
              }
            }
          });
          cbChecker({ type: "syncData" });
        });
      },
      parseA(a) {
        let href = a.href;
        let id;
        if (href.includes("/t/")) {
          id = href.substring(href.indexOf("/t/") + 3, href.indexOf("/t/") + 9);
        }
        return { href, id, title: a.innerText };
      },
      //创建记事本子条目
      async createNoteItem(itemName) {
        return new Promise(async (resolve) => {
          let data = new FormData();
          data.append("content", itemName);
          data.append("parent_id", 0);
          data.append("syntax", 0);
          let apiRes = await window.win().fetch(`${window.baseUrl}/notes/new`, { method: "post", body: data });
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
        data.append("content", val);
        data.append("syntax", 0);
        let apiRes = await window.fetch(`${window.baseUrl}/notes/edit/${id}`, {
          method: "post",
          body: data
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
            /<a((?!<a).)*href="https?:\/\/((?!<a).)*\.(gif|png|jpg|jpeg|GIF|PNG|JPG|JPEG)((?!<a).)*>(((?!<a).)*)<\/a>/g
          ];
          imgWebs.map((v, i) => {
            let has = str.matchAll(v);
            let res2 = [...has];
            res2.map((r) => {
              let p = i === 0 ? r[4] : r[5];
              if (p) {
                let link = p.toLowerCase();
                let src = p;
                if (link.includes(".png") || link.includes(".jpg") || link.includes(".jpeg") || link.includes(".gif")) {
                } else {
                  src = p + ".png";
                }
                str = str.replace(r[0], `<img src="${src}" data-originUrl="${p}" data-notice="这个img标签由v2ex-超级增强脚本解析" style="max-width: 100%">`);
              }
            });
          });
        } catch (e) {
          console.log("正则解析html里面的a标签的图片链接出错了");
        }
        return str;
      }
    };
    async function sleep(time) {
      return new Promise((resolve) => {
        setTimeout(resolve, time);
      });
    }
    async function cbChecker(val, count = 0) {
      if (window.cb) {
        window.cb(val);
      } else {
        while (!window.cb && count < 20) {
          await sleep(500);
          count++;
        }
        window.cb && window.cb(val);
      }
    }
    function feedback() {
      _GM_openInTab("https://github.com/zyronon/v2ex-script/discussions/", {
        active: true,
        insert: true,
        setParent: true
      });
    }
    function initMonkeyMenu() {
      try {
        _GM_registerMenuCommand("脚本设置", function(event) {
          cbChecker({ type: "openSetting" });
        });
        _GM_registerMenuCommand("💬 反馈 & 建议", feedback);
      } catch (e) {
        console.error("无法使用Tampermonkey");
      }
    }
    function initStyle() {
      let style2 = `
       html, body {
            font-size: 62.5%;
        }

        #Wrapper {
          height: unset !important;
          width: unset !important;
        }

       #Wrapper > .content {
        height: unset !important;
        width: unset !important;
      }

      .post-item {
          background: white;
      }

      .post-item > .post-content {
          height: 0;
          margin-top: 0;
      }

      .post-item:hover .toggle {
          display: flex;
      }

      .toggle {
          position: absolute;
          right: ${window.config.simple ? "5rem" : 0};
          top: 0.5rem;
          width: 9rem;
          height: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
          cursor: pointer;
          font-size: 1.2rem;
          color: #ccc;
          display: none;
      }

      .preview {
          margin: 1rem 0;
          border: 1px solid #c8c8c8;
          border-radius: 0.4rem;
          cursor: pointer;
      }

      .preview:hover {
          border: 1px solid #968b8b;
      }

      .preview > .post-content {
          height: unset !important;
          margin-top: 0.5rem !important;
      }

      .preview  .topic-link:link {
          color: black !important;
      }

      .post-content {
          margin-top: 0.5rem;
          display: block;
          max-height: 20rem;
          overflow: hidden;
          text-decoration: unset !important;
          line-break: anywhere;
          -webkit-mask-image: linear-gradient(180deg,#000 60%,transparent);
      }

      .post-content:link {
          color: #494949;
      }


      .post-content:visited {
          color: #afb9c1 !important;
      }

      .Night .post-item {
          background: #18222d !important;
      }

      .Night .preview {
          border: 1px solid #3b536e;
      }

      .Night .preview > .post-content:link {
          color: #d1d5d9;
      }

      .Night .preview > .post-content:visited {
          color: #393f4e !important;
      }

      .Night .preview  .topic-link:link {
          color: #c0dbff !important;
      }
      
      ${window.config.simple ? `
      .item table tr td:first-child{display:none;}
      #Rightbar .cell table:first-child tr td:first-child{display:none;}
      .item table tr td .sep5{display:none;}
      .item table tr td .topic_info{display:none;}
      .item {border-bottom:none;}
      .avatar,#avatar{display:none}
      ` : ""}

      ${window.config.hideName ? `
      .bigger a, .top:nth-last-child(5){color: transparent!important;text-shadow: #111 0 0 6px;user-select: none;}
      #Rightbar .cell table:first-child tr td:first-child{display:none;}
      ` : ""}
    }

    `;
      let addStyle2 = document.createElement("style");
      addStyle2.rel = "stylesheet";
      addStyle2.type = "text/css";
      addStyle2.innerHTML = style2;
      $(window.win().doc.head).append(addStyle2);
    }
    function qianDao() {
      let timeNow = (/* @__PURE__ */ new Date()).getUTCFullYear() + "/" + ((/* @__PURE__ */ new Date()).getUTCMonth() + 1) + "/" + (/* @__PURE__ */ new Date()).getUTCDate();
      if (window.pageType === PageType.Home) {
        let qiandao = window.query('.box .inner a[href="/mission/daily"]');
        if (qiandao) {
          qianDao_(qiandao, timeNow);
        } else if (window.win().doc.getElementById("gift_v2excellent")) {
          window.win().doc.getElementById("gift_v2excellent").click();
          localStorage.setItem("menu_clockInTime", timeNow);
          console.info("[V2EX - 超级增强] 自动签到完成！");
        } else {
          console.info("[V2EX - 超级增强] 自动签到完成！");
        }
      } else {
        let timeOld = localStorage.getItem("menu_clockInTime");
        if (!timeOld || timeOld != timeNow) {
          qianDaoStatus_(timeNow);
        } else {
          console.info("[V2EX - 超级增强] 自动签到完成！");
        }
      }
    }
    function qianDao_(qiandao, timeNow) {
      let url = window.baseUrl + "/mission/daily/redeem?" + RegExp("once\\=(\\d+)").exec(document.querySelector("div#Top .tools, #menu-body").innerHTML)[0];
      console.log("url", url);
      $.get(url).then((r) => {
        let bodyText = r.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
        let html = $(bodyText[0]);
        if (html.find("li.fa.fa-ok-sign").length) {
          html = html.find("#Main").text().match(/已连续登录 (\d+?) 天/)[0];
          localStorage.setItem("menu_clockInTime", timeNow);
          console.info("[V2EX - 超级增强] 自动签到完成！");
          if (qiandao) {
            qiandao.textContent = `自动签到完成！${html}`;
            qiandao.href = "javascript:void(0);";
          }
        } else {
          _GM_notification({
            text: "自动签到失败！请关闭其他插件或脚本。\n如果连续几天都签到失败，请联系作者解决！",
            timeout: 4e3,
            onclick() {
              feedback();
            }
          });
          console.warn("[V2EX 增强] 自动签到失败！请关闭其他插件或脚本。如果连续几天都签到失败，请联系作者解决！");
          if (qiandao)
            qiandao.textContent = "自动签到失败！请尝试手动签到！";
        }
      });
    }
    function qianDaoStatus_(timeNow) {
      $.get(window.baseUrl + "/mission/daily").then((r) => {
        let bodyText = r.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
        let html = $(bodyText[0]);
        if (html.find('input[value^="领取"]').length) {
          qianDao_(null, timeNow);
        } else {
          console.info("[V2EX 增强] 已经签过到了。");
          localStorage.setItem("menu_clockInTime", timeNow);
        }
      });
    }
    function checkPageType() {
      let location2 = window.win().location;
      if (location2.pathname === "/") {
        window.pageType = PageType.Home;
      } else if (location2.href.match(/.com\/?tab=/)) {
        window.pageType = PageType.Home;
      } else if (location2.href.match(/.com\/go\//)) {
        if (!location2.href.includes("/links")) {
          window.pageType = PageType.Node;
        }
      } else if (location2.href.match(/.com\/recent/)) {
        window.pageType = PageType.Home;
      } else {
        let r = location2.href.match(/.com\/t\/([\d]+)/);
        if (r) {
          window.pageType = PageType.Post;
          window.pageData.id = r[1];
          if (location2.search) {
            let pr = location2.href.match(/\?p=([\d]+)/);
            if (pr)
              window.pageData.pageNo = Number(pr[1]);
          }
        }
      }
    }
    function getNoteItemContent(id, prefix) {
      return new Promise((resolve, reject) => {
        $.get(window.baseUrl + "/notes/edit/" + id).then((r2) => {
          let bodyText = r2.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
          let body = $(bodyText[0]);
          let text = body.find(".note_editor").text();
          if (text === prefix) {
            resolve({});
          } else {
            let tagJson = text.substring(prefix.length);
            try {
              resolve(JSON.parse(tagJson));
            } catch (e) {
              console.log("tage", tagJson);
              resolve({});
            }
          }
        });
      });
    }
    async function initNoteData() {
      $.get(window.baseUrl + "/notes").then(async (r) => {
        let bodyText = r.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
        let body = $(bodyText[0]);
        let items = body.find("#Main .box .note_item_title a");
        if (items.length) {
          let tagItem = Array.from(items).find((v) => v.innerText.includes(window.user.tagPrefix));
          if (tagItem) {
            window.user.tagsId = tagItem.href.substr(-5);
            window.user.tags = await getNoteItemContent(window.user.tagsId, window.user.tagPrefix);
          } else {
            let r2 = await window.parse.createNoteItem(window.user.tagPrefix);
            r2 && (window.user.tagsId = r2);
          }
          let readItem = Array.from(items).find((v) => v.innerText.includes(window.user.readPrefix));
          if (readItem) {
            window.user.readNoteItemId = readItem.href.substr(-5);
            window.user.readList = await getNoteItemContent(window.user.readNoteItemId, window.user.readPrefix);
          } else {
            let r2 = await window.parse.createNoteItem(window.user.readPrefix);
            r2 && (window.user.readNoteItemId = r2);
          }
          cbChecker({ type: "syncData" });
        }
      });
    }
    function initConfig() {
      return new Promise((resolve) => {
        let configStr = window.win().localStorage.getItem("v2ex-config");
        if (configStr) {
          let configObj = JSON.parse(configStr);
          configObj = configObj[window.user.username ?? "default"];
          if (configObj) {
            window.config = Object.assign(window.config, configObj);
          }
        }
        resolve(window.config);
      });
    }
    function initSoV2ex() {
      var $search = $("#search");
      var searchEvents = $._data($search[0], "events");
      console.log($search, searchEvents);
      var oKeydownEvent = searchEvents["keydown"][0]["handler"];
      var oInputEvent = searchEvents["input"][0]["handler"];
      $search.attr("placeholder", "sov2ex");
      $search.unbind("keydown", oKeydownEvent);
      $search.unbind("input", oInputEvent);
      $search.on("input", function(e) {
        oInputEvent(e);
        $(".search-item:last").attr("href", "https://www.sov2ex.com/?q=" + $search.val()).text("sov2ex " + $search.val());
      });
      $search.keydown(function(e) {
        if (e.code == "Enter" || e.code == "NumpadEnter" || e.keyCode === 13) {
          if ($(".search-item:last").is(".active")) {
            $(this).val($(this).val().replace(/[#%&]/g, ""));
            window.open("https://www.sov2ex.com/?q=" + $(this).val());
            return 0;
          }
        }
        oKeydownEvent(e);
      });
    }
    function addSettingText() {
      let setting = $(`<a href="javascript:void 0;" class="top">脚本设置</a>`);
      setting.on("click", () => {
        cbChecker({ type: "openSetting" });
      });
      $(".tools").prepend(setting);
    }
    function initCustomBgColor() {
      let style2 = `#Wrapper {
          background-color: ${window.config.customBgColor} !important;
          background-image: unset !important;
        }`;
      let addStyle2 = document.createElement("style");
      addStyle2.rel = "stylesheet";
      addStyle2.type = "text/css";
      addStyle2.innerHTML = style2;
      $(window.win().doc.head).append(addStyle2);
    }
    function init() {
      checkPageType();
      initMonkeyMenu();
      let top2 = document.querySelector(".tools .top:nth-child(2)");
      if (top2 && top2.textContent !== "注册") {
        window.user.username = top2.textContent;
        window.user.avatar = $("#Rightbar .box .avatar").attr("src");
        initNoteData();
      }
      addSettingText();
      initConfig().then((r) => {
        initStyle();
        if (window.config.sov2ex) {
          setTimeout(initSoV2ex, 1e3);
        }
        if (window.config.customBgColor) {
          initCustomBgColor();
        }
        try {
          if (window.config.autoSignin && window.user.username) {
            qianDao();
          }
        } catch (e) {
          console.log("签到失败");
        }
      });
      let box;
      let list;
      switch (window.pageType) {
        case PageType.Node:
          box = window.win().doc.querySelectorAll("#Wrapper #Main .box");
          let topics = box[1].querySelector("#TopicsNode");
          list = topics.querySelectorAll(".cell");
          list[0].before($section);
          window.parse.parsePagePostList(list, box[1]);
          break;
        case PageType.Home:
          box = document.querySelector("#Wrapper #Main .box");
          list = box.querySelectorAll(".item");
          list[0].before($section);
          window.parse.parsePagePostList(list, box);
          break;
        case PageType.Post:
          if (window.config.postWidth) {
            let Main = $("#Main");
            Main.css({
              "width": window.config.postWidth,
              margin: "unset"
            });
            $("#Wrapper > .content").css({
              "max-width": "unset",
              display: "flex",
              "justify-content": "center",
              gap: "20px"
            });
            Main.after($("#Rightbar"));
          }
          box = document.querySelector("#Wrapper #Main .box");
          box.after($section);
          let post = Object.assign({}, window.clone(window.initPost), { id: window.pageData.id });
          let body = $(window.win().doc.body);
          let htmlText = window.win().doc.documentElement.outerHTML;
          window.parse.parsePostContent(
            post,
            body,
            htmlText
          ).then(async (res) => {
            await cbChecker({ type: "postContent", value: res }, 0);
          });
          window.parse.getPostAllReplies(
            post,
            body,
            htmlText,
            window.pageData.pageNo
          ).then(async (res) => {
            await cbChecker({ type: "postReplies", value: res }, 0);
          });
          break;
        default:
          console.error("未知页面");
          break;
      }
    }
    window.canParseV2exPage = !window.location.href.includes("script=0");
    if (window.canParseV2exPage) {
      init();
    } else {
      alert("脚本无法查看此主题，已为您单独打开此主题");
    }
  }
  run();
  let vueApp = vue.createApp(App);
  vueApp.config.unwrapInjectedRef = true;
  vueApp.mount($section);

})(Vue);
