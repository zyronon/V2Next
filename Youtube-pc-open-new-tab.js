// ==UserScript==
// @name         Youtube-PC-新标签页打开
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Youtube新标签页打开.
// @author       zyronon
// @license      GPL License
// @match        https://www.youtube.com/*
// @homepage     https://github.com/zyronon/web-scripts
// @homepageURL  https://github.com/zyronon/web-scripts
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @license MIT
// @grant        GM_openInTab
// @run-at       document-start

// ==/UserScript==

(function () {
  'use strict';

  let pageType = {
    value: 'home'
  }

  function stop(e) {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    return true
  }

//打开新标签页
  function openNewTab(href, active = false) {
    GM_openInTab(href, {active});
  }

  function checkPageType() {
    if (location.pathname === '/watch') {
      pageType.value = 'watch'
    }
    if (location.pathname === '/') {
      pageType.value = 'home'
    }
    if (location.pathname.startsWith('/@')) {
      pageType.value = 'user'
    }
  }

  function checkIsWatchPage() {
    checkPageType()
    return pageType.value === 'watch'
  }

  function findA(target, e) {
    let parentNode = target
    let count = 0
    while (parentNode.tagName !== 'A' && count < 10) {
      count++
      parentNode = parentNode.parentNode
    }
    console.log(parentNode)
    openNewTab(parentNode.href, true)
    return stop(e)
  }

  function checkA(e) {
    let target = e.target;
    let tagName = target.tagName;
    let classList = target.classList
    console.log('e', e, target, tagName, classList,)
    if (tagName === 'YTD-THUMBNAIL-OVERLAY-HOVER-TEXT-RENDERER') {
      console.log('合辑')
      if (checkIsWatchPage()) return
      return findA(target, e)
    }

    if (tagName === 'SPAN' && Array.from(classList).some(v => v.includes('ytd-thumbnail-overlay-hover-text-renderer'))) {
      console.log('合辑-全部播放',)
      if (checkIsWatchPage()) return
      return findA(target, e)
    }
    if (tagName === 'SPAN' && Array.from(classList).some(v => v.includes('yt-formatted-string'))) {
      console.log('描述',)
      if (checkIsWatchPage()) return
      return findA(target, e)
    }

    if (tagName === 'YT-FORMATTED-STRING' && Array.from(classList).some(v =>
      (
        v.includes('ytd-rich-grid-media') ||
        v.includes('ytd-video-renderer')
      )
    )) {
      console.log('标题',)
      if (checkIsWatchPage()) return
      return findA(target, e)
    }

    if (tagName === 'IMG' && Array.from(classList).some(v =>
      (
        v.includes('yt-core-imag') ||
        v.includes('ytd-moving-thumbnail-renderer')
      )
    )) {
      console.log('封面')
      if (checkIsWatchPage()) return
      return findA(target, e)
    }
    if (tagName === 'DIV') {
      if (Array.from(classList).some(v =>
        (
          v.includes('ytd-thumbnail-overlay-toggle-button-renderer') ||
          v.includes('ytd-video-preview') ||
          v.includes('ytp-inline-preview-scrim')
        )
      )) {
        console.log('封面')
        if (checkIsWatchPage()) return
        return findA(target, e)
      }
    }

    if (tagName === 'A' && target.href.includes('/@')) {
      console.log('作者')
      if (checkIsWatchPage()) return
      return findA(target, e)
    }

    // return stop(e)
  }

  window.addEventListener('click', checkA, true);
  let fs = localStorage.getItem('fs')
  if (fs) {
    document.documentElement.style.fontSize = fs + 'px'
  }
})();