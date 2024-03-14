// ==UserScript==
// @name         V2Next-Mobile
// @namespace    http://tampermonkey.net/
// @version      8.3
// @author       zyronon
// @description  V2Next - 一个好用的V2EX脚本！ 移动端专用
// @license      GPL License
// @icon         https://v2next.netlify.app/favicon.ico
// @homepage     https://github.com/zyronon/web-scripts
// @homepageURL  https://github.com/zyronon/web-scripts
// @supportURL   https://update.greasyfork.org/scripts/485356/V2Next-Mobile.user.js
// @downloadURL  https://update.greasyfork.org/scripts/485356/V2Next-Mobile.user.js
// @updateURL    https://update.greasyfork.org/scripts/485356/V2Next-Mobile.user.js
// @match        https://v2ex.com/
// @match        https://v2ex.com/?tab=*
// @match        https://v2ex.com/t/*
// @match        https://v2ex.com/recent*
// @match        https://v2ex.com/go/*
// @match        https://v2ex.com/member/*
// @match        https://v2ex.com/changes*
// @match        https://*.v2ex.com/
// @match        https://*.v2ex.com/?tab=*
// @match        https://*.v2ex.com/t/*
// @match        https://*.v2ex.com/recent*
// @match        https://*.v2ex.com/go/*
// @match        https://*.v2ex.com/member/*
// @match        https://*.v2ex.com/changes*
// @require      http://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.14/dist/vue.global.prod.js
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// ==/UserScript==


(function (vue) {
  'use strict';

  var PageType = /* @__PURE__ */ ((PageType2) => {
    PageType2["Home"] = "Home";
    PageType2["Node"] = "Node";
    PageType2["Post"] = "Post";
    PageType2["Member"] = "Member";
    PageType2["Changes"] = "Changes";
    return PageType2;
  })(PageType || {});
  var CommentDisplayType = /* @__PURE__ */ ((CommentDisplayType2) => {
    CommentDisplayType2[CommentDisplayType2["FloorInFloor"] = 0] = "FloorInFloor";
    CommentDisplayType2[CommentDisplayType2["FloorInFloorNoCallUser"] = 4] = "FloorInFloorNoCallUser";
    CommentDisplayType2[CommentDisplayType2["FloorInFloorNested"] = 5] = "FloorInFloorNested";
    CommentDisplayType2[CommentDisplayType2["Like"] = 1] = "Like";
    CommentDisplayType2[CommentDisplayType2["V2exOrigin"] = 2] = "V2exOrigin";
    CommentDisplayType2[CommentDisplayType2["OnlyOp"] = 3] = "OnlyOp";
    CommentDisplayType2[CommentDisplayType2["New"] = 6] = "New";
    return CommentDisplayType2;
  })(CommentDisplayType || {});
  const MAX_REPLY_LIMIT = 400;
  const _sfc_main$r = {
    name: "Tooltip",
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
      showPop(e2) {
        if (this.disabled)
          return;
        if (!this.title)
          return;
        e2.stopPropagation();
        let rect = e2.target.getBoundingClientRect();
        this.show = true;
        vue.nextTick(() => {
          var _a, _b;
          let tip = (_b = (_a = this.$refs) == null ? void 0 : _a.tip) == null ? void 0 : _b.getBoundingClientRect();
          if (!tip)
            return;
          if (rect.top < 50) {
            this.$refs.tip.style.top = rect.top + rect.height + 10 + "px";
          } else {
            this.$refs.tip.style.top = rect.top - tip.height - 10 + "px";
          }
          let tipWidth = tip.width;
          let rectWidth = rect.width;
          this.$refs.tip.style.left = rect.left - (tipWidth - rectWidth) / 2 + "px";
        });
      }
    },
    render() {
      let Vnode = this.$slots.default()[0];
      return vue.createVNode(vue.Fragment, null, [this.show && this.title && vue.createVNode(vue.Teleport, {
        "to": "body"
      }, {
        default: () => [vue.createVNode(vue.Transition, {
          "name": "fade"
        }, {
          default: () => [vue.createVNode("div", {
            "ref": "tip",
            "className": "tip"
          }, [this.title])]
        })]
      }), vue.createVNode(Vnode, {
        "onClick": () => this.show = false,
        "onmouseenter": (e2) => this.showPop(e2),
        "onmouseleave": () => this.show = false
      }, null)]);
    }
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const Tooltip = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["__scopeId", "data-v-ee672411"]]);
  const _sfc_main$q = /* @__PURE__ */ vue.defineComponent({
    __name: "BaseSwitch",
    props: {
      modelValue: { type: Boolean }
    },
    emits: ["update:modelValue"],
    setup(__props, { emit: __emit }) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(["switch", { active: _ctx.modelValue }]),
          onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", !_ctx.modelValue))
        }, null, 2);
      };
    }
  });
  const BaseSwitch = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__scopeId", "data-v-e7c0fbef"]]);
  const matchIconName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  const stringToIcon = (value, validate, allowSimpleName, provider = "") => {
    const colonSeparated = value.split(":");
    if (value.slice(0, 1) === "@") {
      if (colonSeparated.length < 2 || colonSeparated.length > 3) {
        return null;
      }
      provider = colonSeparated.shift().slice(1);
    }
    if (colonSeparated.length > 3 || !colonSeparated.length) {
      return null;
    }
    if (colonSeparated.length > 1) {
      const name2 = colonSeparated.pop();
      const prefix = colonSeparated.pop();
      const result = {
        // Allow provider without '@': "provider:prefix:name"
        provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
        prefix,
        name: name2
      };
      return validate && !validateIconName(result) ? null : result;
    }
    const name = colonSeparated[0];
    const dashSeparated = name.split("-");
    if (dashSeparated.length > 1) {
      const result = {
        provider,
        prefix: dashSeparated.shift(),
        name: dashSeparated.join("-")
      };
      return validate && !validateIconName(result) ? null : result;
    }
    if (allowSimpleName && provider === "") {
      const result = {
        provider,
        prefix: "",
        name
      };
      return validate && !validateIconName(result, allowSimpleName) ? null : result;
    }
    return null;
  };
  const validateIconName = (icon, allowSimpleName) => {
    if (!icon) {
      return false;
    }
    return !!((icon.provider === "" || icon.provider.match(matchIconName)) && (allowSimpleName && icon.prefix === "" || icon.prefix.match(matchIconName)) && icon.name.match(matchIconName));
  };
  const defaultIconDimensions = Object.freeze(
    {
      left: 0,
      top: 0,
      width: 16,
      height: 16
    }
  );
  const defaultIconTransformations = Object.freeze({
    rotate: 0,
    vFlip: false,
    hFlip: false
  });
  const defaultIconProps = Object.freeze({
    ...defaultIconDimensions,
    ...defaultIconTransformations
  });
  const defaultExtendedIconProps = Object.freeze({
    ...defaultIconProps,
    body: "",
    hidden: false
  });
  function mergeIconTransformations(obj1, obj2) {
    const result = {};
    if (!obj1.hFlip !== !obj2.hFlip) {
      result.hFlip = true;
    }
    if (!obj1.vFlip !== !obj2.vFlip) {
      result.vFlip = true;
    }
    const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
    if (rotate) {
      result.rotate = rotate;
    }
    return result;
  }
  function mergeIconData(parent, child) {
    const result = mergeIconTransformations(parent, child);
    for (const key in defaultExtendedIconProps) {
      if (key in defaultIconTransformations) {
        if (key in parent && !(key in result)) {
          result[key] = defaultIconTransformations[key];
        }
      } else if (key in child) {
        result[key] = child[key];
      } else if (key in parent) {
        result[key] = parent[key];
      }
    }
    return result;
  }
  function getIconsTree(data, names) {
    const icons = data.icons;
    const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
    const resolved = /* @__PURE__ */ Object.create(null);
    function resolve(name) {
      if (icons[name]) {
        return resolved[name] = [];
      }
      if (!(name in resolved)) {
        resolved[name] = null;
        const parent = aliases[name] && aliases[name].parent;
        const value = parent && resolve(parent);
        if (value) {
          resolved[name] = [parent].concat(value);
        }
      }
      return resolved[name];
    }
    (names || Object.keys(icons).concat(Object.keys(aliases))).forEach(resolve);
    return resolved;
  }
  function internalGetIconData(data, name, tree) {
    const icons = data.icons;
    const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
    let currentProps = {};
    function parse(name2) {
      currentProps = mergeIconData(
        icons[name2] || aliases[name2],
        currentProps
      );
    }
    parse(name);
    tree.forEach(parse);
    return mergeIconData(data, currentProps);
  }
  function parseIconSet(data, callback) {
    const names = [];
    if (typeof data !== "object" || typeof data.icons !== "object") {
      return names;
    }
    if (data.not_found instanceof Array) {
      data.not_found.forEach((name) => {
        callback(name, null);
        names.push(name);
      });
    }
    const tree = getIconsTree(data);
    for (const name in tree) {
      const item = tree[name];
      if (item) {
        callback(name, internalGetIconData(data, name, item));
        names.push(name);
      }
    }
    return names;
  }
  const optionalPropertyDefaults = {
    provider: "",
    aliases: {},
    not_found: {},
    ...defaultIconDimensions
  };
  function checkOptionalProps(item, defaults) {
    for (const prop in defaults) {
      if (prop in item && typeof item[prop] !== typeof defaults[prop]) {
        return false;
      }
    }
    return true;
  }
  function quicklyValidateIconSet(obj) {
    if (typeof obj !== "object" || obj === null) {
      return null;
    }
    const data = obj;
    if (typeof data.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") {
      return null;
    }
    if (!checkOptionalProps(obj, optionalPropertyDefaults)) {
      return null;
    }
    const icons = data.icons;
    for (const name in icons) {
      const icon = icons[name];
      if (!name.match(matchIconName) || typeof icon.body !== "string" || !checkOptionalProps(
        icon,
        defaultExtendedIconProps
      )) {
        return null;
      }
    }
    const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
    for (const name in aliases) {
      const icon = aliases[name];
      const parent = icon.parent;
      if (!name.match(matchIconName) || typeof parent !== "string" || !icons[parent] && !aliases[parent] || !checkOptionalProps(
        icon,
        defaultExtendedIconProps
      )) {
        return null;
      }
    }
    return data;
  }
  const dataStorage = /* @__PURE__ */ Object.create(null);
  function newStorage(provider, prefix) {
    return {
      provider,
      prefix,
      icons: /* @__PURE__ */ Object.create(null),
      missing: /* @__PURE__ */ new Set()
    };
  }
  function getStorage(provider, prefix) {
    const providerStorage = dataStorage[provider] || (dataStorage[provider] = /* @__PURE__ */ Object.create(null));
    return providerStorage[prefix] || (providerStorage[prefix] = newStorage(provider, prefix));
  }
  function addIconSet(storage2, data) {
    if (!quicklyValidateIconSet(data)) {
      return [];
    }
    return parseIconSet(data, (name, icon) => {
      if (icon) {
        storage2.icons[name] = icon;
      } else {
        storage2.missing.add(name);
      }
    });
  }
  function addIconToStorage(storage2, name, icon) {
    try {
      if (typeof icon.body === "string") {
        storage2.icons[name] = { ...icon };
        return true;
      }
    } catch (err) {
    }
    return false;
  }
  let simpleNames = false;
  function allowSimpleNames(allow) {
    if (typeof allow === "boolean") {
      simpleNames = allow;
    }
    return simpleNames;
  }
  function getIconData(name) {
    const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
    if (icon) {
      const storage2 = getStorage(icon.provider, icon.prefix);
      const iconName = icon.name;
      return storage2.icons[iconName] || (storage2.missing.has(iconName) ? null : void 0);
    }
  }
  function addIcon(name, data) {
    const icon = stringToIcon(name, true, simpleNames);
    if (!icon) {
      return false;
    }
    const storage2 = getStorage(icon.provider, icon.prefix);
    return addIconToStorage(storage2, icon.name, data);
  }
  function addCollection(data, provider) {
    if (typeof data !== "object") {
      return false;
    }
    if (typeof provider !== "string") {
      provider = data.provider || "";
    }
    if (simpleNames && !provider && !data.prefix) {
      let added = false;
      if (quicklyValidateIconSet(data)) {
        data.prefix = "";
        parseIconSet(data, (name, icon) => {
          if (icon && addIcon(name, icon)) {
            added = true;
          }
        });
      }
      return added;
    }
    const prefix = data.prefix;
    if (!validateIconName({
      provider,
      prefix,
      name: "a"
    })) {
      return false;
    }
    const storage2 = getStorage(provider, prefix);
    return !!addIconSet(storage2, data);
  }
  const defaultIconSizeCustomisations = Object.freeze({
    width: null,
    height: null
  });
  const defaultIconCustomisations = Object.freeze({
    // Dimensions
    ...defaultIconSizeCustomisations,
    // Transformations
    ...defaultIconTransformations
  });
  const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
  const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
  function calculateSize(size, ratio, precision) {
    if (ratio === 1) {
      return size;
    }
    precision = precision || 100;
    if (typeof size === "number") {
      return Math.ceil(size * ratio * precision) / precision;
    }
    if (typeof size !== "string") {
      return size;
    }
    const oldParts = size.split(unitsSplit);
    if (oldParts === null || !oldParts.length) {
      return size;
    }
    const newParts = [];
    let code = oldParts.shift();
    let isNumber = unitsTest.test(code);
    while (true) {
      if (isNumber) {
        const num = parseFloat(code);
        if (isNaN(num)) {
          newParts.push(code);
        } else {
          newParts.push(Math.ceil(num * ratio * precision) / precision);
        }
      } else {
        newParts.push(code);
      }
      code = oldParts.shift();
      if (code === void 0) {
        return newParts.join("");
      }
      isNumber = !isNumber;
    }
  }
  const isUnsetKeyword = (value) => value === "unset" || value === "undefined" || value === "none";
  function iconToSVG(icon, customisations) {
    const fullIcon = {
      ...defaultIconProps,
      ...icon
    };
    const fullCustomisations = {
      ...defaultIconCustomisations,
      ...customisations
    };
    const box = {
      left: fullIcon.left,
      top: fullIcon.top,
      width: fullIcon.width,
      height: fullIcon.height
    };
    let body = fullIcon.body;
    [fullIcon, fullCustomisations].forEach((props) => {
      const transformations = [];
      const hFlip = props.hFlip;
      const vFlip = props.vFlip;
      let rotation = props.rotate;
      if (hFlip) {
        if (vFlip) {
          rotation += 2;
        } else {
          transformations.push(
            "translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")"
          );
          transformations.push("scale(-1 1)");
          box.top = box.left = 0;
        }
      } else if (vFlip) {
        transformations.push(
          "translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")"
        );
        transformations.push("scale(1 -1)");
        box.top = box.left = 0;
      }
      let tempValue;
      if (rotation < 0) {
        rotation -= Math.floor(rotation / 4) * 4;
      }
      rotation = rotation % 4;
      switch (rotation) {
        case 1:
          tempValue = box.height / 2 + box.top;
          transformations.unshift(
            "rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")"
          );
          break;
        case 2:
          transformations.unshift(
            "rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")"
          );
          break;
        case 3:
          tempValue = box.width / 2 + box.left;
          transformations.unshift(
            "rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")"
          );
          break;
      }
      if (rotation % 2 === 1) {
        if (box.left !== box.top) {
          tempValue = box.left;
          box.left = box.top;
          box.top = tempValue;
        }
        if (box.width !== box.height) {
          tempValue = box.width;
          box.width = box.height;
          box.height = tempValue;
        }
      }
      if (transformations.length) {
        body = '<g transform="' + transformations.join(" ") + '">' + body + "</g>";
      }
    });
    const customisationsWidth = fullCustomisations.width;
    const customisationsHeight = fullCustomisations.height;
    const boxWidth = box.width;
    const boxHeight = box.height;
    let width;
    let height;
    if (customisationsWidth === null) {
      height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
      width = calculateSize(height, boxWidth / boxHeight);
    } else {
      width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
      height = customisationsHeight === null ? calculateSize(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
    }
    const attributes = {};
    const setAttr = (prop, value) => {
      if (!isUnsetKeyword(value)) {
        attributes[prop] = value.toString();
      }
    };
    setAttr("width", width);
    setAttr("height", height);
    attributes.viewBox = box.left.toString() + " " + box.top.toString() + " " + boxWidth.toString() + " " + boxHeight.toString();
    return {
      attributes,
      body
    };
  }
  const regex = /\sid="(\S+)"/g;
  const randomPrefix = "IconifyId" + Date.now().toString(16) + (Math.random() * 16777216 | 0).toString(16);
  let counter = 0;
  function replaceIDs(body, prefix = randomPrefix) {
    const ids = [];
    let match;
    while (match = regex.exec(body)) {
      ids.push(match[1]);
    }
    if (!ids.length) {
      return body;
    }
    const suffix = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
    ids.forEach((id) => {
      const newID = typeof prefix === "function" ? prefix(id) : prefix + (counter++).toString();
      const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      body = body.replace(
        // Allowed characters before id: [#;"]
        // Allowed characters after id: [)"], .[a-z]
        new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', "g"),
        "$1" + newID + suffix + "$3"
      );
    });
    body = body.replace(new RegExp(suffix, "g"), "");
    return body;
  }
  const storage = /* @__PURE__ */ Object.create(null);
  function setAPIModule(provider, item) {
    storage[provider] = item;
  }
  function getAPIModule(provider) {
    return storage[provider] || storage[""];
  }
  function createAPIConfig(source) {
    let resources;
    if (typeof source.resources === "string") {
      resources = [source.resources];
    } else {
      resources = source.resources;
      if (!(resources instanceof Array) || !resources.length) {
        return null;
      }
    }
    const result = {
      // API hosts
      resources,
      // Root path
      path: source.path || "/",
      // URL length limit
      maxURL: source.maxURL || 500,
      // Timeout before next host is used.
      rotate: source.rotate || 750,
      // Timeout before failing query.
      timeout: source.timeout || 5e3,
      // Randomise default API end point.
      random: source.random === true,
      // Start index
      index: source.index || 0,
      // Receive data after time out (used if time out kicks in first, then API module sends data anyway).
      dataAfterTimeout: source.dataAfterTimeout !== false
    };
    return result;
  }
  const configStorage = /* @__PURE__ */ Object.create(null);
  const fallBackAPISources = [
    "https://api.simplesvg.com",
    "https://api.unisvg.com"
  ];
  const fallBackAPI = [];
  while (fallBackAPISources.length > 0) {
    if (fallBackAPISources.length === 1) {
      fallBackAPI.push(fallBackAPISources.shift());
    } else {
      if (Math.random() > 0.5) {
        fallBackAPI.push(fallBackAPISources.shift());
      } else {
        fallBackAPI.push(fallBackAPISources.pop());
      }
    }
  }
  configStorage[""] = createAPIConfig({
    resources: ["https://api.iconify.design"].concat(fallBackAPI)
  });
  function addAPIProvider(provider, customConfig) {
    const config2 = createAPIConfig(customConfig);
    if (config2 === null) {
      return false;
    }
    configStorage[provider] = config2;
    return true;
  }
  function getAPIConfig(provider) {
    return configStorage[provider];
  }
  const detectFetch = () => {
    let callback;
    try {
      callback = fetch;
      if (typeof callback === "function") {
        return callback;
      }
    } catch (err) {
    }
  };
  let fetchModule = detectFetch();
  function calculateMaxLength(provider, prefix) {
    const config2 = getAPIConfig(provider);
    if (!config2) {
      return 0;
    }
    let result;
    if (!config2.maxURL) {
      result = 0;
    } else {
      let maxHostLength = 0;
      config2.resources.forEach((item) => {
        const host = item;
        maxHostLength = Math.max(maxHostLength, host.length);
      });
      const url = prefix + ".json?icons=";
      result = config2.maxURL - maxHostLength - config2.path.length - url.length;
    }
    return result;
  }
  function shouldAbort(status) {
    return status === 404;
  }
  const prepare = (provider, prefix, icons) => {
    const results = [];
    const maxLength = calculateMaxLength(provider, prefix);
    const type = "icons";
    let item = {
      type,
      provider,
      prefix,
      icons: []
    };
    let length = 0;
    icons.forEach((name, index) => {
      length += name.length + 1;
      if (length >= maxLength && index > 0) {
        results.push(item);
        item = {
          type,
          provider,
          prefix,
          icons: []
        };
        length = name.length;
      }
      item.icons.push(name);
    });
    results.push(item);
    return results;
  };
  function getPath(provider) {
    if (typeof provider === "string") {
      const config2 = getAPIConfig(provider);
      if (config2) {
        return config2.path;
      }
    }
    return "/";
  }
  const send = (host, params, callback) => {
    if (!fetchModule) {
      callback("abort", 424);
      return;
    }
    let path = getPath(params.provider);
    switch (params.type) {
      case "icons": {
        const prefix = params.prefix;
        const icons = params.icons;
        const iconsList = icons.join(",");
        const urlParams = new URLSearchParams({
          icons: iconsList
        });
        path += prefix + ".json?" + urlParams.toString();
        break;
      }
      case "custom": {
        const uri = params.uri;
        path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
        break;
      }
      default:
        callback("abort", 400);
        return;
    }
    let defaultError = 503;
    fetchModule(host + path).then((response) => {
      const status = response.status;
      if (status !== 200) {
        setTimeout(() => {
          callback(shouldAbort(status) ? "abort" : "next", status);
        });
        return;
      }
      defaultError = 501;
      return response.json();
    }).then((data) => {
      if (typeof data !== "object" || data === null) {
        setTimeout(() => {
          if (data === 404) {
            callback("abort", data);
          } else {
            callback("next", defaultError);
          }
        });
        return;
      }
      setTimeout(() => {
        callback("success", data);
      });
    }).catch(() => {
      callback("next", defaultError);
    });
  };
  const fetchAPIModule = {
    prepare,
    send
  };
  function sortIcons(icons) {
    const result = {
      loaded: [],
      missing: [],
      pending: []
    };
    const storage2 = /* @__PURE__ */ Object.create(null);
    icons.sort((a, b) => {
      if (a.provider !== b.provider) {
        return a.provider.localeCompare(b.provider);
      }
      if (a.prefix !== b.prefix) {
        return a.prefix.localeCompare(b.prefix);
      }
      return a.name.localeCompare(b.name);
    });
    let lastIcon = {
      provider: "",
      prefix: "",
      name: ""
    };
    icons.forEach((icon) => {
      if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) {
        return;
      }
      lastIcon = icon;
      const provider = icon.provider;
      const prefix = icon.prefix;
      const name = icon.name;
      const providerStorage = storage2[provider] || (storage2[provider] = /* @__PURE__ */ Object.create(null));
      const localStorage2 = providerStorage[prefix] || (providerStorage[prefix] = getStorage(provider, prefix));
      let list;
      if (name in localStorage2.icons) {
        list = result.loaded;
      } else if (prefix === "" || localStorage2.missing.has(name)) {
        list = result.missing;
      } else {
        list = result.pending;
      }
      const item = {
        provider,
        prefix,
        name
      };
      list.push(item);
    });
    return result;
  }
  function removeCallback(storages, id) {
    storages.forEach((storage2) => {
      const items = storage2.loaderCallbacks;
      if (items) {
        storage2.loaderCallbacks = items.filter((row) => row.id !== id);
      }
    });
  }
  function updateCallbacks(storage2) {
    if (!storage2.pendingCallbacksFlag) {
      storage2.pendingCallbacksFlag = true;
      setTimeout(() => {
        storage2.pendingCallbacksFlag = false;
        const items = storage2.loaderCallbacks ? storage2.loaderCallbacks.slice(0) : [];
        if (!items.length) {
          return;
        }
        let hasPending = false;
        const provider = storage2.provider;
        const prefix = storage2.prefix;
        items.forEach((item) => {
          const icons = item.icons;
          const oldLength = icons.pending.length;
          icons.pending = icons.pending.filter((icon) => {
            if (icon.prefix !== prefix) {
              return true;
            }
            const name = icon.name;
            if (storage2.icons[name]) {
              icons.loaded.push({
                provider,
                prefix,
                name
              });
            } else if (storage2.missing.has(name)) {
              icons.missing.push({
                provider,
                prefix,
                name
              });
            } else {
              hasPending = true;
              return true;
            }
            return false;
          });
          if (icons.pending.length !== oldLength) {
            if (!hasPending) {
              removeCallback([storage2], item.id);
            }
            item.callback(
              icons.loaded.slice(0),
              icons.missing.slice(0),
              icons.pending.slice(0),
              item.abort
            );
          }
        });
      });
    }
  }
  let idCounter = 0;
  function storeCallback(callback, icons, pendingSources) {
    const id = idCounter++;
    const abort = removeCallback.bind(null, pendingSources, id);
    if (!icons.pending.length) {
      return abort;
    }
    const item = {
      id,
      icons,
      callback,
      abort
    };
    pendingSources.forEach((storage2) => {
      (storage2.loaderCallbacks || (storage2.loaderCallbacks = [])).push(item);
    });
    return abort;
  }
  function listToIcons(list, validate = true, simpleNames2 = false) {
    const result = [];
    list.forEach((item) => {
      const icon = typeof item === "string" ? stringToIcon(item, validate, simpleNames2) : item;
      if (icon) {
        result.push(icon);
      }
    });
    return result;
  }
  var defaultConfig = {
    resources: [],
    index: 0,
    timeout: 2e3,
    rotate: 750,
    random: false,
    dataAfterTimeout: false
  };
  function sendQuery(config2, payload, query, done) {
    const resourcesCount = config2.resources.length;
    const startIndex = config2.random ? Math.floor(Math.random() * resourcesCount) : config2.index;
    let resources;
    if (config2.random) {
      let list = config2.resources.slice(0);
      resources = [];
      while (list.length > 1) {
        const nextIndex = Math.floor(Math.random() * list.length);
        resources.push(list[nextIndex]);
        list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
      }
      resources = resources.concat(list);
    } else {
      resources = config2.resources.slice(startIndex).concat(config2.resources.slice(0, startIndex));
    }
    const startTime = Date.now();
    let status = "pending";
    let queriesSent = 0;
    let lastError;
    let timer = null;
    let queue = [];
    let doneCallbacks = [];
    if (typeof done === "function") {
      doneCallbacks.push(done);
    }
    function resetTimer() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }
    function abort() {
      if (status === "pending") {
        status = "aborted";
      }
      resetTimer();
      queue.forEach((item) => {
        if (item.status === "pending") {
          item.status = "aborted";
        }
      });
      queue = [];
    }
    function subscribe(callback, overwrite) {
      if (overwrite) {
        doneCallbacks = [];
      }
      if (typeof callback === "function") {
        doneCallbacks.push(callback);
      }
    }
    function getQueryStatus() {
      return {
        startTime,
        payload,
        status,
        queriesSent,
        queriesPending: queue.length,
        subscribe,
        abort
      };
    }
    function failQuery() {
      status = "failed";
      doneCallbacks.forEach((callback) => {
        callback(void 0, lastError);
      });
    }
    function clearQueue() {
      queue.forEach((item) => {
        if (item.status === "pending") {
          item.status = "aborted";
        }
      });
      queue = [];
    }
    function moduleResponse(item, response, data) {
      const isError = response !== "success";
      queue = queue.filter((queued) => queued !== item);
      switch (status) {
        case "pending":
          break;
        case "failed":
          if (isError || !config2.dataAfterTimeout) {
            return;
          }
          break;
        default:
          return;
      }
      if (response === "abort") {
        lastError = data;
        failQuery();
        return;
      }
      if (isError) {
        lastError = data;
        if (!queue.length) {
          if (!resources.length) {
            failQuery();
          } else {
            execNext();
          }
        }
        return;
      }
      resetTimer();
      clearQueue();
      if (!config2.random) {
        const index = config2.resources.indexOf(item.resource);
        if (index !== -1 && index !== config2.index) {
          config2.index = index;
        }
      }
      status = "completed";
      doneCallbacks.forEach((callback) => {
        callback(data);
      });
    }
    function execNext() {
      if (status !== "pending") {
        return;
      }
      resetTimer();
      const resource = resources.shift();
      if (resource === void 0) {
        if (queue.length) {
          timer = setTimeout(() => {
            resetTimer();
            if (status === "pending") {
              clearQueue();
              failQuery();
            }
          }, config2.timeout);
          return;
        }
        failQuery();
        return;
      }
      const item = {
        status: "pending",
        resource,
        callback: (status2, data) => {
          moduleResponse(item, status2, data);
        }
      };
      queue.push(item);
      queriesSent++;
      timer = setTimeout(execNext, config2.rotate);
      query(resource, payload, item.callback);
    }
    setTimeout(execNext);
    return getQueryStatus;
  }
  function initRedundancy(cfg) {
    const config2 = {
      ...defaultConfig,
      ...cfg
    };
    let queries = [];
    function cleanup() {
      queries = queries.filter((item) => item().status === "pending");
    }
    function query(payload, queryCallback, doneCallback) {
      const query2 = sendQuery(
        config2,
        payload,
        queryCallback,
        (data, error) => {
          cleanup();
          if (doneCallback) {
            doneCallback(data, error);
          }
        }
      );
      queries.push(query2);
      return query2;
    }
    function find(callback) {
      return queries.find((value) => {
        return callback(value);
      }) || null;
    }
    const instance = {
      query,
      find,
      setIndex: (index) => {
        config2.index = index;
      },
      getIndex: () => config2.index,
      cleanup
    };
    return instance;
  }
  function emptyCallback$1() {
  }
  const redundancyCache = /* @__PURE__ */ Object.create(null);
  function getRedundancyCache(provider) {
    if (!redundancyCache[provider]) {
      const config2 = getAPIConfig(provider);
      if (!config2) {
        return;
      }
      const redundancy = initRedundancy(config2);
      const cachedReundancy = {
        config: config2,
        redundancy
      };
      redundancyCache[provider] = cachedReundancy;
    }
    return redundancyCache[provider];
  }
  function sendAPIQuery(target, query, callback) {
    let redundancy;
    let send2;
    if (typeof target === "string") {
      const api = getAPIModule(target);
      if (!api) {
        callback(void 0, 424);
        return emptyCallback$1;
      }
      send2 = api.send;
      const cached = getRedundancyCache(target);
      if (cached) {
        redundancy = cached.redundancy;
      }
    } else {
      const config2 = createAPIConfig(target);
      if (config2) {
        redundancy = initRedundancy(config2);
        const moduleKey = target.resources ? target.resources[0] : "";
        const api = getAPIModule(moduleKey);
        if (api) {
          send2 = api.send;
        }
      }
    }
    if (!redundancy || !send2) {
      callback(void 0, 424);
      return emptyCallback$1;
    }
    return redundancy.query(query, send2, callback)().abort;
  }
  const browserCacheVersion = "iconify2";
  const browserCachePrefix = "iconify";
  const browserCacheCountKey = browserCachePrefix + "-count";
  const browserCacheVersionKey = browserCachePrefix + "-version";
  const browserStorageHour = 36e5;
  const browserStorageCacheExpiration = 168;
  function getStoredItem(func, key) {
    try {
      return func.getItem(key);
    } catch (err) {
    }
  }
  function setStoredItem(func, key, value) {
    try {
      func.setItem(key, value);
      return true;
    } catch (err) {
    }
  }
  function removeStoredItem(func, key) {
    try {
      func.removeItem(key);
    } catch (err) {
    }
  }
  function setBrowserStorageItemsCount(storage2, value) {
    return setStoredItem(storage2, browserCacheCountKey, value.toString());
  }
  function getBrowserStorageItemsCount(storage2) {
    return parseInt(getStoredItem(storage2, browserCacheCountKey)) || 0;
  }
  const browserStorageConfig = {
    local: true,
    session: true
  };
  const browserStorageEmptyItems = {
    local: /* @__PURE__ */ new Set(),
    session: /* @__PURE__ */ new Set()
  };
  let browserStorageStatus = false;
  function setBrowserStorageStatus(status) {
    browserStorageStatus = status;
  }
  let _window = typeof window === "undefined" ? {} : window;
  function getBrowserStorage(key) {
    const attr = key + "Storage";
    try {
      if (_window && _window[attr] && typeof _window[attr].length === "number") {
        return _window[attr];
      }
    } catch (err) {
    }
    browserStorageConfig[key] = false;
  }
  function iterateBrowserStorage(key, callback) {
    const func = getBrowserStorage(key);
    if (!func) {
      return;
    }
    const version = getStoredItem(func, browserCacheVersionKey);
    if (version !== browserCacheVersion) {
      if (version) {
        const total2 = getBrowserStorageItemsCount(func);
        for (let i = 0; i < total2; i++) {
          removeStoredItem(func, browserCachePrefix + i.toString());
        }
      }
      setStoredItem(func, browserCacheVersionKey, browserCacheVersion);
      setBrowserStorageItemsCount(func, 0);
      return;
    }
    const minTime = Math.floor(Date.now() / browserStorageHour) - browserStorageCacheExpiration;
    const parseItem = (index) => {
      const name = browserCachePrefix + index.toString();
      const item = getStoredItem(func, name);
      if (typeof item !== "string") {
        return;
      }
      try {
        const data = JSON.parse(item);
        if (typeof data === "object" && typeof data.cached === "number" && data.cached > minTime && typeof data.provider === "string" && typeof data.data === "object" && typeof data.data.prefix === "string" && // Valid item: run callback
        callback(data, index)) {
          return true;
        }
      } catch (err) {
      }
      removeStoredItem(func, name);
    };
    let total = getBrowserStorageItemsCount(func);
    for (let i = total - 1; i >= 0; i--) {
      if (!parseItem(i)) {
        if (i === total - 1) {
          total--;
          setBrowserStorageItemsCount(func, total);
        } else {
          browserStorageEmptyItems[key].add(i);
        }
      }
    }
  }
  function initBrowserStorage() {
    if (browserStorageStatus) {
      return;
    }
    setBrowserStorageStatus(true);
    for (const key in browserStorageConfig) {
      iterateBrowserStorage(key, (item) => {
        const iconSet = item.data;
        const provider = item.provider;
        const prefix = iconSet.prefix;
        const storage2 = getStorage(
          provider,
          prefix
        );
        if (!addIconSet(storage2, iconSet).length) {
          return false;
        }
        const lastModified = iconSet.lastModified || -1;
        storage2.lastModifiedCached = storage2.lastModifiedCached ? Math.min(storage2.lastModifiedCached, lastModified) : lastModified;
        return true;
      });
    }
  }
  function updateLastModified(storage2, lastModified) {
    const lastValue = storage2.lastModifiedCached;
    if (
      // Matches or newer
      lastValue && lastValue >= lastModified
    ) {
      return lastValue === lastModified;
    }
    storage2.lastModifiedCached = lastModified;
    if (lastValue) {
      for (const key in browserStorageConfig) {
        iterateBrowserStorage(key, (item) => {
          const iconSet = item.data;
          return item.provider !== storage2.provider || iconSet.prefix !== storage2.prefix || iconSet.lastModified === lastModified;
        });
      }
    }
    return true;
  }
  function storeInBrowserStorage(storage2, data) {
    if (!browserStorageStatus) {
      initBrowserStorage();
    }
    function store(key) {
      let func;
      if (!browserStorageConfig[key] || !(func = getBrowserStorage(key))) {
        return;
      }
      const set = browserStorageEmptyItems[key];
      let index;
      if (set.size) {
        set.delete(index = Array.from(set).shift());
      } else {
        index = getBrowserStorageItemsCount(func);
        if (!setBrowserStorageItemsCount(func, index + 1)) {
          return;
        }
      }
      const item = {
        cached: Math.floor(Date.now() / browserStorageHour),
        provider: storage2.provider,
        data
      };
      return setStoredItem(
        func,
        browserCachePrefix + index.toString(),
        JSON.stringify(item)
      );
    }
    if (data.lastModified && !updateLastModified(storage2, data.lastModified)) {
      return;
    }
    if (!Object.keys(data.icons).length) {
      return;
    }
    if (data.not_found) {
      data = Object.assign({}, data);
      delete data.not_found;
    }
    if (!store("local")) {
      store("session");
    }
  }
  function emptyCallback() {
  }
  function loadedNewIcons(storage2) {
    if (!storage2.iconsLoaderFlag) {
      storage2.iconsLoaderFlag = true;
      setTimeout(() => {
        storage2.iconsLoaderFlag = false;
        updateCallbacks(storage2);
      });
    }
  }
  function loadNewIcons(storage2, icons) {
    if (!storage2.iconsToLoad) {
      storage2.iconsToLoad = icons;
    } else {
      storage2.iconsToLoad = storage2.iconsToLoad.concat(icons).sort();
    }
    if (!storage2.iconsQueueFlag) {
      storage2.iconsQueueFlag = true;
      setTimeout(() => {
        storage2.iconsQueueFlag = false;
        const { provider, prefix } = storage2;
        const icons2 = storage2.iconsToLoad;
        delete storage2.iconsToLoad;
        let api;
        if (!icons2 || !(api = getAPIModule(provider))) {
          return;
        }
        const params = api.prepare(provider, prefix, icons2);
        params.forEach((item) => {
          sendAPIQuery(provider, item, (data) => {
            if (typeof data !== "object") {
              item.icons.forEach((name) => {
                storage2.missing.add(name);
              });
            } else {
              try {
                const parsed = addIconSet(
                  storage2,
                  data
                );
                if (!parsed.length) {
                  return;
                }
                const pending = storage2.pendingIcons;
                if (pending) {
                  parsed.forEach((name) => {
                    pending.delete(name);
                  });
                }
                storeInBrowserStorage(storage2, data);
              } catch (err) {
                console.error(err);
              }
            }
            loadedNewIcons(storage2);
          });
        });
      });
    }
  }
  const loadIcons = (icons, callback) => {
    const cleanedIcons = listToIcons(icons, true, allowSimpleNames());
    const sortedIcons = sortIcons(cleanedIcons);
    if (!sortedIcons.pending.length) {
      let callCallback = true;
      if (callback) {
        setTimeout(() => {
          if (callCallback) {
            callback(
              sortedIcons.loaded,
              sortedIcons.missing,
              sortedIcons.pending,
              emptyCallback
            );
          }
        });
      }
      return () => {
        callCallback = false;
      };
    }
    const newIcons = /* @__PURE__ */ Object.create(null);
    const sources = [];
    let lastProvider, lastPrefix;
    sortedIcons.pending.forEach((icon) => {
      const { provider, prefix } = icon;
      if (prefix === lastPrefix && provider === lastProvider) {
        return;
      }
      lastProvider = provider;
      lastPrefix = prefix;
      sources.push(getStorage(provider, prefix));
      const providerNewIcons = newIcons[provider] || (newIcons[provider] = /* @__PURE__ */ Object.create(null));
      if (!providerNewIcons[prefix]) {
        providerNewIcons[prefix] = [];
      }
    });
    sortedIcons.pending.forEach((icon) => {
      const { provider, prefix, name } = icon;
      const storage2 = getStorage(provider, prefix);
      const pendingQueue = storage2.pendingIcons || (storage2.pendingIcons = /* @__PURE__ */ new Set());
      if (!pendingQueue.has(name)) {
        pendingQueue.add(name);
        newIcons[provider][prefix].push(name);
      }
    });
    sources.forEach((storage2) => {
      const { provider, prefix } = storage2;
      if (newIcons[provider][prefix].length) {
        loadNewIcons(storage2, newIcons[provider][prefix]);
      }
    });
    return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
  };
  function mergeCustomisations(defaults, item) {
    const result = {
      ...defaults
    };
    for (const key in item) {
      const value = item[key];
      const valueType = typeof value;
      if (key in defaultIconSizeCustomisations) {
        if (value === null || value && (valueType === "string" || valueType === "number")) {
          result[key] = value;
        }
      } else if (valueType === typeof result[key]) {
        result[key] = key === "rotate" ? value % 4 : value;
      }
    }
    return result;
  }
  const separator = /[\s,]+/;
  function flipFromString(custom, flip) {
    flip.split(separator).forEach((str) => {
      const value = str.trim();
      switch (value) {
        case "horizontal":
          custom.hFlip = true;
          break;
        case "vertical":
          custom.vFlip = true;
          break;
      }
    });
  }
  function rotateFromString(value, defaultValue = 0) {
    const units = value.replace(/^-?[0-9.]*/, "");
    function cleanup(value2) {
      while (value2 < 0) {
        value2 += 4;
      }
      return value2 % 4;
    }
    if (units === "") {
      const num = parseInt(value);
      return isNaN(num) ? 0 : cleanup(num);
    } else if (units !== value) {
      let split = 0;
      switch (units) {
        case "%":
          split = 25;
          break;
        case "deg":
          split = 90;
      }
      if (split) {
        let num = parseFloat(value.slice(0, value.length - units.length));
        if (isNaN(num)) {
          return 0;
        }
        num = num / split;
        return num % 1 === 0 ? cleanup(num) : 0;
      }
    }
    return defaultValue;
  }
  function iconToHTML(body, attributes) {
    let renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
    for (const attr in attributes) {
      renderAttribsHTML += " " + attr + '="' + attributes[attr] + '"';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg"' + renderAttribsHTML + ">" + body + "</svg>";
  }
  function encodeSVGforURL(svg) {
    return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
  }
  function svgToData(svg) {
    return "data:image/svg+xml," + encodeSVGforURL(svg);
  }
  function svgToURL(svg) {
    return 'url("' + svgToData(svg) + '")';
  }
  const defaultExtendedIconCustomisations = {
    ...defaultIconCustomisations,
    inline: false
  };
  const svgDefaults = {
    "xmlns": "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    "aria-hidden": true,
    "role": "img"
  };
  const commonProps = {
    display: "inline-block"
  };
  const monotoneProps = {
    backgroundColor: "currentColor"
  };
  const coloredProps = {
    backgroundColor: "transparent"
  };
  const propsToAdd = {
    Image: "var(--svg)",
    Repeat: "no-repeat",
    Size: "100% 100%"
  };
  const propsToAddTo = {
    webkitMask: monotoneProps,
    mask: monotoneProps,
    background: coloredProps
  };
  for (const prefix in propsToAddTo) {
    const list = propsToAddTo[prefix];
    for (const prop in propsToAdd) {
      list[prefix + prop] = propsToAdd[prop];
    }
  }
  const customisationAliases = {};
  ["horizontal", "vertical"].forEach((prefix) => {
    const attr = prefix.slice(0, 1) + "Flip";
    customisationAliases[prefix + "-flip"] = attr;
    customisationAliases[prefix.slice(0, 1) + "-flip"] = attr;
    customisationAliases[prefix + "Flip"] = attr;
  });
  function fixSize(value) {
    return value + (value.match(/^[-0-9.]+$/) ? "px" : "");
  }
  const render = (icon, props) => {
    const customisations = mergeCustomisations(defaultExtendedIconCustomisations, props);
    const componentProps = { ...svgDefaults };
    const mode = props.mode || "svg";
    const style = {};
    const propsStyle = props.style;
    const customStyle = typeof propsStyle === "object" && !(propsStyle instanceof Array) ? propsStyle : {};
    for (let key in props) {
      const value = props[key];
      if (value === void 0) {
        continue;
      }
      switch (key) {
        case "icon":
        case "style":
        case "onLoad":
        case "mode":
          break;
        case "inline":
        case "hFlip":
        case "vFlip":
          customisations[key] = value === true || value === "true" || value === 1;
          break;
        case "flip":
          if (typeof value === "string") {
            flipFromString(customisations, value);
          }
          break;
        case "color":
          style.color = value;
          break;
        case "rotate":
          if (typeof value === "string") {
            customisations[key] = rotateFromString(value);
          } else if (typeof value === "number") {
            customisations[key] = value;
          }
          break;
        case "ariaHidden":
        case "aria-hidden":
          if (value !== true && value !== "true") {
            delete componentProps["aria-hidden"];
          }
          break;
        default: {
          const alias = customisationAliases[key];
          if (alias) {
            if (value === true || value === "true" || value === 1) {
              customisations[alias] = true;
            }
          } else if (defaultExtendedIconCustomisations[key] === void 0) {
            componentProps[key] = value;
          }
        }
      }
    }
    const item = iconToSVG(icon, customisations);
    const renderAttribs = item.attributes;
    if (customisations.inline) {
      style.verticalAlign = "-0.125em";
    }
    if (mode === "svg") {
      componentProps.style = {
        ...style,
        ...customStyle
      };
      Object.assign(componentProps, renderAttribs);
      let localCounter = 0;
      let id = props.id;
      if (typeof id === "string") {
        id = id.replace(/-/g, "_");
      }
      componentProps["innerHTML"] = replaceIDs(item.body, id ? () => id + "ID" + localCounter++ : "iconifyVue");
      return vue.h("svg", componentProps);
    }
    const { body, width, height } = icon;
    const useMask = mode === "mask" || (mode === "bg" ? false : body.indexOf("currentColor") !== -1);
    const html = iconToHTML(body, {
      ...renderAttribs,
      width: width + "",
      height: height + ""
    });
    componentProps.style = {
      ...style,
      "--svg": svgToURL(html),
      "width": fixSize(renderAttribs.width),
      "height": fixSize(renderAttribs.height),
      ...commonProps,
      ...useMask ? monotoneProps : coloredProps,
      ...customStyle
    };
    return vue.h("span", componentProps);
  };
  allowSimpleNames(true);
  setAPIModule("", fetchAPIModule);
  if (typeof document !== "undefined" && typeof window !== "undefined") {
    initBrowserStorage();
    const _window2 = window;
    if (_window2.IconifyPreload !== void 0) {
      const preload = _window2.IconifyPreload;
      const err = "Invalid IconifyPreload syntax.";
      if (typeof preload === "object" && preload !== null) {
        (preload instanceof Array ? preload : [preload]).forEach((item) => {
          try {
            if (
              // Check if item is an object and not null/array
              typeof item !== "object" || item === null || item instanceof Array || // Check for 'icons' and 'prefix'
              typeof item.icons !== "object" || typeof item.prefix !== "string" || // Add icon set
              !addCollection(item)
            ) {
              console.error(err);
            }
          } catch (e2) {
            console.error(err);
          }
        });
      }
    }
    if (_window2.IconifyProviders !== void 0) {
      const providers = _window2.IconifyProviders;
      if (typeof providers === "object" && providers !== null) {
        for (let key in providers) {
          const err = "IconifyProviders[" + key + "] is invalid.";
          try {
            const value = providers[key];
            if (typeof value !== "object" || !value || value.resources === void 0) {
              continue;
            }
            if (!addAPIProvider(key, value)) {
              console.error(err);
            }
          } catch (e2) {
            console.error(err);
          }
        }
      }
    }
  }
  const emptyIcon = {
    ...defaultIconProps,
    body: ""
  };
  const Icon = vue.defineComponent({
    // Do not inherit other attributes: it is handled by render()
    inheritAttrs: false,
    // Set initial data
    data() {
      return {
        // Mounted status
        iconMounted: false,
        // Callback counter to trigger re-render
        counter: 0
      };
    },
    mounted() {
      this._name = "";
      this._loadingIcon = null;
      this.iconMounted = true;
    },
    unmounted() {
      this.abortLoading();
    },
    methods: {
      abortLoading() {
        if (this._loadingIcon) {
          this._loadingIcon.abort();
          this._loadingIcon = null;
        }
      },
      // Get data for icon to render or null
      getIcon(icon, onload) {
        if (typeof icon === "object" && icon !== null && typeof icon.body === "string") {
          this._name = "";
          this.abortLoading();
          return {
            data: icon
          };
        }
        let iconName;
        if (typeof icon !== "string" || (iconName = stringToIcon(icon, false, true)) === null) {
          this.abortLoading();
          return null;
        }
        const data = getIconData(iconName);
        if (!data) {
          if (!this._loadingIcon || this._loadingIcon.name !== icon) {
            this.abortLoading();
            this._name = "";
            if (data !== null) {
              this._loadingIcon = {
                name: icon,
                abort: loadIcons([iconName], () => {
                  this.counter++;
                })
              };
            }
          }
          return null;
        }
        this.abortLoading();
        if (this._name !== icon) {
          this._name = icon;
          if (onload) {
            onload(icon);
          }
        }
        const classes = ["iconify"];
        if (iconName.prefix !== "") {
          classes.push("iconify--" + iconName.prefix);
        }
        if (iconName.provider !== "") {
          classes.push("iconify--" + iconName.provider);
        }
        return { data, classes };
      }
    },
    // Render icon
    render() {
      this.counter;
      const props = this.$attrs;
      const icon = this.iconMounted ? this.getIcon(props.icon, props.onLoad) : null;
      if (!icon) {
        return render(emptyIcon, props);
      }
      let newProps = props;
      if (icon.classes) {
        newProps = {
          ...props,
          class: (typeof props["class"] === "string" ? props["class"] + " " : "") + icon.classes.join(" ")
        };
      }
      return render({
        ...defaultIconProps,
        ...icon.data
      }, newProps);
    }
  });
  const _sfc_main$p = /* @__PURE__ */ vue.defineComponent({
    __name: "BackIcon",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(Icon), {
          class: "back-icon",
          icon: "octicon:arrow-left-24",
          width: "22"
        });
      };
    }
  });
  const _hoisted_1$n = { class: "nav-bar" };
  const _hoisted_2$j = {
    key: 0,
    class: "title"
  };
  const _sfc_main$o = /* @__PURE__ */ vue.defineComponent({
    __name: "NavBar",
    props: {
      title: {}
    },
    emits: ["back"],
    setup(__props, { emit: __emit }) {
      const emit = __emit;
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$n, [
          vue.createVNode(_sfc_main$p, {
            onClick: _cache[0] || (_cache[0] = ($event) => emit("back"))
          }),
          _ctx.title ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$j, vue.toDisplayString(_ctx.title), 1)) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  const NavBar = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["__scopeId", "data-v-fda0acaa"]]);
  const _hoisted_1$m = { class: "display-type" };
  const _hoisted_2$i = { style: { "position": "relative" } };
  const _hoisted_3$f = {
    key: 0,
    class: "type-list"
  };
  const _sfc_main$n = /* @__PURE__ */ vue.defineComponent({
    __name: "BaseSelect",
    props: {
      displayType: {}
    },
    emits: ["update:displayType"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      let state = vue.reactive({
        showChangeDisplayType: false,
        lastDisplayType: null
      });
      function changeOption(item) {
        if (![CommentDisplayType.New, CommentDisplayType.Like].includes(props.displayType)) {
          state.lastDisplayType = props.displayType;
        }
        emit("update:displayType", item);
        state.showChangeDisplayType = false;
      }
      function clickDisplayType() {
        if ([CommentDisplayType.New, CommentDisplayType.Like].includes(props.displayType)) {
          return changeOption(state.lastDisplayType ?? CommentDisplayType.FloorInFloorNoCallUser);
        }
        state.showChangeDisplayType = !state.showChangeDisplayType;
      }
      const currentDisplayType = vue.computed(() => {
        let judge = props.displayType;
        if ([CommentDisplayType.New, CommentDisplayType.Like].includes(props.displayType)) {
          judge = state.lastDisplayType;
        }
        switch (judge) {
          case CommentDisplayType.FloorInFloorNoCallUser:
            return "楼中楼";
          case CommentDisplayType.FloorInFloor:
            return "楼中楼(@)";
          case CommentDisplayType.FloorInFloorNested:
            return "冗余楼中楼";
          case CommentDisplayType.V2exOrigin:
            return "V2原版";
          case CommentDisplayType.OnlyOp:
            return "只看楼主";
          default:
            return "楼中楼";
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$m, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["type", _ctx.displayType === vue.unref(CommentDisplayType).Like && "active"]),
            onClick: _cache[0] || (_cache[0] = ($event) => changeOption(vue.unref(CommentDisplayType).Like))
          }, "最热 ", 2),
          vue.createElementVNode("div", _hoisted_2$i, [
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["type", ![vue.unref(CommentDisplayType).New, vue.unref(CommentDisplayType).Like].includes(_ctx.displayType) && "active"]),
              onClick: clickDisplayType
            }, [
              vue.createElementVNode("span", null, vue.toDisplayString(currentDisplayType.value), 1),
              vue.createVNode(vue.unref(Icon), { icon: "mingcute:down-line" })
            ], 2),
            vue.unref(state).showChangeDisplayType ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$f, [
              vue.createElementVNode("div", {
                class: vue.normalizeClass(["item", _ctx.displayType === vue.unref(CommentDisplayType).FloorInFloorNoCallUser && "active"]),
                onClick: _cache[1] || (_cache[1] = vue.withModifiers(($event) => changeOption(vue.unref(CommentDisplayType).FloorInFloorNoCallUser), ["stop"]))
              }, "楼中楼 ", 2),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(["item", _ctx.displayType === vue.unref(CommentDisplayType).FloorInFloor && "active"]),
                onClick: _cache[2] || (_cache[2] = vue.withModifiers(($event) => changeOption(vue.unref(CommentDisplayType).FloorInFloor), ["stop"]))
              }, "楼中楼(@) ", 2),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(["item", _ctx.displayType === vue.unref(CommentDisplayType).FloorInFloorNested && "active"]),
                onClick: _cache[3] || (_cache[3] = vue.withModifiers(($event) => changeOption(vue.unref(CommentDisplayType).FloorInFloorNested), ["stop"]))
              }, "冗余楼中楼 ", 2),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(["item", _ctx.displayType === vue.unref(CommentDisplayType).OnlyOp && "active"]),
                onClick: _cache[4] || (_cache[4] = vue.withModifiers(($event) => changeOption(vue.unref(CommentDisplayType).OnlyOp), ["stop"]))
              }, "只看楼主 ", 2),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(["item", _ctx.displayType === vue.unref(CommentDisplayType).V2exOrigin && "active"]),
                onClick: _cache[5] || (_cache[5] = vue.withModifiers(($event) => changeOption(vue.unref(CommentDisplayType).V2exOrigin), ["stop"]))
              }, "V2原版 ", 2)
            ])) : vue.createCommentVNode("", true)
          ])
        ]);
      };
    }
  });
  const BaseSelect = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-1d327f48"]]);
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
    MERGE_CONFIG: "MERGE_CONFIG",
    REMOVE: "REMOVE",
    CHANGE_COMMENT_THANK: "CHANGE_COMMENT_THANK",
    CHANGE_POST_THANK: "CHANGE_POST_THANK",
    ADD_TAG: "ADD_TAG",
    REMOVE_TAG: "REMOVE_TAG",
    RELATION_REPLY: "RELATION_REPLY",
    JUMP: "JUMP",
    ADD_READ: "ADD_READ",
    REFRESH_POST: "REFRESH_POST",
    SHOW_COMMENT_OPTIONS: "SHOW_COMMENT_OPTIONS",
    SHOW_EDITOR: "COMMENT_REPLY"
  };
  const _withScopeId$e = (n2) => (vue.pushScopeId("data-v-a64ba8b8"), n2 = n2(), vue.popScopeId(), n2);
  const _hoisted_1$l = { class: "font-size" };
  const _hoisted_2$h = { class: "steps" };
  const _hoisted_3$e = /* @__PURE__ */ _withScopeId$e(() => /* @__PURE__ */ vue.createElementVNode("div", {
    class: "text",
    style: { "font-size": "1.2rem" }
  }, "小", -1));
  const _hoisted_4$d = /* @__PURE__ */ _withScopeId$e(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "point" }, null, -1));
  const _hoisted_5$b = [
    _hoisted_3$e,
    _hoisted_4$d
  ];
  const _hoisted_6$a = /* @__PURE__ */ _withScopeId$e(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "text" }, "标准", -1));
  const _hoisted_7$9 = /* @__PURE__ */ _withScopeId$e(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "point" }, null, -1));
  const _hoisted_8$9 = [
    _hoisted_6$a,
    _hoisted_7$9
  ];
  const _hoisted_9$9 = /* @__PURE__ */ _withScopeId$e(() => /* @__PURE__ */ vue.createElementVNode("div", {
    class: "text",
    style: { "font-size": "1.8rem" }
  }, "大", -1));
  const _hoisted_10$8 = /* @__PURE__ */ _withScopeId$e(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "point" }, null, -1));
  const _hoisted_11$8 = [
    _hoisted_9$9,
    _hoisted_10$8
  ];
  const _hoisted_12$8 = /* @__PURE__ */ _withScopeId$e(() => /* @__PURE__ */ vue.createElementVNode("div", {
    class: "text",
    style: { "font-size": "2.2rem" }
  }, "特大", -1));
  const _hoisted_13$8 = /* @__PURE__ */ _withScopeId$e(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "point" }, null, -1));
  const _hoisted_14$7 = [
    _hoisted_12$8,
    _hoisted_13$8
  ];
  const _hoisted_15$7 = /* @__PURE__ */ _withScopeId$e(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "line" }, null, -1));
  const _sfc_main$m = /* @__PURE__ */ vue.defineComponent({
    __name: "FontSizeType",
    setup(__props) {
      const config2 = vue.inject("config");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$l, [
          vue.createElementVNode("div", _hoisted_2$h, [
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["step", [vue.unref(config2).fontSizeType === "small" && "active"]]),
              onClick: _cache[0] || (_cache[0] = ($event) => vue.unref(eventBus).emit(vue.unref(CMD).MERGE_CONFIG, { fontSizeType: "small" }))
            }, _hoisted_5$b, 2),
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["step", [vue.unref(config2).fontSizeType === "normal" && "active"]]),
              onClick: _cache[1] || (_cache[1] = ($event) => vue.unref(eventBus).emit(vue.unref(CMD).MERGE_CONFIG, { fontSizeType: "normal" }))
            }, _hoisted_8$9, 2),
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["step", [vue.unref(config2).fontSizeType === "large" && "active"]]),
              onClick: _cache[2] || (_cache[2] = ($event) => vue.unref(eventBus).emit(vue.unref(CMD).MERGE_CONFIG, { fontSizeType: "large" }))
            }, _hoisted_11$8, 2),
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["step", [vue.unref(config2).fontSizeType === "big-large" && "active"]]),
              onClick: _cache[3] || (_cache[3] = ($event) => vue.unref(eventBus).emit(vue.unref(CMD).MERGE_CONFIG, { fontSizeType: "big-large" }))
            }, _hoisted_14$7, 2)
          ]),
          _hoisted_15$7
        ]);
      };
    }
  });
  const FontSizeType = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__scopeId", "data-v-a64ba8b8"]]);
  var _GM_notification = /* @__PURE__ */ (() => typeof GM_notification != "undefined" ? GM_notification : void 0)();
  var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  const functions = {
    //获取所有回复
    getAllReply(repliesMap = []) {
      return repliesMap.sort((a, b) => a.i - b.i).reduce((pre, i) => {
        pre = pre.concat(i.replyList);
        return pre;
      }, []);
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
    //生成嵌套回复
    createNestedList(allList = []) {
      if (!allList.length)
        return [];
      let list = window.clone(allList);
      let nestedList = [];
      list.map((item, index) => {
        let startList = list.slice(0, index);
        let startReplyUsers = Array.from(new Set(startList.map((v) => v.username)));
        let endList = list.slice(index + 1);
        if (index === 0) {
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
              item.level = 0;
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
      let list = window.clone(allList);
      let nestedList = [];
      list.map((item, index) => {
        let startList = list.slice(0, index);
        let startReplyUsers = Array.from(new Set(startList.map((v) => v.username)));
        let endList = list.slice(index + 1);
        if (index === 0) {
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
              item.level = 0;
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
      return nestedList;
    },
    //解析A标签
    parseA(a) {
      let href = a.href;
      let id;
      if (href.includes("/t/")) {
        id = a.pathname.substring("/t/".length);
      }
      return { href, id, title: a.innerText };
    },
    //图片链接转Img标签
    checkPhotoLink2Img(str) {
      if (!str)
        return;
      try {
        let imgWebs = [
          /<a((?!<a).)*href="https?:\/\/((?!<a).)*imgur.com((?!<a).)*>(((?!<a).)*)<\/a>/g,
          /<a((?!<a).)*href="https?:\/\/((?!<a).)*\.(gif|png|jpg|jpeg|GIF|PNG|JPG|JPEG) ((?!<a).)*>(((?!<a).)*)<\/a>/g
        ];
        imgWebs.map((v, i) => {
          let has = str.matchAll(v);
          let res2 = [...has];
          res2.map((r2) => {
            let p = i === 0 ? r2[4] : r2[5];
            if (p) {
              let link = p.toLowerCase();
              let src = p;
              if (link.includes(".png") || link.includes(".jpg") || link.includes(".jpeg") || link.includes(".gif")) {
              } else {
                src = p + ".png";
              }
              str = str.replace(r2[0], `<img src="${src}" data-originUrl="${p}" data-notice="此img标签由v2ex-超级增强脚本解析" style="max-width: 100%">`);
            }
          });
        });
      } catch (e2) {
        console.log("正则解析html里面的a标签的图片链接出错了");
      }
      return str;
    },
    //检测帖子回复长度
    async checkPostReplies(id, needOpen = true) {
      return new Promise(async (resolve) => {
        let res = await functions.getPostDetailByApi(id);
        if ((res == null ? void 0 : res.replies) > MAX_REPLY_LIMIT) {
          if (needOpen) {
            functions.openNewTab(`https://${location.origin}/t/${id}?p=1&script=1`);
          }
          return resolve(true);
        }
        resolve(false);
      });
    },
    async sleep(time) {
      return new Promise((resolve) => {
        setTimeout(resolve, time);
      });
    },
    //打开新标签页
    openNewTab(href, active = false) {
      _GM_openInTab(href, { active });
    },
    async cbChecker(val, count = 0) {
      if (window.cb) {
        window.cb(val);
      } else {
        while (!window.cb && count < 30) {
          await functions.sleep(500);
          count++;
        }
        window.cb && window.cb(val);
      }
    },
    //初始化脚本菜单
    initMonkeyMenu() {
      try {
        _GM_registerMenuCommand("脚本设置", () => {
          functions.cbChecker({ type: "openSetting" });
        });
        _GM_registerMenuCommand("仓库地址", () => {
          functions.openNewTab(window.const.git);
        });
        _GM_registerMenuCommand("反馈 & 建议", functions.feedback);
      } catch (e2) {
        console.error("无法使用Tampermonkey");
      }
    },
    clone(val) {
      return JSON.parse(JSON.stringify(val));
    },
    feedback() {
      functions.openNewTab(DefaultVal.issue);
    },
    //检测页面类型
    checkPageType(a) {
      let l = a || window.location;
      let data = { pageType: null, pageData: { id: "", pageNo: null }, username: "" };
      if (l.pathname === "/") {
        data.pageType = PageType.Home;
      } else if (l.pathname === "/changes") {
        data.pageType = PageType.Changes;
      } else if (l.pathname === "/recent") {
        data.pageType = PageType.Changes;
      } else if (l.href.match(/.com\/?tab=/)) {
        data.pageType = PageType.Home;
      } else if (l.href.match(/.com\/go\//)) {
        if (!l.href.includes("/links")) {
          data.pageType = PageType.Node;
        }
      } else if (l.href.match(/.com\/member/)) {
        data.pageType = PageType.Member;
        data.username = l.pathname.replace("/member/", "").replace("/replies", "");
      } else {
        let r2 = l.href.match(/.com\/t\/([\d]+)/);
        if (r2 && !l.pathname.includes("review") && !l.pathname.includes("info")) {
          data.pageType = PageType.Post;
          data.pageData.id = r2[1];
          if (l.search) {
            let pr = l.href.match(/\?p=([\d]+)/);
            if (pr)
              data.pageData.pageNo = Number(pr[1]);
          }
        }
      }
      return data;
    },
    //通过api获取主题详情
    getPostDetailByApi(id) {
      return new Promise((resolve) => {
        fetch(`${location.origin}/api/topics/show.json?id=${id}`).then(async (r2) => {
          if (r2.status === 200) {
            let res = await r2.json();
            if (res) {
              let d2 = res[0];
              resolve(d2);
            }
          }
        });
      });
    },
    appendPostContent(res, el) {
      let a = document.createElement("a");
      a.href = res.href;
      a.classList.add("post-content");
      let div = document.createElement("div");
      div.innerHTML = res.content_rendered;
      a.append(div);
      el.append(a);
      const checkHeight2 = () => {
        var _a;
        if (div.clientHeight < 300) {
          a.classList.add("show-all");
        } else {
          let showMore = document.createElement("div");
          showMore.classList.add("show-more");
          showMore.innerHTML = "显示更多/收起";
          showMore.onclick = function(e2) {
            e2.stopPropagation();
            a.classList.toggle("show-all");
          };
          (_a = a.parentNode) == null ? void 0 : _a.append(showMore);
        }
      };
      checkHeight2();
    },
    //从本地读取配置
    initConfig() {
      return new Promise((resolve) => {
        let configStr = localStorage.getItem("v2ex-config");
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
  };
  const DefaultPost = {
    allReplyUsers: [],
    content_rendered: "",
    createDate: "",
    createDateAgo: "",
    lastReplyDate: "",
    fr: "",
    replyList: [],
    nestedReplies: [],
    nestedRedundReplies: [],
    username: "",
    url: "",
    href: "",
    member: {},
    node: {
      title: "",
      url: ""
    },
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
    isReport: false,
    inList: false
  };
  const DefaultUser = {
    tagPrefix: "--用户标签--",
    tags: {},
    tagsId: "",
    username: "",
    avatar: "",
    readPrefix: "--已读楼层--",
    readNoteItemId: "",
    readList: {},
    imgurPrefix: "--imgur图片删除hash--",
    imgurList: {},
    imgurNoteId: "",
    configPrefix: "--config--",
    configNoteId: ""
  };
  const DefaultVal = {
    pageType: void 0,
    pageData: { pageNo: 1 },
    targetUserName: "",
    currentVersion: 1,
    isNight: false,
    cb: null,
    stopMe: null,
    postList: [],
    git: "https://github.com/zyronon/web-scripts",
    shortGit: "zyronon/web-scripts",
    issue: "https://github.com/zyronon/web-scripts/issues",
    pcLog: "https://greasyfork.org/zh-CN/scripts/458024/versions",
    pcScript: "https://greasyfork.org/zh-CN/scripts/458024",
    mobileScript: "https://greasyfork.org/zh-CN/scripts/485356",
    homeUrl: "https://v2next.netlify.app/"
  };
  const DefaultConfig = {
    showToolbar: true,
    autoOpenDetail: true,
    openTag: false,
    //给用户打标签
    clickPostItemOpenDetail: true,
    closePostDetailBySpace: true,
    //点击空白处关闭详情
    contentAutoCollapse: true,
    //正文超长自动折叠
    viewType: "table",
    commentDisplayType: CommentDisplayType.FloorInFloorNoCallUser,
    newTabOpen: false,
    //新标签打开
    newTabOpenActive: false,
    base64: true,
    //base功能
    sov2ex: false,
    postWidth: "",
    showTopReply: true,
    topReplyLoveMinCount: 3,
    topReplyCount: 3,
    autoJumpLastReadFloor: false,
    rememberLastReadFloor: false,
    autoSignin: true,
    customBgColor: "",
    version: DefaultVal.currentVersion,
    collectBrowserNotice: false,
    fontSizeType: "normal"
  };
  const _sfc_main$l = {
    name: "Setting",
    components: {
      FontSizeType,
      BaseSelect,
      NavBar,
      BaseSwitch,
      Tooltip,
      Icon
    },
    emits: ["back"],
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
      },
      to: {
        type: String,
        default() {
          return "";
        }
      }
    },
    data() {
      return {
        activeEruda: !!localStorage.getItem("active-eruda"),
        config: window.clone(this.modelValue)
      };
    },
    computed: {
      DefaultVal() {
        return DefaultVal;
      },
      functions() {
        return functions;
      },
      CommentDisplayType() {
        return CommentDisplayType;
      },
      isNew() {
        return this.config.version < window.currentVersion;
      }
    },
    watch: {
      config: {
        handler(n2) {
          n2.topReplyLoveMinCount = Math.trunc(n2.topReplyLoveMinCount);
          if (n2.topReplyLoveMinCount < 0) {
            n2.topReplyLoveMinCount = 1;
          }
          this.$emit("update:modelValue", n2);
        },
        deep: true
      },
      activeEruda(n2) {
        if (n2) {
          localStorage.setItem("active-eruda", 1);
        } else {
          localStorage.setItem("active-eruda", "");
        }
      }
    }
  };
  const _withScopeId$d = (n2) => (vue.pushScopeId("data-v-424a2b09"), n2 = n2(), vue.popScopeId(), n2);
  const _hoisted_1$k = { class: "mobile-page" };
  const _hoisted_2$g = { class: "page-content" };
  const _hoisted_3$d = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "row" }, [
    /* @__PURE__ */ vue.createElementVNode("label", { class: "main-title" }, "关于脚本")
  ], -1));
  const _hoisted_4$c = { class: "row" };
  const _hoisted_5$a = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "GitHub", -1));
  const _hoisted_6$9 = { class: "wrapper" };
  const _hoisted_7$8 = ["href"];
  const _hoisted_8$8 = { class: "row" };
  const _hoisted_9$8 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "反馈 & 建议", -1));
  const _hoisted_10$7 = { class: "wrapper" };
  const _hoisted_11$7 = ["href"];
  const _hoisted_12$7 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "row" }, [
    /* @__PURE__ */ vue.createElementVNode("label", { class: "main-title" }, "列表设置")
  ], -1));
  const _hoisted_13$7 = { class: "row" };
  const _hoisted_14$6 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "列表展示方式", -1));
  const _hoisted_15$6 = { class: "wrapper" };
  const _hoisted_16$6 = { class: "radio-group2" };
  const _hoisted_17$3 = { class: "row" };
  const _hoisted_18$3 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "帖子弹框显示", -1));
  const _hoisted_19$3 = { class: "wrapper" };
  const _hoisted_20$3 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "desc" }, " 开启此选项后，帖子始终会以弹框的方式显示。优先级大于“新标签页打开链接” ", -1));
  const _hoisted_21$2 = { class: "row" };
  const _hoisted_22$2 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "新标签页打开链接", -1));
  const _hoisted_23$2 = { class: "wrapper" };
  const _hoisted_24$2 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "desc" }, " 网页上所有链接通过新标签页打开 ", -1));
  const _hoisted_25$2 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "row" }, [
    /* @__PURE__ */ vue.createElementVNode("label", { class: "main-title" }, "主题设置")
  ], -1));
  const _hoisted_26$1 = { class: "row" };
  const _hoisted_27$1 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "回复展示方式", -1));
  const _hoisted_28$1 = { class: "wrapper" };
  const _hoisted_29$1 = { class: "row" };
  const _hoisted_30$1 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "正文超长自动折叠", -1));
  const _hoisted_31$1 = { class: "wrapper" };
  const _hoisted_32$1 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "row" }, [
    /* @__PURE__ */ vue.createElementVNode("label", { class: "main-title" }, "高赞回复")
  ], -1));
  const _hoisted_33$1 = { class: "row" };
  const _hoisted_34$1 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "显示高赞回复", -1));
  const _hoisted_35$1 = { class: "wrapper" };
  const _hoisted_36$1 = { class: "row" };
  const _hoisted_37$1 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "最多显示多少个高赞回复", -1));
  const _hoisted_38$1 = { class: "wrapper" };
  const _hoisted_39$1 = { class: "row" };
  const _hoisted_40 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "最少需要多少赞才能被判定为高赞", -1));
  const _hoisted_41 = { class: "wrapper" };
  const _hoisted_42 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "row" }, [
    /* @__PURE__ */ vue.createElementVNode("label", { class: "main-title" }, "记忆阅读")
  ], -1));
  const _hoisted_43 = { class: "row" };
  const _hoisted_44 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "记录上次阅读楼层（误差1层左右）：", -1));
  const _hoisted_45 = { class: "wrapper" };
  const _hoisted_46 = { class: "row" };
  const _hoisted_47 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "打开帖子自动跳转到上次阅读楼层", -1));
  const _hoisted_48 = { class: "wrapper" };
  const _hoisted_49 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "row" }, [
    /* @__PURE__ */ vue.createElementVNode("label", { class: "main-title" }, "其他设置")
  ], -1));
  const _hoisted_50 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "row" }, [
    /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "字体设置")
  ], -1));
  const _hoisted_51 = { class: "row" };
  const _hoisted_52 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "用户打标签(跨平台，数据保存在自己的记事本)：", -1));
  const _hoisted_53 = { class: "wrapper" };
  const _hoisted_54 = { class: "row" };
  const _hoisted_55 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "划词显示Base64解码框", -1));
  const _hoisted_56 = { class: "wrapper" };
  const _hoisted_57 = { class: "row" };
  const _hoisted_58 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "自动签到", -1));
  const _hoisted_59 = { class: "wrapper" };
  const _hoisted_60 = { class: "row" };
  const _hoisted_61 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "收藏时提醒添加到书签", -1));
  const _hoisted_62 = { class: "wrapper" };
  const _hoisted_63 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "desc" }, " V站帐号一旦被封禁，则无法登录，无法查看账号收藏了 ", -1));
  const _hoisted_64 = { class: "row" };
  const _hoisted_65 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("label", { class: "item-title" }, "调试模式", -1));
  const _hoisted_66 = { class: "wrapper" };
  const _hoisted_67 = /* @__PURE__ */ _withScopeId$d(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "desc" }, " 开启此项会显示调试控制台，刷新页面生效 ", -1));
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_NavBar = vue.resolveComponent("NavBar");
    const _component_BaseSwitch = vue.resolveComponent("BaseSwitch");
    const _component_BaseSelect = vue.resolveComponent("BaseSelect");
    const _component_font_size_type = vue.resolveComponent("font-size-type");
    return vue.openBlock(), vue.createBlock(vue.Teleport, { to: $props.to }, [
      vue.createElementVNode("div", _hoisted_1$k, [
        vue.createVNode(_component_NavBar, {
          title: "设置",
          onBack: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("back"))
        }),
        vue.createElementVNode("div", _hoisted_2$g, [
          _hoisted_3$d,
          vue.createElementVNode("div", _hoisted_4$c, [
            _hoisted_5$a,
            vue.createElementVNode("div", _hoisted_6$9, [
              vue.createElementVNode("a", {
                href: $options.DefaultVal.git,
                target: "_blank"
              }, vue.toDisplayString($options.DefaultVal.shortGit), 9, _hoisted_7$8)
            ])
          ]),
          vue.createElementVNode("div", _hoisted_8$8, [
            _hoisted_9$8,
            vue.createElementVNode("div", _hoisted_10$7, [
              vue.createElementVNode("a", {
                href: $options.DefaultVal.issue,
                target: "_blank"
              }, "点此填写Issue", 8, _hoisted_11$7)
            ])
          ]),
          _hoisted_12$7,
          vue.createElementVNode("div", _hoisted_13$7, [
            _hoisted_14$6,
            vue.createElementVNode("div", _hoisted_15$6, [
              vue.createElementVNode("div", _hoisted_16$6, [
                vue.createElementVNode("div", {
                  class: vue.normalizeClass(["radio", $data.config.viewType === "table" ? "active" : ""]),
                  onClick: _cache[1] || (_cache[1] = ($event) => $data.config.viewType = "table")
                }, "表格 ", 2),
                vue.createElementVNode("div", {
                  class: vue.normalizeClass(["radio", $data.config.viewType === "card" ? "active" : ""]),
                  onClick: _cache[2] || (_cache[2] = ($event) => $data.config.viewType = "card")
                }, "卡片 ", 2)
              ])
            ])
          ]),
          vue.createElementVNode("div", _hoisted_17$3, [
            _hoisted_18$3,
            vue.createElementVNode("div", _hoisted_19$3, [
              vue.createVNode(_component_BaseSwitch, {
                modelValue: $data.config.clickPostItemOpenDetail,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.config.clickPostItemOpenDetail = $event)
              }, null, 8, ["modelValue"])
            ])
          ]),
          _hoisted_20$3,
          vue.createElementVNode("div", _hoisted_21$2, [
            _hoisted_22$2,
            vue.createElementVNode("div", _hoisted_23$2, [
              vue.createVNode(_component_BaseSwitch, {
                modelValue: $data.config.newTabOpen,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.config.newTabOpen = $event)
              }, null, 8, ["modelValue"])
            ])
          ]),
          _hoisted_24$2,
          _hoisted_25$2,
          vue.createElementVNode("div", _hoisted_26$1, [
            _hoisted_27$1,
            vue.createElementVNode("div", _hoisted_28$1, [
              vue.createVNode(_component_BaseSelect, {
                "display-type": $data.config.commentDisplayType,
                "onUpdate:displayType": _cache[5] || (_cache[5] = ($event) => $data.config.commentDisplayType = $event)
              }, null, 8, ["display-type"])
            ])
          ]),
          vue.createElementVNode("div", _hoisted_29$1, [
            _hoisted_30$1,
            vue.createElementVNode("div", _hoisted_31$1, [
              vue.createVNode(_component_BaseSwitch, {
                modelValue: $data.config.contentAutoCollapse,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.config.contentAutoCollapse = $event)
              }, null, 8, ["modelValue"])
            ])
          ]),
          _hoisted_32$1,
          vue.createElementVNode("div", _hoisted_33$1, [
            _hoisted_34$1,
            vue.createElementVNode("div", _hoisted_35$1, [
              vue.createVNode(_component_BaseSwitch, {
                modelValue: $data.config.showTopReply,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.config.showTopReply = $event)
              }, null, 8, ["modelValue"])
            ])
          ]),
          vue.createElementVNode("div", _hoisted_36$1, [
            _hoisted_37$1,
            vue.createElementVNode("div", _hoisted_38$1, [
              vue.withDirectives(vue.createElementVNode("input", {
                type: "number",
                min: "1",
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.config.topReplyCount = $event)
              }, null, 512), [
                [vue.vModelText, $data.config.topReplyCount]
              ])
            ])
          ]),
          vue.createElementVNode("div", _hoisted_39$1, [
            _hoisted_40,
            vue.createElementVNode("div", _hoisted_41, [
              vue.withDirectives(vue.createElementVNode("input", {
                type: "number",
                min: "1",
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.config.topReplyLoveMinCount = $event)
              }, null, 512), [
                [vue.vModelText, $data.config.topReplyLoveMinCount]
              ])
            ])
          ]),
          _hoisted_42,
          vue.createElementVNode("div", _hoisted_43, [
            _hoisted_44,
            vue.createElementVNode("div", _hoisted_45, [
              vue.createVNode(_component_BaseSwitch, {
                "model-value": $data.config.rememberLastReadFloor,
                "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => {
                  $data.config.rememberLastReadFloor = !$data.config.rememberLastReadFloor;
                  $data.config.autoJumpLastReadFloor = false;
                })
              }, null, 8, ["model-value"])
            ])
          ]),
          vue.createElementVNode("div", _hoisted_46, [
            _hoisted_47,
            vue.createElementVNode("div", _hoisted_48, [
              vue.createVNode(_component_BaseSwitch, {
                modelValue: $data.config.autoJumpLastReadFloor,
                "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.config.autoJumpLastReadFloor = $event)
              }, null, 8, ["modelValue"])
            ])
          ]),
          _hoisted_49,
          _hoisted_50,
          vue.createVNode(_component_font_size_type),
          vue.createElementVNode("div", _hoisted_51, [
            _hoisted_52,
            vue.createElementVNode("div", _hoisted_53, [
              vue.createVNode(_component_BaseSwitch, {
                modelValue: $data.config.openTag,
                "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.config.openTag = $event)
              }, null, 8, ["modelValue"])
            ])
          ]),
          vue.createElementVNode("div", _hoisted_54, [
            _hoisted_55,
            vue.createElementVNode("div", _hoisted_56, [
              vue.createVNode(_component_BaseSwitch, {
                modelValue: $data.config.base64,
                "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $data.config.base64 = $event)
              }, null, 8, ["modelValue"])
            ])
          ]),
          vue.createElementVNode("div", _hoisted_57, [
            _hoisted_58,
            vue.createElementVNode("div", _hoisted_59, [
              vue.createVNode(_component_BaseSwitch, {
                modelValue: $data.config.autoSignin,
                "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $data.config.autoSignin = $event)
              }, null, 8, ["modelValue"])
            ])
          ]),
          vue.createElementVNode("div", _hoisted_60, [
            _hoisted_61,
            vue.createElementVNode("div", _hoisted_62, [
              vue.createVNode(_component_BaseSwitch, {
                modelValue: $data.config.collectBrowserNotice,
                "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => $data.config.collectBrowserNotice = $event)
              }, null, 8, ["modelValue"])
            ])
          ]),
          _hoisted_63,
          vue.createElementVNode("div", _hoisted_64, [
            _hoisted_65,
            vue.createElementVNode("div", _hoisted_66, [
              vue.createVNode(_component_BaseSwitch, {
                modelValue: $data.activeEruda,
                "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => $data.activeEruda = $event)
              }, null, 8, ["modelValue"])
            ])
          ]),
          _hoisted_67
        ])
      ])
    ], 8, ["to"]);
  }
  const Setting = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$9], ["__scopeId", "data-v-424a2b09"]]);
  const _sfc_main$k = {
    name: "Point",
    components: { Icon },
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
    methods: {
      thankError() {
        if (!this.isLogin) {
          return eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "请先登录！" });
        }
        if (this.item.username === window.user.username) {
          return eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "不能感谢自己" });
        }
        if (this.item.isThanked) {
          return eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "已经感谢过了" });
        }
        this.thank();
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
  const _hoisted_1$j = {
    key: 2,
    class: "link-num"
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Icon = vue.resolveComponent("Icon");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: "tool",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.thankError && $options.thankError(...args))
    }, [
      $props.item.isThanked ? (vue.openBlock(), vue.createBlock(_component_Icon, {
        key: 0,
        color: "red",
        icon: "icon-park-solid:like"
      })) : (vue.openBlock(), vue.createBlock(_component_Icon, {
        key: 1,
        color: "rgb(224,42,42)",
        icon: "icon-park-outline:like"
      })),
      $props.item.thankCount ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$j, vue.toDisplayString($props.item.thankCount), 1)) : vue.createCommentVNode("", true)
    ]);
  }
  const Point = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$8], ["__scopeId", "data-v-b7c6664e"]]);
  const _sfc_main$j = {};
  const _withScopeId$c = (n2) => (vue.pushScopeId("data-v-e92e0529"), n2 = n2(), vue.popScopeId(), n2);
  const _hoisted_1$i = { class: "more" };
  const _hoisted_2$f = /* @__PURE__ */ _withScopeId$c(() => /* @__PURE__ */ vue.createElementVNode("div", null, null, -1));
  const _hoisted_3$c = /* @__PURE__ */ _withScopeId$c(() => /* @__PURE__ */ vue.createElementVNode("div", null, null, -1));
  const _hoisted_4$b = /* @__PURE__ */ _withScopeId$c(() => /* @__PURE__ */ vue.createElementVNode("div", null, null, -1));
  const _hoisted_5$9 = [
    _hoisted_2$f,
    _hoisted_3$c,
    _hoisted_4$b
  ];
  function _sfc_render$7(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$i, _hoisted_5$9);
  }
  const MoreIcon = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$7], ["__scopeId", "data-v-e92e0529"]]);
  const _sfc_main$i = {
    name: "Author",
    components: { MoreIcon, Point, Icon },
    inject: ["isLogin", "tags", "config", "isNight"],
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
      eventBus() {
        return eventBus;
      },
      CMD() {
        return CMD;
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
      }
    },
    methods: {
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
  const _withScopeId$b = (n2) => (vue.pushScopeId("data-v-9041586a"), n2 = n2(), vue.popScopeId(), n2);
  const _hoisted_1$h = { class: "Author-left" };
  const _hoisted_2$e = ["href"];
  const _hoisted_3$b = ["src"];
  const _hoisted_4$a = { class: "info" };
  const _hoisted_5$8 = { class: "top" };
  const _hoisted_6$8 = { class: "texts" };
  const _hoisted_7$7 = ["href"];
  const _hoisted_8$7 = {
    key: 0,
    class: "owner"
  };
  const _hoisted_9$7 = {
    key: 1,
    class: "dup"
  };
  const _hoisted_10$6 = {
    key: 2,
    class: "mod"
  };
  const _hoisted_11$6 = { class: "my-tag" };
  const _hoisted_12$6 = /* @__PURE__ */ _withScopeId$b(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "fa fa-tag" }, null, -1));
  const _hoisted_13$6 = ["onClick"];
  const _hoisted_14$5 = { class: "floor" };
  const _hoisted_15$5 = { class: "ago" };
  const _hoisted_16$5 = { class: "Author-right" };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Icon = vue.resolveComponent("Icon");
    const _component_Point = vue.resolveComponent("Point");
    const _component_MoreIcon = vue.resolveComponent("MoreIcon");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["Author", { expand: !$props.modelValue }])
    }, [
      vue.createElementVNode("div", _hoisted_1$h, [
        !$props.modelValue ? (vue.openBlock(), vue.createBlock(_component_Icon, {
          key: 0,
          onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", true)),
          color: "#177EC9",
          class: "expand-icon",
          icon: "gravity-ui:chevrons-expand-up-right"
        })) : vue.createCommentVNode("", true),
        $options.config.viewType !== "simple" ? (vue.openBlock(), vue.createElementBlock("a", {
          key: 1,
          class: "base-avatar",
          href: `/member/${$props.comment.username}`
        }, [
          vue.createElementVNode("img", {
            src: $props.comment.avatar,
            alt: ""
          }, null, 8, _hoisted_3$b)
        ], 8, _hoisted_2$e)) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", _hoisted_4$a, [
          vue.createElementVNode("div", _hoisted_5$8, [
            vue.createElementVNode("span", _hoisted_6$8, [
              vue.createElementVNode("strong", null, [
                vue.createElementVNode("a", {
                  href: `/member/${$props.comment.username}`,
                  class: vue.normalizeClass(["username", { "dark": $options.isNight }])
                }, vue.toDisplayString($props.comment.username), 11, _hoisted_7$7)
              ]),
              $props.comment.isOp ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8$7, "OP")) : vue.createCommentVNode("", true),
              $props.comment.isDup ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_9$7, "DUP")) : vue.createCommentVNode("", true),
              $props.comment.isMod ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10$6, "MOD")) : vue.createCommentVNode("", true),
              $options.isLogin && $options.config.openTag ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 3 }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.myTags, (i) => {
                  return vue.openBlock(), vue.createElementBlock("span", _hoisted_11$6, [
                    _hoisted_12$6,
                    vue.createElementVNode("span", null, vue.toDisplayString(i), 1),
                    vue.createElementVNode("i", {
                      class: "fa fa-trash-o remove",
                      onClick: ($event) => $options.removeTag(i)
                    }, null, 8, _hoisted_13$6)
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
          vue.createElementVNode("div", null, [
            vue.createElementVNode("span", _hoisted_14$5, vue.toDisplayString($props.comment.floor) + "楼", 1),
            vue.createElementVNode("span", _hoisted_15$5, vue.toDisplayString($props.comment.date), 1)
          ])
        ])
      ]),
      vue.createElementVNode("div", _hoisted_16$5, [
        vue.withDirectives(vue.createVNode(_component_Point, {
          item: $options.pointInfo,
          onAddThank: $options.addThank,
          onRecallThank: $options.recallThank,
          "api-url": "reply/" + $props.comment.id
        }, null, 8, ["item", "onAddThank", "onRecallThank", "api-url"]), [
          [vue.vShow, $props.comment.thankCount]
        ]),
        vue.createVNode(_component_MoreIcon, {
          onClick: _cache[2] || (_cache[2] = vue.withModifiers(($event) => $options.eventBus.emit($options.CMD.SHOW_COMMENT_OPTIONS, { ...$props.comment, top: $props.type === "top" }), ["stop"]))
        })
      ])
    ], 2);
  }
  const Author = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$6], ["__scopeId", "data-v-9041586a"]]);
  const _sfc_main$h = /* @__PURE__ */ vue.defineComponent({
    __name: "BaseLoading",
    props: {
      size: { default: "normal" }
    },
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(["loading", [_ctx.size]])
        }, null, 2);
      };
    }
  });
  const BaseLoading = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__scopeId", "data-v-2697baa2"]]);
  const _hoisted_1$g = {
    key: 1,
    class: "key-notice"
  };
  const _hoisted_2$d = { class: "key" };
  const _sfc_main$g = /* @__PURE__ */ vue.defineComponent({
    __name: "BaseButton",
    props: {
      keyboard: {},
      active: { type: Boolean },
      disabled: { type: Boolean },
      loading: { type: Boolean },
      size: { default: "normal" },
      type: { default: "primary" }
    },
    emits: ["click"],
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(Tooltip, {
          disabled: !_ctx.keyboard,
          title: `快捷键: ${_ctx.keyboard}`
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", vue.mergeProps({ class: "base-button" }, _ctx.$attrs, {
              onClick: _cache[0] || (_cache[0] = (e2) => !_ctx.disabled && !_ctx.loading && _ctx.$emit("click", e2)),
              class: [
                _ctx.active && "active",
                _ctx.size,
                _ctx.type,
                (_ctx.disabled || _ctx.loading) && "disabled",
                !_ctx.disabled && "hvr-grow"
              ]
            }), [
              vue.createElementVNode("span", {
                style: vue.normalizeStyle({ opacity: _ctx.loading ? 0 : 1 })
              }, [
                vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
              ], 4),
              _ctx.loading ? (vue.openBlock(), vue.createBlock(BaseLoading, {
                key: 0,
                size: "small"
              })) : vue.createCommentVNode("", true),
              _ctx.keyboard ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$g, [
                vue.createElementVNode("span", _hoisted_2$d, vue.toDisplayString(_ctx.keyboard), 1)
              ])) : vue.createCommentVNode("", true)
            ], 16)
          ]),
          _: 3
        }, 8, ["disabled", "title"]);
      };
    }
  });
  const BaseButton = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-04f4c89d"]]);
  const _withScopeId$a = (n2) => (vue.pushScopeId("data-v-0612e02f"), n2 = n2(), vue.popScopeId(), n2);
  const _hoisted_1$f = { class: "get-cursor" };
  const _hoisted_2$c = ["innerHTML"];
  const _hoisted_3$a = { class: "toolbar" };
  const _hoisted_4$9 = { class: "left" };
  const _hoisted_5$7 = /* @__PURE__ */ _withScopeId$a(() => /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z",
    fill: "none",
    stroke: "#929596",
    "stroke-width": "2",
    "stroke-linejoin": "round"
  }, null, -1));
  const _hoisted_6$7 = /* @__PURE__ */ _withScopeId$a(() => /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M24 35C29 35 31 31 31 31H17C17 31 19 35 24 35Z",
    stroke: "#929596",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, null, -1));
  const _hoisted_7$6 = /* @__PURE__ */ _withScopeId$a(() => /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M31 18V22",
    stroke: "#929596",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, null, -1));
  const _hoisted_8$6 = /* @__PURE__ */ _withScopeId$a(() => /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M17 18V22",
    stroke: "#929596",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, null, -1));
  const _hoisted_9$6 = [
    _hoisted_5$7,
    _hoisted_6$7,
    _hoisted_7$6,
    _hoisted_8$6
  ];
  const _hoisted_10$5 = { class: "upload" };
  const _hoisted_11$5 = /* @__PURE__ */ _withScopeId$a(() => /* @__PURE__ */ vue.createElementVNode("svg", {
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
  const _hoisted_12$5 = {
    key: 0,
    style: { "color": "black", "font-size": "1.4rem" }
  };
  const _hoisted_13$5 = { class: "right" };
  const _hoisted_14$4 = /* @__PURE__ */ _withScopeId$a(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "title" }, "经典表情", -1));
  const _hoisted_15$4 = { class: "list" };
  const _hoisted_16$4 = ["src", "onClick"];
  const _hoisted_17$2 = { class: "emoji" };
  const _hoisted_18$2 = { class: "title" };
  const _hoisted_19$2 = { class: "list" };
  const _hoisted_20$2 = ["onClick"];
  const _sfc_main$f = {
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
    setup(__props, { expose: __expose, emit: __emit }) {
      let props = __props;
      let { replyUser, replyFloor, useType } = props;
      let replyInfo = replyUser ? `@${replyUser} #${replyFloor} ` : "";
      const emits = __emit;
      const post = vue.inject("post");
      const show = vue.inject("show");
      const isNight = vue.inject("isNight");
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
      vue.watch(props, (n2) => {
        replyUser = props.replyUser;
        replyFloor = props.replyFloor;
        useType = props.useType;
        replyInfo = replyUser ? `@${replyUser} #${replyFloor} ` : "";
        content.value = replyInfo;
      });
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
      const editorClass = vue.computed(() => {
        return [isFocus.value ? "isFocus" : "", isNight.value ? "isNight" : ""];
      });
      const cursorHtml = vue.computed(() => {
        var _a;
        if (!txtRef.value || !content.value)
          return "";
        let index = ((_a = txtRef.value) == null ? void 0 : _a.selectionStart) || 0;
        return content.value.substring(0, index).replace(/</g, "<").replace(/>/g, ">").replace(/\n/g, "<br/>").replace(/\s/g, none.value);
      });
      const disabled = vue.computed(() => {
        if (content.value) {
          return content.value === replyInfo;
        } else {
          return true;
        }
      });
      function focus() {
        txtRef.value.focus();
      }
      __expose({ content, focus });
      function drop(e2) {
        e2.preventDefault();
        upload(e2.dataTransfer.files[0]);
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
        console.log("回复", item);
        let url = `${window.baseUrl}/t/${post.value.id}`;
        $.post(url, { content: submit_content, once: post.value.once }).then(
          // $.post(url, {content: submit_content, once: 123}).then(
          (res) => {
            loading.value = false;
            let r2 = res.search("你上一条回复的内容和这条相同");
            if (r2 > -1)
              return eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "你上一条回复的内容和这条相同" });
            r2 = res.search("请不要在每一个回复中都包括外链，这看起来像是在 spamming");
            if (r2 > -1)
              return eventBus.emit(CMD.SHOW_MSG, {
                type: "error",
                text: "请不要在每一个回复中都包括外链，这看起来像是在 spamming"
              });
            let r22 = res.search("创建新回复");
            if (r22 > -1) {
              eventBus.emit(CMD.REFRESH_ONCE, res);
              eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "回复出现了问题，请使用原版进行回复" });
              let clientWidth = window.document.body.clientWidth;
              let windowWidth = 1200;
              let left = clientWidth / 2 - windowWidth / 2;
              let newWin = window.open("创建新回复", "", `width=${windowWidth},height=600,left=${left},top=100`);
              newWin.document.write(res);
              let loop = setInterval(function() {
                if (newWin.closed) {
                  clearInterval(loop);
                  eventBus.emit(CMD.REFRESH_POST);
                }
              }, 1e3);
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
        ).catch((r2) => {
          console.log("catch", r2);
        });
      }
      function showEmoticons(e2) {
        if (isShowEmoticons.value) {
          return isShowEmoticons.value = false;
        }
        let rect = e2.currentTarget.getBoundingClientRect();
        emoticonsRef.value.style.left = rect.left + 30 + "px";
        emoticonsRef.value.style.bottom = window.innerHeight - rect.top - 20 + "px";
        isShowEmoticons.value = true;
      }
      function off() {
        eventBus.emit(CMD.SHOW_CALL, { show: false });
        eventBus.off(CMD.SET_CALL);
      }
      function checkHeight2() {
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
          checkHeight2();
        });
      }
      function showCallPopover(text) {
        let r2 = cursorRef.value.getBoundingClientRect();
        eventBus.emit(CMD.SHOW_CALL, { show: true, top: r2.top, left: r2.left, text });
        eventBus.off(CMD.SET_CALL);
        eventBus.on(CMD.SET_CALL, (e2) => {
          let cursorPos = txtRef.value.selectionStart;
          let start = content.value.slice(0, cursorPos);
          let end = content.value.slice(cursorPos, content.value.length);
          let lastCallPos = start.lastIndexOf("@");
          start = content.value.slice(0, lastCallPos + 1);
          if (e2 === "管理员") {
            e2 = "Livid @Kai @Olivia @GordianZ @sparanoid";
          }
          if (e2 === "所有人") {
            e2 = allReplyUsers.value.map((v, i) => {
              if (i)
                return "@" + v;
              else
                return v;
            }).join(" ");
          }
          content.value = start + e2 + " " + end;
          let moveCursorPos = start.length + e2.length + 1;
          setTimeout(() => {
            txtRef.value.setSelectionRange(moveCursorPos, moveCursorPos);
            checkHeight2();
          });
          eventBus.off(CMD.SET_CALL);
        });
      }
      function onKeydown(e2) {
        let code = e2.keyCode;
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
            e2.preventDefault();
            e2.stopPropagation();
            e2.stopImmediatePropagation();
            return false;
          case 13:
            if (e2.ctrlKey)
              submit();
            if (e2.metaKey)
              submit();
            break;
        }
      }
      function onInput(e2) {
        let cursorPos = txtRef.value.selectionStart;
        if (!content.value)
          return;
        if (e2.data === " ") {
          return off();
        }
        if (e2.data === "@") {
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
      function onPaste(e2) {
        const dataTransferItemList = e2.clipboardData.items;
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
      vue.watch(() => show, (n2) => {
        if (n2.value)
          isShowEmoticons.value = false;
      }, { deep: true });
      vue.onMounted(() => {
        $(`.${editorId.value}`).each(function() {
          this.setAttribute("style", "height:" + this.scrollHeight + "px;overflow-y:hidden;");
        }).on("input", function() {
          this.style.height = 0;
          this.style.height = this.scrollHeight + "px";
        });
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(["post-editor-wrapper", editorClass.value])
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
          vue.createElementVNode("div", _hoisted_1$f, [
            vue.createElementVNode("span", { innerHTML: cursorHtml.value }, null, 8, _hoisted_2$c),
            vue.createElementVNode("span", {
              class: "cursor",
              ref_key: "cursorRef",
              ref: cursorRef
            }, "|", 512)
          ]),
          vue.createElementVNode("div", _hoisted_3$a, [
            vue.createElementVNode("div", _hoisted_4$9, [
              (vue.openBlock(), vue.createElementBlock("svg", {
                onClick: showEmoticons,
                width: "20",
                height: "20",
                viewBox: "0 0 48 48",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg"
              }, _hoisted_9$6)),
              vue.createElementVNode("div", _hoisted_10$5, [
                vue.createElementVNode("input", {
                  type: "file",
                  accept: "image/*",
                  onChange: _cache[2] || (_cache[2] = (e2) => upload(e2.currentTarget.files[0]))
                }, null, 32),
                _hoisted_11$5
              ]),
              uploadLoading.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_12$5, "上传中.....")) : vue.createCommentVNode("", true)
            ]),
            vue.createElementVNode("div", _hoisted_13$5, [
              vue.createVNode(BaseButton, {
                size: "small",
                disabled: disabled.value,
                loading: loading.value,
                onClick: submit
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("回复 ")
                ]),
                _: 1
              }, 8, ["disabled", "loading"])
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
              onClick: _cache[3] || (_cache[3] = ($event) => isShowEmoticons.value = false)
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
                }, null, 8, _hoisted_16$4);
              }), 64))
            ]),
            vue.createElementVNode("div", _hoisted_17$2, [
              (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(emojiEmoticons, (item) => {
                return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
                  vue.createElementVNode("div", _hoisted_18$2, vue.toDisplayString(item.title), 1),
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
  const PostEditor = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-0612e02f"]]);
  const _hoisted_1$e = {
    key: 0,
    class: "html-wrapper"
  };
  const _hoisted_2$b = ["innerHTML"];
  const checkHeight = 900;
  const _sfc_main$e = {
    __name: "BaseHtmlRender",
    props: ["html"],
    setup(__props) {
      const config2 = vue.inject("config");
      const props = __props;
      const contentRef = vue.ref(null);
      const htmlMask = vue.ref(false);
      const handOpen = vue.ref(false);
      function mouseup(e2) {
        if (!config2.value.base64)
          return;
        let selectionText = window.win().getSelection().toString();
        if (selectionText) {
          let r2 = selectionText.match(/([A-Za-z0-9+/=]+)/g);
          if (r2) {
            if (r2[0].length < 4)
              return;
            eventBus.emit(CMD.SHOW_TOOLTIP, { text: r2[0], e: e2 });
          }
        }
      }
      vue.watch(config2.value, (newVale) => {
        if (!newVale.contentAutoCollapse) {
          htmlMask.value = false;
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
        htmlMask.value = rect.height >= checkHeight;
      }
      return (_ctx, _cache) => {
        return props.html ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$e, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass({ htmlMask: htmlMask.value })
          }, [
            vue.createElementVNode("div", {
              ref_key: "contentRef",
              ref: contentRef,
              innerHTML: props.html,
              onMouseup: mouseup
            }, null, 40, _hoisted_2$b)
          ], 2),
          htmlMask.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "expand",
            onClick: _cache[0] || (_cache[0] = ($event) => {
              htmlMask.value = false;
              handOpen.value = true;
            })
          }, "展开")) : vue.createCommentVNode("", true)
        ])) : vue.createCommentVNode("", true);
      };
    }
  };
  const BaseHtmlRender = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-f8165980"]]);
  const _sfc_main$d = {
    name: "Comment",
    components: { MoreIcon, BaseHtmlRender, Author, PostEditor, Point },
    inject: ["post", "show", "isNight", "config"],
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
      show(e2) {
        if (e2) {
          this.edit = false;
        }
      },
      postDetailWidth(n2, o) {
        this.checkIsTooLong(n2);
      }
    },
    computed: {
      eventBus() {
        return eventBus;
      },
      CMD() {
        return CMD;
      },
      CommentDisplayType() {
        return CommentDisplayType;
      },
      myClass() {
        return {
          isOp: this.modelValue.isOp,
          ding: this.ding,
          isLevelOne: this.modelValue.level === 0,
          ["c_" + this.floor]: this.type !== "top"
        };
      }
    },
    mounted() {
      this.checkIsTooLong();
    },
    methods: {
      checkIsTooLong() {
        let rect = this.$refs.comment.getBoundingClientRect();
        let postDetailWidth = document.body.clientWidth;
        let ban = postDetailWidth / 2;
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
      },
      //高亮一下
      showDing() {
        this.ding = true;
        setTimeout(() => {
          this.ding = false;
        }, 2e3);
      },
      toggle() {
        this.expand = !this.expand;
      }
    }
  };
  const _withScopeId$9 = (n2) => (vue.pushScopeId("data-v-312e9541"), n2 = n2(), vue.popScopeId(), n2);
  const _hoisted_1$d = ["data-floor"];
  const _hoisted_2$a = { class: "comment-content" };
  const _hoisted_3$9 = { class: "right" };
  const _hoisted_4$8 = { class: "w" };
  const _hoisted_5$6 = {
    key: 0,
    class: "wrong-wrapper"
  };
  const _hoisted_6$6 = ["href"];
  const _hoisted_7$5 = { class: "del-line" };
  const _hoisted_8$5 = /* @__PURE__ */ _withScopeId$9(() => /* @__PURE__ */ vue.createElementVNode("i", {
    class: "fa fa-question-circle-o wrong-icon",
    "aria-hidden": "true"
  }, null, -1));
  const _hoisted_9$5 = {
    key: 0,
    class: "warning"
  };
  const _hoisted_10$4 = /* @__PURE__ */ _withScopeId$9(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_11$4 = /* @__PURE__ */ _withScopeId$9(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_12$4 = /* @__PURE__ */ _withScopeId$9(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_13$4 = /* @__PURE__ */ _withScopeId$9(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_14$3 = /* @__PURE__ */ _withScopeId$9(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_15$3 = /* @__PURE__ */ _withScopeId$9(() => /* @__PURE__ */ vue.createElementVNode("a", {
    href: "https://github.com/zyronon/web-scripts/issues",
    target: "_blank"
  }, "这里", -1));
  const _hoisted_16$3 = { class: "simple-wrapper" };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Author = vue.resolveComponent("Author");
    const _component_BaseHtmlRender = vue.resolveComponent("BaseHtmlRender");
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
        type: $props.type
      }, null, 8, ["modelValue", "comment", "type"]),
      $data.cssStyle && !$data.expand ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: "more ago",
        onClick: _cache[1] || (_cache[1] = ($event) => $data.expand = !$data.expand)
      }, " 由于嵌套回复层级太深，自动将后续回复隐藏 ")) : vue.createCommentVNode("", true),
      $data.expand ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: "comment-content-w",
        style: vue.normalizeStyle($data.cssStyle)
      }, [
        $data.cssStyle ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: "more ago",
          onClick: _cache[2] || (_cache[2] = ($event) => $data.expand = !$data.expand)
        }, " 由于嵌套回复层级太深，自动将以下回复移至可见范围 ")) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", _hoisted_2$a, [
          vue.createElementVNode("div", {
            class: "left expand-line",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.toggle && $options.toggle(...args))
          }),
          vue.createElementVNode("div", _hoisted_3$9, [
            vue.createElementVNode("div", _hoisted_4$8, [
              $props.modelValue.isWrong ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5$6, [
                vue.createElementVNode("span", {
                  onClick: _cache[4] || (_cache[4] = ($event) => $data.expandWrong = !$data.expandWrong),
                  title: "点击楼层号查看提示"
                }, [
                  vue.createElementVNode("a", {
                    href: "/member/" + $props.modelValue.replyUsers[0]
                  }, "@" + vue.toDisplayString($props.modelValue.replyUsers[0]) + "  ", 9, _hoisted_6$6),
                  vue.createElementVNode("span", _hoisted_7$5, "#" + vue.toDisplayString($props.modelValue.replyFloor), 1),
                  _hoisted_8$5
                ]),
                $data.expandWrong ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_9$5, [
                  vue.createTextVNode(" 这条回复似乎有点问题，指定的楼层号与@的人对应不上 "),
                  _hoisted_10$4,
                  vue.createTextVNode(" 原因可能有下面几种： "),
                  _hoisted_11$4,
                  vue.createTextVNode(" 一、屏蔽用户导致楼层塌陷：你屏蔽了A，自A以后的回复的楼层号都会减1 "),
                  _hoisted_12$4,
                  vue.createTextVNode(" 二、忽略回复导致楼层塌陷：原理同上 "),
                  _hoisted_13$4,
                  vue.createTextVNode(" 三、层主回复时指定错了楼层号（同一，层主屏蔽了别人，导致楼层塌陷） "),
                  _hoisted_14$3,
                  vue.createTextVNode(" 四、脚本解析错误，请在 "),
                  _hoisted_15$3,
                  vue.createTextVNode("反馈 ")
                ])) : vue.createCommentVNode("", true)
              ])) : vue.createCommentVNode("", true),
              $options.config.commentDisplayType === $options.CommentDisplayType.FloorInFloorNoCallUser && this.type !== "top" ? (vue.openBlock(), vue.createBlock(_component_BaseHtmlRender, {
                key: 1,
                class: "reply_content",
                html: $props.modelValue.hideCallUserReplyContent
              }, null, 8, ["html"])) : (vue.openBlock(), vue.createBlock(_component_BaseHtmlRender, {
                key: 2,
                class: "reply_content",
                html: $props.modelValue.reply_content
              }, null, 8, ["html"]))
            ]),
            vue.createElementVNode("div", _hoisted_16$3, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.modelValue.children, (item, index) => {
                return vue.openBlock(), vue.createBlock(_component_Comment, {
                  modelValue: $props.modelValue.children[index],
                  "onUpdate:modelValue": ($event) => $props.modelValue.children[index] = $event,
                  key: index
                }, null, 8, ["modelValue", "onUpdate:modelValue"]);
              }), 128))
            ])
          ])
        ]),
        $data.cssStyle ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: "more ago",
          onClick: _cache[5] || (_cache[5] = ($event) => $data.expand = !$data.expand)
        }, " 由于嵌套回复层级太深，自动将以上回复移至可见范围 ")) : vue.createCommentVNode("", true)
      ], 4)) : vue.createCommentVNode("", true)
    ], 10, _hoisted_1$d);
  }
  const Comment = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$5], ["__scopeId", "data-v-312e9541"]]);
  const _sfc_main$c = {
    name: "Toolbar",
    components: { Icon, BaseLoading },
    inject: [
      "isLogin",
      "post",
      "pageType"
    ],
    data() {
      return {
        timer: null,
        loading: false,
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
      async toggleFavorite() {
        if (config.collectBrowserNotice) {
          eventBus.emit(CMD.SHOW_MSG, { type: "success", text: "别忘记添加到书签哦" });
        }
        if (!this.checkIsLogin())
          return;
        let isFavorite = this.post.isFavorite;
        let url = `${window.baseUrl}/${isFavorite ? "unfavorite" : "favorite"}/topic/${this.post.id}?once=${this.post.once}`;
        this.loading = true;
        let apiRes = await fetch(url);
        this.loading = false;
        if (apiRes.redirected) {
          let htmlText = await apiRes.text();
          if (htmlText.search(this.post.isFavorite ? "加入收藏" : "取消收藏")) {
            eventBus.emit(CMD.MERGE, { collectCount: isFavorite ? this.post.collectCount - 1 : this.post.collectCount + 1 });
            eventBus.emit(CMD.SHOW_MSG, { type: "success", text: isFavorite ? "取消成功" : "收藏成功" });
            eventBus.emit(CMD.REFRESH_ONCE, htmlText);
            eventBus.emit(CMD.MERGE, { isFavorite: !isFavorite });
            return;
          }
        }
        eventBus.emit(CMD.REFRESH_ONCE);
        eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "操作失败" });
      }
    }
  };
  const _hoisted_1$c = { class: "toolbar" };
  const _hoisted_2$9 = { class: "left" };
  const _hoisted_3$8 = { class: "right" };
  const _hoisted_4$7 = { key: 2 };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BaseLoading = vue.resolveComponent("BaseLoading");
    const _component_Icon = vue.resolveComponent("Icon");
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$c, [
      vue.createElementVNode("div", _hoisted_2$9, [
        vue.createElementVNode("div", null, vue.toDisplayString($options.post.createDate.substring(0, 16)), 1)
      ]),
      vue.createElementVNode("div", _hoisted_3$8, [
        vue.createElementVNode("div", {
          class: vue.normalizeClass(["tool", { disabled: $data.loading }]),
          onClick: _cache[0] || (_cache[0] = (...args) => $options.toggleFavorite && $options.toggleFavorite(...args))
        }, [
          $data.loading ? (vue.openBlock(), vue.createBlock(_component_BaseLoading, {
            key: 0,
            size: "small"
          })) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
            $options.post.isFavorite ? (vue.openBlock(), vue.createBlock(_component_Icon, {
              key: 0,
              color: "rgb(224,42,42)",
              icon: "iconoir:star-solid"
            })) : (vue.openBlock(), vue.createBlock(_component_Icon, {
              key: 1,
              icon: "iconoir:star"
            }))
          ], 64)),
          $options.post.collectCount !== 0 ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4$7, vue.toDisplayString($options.post.collectCount), 1)) : vue.createCommentVNode("", true)
        ], 2),
        vue.createElementVNode("div", {
          class: "tool",
          onClick: _cache[1] || (_cache[1] = ($event) => $options.checkIsLogin("reply"))
        }, [
          vue.createVNode(_component_Icon, { icon: "mynaui:message" })
        ])
      ])
    ]);
  }
  const Toolbar = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$4], ["__scopeId", "data-v-6234240d"]]);
  const _withScopeId$8 = (n2) => (vue.pushScopeId("data-v-0869dab5"), n2 = n2(), vue.popScopeId(), n2);
  const _hoisted_1$b = {
    class: "comment",
    ref: "comment"
  };
  const _hoisted_2$8 = ["href"];
  const _hoisted_3$7 = ["src"];
  const _hoisted_4$6 = { class: "texts" };
  const _hoisted_5$5 = {
    key: 0,
    class: "point"
  };
  const _hoisted_6$5 = { class: "link-num" };
  const _hoisted_7$4 = { class: "my-tag" };
  const _hoisted_8$4 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "fa fa-tag" }, null, -1));
  const _hoisted_9$4 = {
    key: 2,
    class: "ago"
  };
  const _hoisted_10$3 = {
    key: 3,
    class: "mod"
  };
  const _hoisted_11$3 = {
    key: 4,
    class: "owner"
  };
  const _hoisted_12$3 = ["href"];
  const _hoisted_13$3 = {
    key: 5,
    class: "owner"
  };
  const _hoisted_14$2 = {
    key: 6,
    class: "mod"
  };
  const _hoisted_15$2 = {
    key: 7,
    class: "ago"
  };
  const _hoisted_16$2 = { class: "my-tag" };
  const _hoisted_17$1 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "fa fa-tag" }, null, -1));
  const _hoisted_18$1 = {
    key: 9,
    class: "point"
  };
  const _hoisted_19$1 = { class: "link-num" };
  const _hoisted_20$1 = ["href"];
  const _hoisted_21$1 = ["src"];
  const _hoisted_22$1 = { class: "Author-right" };
  const _hoisted_23$1 = { class: "floor" };
  const _hoisted_24$1 = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ vue.createElementVNode("span", null, "跳转", -1));
  const _hoisted_25$1 = [
    _hoisted_24$1
  ];
  const _sfc_main$b = {
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
      const config2 = vue.inject("config");
      const isLogin = vue.inject("isLogin");
      const tags = vue.inject("tags");
      const props = __props;
      const myTags = vue.computed(() => {
        return tags[props.comment.username] ?? [];
      });
      function jump() {
        eventBus.emit(CMD.JUMP, props.comment.floor);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$b, [
          !__props.isRight ? (vue.openBlock(), vue.createElementBlock("a", {
            key: 0,
            class: "base-avatar",
            href: `/member/${__props.comment.username}`
          }, [
            vue.createElementVNode("img", {
              src: __props.comment.avatar,
              alt: ""
            }, null, 8, _hoisted_3$7)
          ], 8, _hoisted_2$8)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["comment-body", { isRight: __props.isRight }])
          }, [
            vue.createElementVNode("div", _hoisted_4$6, [
              __props.comment.thankCount && __props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5$5, [
                __props.comment.isThanked ? (vue.openBlock(), vue.createBlock(vue.unref(Icon), {
                  key: 0,
                  color: "red",
                  icon: "icon-park-solid:like"
                })) : (vue.openBlock(), vue.createBlock(vue.unref(Icon), {
                  key: 1,
                  color: "rgb(224,42,42)",
                  icon: "icon-park-outline:like"
                })),
                vue.createElementVNode("div", _hoisted_6$5, vue.toDisplayString(__props.comment.thankCount), 1)
              ])) : vue.createCommentVNode("", true),
              vue.unref(isLogin) && vue.unref(config2).openTag && __props.isRight ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(myTags.value, (i) => {
                return vue.openBlock(), vue.createElementBlock("span", _hoisted_7$4, [
                  _hoisted_8$4,
                  vue.createElementVNode("span", null, vue.toDisplayString(i), 1)
                ]);
              }), 256)) : vue.createCommentVNode("", true),
              __props.isRight ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_9$4, vue.toDisplayString(__props.comment.date), 1)) : vue.createCommentVNode("", true),
              __props.comment.isMod && __props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10$3, "MOD")) : vue.createCommentVNode("", true),
              __props.comment.isOp && __props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11$3, "OP")) : vue.createCommentVNode("", true),
              vue.createElementVNode("a", {
                href: `/member/${__props.comment.username}`,
                class: "username"
              }, vue.toDisplayString(__props.comment.username), 9, _hoisted_12$3),
              __props.comment.isOp && !__props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_13$3, "OP")) : vue.createCommentVNode("", true),
              __props.comment.isMod && !__props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_14$2, "MOD")) : vue.createCommentVNode("", true),
              !__props.isRight ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_15$2, vue.toDisplayString(__props.comment.date), 1)) : vue.createCommentVNode("", true),
              vue.unref(isLogin) && vue.unref(config2).openTag && !__props.isRight ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 8 }, vue.renderList(myTags.value, (i) => {
                return vue.openBlock(), vue.createElementBlock("span", _hoisted_16$2, [
                  _hoisted_17$1,
                  vue.createElementVNode("span", null, vue.toDisplayString(i), 1)
                ]);
              }), 256)) : vue.createCommentVNode("", true),
              __props.comment.thankCount && !__props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_18$1, [
                __props.comment.isThanked ? (vue.openBlock(), vue.createBlock(vue.unref(Icon), {
                  key: 0,
                  color: "red",
                  icon: "icon-park-solid:like"
                })) : (vue.openBlock(), vue.createBlock(vue.unref(Icon), {
                  key: 1,
                  color: "rgb(224,42,42)",
                  icon: "icon-park-outline:like"
                })),
                vue.createElementVNode("div", _hoisted_19$1, vue.toDisplayString(__props.comment.thankCount), 1)
              ])) : vue.createCommentVNode("", true)
            ]),
            vue.createVNode(BaseHtmlRender, {
              class: "reply_content",
              html: __props.comment.reply_content
            }, null, 8, ["html"])
          ], 2),
          __props.isRight ? (vue.openBlock(), vue.createElementBlock("a", {
            key: 1,
            class: "base-avatar",
            href: `/member/${__props.comment.username}`
          }, [
            vue.createElementVNode("img", {
              src: __props.comment.avatar,
              alt: ""
            }, null, 8, _hoisted_21$1)
          ], 8, _hoisted_20$1)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", _hoisted_22$1, [
            vue.createElementVNode("div", _hoisted_23$1, vue.toDisplayString(__props.comment.floor) + "楼", 1),
            vue.createElementVNode("div", {
              class: "tool jump",
              onClick: jump
            }, _hoisted_25$1)
          ])
        ], 512);
      };
    }
  };
  const SingleComment = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-0869dab5"]]);
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
  async function copy(text) {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      eventBus.emit(CMD.SHOW_MSG, { type: "success", text: "复制成功" });
      return true;
    } else {
      eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "复制失败！浏览器不支持！" });
    }
  }
  const _sfc_main$a = {
    name: "FromBottomDialog",
    props: {
      modelValue: {
        type: Boolean,
        default: false
      },
      mode: {
        type: String,
        // default: 'dark'
        default: "light"
        // default: 'white'
      },
      maskMode: {
        type: String,
        default: "dark"
      },
      height: {
        type: String,
        default: "70vh"
      },
      showHengGang: {
        type: Boolean,
        default: true
      },
      pageId: {
        type: String,
        default: null,
        required: true
      },
      borderRadius: {
        type: String,
        default: "1rem 1rem 0 0"
      },
      tag: {
        type: String,
        default: ""
      }
    },
    watch: {
      modelValue(newVal) {
        let page = document.getElementById(this.pageId);
        if (newVal) {
          page.style.overflow = "hidden";
          this.scroll = page.scrollTop;
          let mask = $(`<div class="mask fade-in ${this.maskMode}"></div>`);
          mask.on("click", (e2) => {
            this.hide(false);
          });
          page.appendChild(mask[0]);
        } else {
          page.style.overflow = "unset";
          let mask = $(".mask");
          mask.removeClass("fade-in");
          mask.addClass("fade-out");
          setTimeout(() => {
            mask.remove();
          }, 250);
        }
      }
    },
    data() {
      return {
        scroll: 0,
        startLocationY: 0,
        moveYDistance: 0,
        startTime: 0,
        pagePosition: null
      };
    },
    computed: {},
    created() {
    },
    methods: {
      beforeEnter(el) {
        el.style["transition-duration"] = `250ms`;
        el.style["transform"] = `translate3d(0,${this.height},0)`;
      },
      enter(el, done) {
        setTimeout(() => {
          el.style["transform"] = `translate3d(0,0,0)`;
        }, 0);
        setTimeout(() => {
          el.style["transform"] = `none`;
          done();
        }, 250);
      },
      afterEnter() {
      },
      beforeLeave(el) {
        el.style["transition-duration"] = `250ms`;
        el.style["transform"] = `translate3d(0,0,0)`;
      },
      leave(el, done) {
        let maxHeight = $(".FromBottomDialog").css("max-height");
        el.style["transform"] = `translate3d(0,${maxHeight},0)`;
        setTimeout(done, 250);
      },
      afterLeave() {
      },
      hide(val = false) {
        this.$emit("update:modelValue", val);
        this.$emit("cancel");
      },
      start(e2) {
        if (this.$refs.dialog.scrollTop !== 0)
          return;
        this.startLocationY = e2.touches[0].pageY;
        this.startTime = Date.now();
        this.$refs.dialog.style["transition-duration"] = `0ms`;
      },
      move(e2) {
        if (this.$refs.dialog.scrollTop !== 0)
          return;
        this.moveYDistance = e2.touches[0].pageY - this.startLocationY;
        if (this.moveYDistance > 0) {
          this.$refs.dialog.style["transform"] = `translate3d(0,${this.moveYDistance}px,0)`;
        }
      },
      end(e2) {
        if (Date.now() - this.startTime < 150 && Math.abs(this.moveYDistance) < 30) {
          return;
        }
        if (this.$refs.dialog.scrollTop !== 0)
          return;
        let clientHeight = this.$refs.dialog.clientHeight;
        this.$refs.dialog.style["transition-duration"] = `250ms`;
        if (Math.abs(this.moveYDistance) > clientHeight / 2) {
          this.$refs.dialog.style["transform"] = `translate3d(0,${clientHeight}px,0)`;
          setTimeout(this.hide, 250);
        } else {
          this.$refs.dialog.style["transform"] = `translate3d(0,0,0)`;
          setTimeout(() => {
            if (this.$refs.dialog) {
              this.$refs.dialog.style["transform"] = `none`;
            }
          }, 250);
        }
        this.moveYDistance = 0;
      }
    }
  };
  const __injectCSSVars__ = () => {
    vue.useCssVars((_ctx) => ({
      "0013fa15": _ctx.borderRadius
    }));
  };
  const __setup__ = _sfc_main$a.setup;
  _sfc_main$a.setup = __setup__ ? (props, ctx) => {
    __injectCSSVars__();
    return __setup__(props, ctx);
  } : __injectCSSVars__;
  const _withScopeId$7 = (n2) => (vue.pushScopeId("data-v-3a54f208"), n2 = n2(), vue.popScopeId(), n2);
  const _hoisted_1$a = /* @__PURE__ */ _withScopeId$7(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "gang-content" }, null, -1));
  const _hoisted_2$7 = [
    _hoisted_1$a
  ];
  const _hoisted_3$6 = { class: "dialog-wrapper" };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createBlock(vue.Transition, {
      onBeforeEnter: $options.beforeEnter,
      onEnter: $options.enter,
      onAfterEnter: $options.afterEnter,
      onBeforeLeave: $options.beforeLeave,
      onLeave: $options.leave,
      onAfterLeave: $options.afterLeave,
      css: false
    }, {
      default: vue.withCtx(() => [
        $props.modelValue ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          ref: "dialog",
          class: vue.normalizeClass(["FromBottomDialog", [$props.mode, $props.showHengGang ? "" : "no-heng-gang"]]),
          style: vue.normalizeStyle({ "max-height": $props.height }),
          onTouchstart: _cache[0] || (_cache[0] = (...args) => $options.start && $options.start(...args)),
          onTouchmove: _cache[1] || (_cache[1] = (...args) => $options.move && $options.move(...args)),
          onTouchend: _cache[2] || (_cache[2] = (...args) => $options.end && $options.end(...args))
        }, [
          vue.renderSlot(_ctx.$slots, "header", {}, void 0, true),
          $props.showHengGang ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(["heng-gang", $props.mode])
          }, _hoisted_2$7, 2)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", _hoisted_3$6, [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ])
        ], 38)) : vue.createCommentVNode("", true)
      ]),
      _: 3
    }, 8, ["onBeforeEnter", "onEnter", "onAfterEnter", "onBeforeLeave", "onLeave", "onAfterLeave"]);
  }
  const FromBottomDialog = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$3], ["__scopeId", "data-v-3a54f208"]]);
  const _withScopeId$6 = (n2) => (vue.pushScopeId("data-v-ae322b31"), n2 = n2(), vue.popScopeId(), n2);
  const _hoisted_1$9 = { class: "wrapper" };
  const _hoisted_2$6 = { class: "options" };
  const _hoisted_3$5 = { class: "icon-wrap" };
  const _hoisted_4$5 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ vue.createElementVNode("span", null, "分享", -1));
  const _hoisted_5$4 = { class: "icon-wrap" };
  const _hoisted_6$4 = { class: "icon-wrap" };
  const _hoisted_7$3 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ vue.createElementVNode("span", null, "回复", -1));
  const _hoisted_8$3 = { class: "icon-wrap" };
  const _hoisted_9$3 = { class: "icon-wrap" };
  const _hoisted_10$2 = { class: "icon-wrap" };
  const _hoisted_11$2 = { class: "icon-wrap" };
  const _hoisted_12$2 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ vue.createElementVNode("span", null, "复制链接", -1));
  const _hoisted_13$2 = { class: "icon-wrap" };
  const _hoisted_14$1 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ vue.createElementVNode("span", null, "复制内容", -1));
  const _hoisted_15$1 = { class: "icon-wrap" };
  const _hoisted_16$1 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ vue.createElementVNode("span", null, "刷新", -1));
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    __name: "PostOptions",
    props: {
      modelValue: { type: Boolean },
      post: {}
    },
    emits: ["close", "reply", "refresh", "merge", "update:modelValue"],
    setup(__props, { emit: __emit }) {
      let state = vue.reactive({
        timer: null,
        loading: false,
        loading1: false,
        loading2: false,
        loading3: false,
        loading4: false
      });
      const props = __props;
      const emit = __emit;
      const isLogin = vue.inject("isLogin");
      const pageType = vue.inject("pageType");
      const config2 = vue.inject("config");
      function close() {
        emit("close");
        emit("update:modelValue", false);
      }
      function checkIsLogin() {
        if (!isLogin.value) {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "请先登录！" });
          return false;
        }
        return true;
      }
      async function copyLink() {
        let text = props.post.url;
        if (await copy(text)) {
          close();
        }
      }
      async function copyContent() {
        let text = props.post.headerTemplate;
        text = $(`<div>${text}</div>`).text();
        if (await copy(text)) {
          close();
        }
      }
      function share() {
        var _a;
        let username = ((_a = window.user) == null ? void 0 : _a.username) ?? "";
        let url = `https://twitter.com/intent/tweet?url=${location.origin}/t/${props.post.id}?r=${username}&related=v2ex&text=${props.post.title}`;
        window.open(url, "_blank");
        close();
      }
      function reply() {
        if (!checkIsLogin())
          return;
        emit("reply");
        close();
      }
      async function toggleIgnore() {
        if (!checkIsLogin())
          return;
        if (state.loading2)
          return;
        let isIgnore = props.post.isIgnore;
        let url = `${location.origin}/${isIgnore ? "unignore" : "ignore"}/topic/${props.post.id}?once=${props.post.once}`;
        state.loading2 = true;
        let apiRes = await fetch(url);
        state.loading2 = false;
        if (apiRes.redirected) {
          eventBus.emit(CMD.SHOW_MSG, { type: "success", text: isIgnore ? "取消成功" : "忽略成功" });
        } else {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "忽略失败" });
        }
        if (isIgnore) {
          eventBus.emit(CMD.MERGE, { isIgnore: !isIgnore });
        } else {
          if (pageType.value === PageType.Post) {
            location.href = location.origin;
          } else {
            eventBus.emit(CMD.IGNORE);
          }
        }
        eventBus.emit(CMD.REFRESH_ONCE);
        close();
      }
      async function toggleFavorite() {
        if (!checkIsLogin())
          return;
        if (state.loading)
          return;
        let isFavorite = props.post.isFavorite;
        if (!isFavorite && config2.value.collectBrowserNotice) {
          eventBus.emit(CMD.SHOW_MSG, { type: "success", text: "别忘记添加到书签哦" });
        }
        let url = `${location.origin}/${isFavorite ? "unfavorite" : "favorite"}/topic/${props.post.id}?once=${props.post.once}`;
        state.loading = true;
        let apiRes = await fetch(url);
        state.loading = false;
        if (apiRes.redirected) {
          let htmlText = await apiRes.text();
          if (htmlText.search(isFavorite ? "加入收藏" : "取消收藏")) {
            eventBus.emit(CMD.SHOW_MSG, { type: "success", text: isFavorite ? "取消成功" : "收藏成功" });
            eventBus.emit(CMD.MERGE, { collectCount: isFavorite ? props.post.collectCount - 1 : props.post.collectCount + 1 });
            eventBus.emit(CMD.REFRESH_ONCE, htmlText);
            eventBus.emit(CMD.MERGE, { isFavorite: !isFavorite });
            return close();
          }
        }
        eventBus.emit(CMD.REFRESH_ONCE);
        eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "操作失败，请重试" });
      }
      async function report() {
        if (!checkIsLogin())
          return;
        if (state.loading1)
          return;
        let isReport = props.post.isReport;
        if (isReport) {
          eventBus.emit(CMD.SHOW_MSG, { type: "success", text: "你已对本主题进行了报告" });
          return;
        }
        let url = `${location.origin}/report/topic/${props.post.id}?once=${props.post.once}`;
        state.loading1 = true;
        let apiRes = await fetch(url);
        state.loading1 = false;
        if (apiRes.redirected) {
          let htmlText = await apiRes.text();
          if (htmlText.search("你已对本主题进行了报告")) {
            eventBus.emit(CMD.SHOW_MSG, { type: "success", text: "你已对本主题进行了报告" });
            eventBus.emit(CMD.REFRESH_ONCE, htmlText);
            eventBus.emit(CMD.MERGE, { isReport: !isReport });
            return close();
          }
        }
        eventBus.emit(CMD.REFRESH_ONCE);
        eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "操作失败，请重试" });
      }
      async function thank() {
        if (!isLogin.value) {
          return eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "请先登录！" });
        }
        if (props.post.username === window.user.username) {
          return eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "不能感谢自己" });
        }
        let isThanked = props.post.isThanked;
        if (isThanked) {
          return eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "已经感谢过了" });
        }
        if (state.loading4)
          return;
        eventBus.emit(CMD.MERGE, { isThanked: !isThanked });
        let url = `${location.origin}/thank/reply/${props.post.id}?once=${props.post.once}`;
        state.loading4 = true;
        await fetch(url);
        state.loading4 = false;
        $.post(url).then((res) => {
          if (!res.success) {
            eventBus.emit(CMD.MERGE, { isThanked: !isThanked });
            eventBus.emit(CMD.SHOW_MSG, { type: "error", text: res.message });
          }
          eventBus.emit(CMD.REFRESH_ONCE, res.once);
        }, (err) => {
          state.loading4 = false;
          eventBus.emit(CMD.MERGE, { isThanked: !isThanked });
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "感谢失败" });
          eventBus.emit(CMD.REFRESH_ONCE);
        });
        close();
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(FromBottomDialog, {
          "page-id": "post-detail",
          height: "40rem",
          "model-value": _ctx.modelValue,
          onCancel: _cache[1] || (_cache[1] = ($event) => emit("update:modelValue", false))
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", _hoisted_1$9, [
              vue.createElementVNode("div", _hoisted_2$6, [
                vue.createElementVNode("div", {
                  class: "item",
                  onClick: share
                }, [
                  vue.createElementVNode("div", _hoisted_3$5, [
                    vue.createVNode(vue.unref(Icon), {
                      color: "rgb(57,174,85)",
                      icon: "uil:share"
                    })
                  ]),
                  _hoisted_4$5
                ]),
                vue.createElementVNode("div", {
                  class: "item",
                  onClick: toggleIgnore
                }, [
                  vue.createElementVNode("div", _hoisted_5$4, [
                    vue.unref(state).loading2 ? (vue.openBlock(), vue.createBlock(BaseLoading, { key: 0 })) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                      _ctx.post.isIgnore ? (vue.openBlock(), vue.createBlock(vue.unref(Icon), {
                        key: 0,
                        color: "rgb(224,42,42)",
                        icon: "mdi:eye-off-outline"
                      })) : (vue.openBlock(), vue.createBlock(vue.unref(Icon), {
                        key: 1,
                        color: "rgb(57,174,85)",
                        icon: "mdi:eye-outline"
                      }))
                    ], 64))
                  ]),
                  vue.createElementVNode("span", null, vue.toDisplayString(_ctx.post.isIgnore ? "取消" : "") + "忽略", 1)
                ]),
                vue.createElementVNode("div", {
                  class: "item",
                  onClick: reply
                }, [
                  vue.createElementVNode("div", _hoisted_6$4, [
                    vue.createVNode(vue.unref(Icon), {
                      color: "rgb(57,174,85)",
                      icon: "mynaui:message"
                    })
                  ]),
                  _hoisted_7$3
                ]),
                vue.createElementVNode("div", {
                  class: "item",
                  onClick: thank
                }, [
                  vue.createElementVNode("div", _hoisted_8$3, [
                    _ctx.post.isThanked ? (vue.openBlock(), vue.createBlock(vue.unref(Icon), {
                      key: 0,
                      icon: "flat-color-icons:like"
                    })) : (vue.openBlock(), vue.createBlock(vue.unref(Icon), {
                      key: 1,
                      color: "rgb(57,174,85)",
                      icon: "icon-park-outline:like"
                    }))
                  ]),
                  vue.createElementVNode("span", null, vue.toDisplayString(_ctx.post.isThanked ? "已" : "") + "感谢", 1)
                ]),
                vue.createElementVNode("div", {
                  class: "item",
                  onClick: toggleFavorite
                }, [
                  vue.createElementVNode("div", _hoisted_9$3, [
                    vue.unref(state).loading ? (vue.openBlock(), vue.createBlock(BaseLoading, { key: 0 })) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                      _ctx.post.isFavorite ? (vue.openBlock(), vue.createBlock(vue.unref(Icon), {
                        key: 0,
                        color: "rgb(224,42,42)",
                        icon: "iconoir:star-solid"
                      })) : (vue.openBlock(), vue.createBlock(vue.unref(Icon), {
                        key: 1,
                        color: "rgb(57,174,85)",
                        icon: "iconoir:star"
                      }))
                    ], 64))
                  ]),
                  vue.createElementVNode("span", null, vue.toDisplayString(_ctx.post.isFavorite ? "取消" : "") + "收藏", 1)
                ]),
                vue.createElementVNode("div", {
                  class: vue.normalizeClass(["item", [_ctx.post.isReport && "disabled"]]),
                  onClick: report
                }, [
                  vue.createElementVNode("div", _hoisted_10$2, [
                    vue.unref(state).loading1 ? (vue.openBlock(), vue.createBlock(BaseLoading, { key: 0 })) : (vue.openBlock(), vue.createBlock(vue.unref(Icon), {
                      key: 1,
                      class: "black",
                      icon: "solar:danger-triangle-outline"
                    }))
                  ]),
                  vue.createElementVNode("span", null, vue.toDisplayString(_ctx.post.isReport ? "已报告" : "报告问题"), 1)
                ], 2),
                vue.createElementVNode("div", {
                  class: "item",
                  onClick: copyLink
                }, [
                  vue.createElementVNode("div", _hoisted_11$2, [
                    vue.createVNode(vue.unref(Icon), {
                      class: "black",
                      icon: "solar:link-broken"
                    })
                  ]),
                  _hoisted_12$2
                ]),
                vue.createElementVNode("div", {
                  class: "item",
                  onClick: copyContent
                }, [
                  vue.createElementVNode("div", _hoisted_13$2, [
                    vue.createVNode(vue.unref(Icon), {
                      class: "black",
                      icon: "octicon:copy-24"
                    })
                  ]),
                  _hoisted_14$1
                ]),
                vue.createElementVNode("div", {
                  class: "item",
                  onClick: _cache[0] || (_cache[0] = ($event) => (emit("refresh"), close()))
                }, [
                  vue.createElementVNode("div", _hoisted_15$1, [
                    vue.createVNode(vue.unref(Icon), {
                      class: "black",
                      icon: "ion:refresh"
                    })
                  ]),
                  _hoisted_16$1
                ])
              ]),
              vue.createVNode(FontSizeType),
              vue.createElementVNode("div", {
                class: "cancel",
                onClick: close
              }, "取消")
            ])
          ]),
          _: 1
        }, 8, ["model-value"]);
      };
    }
  });
  const PostOptions = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-ae322b31"]]);
  const _withScopeId$5 = (n2) => (vue.pushScopeId("data-v-8ef13a81"), n2 = n2(), vue.popScopeId(), n2);
  const _hoisted_1$8 = { class: "wrapper" };
  const _hoisted_2$5 = { class: "options" };
  const _hoisted_3$4 = { class: "icon-wrap" };
  const _hoisted_4$4 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("span", null, "忽略", -1));
  const _hoisted_5$3 = { class: "icon-wrap" };
  const _hoisted_6$3 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("span", null, "复制", -1));
  const _hoisted_7$2 = { class: "icon-wrap" };
  const _hoisted_8$2 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("span", null, "上下文", -1));
  const _hoisted_9$2 = { class: "icon-wrap" };
  const _hoisted_10$1 = { class: "icon-wrap" };
  const _hoisted_11$1 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("span", null, "回复", -1));
  const _hoisted_12$1 = { class: "icon-wrap" };
  const _hoisted_13$1 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("span", null, "跳转", -1));
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    __name: "CommentOptions",
    props: {
      modelValue: { type: Boolean },
      comment: {},
      post: {}
    },
    emits: ["close", "reply", "merge", "update:modelValue"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const config2 = vue.inject("config");
      const isLogin = vue.inject("isLogin");
      function close() {
        emit("close");
        emit("update:modelValue", false);
      }
      function checkIsLogin() {
        if (!isLogin.value) {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "请先登录！" });
          return false;
        }
        return true;
      }
      async function handleCopy() {
        let text = props.comment.reply_content;
        if (config2.value.commentDisplayType === CommentDisplayType.FloorInFloorNoCallUser) {
          text = props.comment.hideCallUserReplyContent;
        }
        text = $(`<div>${text}</div>`).text();
        if (await copy(text)) {
          close();
        }
      }
      async function hide() {
        if (!checkIsLogin())
          return;
        let url = `${window.baseUrl}/ignore/reply/${props.comment.id}?once=${props.post.once}`;
        eventBus.emit(CMD.REMOVE, props.comment.floor);
        close();
        $.post(url).then((res) => {
          eventBus.emit(CMD.REFRESH_ONCE);
          eventBus.emit(CMD.SHOW_MSG, { type: "success", text: "隐藏成功" });
        }, (err) => {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "隐藏成功,仅本次有效（接口调用失败！）" });
        });
      }
      function jump() {
        eventBus.emit(CMD.JUMP, props.comment.floor);
        close();
      }
      function showRelationReply() {
        if (!props.comment.replyUsers.length) {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "该回复无上下文" });
          return;
        }
        eventBus.emit(CMD.RELATION_REPLY, {
          left: props.comment.replyUsers,
          right: props.comment.username,
          rightFloor: props.comment.floor
        });
        close();
      }
      function recallThank() {
        eventBus.emit(CMD.CHANGE_COMMENT_THANK, { id: props.comment.id, type: "recall" });
      }
      function thank() {
        if (!checkIsLogin())
          return;
        if (props.comment.username === window.user.username) {
          return eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "不能感谢自己" });
        }
        if (props.comment.isThanked) {
          return eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "已经感谢过了" });
        }
        eventBus.emit(CMD.CHANGE_COMMENT_THANK, { id: props.comment.id, type: "add" });
        let url = `${window.baseUrl}/thank/reply/${props.comment.id}?once=${props.post.once}`;
        $.post(url).then((res) => {
          if (!res.success) {
            recallThank();
            eventBus.emit(CMD.SHOW_MSG, { type: "error", text: res.message });
          }
          eventBus.emit(CMD.REFRESH_ONCE, res.once);
        }, (err) => {
          recallThank();
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "感谢失败" });
          eventBus.emit(CMD.REFRESH_ONCE);
        });
        close();
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(FromBottomDialog, {
          "page-id": "post-detail",
          height: "40rem",
          "model-value": _ctx.modelValue,
          onCancel: _cache[1] || (_cache[1] = ($event) => emit("update:modelValue", false))
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", _hoisted_1$8, [
              vue.createElementVNode("div", _hoisted_2$5, [
                vue.createElementVNode("div", {
                  class: "item",
                  onClick: hide
                }, [
                  vue.createElementVNode("div", _hoisted_3$4, [
                    vue.createVNode(vue.unref(Icon), { icon: "solar:forbidden-circle-outline" })
                  ]),
                  _hoisted_4$4
                ]),
                vue.createElementVNode("div", {
                  class: "item",
                  onClick: handleCopy
                }, [
                  vue.createElementVNode("div", _hoisted_5$3, [
                    vue.createVNode(vue.unref(Icon), { icon: "octicon:copy-24" })
                  ]),
                  _hoisted_6$3
                ]),
                vue.createElementVNode("div", {
                  class: vue.normalizeClass(["item", [!_ctx.comment.replyUsers.length && "disabled"]]),
                  onClick: showRelationReply
                }, [
                  vue.createElementVNode("div", _hoisted_7$2, [
                    vue.createVNode(vue.unref(Icon), { icon: "iconoir:page-search" })
                  ]),
                  _hoisted_8$2
                ], 2),
                vue.createElementVNode("div", {
                  class: vue.normalizeClass(["item", [_ctx.comment.isThanked && "full"]]),
                  onClick: thank
                }, [
                  vue.createElementVNode("div", _hoisted_9$2, [
                    _ctx.comment.isThanked ? (vue.openBlock(), vue.createBlock(vue.unref(Icon), {
                      key: 0,
                      icon: "icon-park-solid:like"
                    })) : (vue.openBlock(), vue.createBlock(vue.unref(Icon), {
                      key: 1,
                      icon: "icon-park-outline:like"
                    }))
                  ]),
                  vue.createElementVNode("span", null, vue.toDisplayString(_ctx.comment.isThanked ? "已" : "") + "感谢", 1)
                ], 2),
                vue.createElementVNode("div", {
                  class: "item",
                  onClick: _cache[0] || (_cache[0] = ($event) => emit("reply"))
                }, [
                  vue.createElementVNode("div", _hoisted_10$1, [
                    vue.createVNode(vue.unref(Icon), { icon: "mynaui:message" })
                  ]),
                  _hoisted_11$1
                ]),
                _ctx.comment.top ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  class: "item",
                  onClick: jump
                }, [
                  vue.createElementVNode("div", _hoisted_12$1, [
                    vue.createVNode(vue.unref(Icon), { icon: "icon-park-outline:to-bottom" })
                  ]),
                  _hoisted_13$1
                ])) : vue.createCommentVNode("", true)
              ]),
              vue.createElementVNode("div", {
                class: "cancel",
                onClick: close
              }, "取消")
            ])
          ]),
          _: 1
        }, 8, ["model-value"]);
      };
    }
  });
  const CommentOptions = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-8ef13a81"]]);
  const _hoisted_1$7 = { class: "comments" };
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "RelationReply",
    props: {
      modelValue: { type: Boolean },
      relationReply: {},
      targetUser: {},
      post: {}
    },
    emits: ["close", "reply", "merge", "update:modelValue"],
    setup(__props, { emit: __emit }) {
      const emit = __emit;
      vue.inject("config");
      vue.inject("isLogin");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(FromBottomDialog, {
          "page-id": "post-detail",
          height: "70vh",
          "model-value": _ctx.modelValue,
          onCancel: _cache[0] || (_cache[0] = ($event) => emit("update:modelValue", false))
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", _hoisted_1$7, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.relationReply, (item, index) => {
                return vue.openBlock(), vue.createBlock(SingleComment, {
                  "is-right": item.username === _ctx.targetUser.right,
                  key: item.floor,
                  comment: item
                }, null, 8, ["is-right", "comment"]);
              }), 128))
            ])
          ]),
          _: 1
        }, 8, ["model-value"]);
      };
    }
  });
  const _sfc_main$6 = {
    name: "detail",
    emits: ["saveReadList", "refresh"],
    components: {
      BackIcon: _sfc_main$p,
      BaseSelect,
      RelationReply: _sfc_main$7,
      CommentOptions,
      FromBottomDialog,
      PostOptions,
      MoreIcon,
      BaseButton,
      SingleComment,
      Comment,
      PostEditor,
      Point,
      Toolbar,
      BaseHtmlRender,
      Tooltip,
      BaseLoading,
      Icon
    },
    inject: ["allReplyUsers", "user", "post", "tags", "isLogin", "config", "pageType", "isNight"],
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
      refreshLoading: {
        type: Boolean,
        default() {
          return false;
        }
      },
      displayType: CommentDisplayType.FloorInFloorNoCallUser
    },
    data() {
      return {
        isSticky: false,
        showPostOptions: false,
        showCommentOptions: false,
        selectCallIndex: 0,
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
        currentFloor: "",
        showOpTag: false,
        currentComment: null
      };
    },
    computed: {
      eventBus() {
        return eventBus;
      },
      CMD() {
        return CMD;
      },
      replyUser() {
        if (this.currentComment)
          return this.currentComment.username;
        return null;
      },
      replyFloor() {
        if (this.currentComment)
          return this.currentComment.floor;
        return null;
      },
      isMy() {
        return this.post.member.username === window.user.username;
      },
      myTags() {
        return this.tags[this.post.member.username] ?? [];
      },
      CommentDisplayType() {
        return CommentDisplayType;
      },
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
        if ([CommentDisplayType.FloorInFloor, CommentDisplayType.FloorInFloorNoCallUser].includes(this.displayType))
          return this.post.nestedReplies;
        if (this.displayType === CommentDisplayType.Like) {
          return window.clone(this.post.nestedReplies).sort((a, b) => b.thankCount - a.thankCount);
        }
        if (this.displayType === CommentDisplayType.V2exOrigin)
          return this.post.replyList;
        if (this.displayType === CommentDisplayType.FloorInFloorNested)
          return this.post.nestedRedundReplies;
        if (this.displayType === CommentDisplayType.OnlyOp)
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
      "post.id"(n2, o) {
        if (this.$refs["post-editor"]) {
          this.$refs["post-editor"].content = "";
          vue.nextTick(() => {
            this.scrollTop(false);
          });
        }
      },
      "post.headerTemplate"(n2, o) {
        let mountEl = document.querySelector(".main-wrapper .post-wrapper .html-wrapper .header");
        if (mountEl) {
          this.showOpTag = true;
        }
      },
      modelValue: {
        handler(newVal) {
          if (this.isPost) {
            return;
          }
          if (newVal) {
            if (!window.history.state) {
              window.history.pushState({}, 0, this.post.href);
            }
            this.read = this.post.read;
            this.currentFloor = "";
            vue.nextTick(() => {
              window.document.title = this.post.title ?? "V2EX";
            });
          } else {
            this.$emit("saveReadList");
            window.document.title = "V2EX";
            this.isSticky = false;
            this.showRelationReply = false;
            if (window.history.state) {
              window.history.back();
            }
          }
        }
      }
    },
    mounted() {
      this.debounceScroll = debounce(this.scroll, 300, false);
      if (this.isLogin) {
        const observer = new IntersectionObserver(
          ([e2]) => e2.target.toggleAttribute("stuck", e2.intersectionRatio < 1),
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
      eventBus.on(CMD.SHOW_COMMENT_OPTIONS, (comment) => {
        this.currentComment = comment;
        this.showCommentOptions = true;
      });
      eventBus.on(CMD.SHOW_EDITOR, (comment) => {
        this.currentComment = comment;
        this.isSticky = true;
        setTimeout(() => {
          var _a;
          (_a = this.$refs["post-editor"]) == null ? void 0 : _a.focus();
        }, 300);
      });
    },
    beforeUnmount() {
      window.removeEventListener("keydown", this.onKeyDown);
      eventBus.off(CMD.SHOW_CALL);
    },
    methods: {
      clickAvatar() {
        window.functions.clickAvatar(".post-wrapper ");
      },
      addTag() {
        eventBus.emit(CMD.ADD_TAG, this.post.member.username);
      },
      removeTag(tag) {
        eventBus.emit(CMD.REMOVE_TAG, { username: this.post.member.username, tag });
      },
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
      jump(floor) {
        let lastItem = this.replyList[this.replyList.length - 1];
        if (floor === "") {
          floor = lastItem.floor;
        } else {
          try {
            floor = Number(floor);
          } catch (e2) {
            floor = lastItem.floor;
          }
          if (floor === 0) {
            floor = 1;
          }
          if (floor > lastItem.floor)
            floor = lastItem.floor;
        }
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
          let postWrapper = document.querySelector(".post-wrapper");
          postWrapper.scrollTo({ top: this.$refs["detail"].clientHeight, behavior: "smooth" });
        });
      },
      close() {
        this.$emit("update:modelValue", false);
      },
      setCall(e2) {
        eventBus.emit(CMD.SET_CALL, e2);
        this.showCallList = false;
      },
      onKeyDown(e2) {
        if (!this.modelValue)
          return;
        if (!this.showCallList)
          return;
        let length = this.filterCallList.slice(0, 10).length;
        if (e2.keyCode === 13) {
          this.setCall(this.filterCallList[this.selectCallIndex]);
          e2.preventDefault();
        }
        if (e2.keyCode === 38) {
          this.selectCallIndex--;
          if (this.selectCallIndex < 0) {
            this.selectCallIndex = length - 1;
          }
          e2.preventDefault();
        }
        if (e2.keyCode === 40) {
          this.selectCallIndex++;
          if (this.selectCallIndex > length - 1) {
            this.selectCallIndex = 0;
          }
          e2.preventDefault();
        }
      },
      scrollTop(anim = true) {
        document.querySelector(".post-wrapper").scrollTo({ top: 0, behavior: anim ? "smooth" : "instant" });
      }
    }
  };
  const _withScopeId$4 = (n2) => (vue.pushScopeId("data-v-546d3b11"), n2 = n2(), vue.popScopeId(), n2);
  const _hoisted_1$6 = { class: "left" };
  const _hoisted_2$4 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("a", { href: "/" }, "V2EX", -1));
  const _hoisted_3$3 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("span", { class: "chevron" }, "  ›  ", -1));
  const _hoisted_4$3 = ["href"];
  const _hoisted_5$2 = { class: "right" };
  const _hoisted_6$2 = ["src"];
  const _hoisted_7$1 = { class: "my-box post-main-body" };
  const _hoisted_8$1 = { class: "box-content" };
  const _hoisted_9$1 = { class: "box-header" };
  const _hoisted_10 = { class: "gray" };
  const _hoisted_11 = ["href"];
  const _hoisted_12 = ["src"];
  const _hoisted_13 = { class: "info" };
  const _hoisted_14 = { class: "top" };
  const _hoisted_15 = ["href"];
  const _hoisted_16 = {
    key: 0,
    class: "center"
  };
  const _hoisted_17 = { class: "my-tag" };
  const _hoisted_18 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "fa fa-tag" }, null, -1));
  const _hoisted_19 = ["onClick"];
  const _hoisted_20 = { class: "bottom" };
  const _hoisted_21 = ["title"];
  const _hoisted_22 = ["href"];
  const _hoisted_23 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "fa fa-info-circle" }, null, -1));
  const _hoisted_24 = [
    _hoisted_23
  ];
  const _hoisted_25 = ["href"];
  const _hoisted_26 = {
    key: 0,
    class: "my-box"
  };
  const _hoisted_27 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("span", { class: "" }, "高赞回复", -1));
  const _hoisted_28 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "top-reply" }, [
    /* @__PURE__ */ vue.createElementVNode("i", { class: "fa fa-compress" })
  ], -1));
  const _hoisted_29 = [
    _hoisted_27,
    _hoisted_28
  ];
  const _hoisted_30 = { ref: "topReply" };
  const _hoisted_31 = {
    key: 1,
    class: "my-cell flex comments-header"
  };
  const _hoisted_32 = {
    key: 2,
    class: "my-box comment-wrapper"
  };
  const _hoisted_33 = {
    key: 0,
    class: "loading-wrapper"
  };
  const _hoisted_34 = {
    key: 1,
    class: "comments"
  };
  const _hoisted_35 = {
    key: 3,
    id: "no-comments-yet"
  };
  const _hoisted_36 = { class: "my-cell flex" };
  const _hoisted_37 = { class: "notice-right gray" };
  const _hoisted_38 = { class: "p1" };
  const _hoisted_39 = ["onClick"];
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BackIcon = vue.resolveComponent("BackIcon");
    const _component_BaseLoading = vue.resolveComponent("BaseLoading");
    const _component_MoreIcon = vue.resolveComponent("MoreIcon");
    const _component_BaseHtmlRender = vue.resolveComponent("BaseHtmlRender");
    const _component_Toolbar = vue.resolveComponent("Toolbar");
    const _component_Comment = vue.resolveComponent("Comment");
    const _component_BaseSelect = vue.resolveComponent("BaseSelect");
    const _component_PostEditor = vue.resolveComponent("PostEditor");
    const _component_post_options = vue.resolveComponent("post-options");
    const _component_comment_options = vue.resolveComponent("comment-options");
    const _component_relation_reply = vue.resolveComponent("relation-reply");
    return vue.openBlock(), vue.createBlock(vue.Teleport, { to: ".post-wrapper" }, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(["post-detail", [
          $options.isNight ? "isNight" : "",
          $options.pageType
        ]]),
        ref: "detail",
        id: "post-detail",
        onScroll: _cache[20] || (_cache[20] = (...args) => $data.debounceScroll && $data.debounceScroll(...args))
      }, [
        vue.createElementVNode("div", {
          class: "my-box nav-bar",
          onDblclick: _cache[2] || (_cache[2] = vue.withModifiers((...args) => $options.scrollTop && $options.scrollTop(...args), ["stop"]))
        }, [
          vue.createElementVNode("div", _hoisted_1$6, [
            !$options.isPost ? (vue.openBlock(), vue.createBlock(_component_BackIcon, {
              key: 0,
              onClick: vue.withModifiers($options.close, ["stop"])
            }, null, 8, ["onClick"])) : vue.createCommentVNode("", true),
            $options.isPost ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
              _hoisted_2$4,
              _hoisted_3$3
            ], 64)) : vue.createCommentVNode("", true),
            vue.createElementVNode("a", {
              href: $options.post.node.url
            }, vue.toDisplayString($options.post.node.title), 9, _hoisted_4$3)
          ]),
          vue.createElementVNode("div", _hoisted_5$2, [
            $props.refreshLoading ? (vue.openBlock(), vue.createBlock(_component_BaseLoading, { key: 0 })) : vue.createCommentVNode("", true),
            vue.createVNode(_component_MoreIcon, {
              onClick: _cache[0] || (_cache[0] = vue.withModifiers(($event) => $data.showPostOptions = true, ["stop"]))
            }),
            $options.user.avatar ? (vue.openBlock(), vue.createElementBlock("img", {
              key: 1,
              onClick: _cache[1] || (_cache[1] = (...args) => $options.clickAvatar && $options.clickAvatar(...args)),
              style: { "margin-right": "0" },
              class: "avatar mobile",
              src: $options.user.avatar
            }, null, 8, _hoisted_6$2)) : vue.createCommentVNode("", true)
          ])
        ], 32),
        vue.createElementVNode("div", _hoisted_7$1, [
          vue.createElementVNode("div", _hoisted_8$1, [
            vue.createElementVNode("div", _hoisted_9$1, [
              vue.createElementVNode("small", _hoisted_10, [
                $options.post.member.avatar_large ? (vue.openBlock(), vue.createElementBlock("a", {
                  key: 0,
                  class: "base-avatar",
                  href: `/member/${$options.post.member.username}`
                }, [
                  vue.createElementVNode("img", {
                    src: $options.post.member.avatar_large
                  }, null, 8, _hoisted_12)
                ], 8, _hoisted_11)) : vue.createCommentVNode("", true),
                vue.createElementVNode("div", _hoisted_13, [
                  vue.createElementVNode("div", _hoisted_14, [
                    vue.createElementVNode("a", {
                      href: `/member/${$options.post.member.username}`
                    }, vue.toDisplayString($options.post.member.username), 9, _hoisted_15),
                    $options.post.member.createDate ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                      vue.createTextVNode(" · "),
                      vue.createElementVNode("span", {
                        class: vue.normalizeClass($options.post.member.isNew && "danger")
                      }, vue.toDisplayString($options.post.member.createDate), 3)
                    ], 64)) : vue.createCommentVNode("", true)
                  ]),
                  $options.isLogin && $options.config.openTag ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_16, [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.myTags, (i) => {
                      return vue.openBlock(), vue.createElementBlock("span", _hoisted_17, [
                        _hoisted_18,
                        vue.createElementVNode("span", null, vue.toDisplayString(i), 1),
                        vue.createElementVNode("i", {
                          class: "fa fa-trash-o remove",
                          onClick: ($event) => $options.removeTag(i)
                        }, null, 8, _hoisted_19)
                      ]);
                    }), 256)),
                    vue.createElementVNode("span", {
                      class: "add-tag ago",
                      onClick: _cache[3] || (_cache[3] = (...args) => $options.addTag && $options.addTag(...args)),
                      title: "添加标签"
                    }, "+")
                  ])) : vue.createCommentVNode("", true),
                  vue.createElementVNode("div", _hoisted_20, [
                    $options.post.createDateAgo ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                      vue.createElementVNode("span", {
                        title: $options.post.createDate
                      }, vue.toDisplayString($options.post.createDateAgo), 9, _hoisted_21),
                      vue.createTextVNode(" · ")
                    ], 64)) : vue.createCommentVNode("", true),
                    vue.createTextVNode(" " + vue.toDisplayString($options.post.clickCount) + " 次点击 ", 1),
                    $options.isMy ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                      vue.createTextVNode("   "),
                      vue.createElementVNode("a", {
                        href: `/t/${$options.post.id}/info`
                      }, _hoisted_24, 8, _hoisted_22),
                      vue.createTextVNode("   "),
                      vue.createElementVNode("a", {
                        href: `/append/topic/${$options.post.id}`,
                        class: "op"
                      }, "APPEND", 8, _hoisted_25)
                    ], 64)) : vue.createCommentVNode("", true)
                  ])
                ])
              ]),
              vue.createElementVNode("h1", null, vue.toDisplayString($options.post.title), 1)
            ]),
            vue.createVNode(_component_BaseHtmlRender, {
              html: $options.post.headerTemplate
            }, null, 8, ["html"])
          ]),
          vue.createVNode(_component_Toolbar, {
            onReply: _cache[4] || (_cache[4] = ($event) => {
              $data.isSticky = !$data.isSticky;
              $data.currentComment = null;
            })
          })
        ]),
        $options.topReply.length && $options.config.showTopReply ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_26, [
          vue.createElementVNode("div", {
            class: "my-cell flex",
            onClick: _cache[5] || (_cache[5] = (...args) => $options.collapseTopReplyList && $options.collapseTopReplyList(...args))
          }, _hoisted_29),
          vue.createElementVNode("div", _hoisted_30, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.topReply, (item, index) => {
              return vue.openBlock(), vue.createBlock(_component_Comment, {
                key: item.floor,
                type: "top",
                modelValue: $options.topReply[index],
                "onUpdate:modelValue": ($event) => $options.topReply[index] = $event
              }, null, 8, ["modelValue", "onUpdate:modelValue"]);
            }), 128))
          ], 512)
        ])) : vue.createCommentVNode("", true),
        $options.post.replyList.length || $props.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_31, [
          vue.createElementVNode("span", null, vue.toDisplayString($options.post.replyCount) + " 条回复", 1),
          vue.createVNode(_component_BaseSelect, {
            "display-type": $props.displayType,
            "onUpdate:displayType": _cache[6] || (_cache[6] = (e2) => _ctx.$emit("update:displayType", e2))
          }, null, 8, ["display-type"])
        ])) : vue.createCommentVNode("", true),
        $options.replyList.length || $props.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_32, [
          $props.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_33, [
            vue.createVNode(_component_BaseLoading, { size: "large" })
          ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_34, [
            $props.modelValue ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList($options.replyList, (item, index) => {
              return vue.openBlock(), vue.createBlock(_component_Comment, {
                key: item.floor,
                modelValue: $options.replyList[index],
                "onUpdate:modelValue": ($event) => $options.replyList[index] = $event
              }, null, 8, ["modelValue", "onUpdate:modelValue"]);
            }), 128)) : vue.createCommentVNode("", true)
          ]))
        ])) : vue.createCommentVNode("", true),
        !($options.replyList.length || $props.loading) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_35, "目前尚无回复")) : vue.createCommentVNode("", true),
        $options.isLogin ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 4,
          class: vue.normalizeClass(["my-box", { "sticky": $data.isSticky }]),
          ref: "replyBox"
        }, [
          vue.createElementVNode("div", _hoisted_36, [
            vue.createElementVNode("span", null, vue.toDisplayString($data.currentComment ? `回复${$data.currentComment.floor}楼` : "回复主题"), 1),
            vue.createElementVNode("div", _hoisted_37, [
              $data.isSticky ? (vue.openBlock(), vue.createElementBlock("a", {
                key: 0,
                style: { "margin-right": "2rem" },
                onClick: _cache[7] || (_cache[7] = ($event) => {
                  $data.isSticky = false;
                  $data.currentComment = null;
                })
              }, "取消回复框停靠")) : vue.createCommentVNode("", true),
              vue.createElementVNode("a", {
                onClick: _cache[8] || (_cache[8] = (...args) => $options.scrollTop && $options.scrollTop(...args))
              }, "回到顶部")
            ])
          ]),
          vue.createElementVNode("div", _hoisted_38, [
            vue.createVNode(_component_PostEditor, {
              onClose: $options.goBottom,
              ref: "post-editor",
              useType: $data.currentComment ? "reply-comment" : "reply-post",
              replyUser: $options.replyUser,
              replyFloor: $options.replyFloor,
              onClick: _cache[9] || (_cache[9] = ($event) => $data.isSticky = true)
            }, null, 8, ["onClose", "useType", "replyUser", "replyFloor"])
          ])
        ], 2)) : vue.createCommentVNode("", true),
        $data.showCallList && $options.filterCallList.length ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 5,
          class: "call-list",
          style: vue.normalizeStyle($data.callStyle)
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.filterCallList, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              class: vue.normalizeClass(["call-item", { select: index === $data.selectCallIndex }]),
              onClick: ($event) => $options.setCall(item)
            }, [
              vue.createElementVNode("a", null, vue.toDisplayString(item), 1)
            ], 10, _hoisted_39);
          }), 256))
        ], 4)) : vue.createCommentVNode("", true),
        vue.createVNode(_component_post_options, {
          onMerge: _cache[10] || (_cache[10] = (val) => {
            $options.post = Object.assign($options.post, val);
            console.log("va", val, $options.post);
          }),
          post: $options.post,
          onReply: _cache[11] || (_cache[11] = ($event) => ($options.eventBus.emit($options.CMD.SHOW_EDITOR, null), $data.showPostOptions = false)),
          onRefresh: _cache[12] || (_cache[12] = ($event) => _ctx.$emit("refresh")),
          modelValue: $data.showPostOptions,
          "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $data.showPostOptions = $event)
        }, null, 8, ["post", "modelValue"]),
        vue.createVNode(_component_comment_options, {
          onMerge: _cache[14] || (_cache[14] = (val) => $data.currentComment = Object.assign($data.currentComment, val)),
          onRecallThank: _cache[15] || (_cache[15] = ($event) => $data.currentComment.isThanked = false),
          post: $options.post,
          comment: $data.currentComment,
          onClose: _cache[16] || (_cache[16] = ($event) => $data.currentComment = null),
          onReply: _cache[17] || (_cache[17] = ($event) => ($options.eventBus.emit($options.CMD.SHOW_EDITOR, $data.currentComment), $data.showCommentOptions = false)),
          modelValue: $data.showCommentOptions,
          "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => $data.showCommentOptions = $event)
        }, null, 8, ["post", "comment", "modelValue"]),
        vue.createVNode(_component_relation_reply, {
          post: $options.post,
          "relation-reply": $options.relationReply,
          modelValue: $data.showRelationReply,
          "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => $data.showRelationReply = $event),
          "target-user": $data.targetUser
        }, null, 8, ["post", "relation-reply", "modelValue", "target-user"])
      ], 34)
    ]);
  }
  const PostDetail = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$2], ["__scopeId", "data-v-546d3b11"]]);
  const _withScopeId$3 = (n2) => (vue.pushScopeId("data-v-1988f33b"), n2 = n2(), vue.popScopeId(), n2);
  const _hoisted_1$5 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ vue.createElementVNode("svg", {
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
  const _sfc_main$5 = {
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
        eventBus.on(CMD.SHOW_TOOLTIP, ({ text, e: e2 }) => {
          setTimeout(() => show.value = true);
          originalText.value = text;
          decodeText.value = "";
          styleObject.left = e2.clientX + "px";
          styleObject.top = e2.clientY + 20 + "px";
        });
        window.addEventListener("click", (e2) => {
          if (!tooltip.value)
            return;
          if (!tooltip.value.contains(e2.target) && show.value) {
            show.value = false;
          }
        }, { capture: true });
        const fn = () => show.value && (show.value = false);
        $(".post-detail", window.win().doc).on("scroll", fn);
      });
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
          new Blob([base64ToArrayBuffer(originalText.value)]).text().then((r2) => {
            decodeText.value = r2;
          });
        } catch (e2) {
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
            _hoisted_1$5
          ], 64)) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$3, [
            vue.createElementVNode("span", null, vue.toDisplayString(decodeText.value), 1),
            vue.createVNode(BaseButton, {
              class: "btn",
              size: "small",
              onClick: _cache[0] || (_cache[0] = ($event) => vue.unref(copy)(decodeText.value))
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("点击复制")
              ]),
              _: 1
            })
          ]))
        ], 4)), [
          [vue.vShow, show.value]
        ]);
      };
    }
  };
  const Base64Tooltip = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-1988f33b"]]);
  const _sfc_main$4 = {
    name: "Msg",
    components: { Icon },
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
  const _hoisted_1$4 = { class: "right" };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Icon = vue.resolveComponent("Icon");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["msg", $props.type])
    }, [
      vue.createElementVNode("div", {
        class: "left",
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
      }, [
        vue.createVNode(_component_Icon, { icon: "ic:round-close" })
      ]),
      vue.createElementVNode("div", _hoisted_1$4, vue.toDisplayString($props.text), 1)
    ], 2);
  }
  const Msg = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$1], ["__scopeId", "data-v-0dcc0508"]]);
  const _withScopeId$2 = (n2) => (vue.pushScopeId("data-v-674b86aa"), n2 = n2(), vue.popScopeId(), n2);
  const _hoisted_1$3 = {
    key: 0,
    class: "tag-modal modal"
  };
  const _hoisted_2$2 = { class: "wrapper" };
  const _hoisted_3$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "title" }, " 添加标签 ", -1));
  const _hoisted_4$2 = { class: "option" };
  const _hoisted_5$1 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("span", null, "用户：", -1));
  const _hoisted_6$1 = { class: "btns" };
  const _sfc_main$3 = {
    __name: "TagModal",
    props: ["tags"],
    emits: ["update:tags"],
    setup(__props, { emit: __emit }) {
      const tagModal = vue.reactive({
        show: false,
        currentUsername: "",
        tag: ""
      });
      const props = __props;
      const emit = __emit;
      const inputRef = vue.ref();
      vue.onMounted(() => {
        eventBus.on(CMD.ADD_TAG, (username) => {
          tagModal.currentUsername = username;
          tagModal.show = true;
          vue.nextTick(() => {
            inputRef.value.focus();
          });
        });
      });
      async function addTag() {
        if (!tagModal.tag) {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "请输入标签" });
          return;
        }
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
            tagModal.show ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
              vue.createElementVNode("div", {
                class: "mask",
                onClick: _cache[0] || (_cache[0] = vue.withModifiers(($event) => tagModal.show = false, ["stop"]))
              }),
              vue.createElementVNode("div", _hoisted_2$2, [
                _hoisted_3$2,
                vue.createElementVNode("div", _hoisted_4$2, [
                  _hoisted_5$1,
                  vue.createElementVNode("div", null, [
                    vue.createElementVNode("b", null, vue.toDisplayString(tagModal.currentUsername), 1)
                  ])
                ]),
                vue.withDirectives(vue.createElementVNode("input", {
                  type: "text",
                  ref_key: "inputRef",
                  ref: inputRef,
                  style: { "width": "100%" },
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => tagModal.tag = $event),
                  onKeydown: vue.withKeys(addTag, ["enter"])
                }, null, 544), [
                  [vue.vModelText, tagModal.tag]
                ]),
                vue.createElementVNode("div", _hoisted_6$1, [
                  vue.createVNode(BaseButton, {
                    type: "link",
                    onClick: _cache[2] || (_cache[2] = ($event) => tagModal.show = false)
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("取消")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(BaseButton, { onClick: addTag }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("确定")
                    ]),
                    _: 1
                  })
                ])
              ])
            ])) : vue.createCommentVNode("", true)
          ]),
          _: 1
        });
      };
    }
  };
  const TagModal = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-674b86aa"]]);
  const _hoisted_1$2 = { class: "msgs" };
  const _sfc_main$2 = {
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
        return vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
          vue.createElementVNode("div", _hoisted_1$2, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(msgList, (v) => {
              return vue.openBlock(), vue.createBlock(Msg, {
                key: v.id,
                type: v.type,
                text: v.text,
                onClose: ($event) => removeMsg(v.id)
              }, null, 8, ["type", "text", "onClose"]);
            }), 128))
          ])
        ]);
      };
    }
  };
  const MsgModal = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-93c4dec0"]]);
  let u = ".__cf_email__", f = "data-cfemail", d = document.createElement("div");
  function e(e2) {
    console.error(e2);
  }
  function r(e2, t) {
    let r2 = e2.substr(t, 2);
    return parseInt(r2, 16);
  }
  function n(href, index) {
    let o = "", a = r(href, index);
    for (let i = index + 2; i < href.length; i += 2) {
      let l = r(href, i) ^ a;
      o += String.fromCharCode(l);
    }
    try {
      o = decodeURIComponent(escape(o));
    } catch (u2) {
      e(u2);
    }
    d.innerHTML = '<a href="' + o.replace(/"/g, "&quot;") + '"></a>';
    return d.childNodes[0].getAttribute("href") || "";
  }
  function decodeEmail(body) {
    try {
      let as = body.find(u);
      as.each(function() {
        try {
          let o = this, a = o.parentNode, i = o.getAttribute(f);
          if (i) {
            let l = n(i, 0), d2 = document.createTextNode(l);
            a.replaceChild(d2, o);
          }
        } catch (h2) {
          e(h2);
        }
      });
    } catch (s) {
      e(s);
    }
  }
  const _withScopeId$1 = (n2) => (vue.pushScopeId("data-v-19a5903e"), n2 = n2(), vue.popScopeId(), n2);
  const _hoisted_1$1 = {
    key: 0,
    class: "tag-modal modal"
  };
  const _hoisted_2$1 = { class: "modal-root" };
  const _hoisted_3$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "title" }, " 提醒系统 ", -1));
  const _hoisted_4$1 = ["innerHTML"];
  const _sfc_main$1 = {
    __name: "NotificationModal",
    props: ["modelValue", "h"],
    emits: ["update:modelValue"],
    setup(__props, { emit: __emit }) {
      const emit = __emit;
      vue.onMounted(() => {
      });
      function close() {
        emit("update:modelValue", false);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, null, {
          default: vue.withCtx(() => [
            __props.modelValue ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
              vue.createElementVNode("div", {
                class: "mask",
                onClick: vue.withModifiers(close, ["stop"])
              }),
              vue.createElementVNode("div", _hoisted_2$1, [
                vue.createElementVNode("div", { class: "modal-header" }, [
                  _hoisted_3$1,
                  vue.createElementVNode("i", {
                    class: "fa fa-times",
                    onClick: close
                  })
                ]),
                vue.createElementVNode("div", {
                  innerHTML: __props.h,
                  class: "modal-body"
                }, null, 8, _hoisted_4$1)
              ])
            ])) : vue.createCommentVNode("", true)
          ]),
          _: 1
        });
      };
    }
  };
  const NotificationModal = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-19a5903e"]]);
  const _sfc_main = {
    components: {
      BaseButton,
      NotificationModal,
      BaseLoading,
      BaseSwitch,
      MsgModal,
      TagModal,
      Tooltip,
      Setting,
      PostDetail,
      Base64Tooltip,
      Msg
    },
    provide() {
      return {
        user: vue.computed(() => window.user),
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
        })
      };
    },
    data() {
      return {
        loading: window.pageType === PageType.Post,
        refreshLoading: false,
        loadMore: false,
        isLogin: !!window.user.username,
        pageType: window.pageType,
        isNight: window.isNight,
        stopMe: window.stopMe,
        //停止使用脚本
        show: false,
        current: window.clone(window.initPost),
        list: [],
        config: window.clone(window.config),
        tags: window.user.tags,
        readList: window.user.readList,
        notificationModal: {
          show: false,
          h: ""
        },
        step: 0
      };
    },
    computed: {
      targetUserTags() {
        return this.tags[window.targetUserName] ?? [];
      },
      isList() {
        return [PageType.Home, PageType.Node].includes(this.pageType);
      },
      isPost() {
        return this.pageType === PageType.Post;
      },
      isMember() {
        return this.pageType === PageType.Member;
      }
    },
    watch: {
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
      },
      "config.fontSizeType": {
        handler(newVal) {
          switch (newVal) {
            case "small":
              return $("html").css("font-size", "8px");
            case "normal":
              return $("html").css("font-size", "10px");
            case "large":
              return $("html").css("font-size", "12px");
            case "big-large":
              return $("html").css("font-size", "14px");
          }
        },
        deep: true
      },
      show(n2) {
        if (n2)
          this.step++;
        else
          this.step--;
        this.slide("post");
      }
    },
    created() {
      let that = this;
      this.initEvent();
      window.cb = this.winCb;
      if (!window.canParseV2exPage)
        return;
      document.addEventListener("click", this.clickA, true);
      $(document).on("click", ".post-item", function(e2) {
        if (e2.currentTarget.getAttribute("script"))
          return;
        if (that.stopMe)
          return true;
        if (this.classList.contains("preview")) {
          if (e2.target.tagName !== "A" && e2.target.tagName !== "IMG") {
            console.log("点空白处", this);
            let id = this.dataset["id"];
            let href = this.dataset["href"];
            if (id) {
              that.clickPost(e2, id, href);
            } else {
              if (href)
                location.href = href;
            }
          }
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
      };
      window.deleteNotification = (nId, token) => {
        console.log("deleteNotification", nId, token);
        let item = $("#n_" + nId);
        item.slideUp("fast");
        $.post({
          url: "/delete/notification/" + nId + "?once=" + token,
          success() {
            $.get({
              url: "/notifications/below/" + window.notificationBottom,
              success(data, status, request) {
                item.remove();
                $("#notifications").append(data);
                window.notificationBottom = request.getResponseHeader("X-V2EX-New-Notification-Bottom");
              },
              error() {
                item.slideDown("fast");
              }
            });
          },
          error() {
            item.slideDown("fast");
          }
        });
      };
    },
    beforeUnmount() {
      eventBus.clear();
      document.removeEventListener("click", this.clickA, true);
    },
    methods: {
      async getUnreadMessagesCount() {
        var _a, _b;
        const res = await fetch(`${location.origin}/mission`);
        const htmlText = await res.text();
        const $page = $(htmlText);
        const text = $page.find('#Rightbar a[href^="/notifications"]').text();
        if (text.includes("未读提醒")) {
          const countStr = (_a = text.match(/\d+/)) == null ? void 0 : _a.at(0);
          if (countStr) {
            return Number((_b = text.match(/\d+/)) == null ? void 0 : _b.at(0));
          }
        } else {
          return 0;
        }
        throw new Error("无法获取未读消息数量");
      },
      clickA(e2) {
        if (!(e2 == null ? void 0 : e2.target))
          return;
        if (e2.target.tagName !== "A")
          return;
        let that = this;
        if (e2.target.getAttribute("script"))
          return;
        if (that.stopMe)
          return true;
        let { href, id, title } = functions.parseA(e2.target);
        if (href.includes("/settings/night/toggle"))
          return;
        if (href.includes("/?tab="))
          return;
        if (href.includes("/go"))
          return;
        if (href === window.origin + "/#;")
          return;
        if (href === window.origin + "/")
          return;
        if (href === window.origin + "/recent")
          return;
        if (href.includes("/notifications"))
          return;
        if (href === window.origin + "/script-setting") {
          window.functions.clickAvatar(this.show ? ".post-wrapper " : "");
          this.slide("setting", this.step++);
          that.stopEvent(e2);
          return;
        }
        if (id) {
          that.clickPost(e2, id, href, title);
        } else {
          if (that.config.newTabOpen) {
            that.stopEvent(e2);
            functions.openNewTab(href);
          }
        }
      },
      stopEvent(e2) {
        e2.preventDefault();
        e2.stopPropagation();
      },
      saveReadList() {
        if (this.config.rememberLastReadFloor) {
          window.parse.saveReadList(this.readList);
        }
      },
      async clickPost(e2, id, href, title = "") {
        if (id) {
          if (this.config.clickPostItemOpenDetail) {
            this.stopEvent(e2);
            let index = this.list.findIndex((v) => v.id == id);
            let postItem = this.clone(window.initPost);
            if (index > -1) {
              postItem = this.list[index];
            }
            if (!postItem.title) {
              postItem.title = title ?? "加载中";
            }
            postItem.inList = index > -1;
            if (postItem.inList) {
              if (postItem.replyCount > MAX_REPLY_LIMIT) {
                return functions.openNewTab(`${location.origin}/t/${id}?p=1&script=1`);
              }
            }
            postItem.id = id;
            postItem.href = href;
            if (!postItem.headerTemplate) {
              let template = `
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
            return;
          }
          if (this.config.newTabOpen) {
            this.stopEvent(e2);
            functions.openNewTab(`https://www.v2ex.com/t/${id}?p=1`);
          }
        }
      },
      showPost() {
        $(".slide-list").css("transition", `0s`);
        setTimeout(() => {
          $(".slide-list").css("transition", `transform .3s`);
        }, 500);
        this.show = true;
        $("#site-header").css("margin-top", "-42px");
        $(`#Wrapper .box:lt(5)`).each(function() {
          $(this).hide();
        });
      },
      slide(to = "post", v) {
        if (this.step === 1) {
          if (to === "post") {
            $(".post-wrapper").css("z-index", 10);
            $(".setting-wrapper").css("z-index", 9);
          } else {
            $(".post-wrapper").css("z-index", 9);
            $(".setting-wrapper").css("z-index", 10);
          }
        }
        $(".slide-list").css("transform", `translateX(-${this.step * 100}vw)`);
      },
      async winCb({ type, value }) {
        console.log("回调的类型", type, value);
        if (type === "syncList") {
          this.list = Object.assign(this.list, window.postList);
        }
        if (type === "syncData") {
          this.list = window.postList;
          this.config = window.config;
          this.stopMe = window.stopMe;
          this.tags = window.user.tags;
          this.readList = window.user.readList;
          this.current.read = this.readList[this.current.id] ?? {};
          if (this.show && this.isPost && this.current.read.floor) {
            this.$refs.postDetail.read = this.current.read;
          }
        }
        if (type === "warningNotice") {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: value });
        }
        if (this.stopMe)
          return;
        if (type === "restorePost") {
          this.show = false;
          this.loading = false;
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "脚本无法查看此页面！" });
          $(`#Wrapper #Main .box:lt(3)`).each(function() {
            $(this).show();
          });
        }
        if (type === "postContent") {
          this.current = Object.assign(this.current, value);
          this.current.inList = true;
          this.showPost();
        }
        if (type === "postReplies") {
          this.current = Object.assign(this.current, value);
          this.list.push(this.clone(this.current));
          this.loading = false;
        }
      },
      clone(val) {
        return functions.clone(val);
      },
      regenerateReplyList() {
        if (this.current.replyList.length) {
          this.current.replyCount = this.current.replyList.length;
          let res = functions.createNestedList(this.current.replyList);
          if (res) {
            this.current.nestedReplies = res;
          }
          let dup_res = functions.createNestedRedundantList(this.current.replyList);
          if (dup_res) {
            this.current.nestedRedundReplies = dup_res;
          }
        } else {
          this.current.replyCount = 0;
          this.current.nestedReplies = [];
          this.current.nestedRedundReplies = [];
        }
        if (this.list.length) {
          let rIndex = this.list.findIndex((i) => i.id === this.current.id);
          if (rIndex > -1) {
            this.list[rIndex] = this.clone(this.current);
          }
        }
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
            this.regenerateReplyList();
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
          this.regenerateReplyList();
        });
        eventBus.on(CMD.IGNORE, () => {
          this.show = false;
          let rIndex = this.list.findIndex((i) => i.id === this.current.id);
          if (rIndex > -1) {
            this.list.splice(rIndex, 1);
          }
          let el = document.querySelector(`.id_${this.current.id}`);
          if (el)
            el.remove();
          this.current = this.clone(window.initPost);
        });
        eventBus.on(CMD.MERGE, (val) => {
          this.current = Object.assign(this.current, val);
          let rIndex = this.list.findIndex((i) => i.id === this.current.id);
          if (rIndex > -1) {
            this.list[rIndex] = this.clone(this.current);
          }
        });
        eventBus.on(CMD.MERGE_CONFIG, (val) => {
          this.config = Object.assign(this.config, val);
        });
        eventBus.on(CMD.ADD_READ, (val) => {
          this.readList[this.current.id] = val;
        });
        eventBus.on(CMD.ADD_REPLY, (item) => {
          this.current.replyList.push(item);
          this.regenerateReplyList();
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
          window.fetchOnce().then((r2) => {
            this.current.once = r2;
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
        eventBus.on(CMD.REFRESH_POST, () => this.getPostDetail(this.current));
      },
      async getPostDetail(post) {
        console.log("getPostDetail", this.clone(post));
        this.current = post;
        this.current.read = this.readList[this.current.id] ?? { floor: 0, total: 0 };
        this.show = true;
        if (!this.current.inList) {
          this.loading = true;
          let r2 = await functions.checkPostReplies(post.id, true);
          if (r2) {
            eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "由于回复数量较多，已为您单独打开此主题" });
            this.loading = this.show = false;
            return;
          }
        }
        let url = window.baseUrl + "/t/" + post.id;
        this.current.url = url;
        let alreadyHasReply = this.current.replyList.length;
        if (alreadyHasReply) {
          this.refreshLoading = true;
          this.$refs.postDetail.jumpLastRead(this.current.read.floor);
        } else {
          this.loading = true;
        }
        let apiRes = await window.fetch(url + "?p=1");
        if (apiRes.status === 404) {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "主题未找到" });
          return this.refreshLoading = this.loading = false;
        }
        if (apiRes.status === 403) {
          this.refreshLoading = this.show = this.loading = false;
          functions.openNewTab(`${location.origin}/t/${post.id}?p=1&script=0`);
          return;
        }
        if (apiRes.redirected) {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "没有权限" });
          return this.refreshLoading = this.loading = false;
        }
        let htmlText = await apiRes.text();
        let hasPermission = htmlText.search("你要查看的页面需要先登录");
        if (hasPermission > -1) {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "你要查看的页面需要先登录" });
          return this.refreshLoading = this.loading = false;
        }
        let bodyText = htmlText.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
        let body = $(bodyText[0]);
        decodeEmail(body);
        await window.parse.getPostDetail(this.current, body, htmlText);
        let index = this.list.findIndex((v) => v.id == this.current.id);
        if (index > -1) {
          this.list[index] = this.clone(this.current);
        } else {
          this.list.push(this.clone(this.current));
        }
        this.refreshLoading = this.loading = false;
        if (!alreadyHasReply) {
          vue.nextTick(() => {
            this.$refs.postDetail.jumpLastRead(this.current.read.floor);
          });
        }
        await window.parse.parseOp(this.current);
        console.log("当前帖子", this.current);
      },
      addTargetUserTag() {
        eventBus.emit(CMD.ADD_TAG, window.targetUserName);
      },
      removeTargetUserTag(tag) {
        eventBus.emit(CMD.REMOVE_TAG, { username: window.targetUserName, tag });
      }
    }
  };
  const _withScopeId = (n2) => (vue.pushScopeId("data-v-cf079729"), n2 = n2(), vue.popScopeId(), n2);
  const _hoisted_1 = {
    key: 0,
    class: "target-user-tags p1"
  };
  const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", null, "标签：", -1));
  const _hoisted_3 = { class: "my-tag" };
  const _hoisted_4 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "fa fa-tag" }, null, -1));
  const _hoisted_5 = ["onClick"];
  const _hoisted_6 = {
    key: 1,
    class: "my-box p2",
    style: { "margin-top": "2rem" }
  };
  const _hoisted_7 = {
    key: 0,
    class: "flex flex-center"
  };
  const _hoisted_8 = {
    key: 1,
    class: "loaded"
  };
  const _hoisted_9 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", null, "楼中楼解析完成", -1));
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Setting = vue.resolveComponent("Setting");
    const _component_PostDetail = vue.resolveComponent("PostDetail");
    const _component_TagModal = vue.resolveComponent("TagModal");
    const _component_Base64Tooltip = vue.resolveComponent("Base64Tooltip");
    const _component_MsgModal = vue.resolveComponent("MsgModal");
    vue.resolveComponent("NotificationModal");
    const _component_BaseLoading = vue.resolveComponent("BaseLoading");
    const _component_BaseButton = vue.resolveComponent("BaseButton");
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createVNode(_component_Setting, {
        modelValue: $data.config,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.config = $event),
        onBack: _cache[1] || (_cache[1] = ($event) => $options.slide("post", $data.step--)),
        to: ".setting-wrapper"
      }, null, 8, ["modelValue"]),
      vue.createVNode(_component_Setting, {
        modelValue: $data.config,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.config = $event),
        onBack: _cache[3] || (_cache[3] = ($event) => $options.slide("post", $data.step--)),
        to: ".setting-wrapper2"
      }, null, 8, ["modelValue"]),
      vue.createVNode(_component_PostDetail, {
        modelValue: $data.show,
        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.show = $event),
        ref: "postDetail",
        displayType: $data.config.commentDisplayType,
        "onUpdate:displayType": _cache[5] || (_cache[5] = ($event) => $data.config.commentDisplayType = $event),
        onSaveReadList: $options.saveReadList,
        onRefresh: _cache[6] || (_cache[6] = ($event) => $options.getPostDetail($data.current)),
        loading: $data.loading,
        refreshLoading: $data.refreshLoading
      }, null, 8, ["modelValue", "displayType", "onSaveReadList", "loading", "refreshLoading"]),
      vue.createVNode(_component_TagModal, {
        tags: $data.tags,
        "onUpdate:tags": _cache[7] || (_cache[7] = ($event) => $data.tags = $event)
      }, null, 8, ["tags"]),
      vue.createVNode(_component_Base64Tooltip),
      vue.createVNode(_component_MsgModal),
      vue.createCommentVNode("", true),
      !$data.stopMe ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
        $options.isMember && $data.isLogin && $data.config.openTag ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          _hoisted_2,
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.targetUserTags, (i) => {
            return vue.openBlock(), vue.createElementBlock("span", _hoisted_3, [
              _hoisted_4,
              vue.createElementVNode("span", null, vue.toDisplayString(i), 1),
              vue.createElementVNode("i", {
                class: "fa fa-trash-o remove",
                onClick: ($event) => $options.removeTargetUserTag(i)
              }, null, 8, _hoisted_5)
            ]);
          }), 256)),
          vue.createElementVNode("span", {
            class: "add-tag ago",
            onClick: _cache[9] || (_cache[9] = (...args) => $options.addTargetUserTag && $options.addTargetUserTag(...args)),
            title: "添加标签"
          }, "+")
        ])) : vue.createCommentVNode("", true),
        $options.isPost && !$data.show ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [
          $data.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7, [
            vue.createVNode(_component_BaseLoading)
          ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_8, [
            _hoisted_9,
            vue.createVNode(_component_BaseButton, {
              size: "small",
              onClick: $options.showPost
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("点击显示")
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))
        ])) : vue.createCommentVNode("", true)
      ], 64)) : vue.createCommentVNode("", true)
    ], 64);
  }
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-cf079729"]]);
  let isMobile = !document.querySelector("#Rightbar");
  let $section = document.createElement("section");
  $section.id = "app";
  function run() {
    window.baseUrl = location.origin;
    window.initPost = DefaultPost;
    window.win = function() {
      return window;
    };
    window.win().doc = window.win().document;
    window.win().query = (v) => window.win().document.querySelector(v);
    window.query = (v) => window.win().document.querySelector(v);
    window.clone = (val) => JSON.parse(JSON.stringify(val));
    window.user = DefaultUser;
    window.targetUserName = "";
    window.pageType = void 0;
    window.pageData = { pageNo: 1 };
    window.config = { ...DefaultConfig, ...{ viewType: "card" } };
    window.const = {
      git: "https://github.com/zyronon/v2ex-script",
      issue: "https://github.com/zyronon/v2ex-script/issues"
    };
    window.currentVersion = 1;
    window.isNight = $(".Night").length === 1;
    window.cb = null;
    window.stopMe = false;
    window.postList = [];
    window.parse = {
      //解析帖子内容
      async parsePostContent(post, body, htmlText) {
        var _a, _b;
        let once = htmlText.match(/var once = "([\d]+)";/);
        if (once && once[1]) {
          post.once = once[1];
        }
        post.isReport = htmlText.includes("你已对本主题进行了报告");
        let wrapperClass = "Wrapper";
        let wrapper;
        let boxs;
        if (body.length > 1) {
          body.each(function() {
            if (this.id === wrapperClass) {
              wrapper = $(this);
              boxs = this.querySelectorAll(".box");
            }
          });
        } else {
          wrapper = body;
          boxs = body.find(`#${wrapperClass} .box`);
        }
        let box1 = $(boxs[0]);
        let header1 = wrapper.find(".header");
        if (!post.title || !post.content_rendered) {
          let h1 = wrapper.find("h1");
          if (h1) {
            post.title = h1[0].innerText;
          }
        }
        let as = wrapper.find(".header > a");
        if (as.length) {
          post.node.title = as[1].innerText;
          post.node.url = as[1].href;
        }
        let aName = header1.find("small.gray a:nth-child(1)");
        if (aName) {
          post.member.username = aName[0].innerText;
        }
        let small = header1.find("small.gray");
        if (small[0]) {
          let spanEl = (_b = (_a = small[0]) == null ? void 0 : _a.lastChild) == null ? void 0 : _b.nodeValue;
          if (spanEl) {
            let dianIndex = spanEl.indexOf("·");
            post.createDateAgo = spanEl.substring(4, dianIndex - 1);
            let text = spanEl.substring(dianIndex + 1).trim();
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
        let avatarEl = header1.find(".avatar");
        if (avatarEl) {
          post.member.avatar_large = avatarEl[0].src;
        }
        let topic_buttons = box1.find(".inner .fr");
        if (topic_buttons.length) {
          let favoriteNode = topic_buttons.find(".op:first");
          if (favoriteNode.length) {
            post.isFavorite = favoriteNode[0].innerText === "取消收藏";
          }
          let ignoreNode = topic_buttons.find(".tb");
          if (ignoreNode.length) {
            post.isIgnore = ignoreNode[0].innerText === "取消忽略";
          }
          let thankNode = topic_buttons.find(".topic_thanked");
          if (thankNode.length) {
            post.isThanked = true;
          }
          let span = topic_buttons.find("span");
          if (span.length) {
            let text = span[0].innerText;
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
          }
        }
        let header = $(boxs[0]);
        let temp = header.clone();
        temp.find(".topic_buttons").remove();
        temp.find(".inner").remove();
        temp.find(".header").remove();
        let html = temp.html();
        html = functions.checkPhotoLink2Img(html);
        post.headerTemplate = html;
        return post;
      },
      //解析OP信息
      async parseOp(post) {
        if (!post.member.id) {
          let userRes = await fetch(window.baseUrl + "/api/members/show.json?username=" + post.member.username);
          if (userRes.status === 200) {
            post.member = await userRes.json();
          }
        }
        if (post.member.id) {
          let date = new Date(post.member.created * 1e3);
          let createStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
          date.setHours(0);
          date.setMinutes(0);
          date.setSeconds(0);
          date.setMilliseconds(0);
          let now = /* @__PURE__ */ new Date();
          now.setHours(0);
          now.setMinutes(0);
          now.setSeconds(0);
          now.setMilliseconds(0);
          let d2 = now.getTime() - date.getTime();
          let isNew = d2 <= 1e3 * 60 * 60 * 24 * 7;
          post.member.createDate = createStr + " 注册";
          post.member.isNew = isNew;
        } else {
          post.member.createDate = "用户已被注销/封禁";
          post.member.isNew = true;
        }
        return post;
      },
      //获取帖子所有回复
      async getPostAllReplies(post, body, htmlText, pageNo = 1) {
        var _a, _b;
        if (body.find("#no-comments-yet").length) {
          return post;
        }
        let wrapperClass = "Wrapper";
        let boxs;
        let box;
        if (body.length > 1) {
          body.each(function() {
            if (this.id === wrapperClass) {
              boxs = this.querySelectorAll(".box");
              box = boxs[1];
            }
          });
        } else {
          boxs = body.find(`#${wrapperClass} .box`);
          box = boxs[1];
        }
        let cells = box.querySelectorAll(".cell");
        if (cells && cells.length) {
          cells = Array.from(cells);
          let snow = cells[0].querySelector(".snow");
          post.createDate = ((_b = (_a = snow == null ? void 0 : snow.nextSibling) == null ? void 0 : _a.nodeValue) == null ? void 0 : _b.trim()) || "";
          let repliesMap = [];
          if (cells[1].id) {
            repliesMap.push({ i: pageNo, replyList: this.parsePageReplies(cells.slice(1)) });
            let replyList = functions.getAllReply(repliesMap);
            post.replyList = replyList;
            post.replyCount = replyList.length;
            post.allReplyUsers = Array.from(new Set(replyList.map((v) => v.username)));
            let nestedList = functions.createNestedList(replyList);
            let nestedRedundantList = functions.createNestedRedundantList(replyList);
            if (nestedList)
              post.nestedReplies = nestedList;
            if (nestedRedundantList)
              post.nestedRedundReplies = nestedRedundantList;
            return post;
          } else {
            let promiseList = [];
            return new Promise((resolve, reject) => {
              repliesMap.push({ i: pageNo, replyList: this.parsePageReplies(cells.slice(2, cells.length - 1)) });
              let pages = cells[1].querySelectorAll("a.page_normal");
              pages = Array.from(pages);
              let url = window.baseUrl + "/t/" + post.id;
              for (let i = 0; i < pages.length; i++) {
                let currentPageNo = Number(pages[i].innerText);
                promiseList.push(this.fetchPostOtherPageReplies(url + "?p=" + currentPageNo, currentPageNo));
              }
              Promise.allSettled(promiseList).then(
                (results) => {
                  results.filter((result) => result.status === "fulfilled").map((v) => repliesMap.push(v.value));
                  let replyList = functions.getAllReply(repliesMap);
                  post.replyList = replyList;
                  post.replyCount = replyList.length;
                  post.allReplyUsers = Array.from(new Set(replyList.map((v) => v.username)));
                  let nestedList = functions.createNestedList(replyList);
                  let nestedRedundantList = functions.createNestedRedundantList(replyList);
                  if (nestedList)
                    post.nestedReplies = nestedList;
                  if (nestedRedundantList)
                    post.nestedRedundReplies = nestedRedundantList;
                  resolve(post);
                }
              );
            });
          }
        }
      },
      //请求帖子其他页的回复
      fetchPostOtherPageReplies(href, pageNo) {
        return new Promise((resolve) => {
          $.get(href).then((res) => {
            let s = res.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
            let wrapperClass = "Wrapper";
            let box;
            $(s[0]).each(function() {
              if (this.id === wrapperClass) {
                box = this.querySelectorAll(".box")[2];
              }
            });
            let cells = box.querySelectorAll(".cell");
            cells = Array.from(cells);
            resolve({ i: pageNo, replyList: this.parsePageReplies(cells.slice(2, cells.length - 1)) });
          }).catch((r2) => {
            if (r2.status === 403) {
              functions.cbChecker({ type: "restorePost", value: null });
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
            isDup: false,
            id: node.id.replace("r_", "")
          };
          let reply_content = node.querySelector(".reply_content");
          item.reply_content = functions.checkPhotoLink2Img(reply_content.innerHTML);
          item.reply_text = reply_content.textContent;
          let { users, floor } = this.parseReplyContent(item.reply_content);
          item.hideCallUserReplyContent = item.reply_content;
          if (users.length === 1) {
            item.hideCallUserReplyContent = item.reply_content.replace(/@<a href="\/member\/[\s\S]+?<\/a>(\s#[\d]+)?\s(<br>)?/, () => "");
          }
          item.replyUsers = users;
          item.replyFloor = floor;
          let spans = node.querySelectorAll("span");
          let ago = spans[1];
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
          let small = spans[2];
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
      //解析页面帖子列表
      parsePagePostList(list, box) {
        list.forEach((itemDom) => {
          let item = window.clone(window.initPost);
          let item_title = itemDom.querySelector(".item_title");
          itemDom.classList.add("post-item");
          if (!item_title)
            return;
          let a = item_title.querySelector("a");
          let { href, id } = functions.parseA(a);
          item.id = Number(id);
          a.href = item.href = href;
          item.url = location.origin + "/api/topics/show.json?id=" + item.id;
          itemDom.classList.add(`id_${id}`);
          itemDom.dataset["href"] = href;
          itemDom.dataset["id"] = id;
          window.postList.push(item);
          if (![PageType.Member].includes(window.pageType)) {
            let headerWrap = $(`
<div class="new-item">
        <div class="left">
           <div class="top">
              <div class="r">
                <div class="small fade"></div>
                <div class="small fade"></div>
              </div>
            </div>
            <div class="bottom"></div>
        </div>
        <div class="right"></div>
</div>`);
            headerWrap.find(".bottom").append(item_title);
            headerWrap.find(".right").append(itemDom.querySelector(".count_livid"));
            headerWrap.find(".top").prepend(itemDom.querySelector("td:first-child a"));
            let info = itemDom.querySelector("td:nth-child(3)");
            if (window.pageType === PageType.Node)
              ;
            if ([PageType.Changes, PageType.Home].includes(window.pageType)) {
              let s1 = info.querySelector("span:first-child");
              let t = headerWrap.find(".top .r div:first");
              t.append(s1.querySelector("strong"));
              t.append(`  •  `);
              t.append(s1.querySelector("a"));
            }
            let b = headerWrap.find(".top .r div:last");
            b.append(info.querySelector("span:last-child").innerHTML);
            itemDom.append(headerWrap[0]);
            itemDom.querySelector("table").remove();
          }
        });
        const setF = (res) => {
          var _a;
          let rIndex = window.postList.findIndex((w) => w.id === res.id);
          if (rIndex > -1) {
            window.postList[rIndex] = Object.assign(window.postList[rIndex], res);
          }
          let itemDom = box.querySelector(`.id_${res.id}`);
          itemDom.classList.add("preview");
          if (res.content_rendered) {
            let a = document.createElement("a");
            a.href = res.href;
            a.classList.add("post-content");
            let div = document.createElement("div");
            div.innerHTML = res.content_rendered;
            a.append(div);
            itemDom.append(a);
            if (div.clientHeight < 300) {
              a.classList.add("show-all");
            } else {
              let showMore = document.createElement("div");
              showMore.classList.add("show-more");
              showMore.innerHTML = "显示更多/收起";
              showMore.onclick = function(e2) {
                e2.stopPropagation();
                a.classList.toggle("show-all");
              };
              (_a = a.parentNode) == null ? void 0 : _a.append(showMore);
            }
          }
          functions.cbChecker({ type: "syncList" });
        };
        if (window.config.viewType === "card") {
          let cacheDataStr = localStorage.getItem("cacheData");
          let cacheData = [];
          if (cacheDataStr) {
            cacheData = JSON.parse(cacheDataStr);
            let now = Date.now();
            cacheData = cacheData.filter((v) => {
              return v.created > now / 1e3 - 60 * 60 * 24 * 3;
            });
          }
          let fetchIndex = 0;
          for (let i = 0; i < window.postList.length; i++) {
            let item = window.postList[i];
            let rItem = cacheData.find((w) => w.id === item.id);
            if (rItem) {
              rItem.href = item.href;
              setF(rItem);
            } else {
              fetchIndex++;
              setTimeout(() => {
                $.get(item.url).then((v) => {
                  let res = v[0];
                  res.href = item.href;
                  cacheData.push(res);
                  localStorage.setItem("cacheData", JSON.stringify(cacheData));
                  setF(res);
                });
              }, fetchIndex < 4 ? 0 : (fetchIndex - 4) * 1e3);
            }
          }
        } else {
          functions.cbChecker({ type: "syncData" });
        }
      },
      //创建记事本子条目
      async createNoteItem(itemName) {
        return;
      },
      //编辑记事本子条目
      async editNoteItem(val, id) {
        return;
      },
      //标签操作
      async saveTags(val) {
        return;
      },
      //已读楼层操作
      async saveReadList(val) {
        return;
      },
      //imgur图片删除hash操作
      async saveImgurList(val) {
        return;
      }
    };
    window.vals = {};
    window.functions = {
      clickAvatar(prex) {
        let menu = $(`${prex}#menu-body`);
        if (menu.css("--show-dropdown") === "block") {
          menu.css("--show-dropdown", "none");
        } else {
          menu.css("--show-dropdown", "block");
        }
      }
    };
    function initStyle() {
      let style2 = `
      
    }
    `;
      let addStyle2 = document.createElement("style");
      addStyle2.rel = "stylesheet";
      addStyle2.type = "text/css";
      addStyle2.innerHTML = style2;
      window.document.head.append(addStyle2);
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
      $.get(url).then((r2) => {
        let bodyText = r2.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
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
              functions.feedback();
            }
          });
          console.warn("[V2EX 增强] 自动签到失败！请关闭其他插件或脚本。如果连续几天都签到失败，请联系作者解决！");
          if (qiandao)
            qiandao.textContent = "自动签到失败！请尝试手动签到！";
        }
      });
    }
    function qianDaoStatus_(timeNow) {
      $.get(window.baseUrl + "/mission/daily").then((r2) => {
        let bodyText = r2.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
        let html = $(bodyText[0]);
        if (html.find('input[value^="领取"]').length) {
          qianDao_(null, timeNow);
        } else {
          console.info("[V2EX 增强] 已经签过到了。");
          localStorage.setItem("menu_clockInTime", timeNow);
        }
      });
    }
    async function initNoteData() {
      return;
    }
    function initConfig() {
      return new Promise((resolve) => {
        let configStr = localStorage.getItem("v2ex-config");
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
    function addSettingText() {
      let setting = $(`<a href="/script-setting" class="top">脚本管理</a>`);
      $("#menu-body .cell:first").append(setting);
    }
    async function init() {
      window.addEventListener("error", (e2) => {
        let dom = e2.target;
        let originImgUrl = dom.getAttribute("data-originurl");
        if (originImgUrl) {
          let a = document.createElement("a");
          a.href = originImgUrl;
          a.setAttribute("notice", "此标签由v2ex超级增强脚本转换图片失败后恢复");
          a.innerText = originImgUrl;
          dom.parentNode.replaceChild(a, dom);
        }
      }, true);
      if (window.isNight) {
        document.documentElement.classList.add("dark");
      }
      let { pageData, pageType } = functions.checkPageType();
      window.pageType = pageType;
      window.pageData = pageData;
      addSettingText();
      functions.initMonkeyMenu();
      let s = $(`
        <div class="slide">
            <div class="slide-list">
                <div class="slide-item page0"></div>
                <div class="slide-item page1">
                    <div class="post-wrapper"></div>
                    <div class="setting-wrapper"></div>
                </div>
                <div class="slide-item page2">
                    <div class="setting-wrapper2"></div>
                </div>
            </div>    
        </div>`);
      $("body").append(s);
      $("body").children().slice(0, 4).each(function() {
        $(".page0").append(this);
      });
      $(".post-wrapper").append($("#site-header").clone());
      let top2 = $("#menu-body .cell:first .top:first");
      if (top2.length && ["个人主页", "Profile"].includes(top2.text())) {
        window.user.username = top2.attr("href").replace("/member/", "");
        window.user.avatar = $("#menu-entry .avatar").attr("src");
      }
      initConfig().then(async (r2) => {
        initStyle();
        try {
          if (window.config.autoSignin && window.user.username) {
            qianDao();
          }
        } catch (e2) {
          console.log("签到失败");
        }
        if (window.user.username) {
          initNoteData();
        }
        let box;
        let list;
        let first;
        let last;
        switch (window.pageType) {
          case PageType.Node:
            box = document.querySelectorAll("#Wrapper .box");
            box[1].style.background = "unset";
            box[1].style.borderBottom = "none";
            box[1].style["border-radius"] = "0";
            box[1].style["box-shadow"] = "none";
            first = $(box[1]).children().first();
            first.addClass("cell post-item");
            if (window.config.viewType === "card")
              first[0].classList.add("preview");
            last = $(box[1]).children().last();
            last.addClass("cell post-item");
            if (window.config.viewType === "card")
              last[0].classList.add("preview");
            list = box[1].querySelectorAll(".cell");
            box[0].before($section);
            window.parse.parsePagePostList(list, box[1]);
            break;
          case PageType.Home:
            box = document.querySelector("#Wrapper .box");
            let headerWrap = $('<div class="cell post-item"></div>');
            if (window.config.viewType === "card")
              headerWrap[0].classList.add("preview");
            $(box).prepend(headerWrap);
            $(box).children().slice(1, 3).each(function() {
              headerWrap.append(this);
            });
            last = $(box).children().last();
            last.addClass("cell post-item");
            if (window.config.viewType === "card")
              last[0].classList.add("preview");
            box.style.background = "unset";
            box.style["border-radius"] = "0";
            box.style["box-shadow"] = "none";
            list = box.querySelectorAll(".item");
            list[0].before($section);
            window.parse.parsePagePostList(list, box);
            break;
          case PageType.Changes:
            box = document.querySelector("#Wrapper .box");
            box.style.background = "unset";
            box.style["border-radius"] = "0";
            box.style["box-shadow"] = "none";
            first = $(box).children().first();
            first.addClass("cell post-item");
            if (window.config.viewType === "card")
              first[0].classList.add("preview");
            last = $(box).children().last();
            last.addClass("cell post-item");
            if (window.config.viewType === "card")
              last[0].classList.add("preview");
            list = box.querySelectorAll(".item");
            list[0].before($section);
            window.parse.parsePagePostList(list, box);
            break;
          case PageType.Post:
            box = document.querySelector("#Wrapper .box");
            box.after($section);
            let r22 = await functions.checkPostReplies(window.pageData.id, false);
            if (r22) {
              window.stopMe = true;
              functions.cbChecker({ type: "syncData" });
              functions.cbChecker({ type: "warningNotice", value: "由于回复数量较多，脚本已停止解析楼中楼" });
              return;
            }
            let post = functions.clone(window.initPost);
            post.id = window.pageData.id;
            let body = $(document.body);
            let htmlText = document.documentElement.outerHTML;
            window.parse.parsePostContent(
              post,
              body,
              htmlText
            ).then(async (res) => {
              await functions.cbChecker({ type: "postContent", value: res });
              await window.parse.parseOp(res);
            });
            window.parse.getPostAllReplies(
              post,
              body,
              htmlText,
              window.pageData.pageNo
            ).then(async (res1) => {
              await functions.cbChecker({ type: "postReplies", value: res1 });
            });
            break;
          case PageType.Member:
            box = document.querySelectorAll("#Wrapper .box");
            window.targetUserName = box[0].querySelector("h1").textContent;
            if (window.config.openTag) {
              box[0].style.borderBottom = "none";
              box[0].style["border-bottom-left-radius"] = "0";
              box[0].style["border-bottom-right-radius"] = "0";
            }
            list = box[2].querySelectorAll(".cell");
            box[0].after($section);
            window.parse.parsePagePostList(list, box[2]);
            break;
          default:
            window.stopMe = true;
            functions.cbChecker({ type: "syncData" });
            console.error("未知页面");
            break;
        }
      });
    }
    window.canParseV2exPage = !window.location.search.includes("script");
    if (window.canParseV2exPage) {
      init();
    } else {
      let box = document.querySelector("#Wrapper #Main .box");
      box.after($section);
      window.stopMe = true;
      functions.cbChecker({ type: "syncData" });
      if (window.location.search.includes("script=0")) {
        functions.cbChecker({ type: "warningNotice", value: "脚本无法查看此主题，已为您单独打开此主题" });
      }
      if (window.location.search.includes("script=1")) {
        functions.cbChecker({ type: "warningNotice", value: "由于回复数量较多，已为您单独打开此主题并停止解析楼中楼" });
      }
    }
  }
  if (isMobile) {
    (e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const o=document.createElement("style");o.textContent=e,document.head.append(o)})(' .tip[data-v-ee672411]{position:fixed;font-size:1.6rem;z-index:9999;max-width:10rem;border-radius:.5rem;padding:1rem;color:var(--color-font-8);background:var(--color-tooltip-bg);box-shadow:0 0 6px 1px var(--color-tooltip-shadow)}.v-enter-active[data-v-e7c0fbef],.v-leave-active[data-v-e7c0fbef]{transition:opacity .3s ease}.v-enter-from[data-v-e7c0fbef],.v-leave-to[data-v-e7c0fbef]{opacity:0}.fade-in[data-v-e7c0fbef]{animation:fade-in-e7c0fbef .3s}.fade-out[data-v-e7c0fbef]{animation:fade-out-e7c0fbef .4s}@keyframes fade-in-e7c0fbef{0%{opacity:0}to{opacity:1}}@keyframes fade-out-e7c0fbef{0%{opacity:1}to{opacity:0;display:none}}.username[data-v-e7c0fbef]{font-weight:700;font-size:1.4rem;margin-right:1rem}.link-num[data-v-e7c0fbef]{font-size:1.4rem;color:#e02a2a}.owner[data-v-e7c0fbef]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;margin-right:1rem;transform:scale(.8)}.mod[data-v-e7c0fbef]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;transform:scale(.8);background:#1484cd;color:#fff;margin-right:1rem}.my-tag[data-v-e7c0fbef]{font-size:1.4rem;color:red;margin-left:1rem}.my-tag .remove[data-v-e7c0fbef]{margin-left:.5rem;display:none}.add-tag[data-v-e7c0fbef]{font-size:2.4rem;transform:translateY(.2rem);line-height:1rem;display:inline-block;margin-left:1rem;position:absolute;display:none}.floor[data-v-e7c0fbef]{font-size:1.1rem;line-height:1rem;border-radius:.5rem;display:inline-block;color:var(--color-floor-font);cursor:default;margin-right:1rem}.base-avatar[data-v-e7c0fbef]{margin-right:1rem;display:inline-flex}.base-avatar img[data-v-e7c0fbef]{width:2.8rem;height:2.8rem;border-radius:.4rem}html[data-v-e7c0fbef]{font-size:10px}[data-v-e7c0fbef]:root{--box-border-radius: 8px}#site-header[data-v-e7c0fbef]{height:4rem}#site-header #site-header-menu #menu-body[data-v-e7c0fbef]{top:5rem;right:1rem}#Wrapper .cell .count_livid[data-v-e7c0fbef]{font-size:14px;font-weight:700;padding:3px 10px;border-radius:5px}a[data-v-e7c0fbef]{-webkit-tap-highlight-color:rgba(255,255,255,0);-webkit-user-select:none;-moz-user-focus:none;-moz-user-select:none}.post-item[data-v-e7c0fbef]{background:var(--box-background-color)}.post-item .new-item[data-v-e7c0fbef]{display:flex;justify-content:space-between}.post-item .new-item .left .top[data-v-e7c0fbef]{display:flex;align-items:center;line-height:1.2;gap:1rem}.post-item .new-item .left .small[data-v-e7c0fbef],.post-item .new-item .left a.node[data-v-e7c0fbef]{font-size:1.2rem}.post-item .new-item .left .bottom[data-v-e7c0fbef]{margin:1rem 0 .5rem}.post-item .new-item .left .bottom .item_title[data-v-e7c0fbef]{font-size:1.6rem}.post-item .new-item .left .bottom a[data-v-e7c0fbef]{text-decoration:none!important}.post-item .new-item .right[data-v-e7c0fbef]{min-width:5rem;display:flex;justify-content:flex-end;align-items:center}.post-item .new-item .right .count_livid[data-v-e7c0fbef]{font-size:1.4rem!important;margin-right:0;padding:.3rem 1rem!important;border-radius:.5rem!important}.post-item .post-content[data-v-e7c0fbef]{display:block;max-height:30rem;overflow:hidden;line-break:anywhere;-webkit-mask-image:linear-gradient(180deg,#000 60%,transparent);height:0;color:#000;text-decoration:none!important}.post-item .post-content blockquote[data-v-e7c0fbef]{margin-top:.5rem}.post-item .post-content p[data-v-e7c0fbef]:first-child{margin-top:0}.post-item .post-content[data-v-e7c0fbef]:visited{color:var(--link-visited-color)}.post-item .show-more[data-v-e7c0fbef]{font-size:1.3rem;text-align:right;height:3rem;align-items:center;justify-content:center;position:relative;z-index:9;display:none}.preview[data-v-e7c0fbef]{margin-bottom:.7rem;border-radius:var(--box-border-radius)}.preview .topic-link[data-v-e7c0fbef]:link{color:#000!important}.preview .show-all[data-v-e7c0fbef]{max-height:unset;-webkit-mask-image:none}.preview .post-content[data-v-e7c0fbef]{height:unset!important}.preview .show-more[data-v-e7c0fbef]{display:flex}.preview .item_title[data-v-e7c0fbef]{font-weight:700}.Night .post-item[data-v-e7c0fbef]{background:#18222d!important}.Night .preview[data-v-e7c0fbef]{border:1px solid #3b536e}.Night .preview>.post-content[data-v-e7c0fbef]:link{color:#d1d5d9}.Night .preview>.post-content[data-v-e7c0fbef]:visited{color:#393f4e!important}.Night .preview .topic-link[data-v-e7c0fbef]:link{color:#c0dbff!important}[data-v-e7c0fbef]:root{--color-main-bg: #e2e2e2;--color-second-bg: white;--color-third-bg: #e2e2e2;--color-four-bg: #e7e9eb;--color-item-bg: white;--color-swtich-bg: #dcdfe6;--color-active: #409eff;--color-font: #999;--color-font-8: rgba(0, 0, 0, .8);--color-font-3: rgba(0, 0, 0, .3);--color-font-pure: black;--color-input-bg: white;--color-input-border: #e2e2e2;--color-input-border-hover: #a3a6ad;--color-radio-border: #e2e2e2;--color-tooltip-bg: white;--color-tooltip-shadow: #bbbbbb;--color-scrollbar: #93ade3;--color-line: #e2e2e2;--color-line2: #cecece;--color-loading-1: #00000033;--color-loading-2: #000;--color-floor: #f0f0f0;--color-floor-font: #bdbdbd;--color-editor-toolbar: #f6f7f8;--color-sp-btn-bg: #f1f1f1;--color-call-list-bg: white;--space: 1rem}html.dark[data-v-e7c0fbef]{--color-main-bg: #22303f;--color-second-bg: #18222d;--color-third-bg: #31475e;--color-four-bg: #22303f;--color-item-bg: #18222d;--color-swtich-bg: #4c4d4f;--color-active: #409eff;--color-font: rgba(255, 255, 255, .5);--color-font-8: rgba(255, 255, 255, .8);--color-font-3: rgba(255, 255, 255, .3);--color-font-pure: white;--color-input-bg: #333333;--color-input-border: #6c6e72;--color-input-border-hover: #a3a6ad;--color-radio-border: #454847;--color-tooltip-bg: #31475e;--color-tooltip-shadow: #3b3b3b;--color-scrollbar: #5c5d5e;--color-line: var(--box-border-color);--color-loading-1: rgba(178, 177, 177, .2);--color-loading-2: #ffffff;--color-floor: #293b4d;--color-floor-font: rgba(255, 255, 255, .3);--color-editor-toolbar: var(--box-background-hover-color);--color-sp-btn-bg: #31475e;--color-call-list-bg: #31475e}.flex[data-v-e7c0fbef]{display:flex;align-items:center;justify-content:space-between}.flex-end[data-v-e7c0fbef]{justify-content:flex-end}.flex-center[data-v-e7c0fbef]{justify-content:center}.p1[data-v-e7c0fbef]{padding:1rem}.p2[data-v-e7c0fbef]{padding:2rem}.p0[data-v-e7c0fbef]{padding:0!important}body :is(.topic_content,.reply_content) a[href^=http][data-v-e7c0fbef]{text-underline-offset:.46ex;color:currentcolor;text-decoration:underline 1.5px}a[data-v-e7c0fbef]{text-decoration:none}.tool[data-v-e7c0fbef]{position:relative;display:flex;align-items:center;border-radius:.3rem;height:2.6rem;padding:0 .5rem;gap:.6rem}.tool>svg[data-v-e7c0fbef]{width:2.2rem!important;height:2.2rem!important}.tool.disabled[data-v-e7c0fbef]{cursor:not-allowed}.tool span[data-v-e7c0fbef]{line-height:1rem}.my-node[data-v-e7c0fbef]{border-radius:.2rem;padding:.4rem;font-size:1rem;color:#999;background:#f5f5f5}.msgs[data-v-e7c0fbef]{position:fixed;margin-left:calc(50% - 25rem);width:50rem;z-index:9999;bottom:0;left:0;right:0}.my-box[data-v-e7c0fbef]{background:var(--box-background-color);margin-bottom:.5rem;width:100%;overflow:hidden;box-sizing:border-box;transition:background-color .3s}.my-box .box-content[data-v-e7c0fbef]{padding:.5rem}.my-cell[data-v-e7c0fbef]{color:var(--color-font);height:4.2rem;padding:0 1rem;font-size:1.4rem;line-height:150%;text-align:left;border-bottom:1px solid var(--color-line)}.modal[data-v-e7c0fbef]{position:fixed;z-index:100;width:100vw;height:100vh;left:0;top:0;display:flex;justify-content:center;align-items:center}.modal .title[data-v-e7c0fbef]{font-size:2.4rem;margin-bottom:1rem;text-align:center}.modal .option[data-v-e7c0fbef]{display:flex;align-items:center;padding:.6rem 0}.modal .option>span[data-v-e7c0fbef]{position:relative}.radio-group2[data-v-e7c0fbef]{display:inline-flex;border-radius:.5rem;overflow:hidden;border:1px solid var(--color-radio-border);background:var(--box-background-alt-color)}.radio-group2 .radio[data-v-e7c0fbef]{background:transparent;padding:.5rem 1.2rem;border-left:1px solid var(--color-radio-border);font-size:1.3rem;color:var(--color-gray)}.radio-group2 .radio[data-v-e7c0fbef]:first-child{border-left:none}.radio-group2 .active[data-v-e7c0fbef]{background:var(--color-active);color:#fff}.pop-confirm[data-v-e7c0fbef]{position:relative;display:inline-flex;justify-content:center}input[data-v-e7c0fbef]{width:10rem;height:3rem;outline:unset;border:1px solid var(--color-input-border);padding:0 .5rem;border-radius:5px;box-sizing:border-box;transition:all .3s;background:var(--color-input-bg);color:var(--color-font)}input[data-v-e7c0fbef]:focus{border:1px solid var(--color-active)}.danger[data-v-e7c0fbef]{color:red!important}.topic_content[data-v-e7c0fbef],.reply_content[data-v-e7c0fbef]{font-size:1.6rem}.mask[data-v-e7c0fbef]{z-index:10;position:fixed;top:0;width:100vw;height:100vh;background:#000000bb}.mask.dark[data-v-e7c0fbef]{background:#000000bb}.mask.light[data-v-e7c0fbef]{background:transparent}.mask.lightgray[data-v-e7c0fbef]{background:rgba(0,0,0,.25)}.mask.white[data-v-e7c0fbef]{background:transparent}.slide[data-v-e7c0fbef]{flex:1;width:100vw;height:100vh;transition:height .3s;position:relative;overflow:hidden}.slide .slide-list[data-v-e7c0fbef]{height:100%;width:100%;display:flex;position:relative;transition:transform .3s}.slide .slide-list .slide-item[data-v-e7c0fbef]{height:100%;width:100%;flex-shrink:0;position:relative;overflow:auto}.page1[data-v-e7c0fbef]{overflow:hidden!important}.post-wrapper[data-v-e7c0fbef],.setting-wrapper[data-v-e7c0fbef]{position:absolute;left:0;top:0;height:100%;width:100%;background:var(--color-main-bg);overflow:auto}.setting-wrapper[data-v-e7c0fbef],.setting-wrapper2[data-v-e7c0fbef]{height:100%;overflow:hidden;background:var(--color-second-bg)}.mobile-page[data-v-e7c0fbef]{height:100%;overflow:hidden;font-size:1.8rem;display:flex;flex-direction:column}.mobile-page>.page-content[data-v-e7c0fbef]{padding:1rem;padding-top:0;box-sizing:border-box;overflow:auto}.switch[data-v-e7c0fbef]{width:4.5rem;height:2.2rem;border-radius:2rem;position:relative;display:flex;align-items:center;background:var(--color-swtich-bg);transition:all .3s}.switch.active[data-v-e7c0fbef]{background:var(--color-active)}.switch.active[data-v-e7c0fbef]:before{right:.2rem}.switch[data-v-e7c0fbef]:before{position:absolute;content:" ";transition:all .3s;right:calc(100% - 2rem);width:1.8rem;height:1.8rem;background:white;border-radius:50%}.nav-bar[data-v-fda0acaa]{box-sizing:border-box;width:100%;height:5rem;padding:0 var(--space);display:flex;align-items:center;justify-content:center;position:relative;font-size:2rem;color:var(--color-font-pure)}.nav-bar[data-v-fda0acaa] .back-icon{left:var(--space);position:absolute}.display-type[data-v-1d327f48]{height:3rem;padding:0 .3rem;background:var(--color-main-bg);border-radius:1rem;display:flex;font-size:1.4rem;align-items:center;color:#a9a9a9}.display-type .type[data-v-1d327f48]{border-radius:.8rem;padding:0 1.3rem;height:2.5rem;align-items:center;display:flex;position:relative}.display-type .type.active[data-v-1d327f48]{background:var(--color-second-bg);color:var(--color-font-pure);box-shadow:0 0 6px 0 var(--color-tooltip-shadow)}.display-type .type-list[data-v-1d327f48]{position:absolute;background:white;right:0;top:3rem;font-size:1.4rem;box-shadow:0 0 6px 0 var(--color-tooltip-shadow);border-radius:.6rem;z-index:9;color:var(--color-font)}.display-type .type-list .item[data-v-1d327f48]{word-break:keep-all;padding:.8rem 1rem}.display-type .type-list .item.active[data-v-1d327f48]{color:var(--color-font-pure)}.display-type svg[data-v-1d327f48]{width:1.5rem}.font-size[data-v-a64ba8b8]{margin-bottom:3rem;display:flex;flex-direction:column;align-items:center;justify-content:center}.font-size .steps[data-v-a64ba8b8]{width:100%;border-radius:10rpx;display:flex;justify-content:space-between;align-items:center;position:relative;z-index:2}.font-size .steps .step[data-v-a64ba8b8]{width:100%;font-size:20rpx;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:4.8rem;gap:1.5rem;color:gray}.font-size .steps .step .text[data-v-a64ba8b8]{font-size:1.4rem}.font-size .steps .step .point[data-v-a64ba8b8]{border-radius:50%;min-width:6px;min-height:6px;background:#adadad}.font-size .steps .step.active[data-v-a64ba8b8]{color:var(--color-font-pure)}.font-size .steps .step.active .point[data-v-a64ba8b8]{box-shadow:0 0 1px 1px #f1f1f1;background:white;transform:scale(3)}.font-size .line[data-v-a64ba8b8]{position:relative;z-index:1;margin-top:-4px;height:2px;width:76%;background:var(--color-font)}.row[data-v-424a2b09]{min-height:4rem;display:flex;justify-content:space-between;align-items:center;color:var(--color-font-8)}.row .wrapper[data-v-424a2b09]{height:3rem;flex:1;display:flex;justify-content:flex-end;align-items:center;gap:var(--space)}.row .main-title[data-v-424a2b09]{font-size:2.2rem;font-weight:700}.row .item-title[data-v-424a2b09]{font-size:1.8rem}.desc[data-v-424a2b09]{margin-bottom:1rem;font-size:1.4rem;text-align:left;color:var(--color-font)}.tool>svg[data-v-b7c6664e]{width:1.8rem!important;height:1.8rem!important}.more[data-v-e92e0529]{height:1.6rem;width:2.08rem;padding:1rem .8rem 1rem 0;display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end}.more div[data-v-e92e0529]{background:var(--color-floor-font);width:.3rem;height:.3rem;border-radius:50%}.Author[data-v-9041586a]{display:flex;align-items:center;justify-content:space-between;font-size:1.2rem;position:relative}.Author.expand[data-v-9041586a]{margin-bottom:0}.Author .Author-left[data-v-9041586a]{display:flex;align-items:center;width:80%;word-break:break-all}.Author .Author-left .info[data-v-9041586a]{display:flex;flex-direction:column}.Author .Author-left .username[data-v-9041586a]{font-size:1.4rem;margin-right:1rem}.Author .Author-left .expand-icon[data-v-9041586a]{margin-right:.8rem;width:2.4rem;height:2.4rem;transform:rotate(90deg)}.Author .Author-left .texts[data-v-9041586a]{flex:1}.Author .Author-left .owner[data-v-9041586a]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;margin-right:1rem;transform:scale(.8)}.Author .Author-left .dup[data-v-9041586a]{display:inline-block;background-color:transparent;color:red;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid red;font-size:1.2rem;font-weight:700;margin-right:1rem;transform:scale(.8)}.Author .Author-left .mod[data-v-9041586a]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;transform:scale(.8);background:#1484cd;color:#fff;margin-right:1rem}.Author .Author-right[data-v-9041586a]{position:absolute;right:0;display:flex;align-items:center}.loading[data-v-2697baa2]{border:2px solid;border-color:var(--color-loading-2) var(--color-loading-1) var(--color-loading-1) var(--color-loading-1);border-radius:100%;animation:circle-2697baa2 infinite 1s linear;width:2rem;height:2rem}.loading.small[data-v-2697baa2]{width:1.2rem;height:1.2rem}.loading.large[data-v-2697baa2]{width:3rem;height:3rem}@keyframes circle-2697baa2{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.base-button[data-v-04f4c89d]{border-radius:.6rem;padding:0 1.5rem;display:inline-flex;align-items:center;justify-content:center;transition:all .3s;height:3.6rem;line-height:1;position:relative}.base-button .loading[data-v-04f4c89d]{position:absolute}.base-button.disabled[data-v-04f4c89d]{opacity:.6;cursor:not-allowed;-webkit-user-select:none;user-select:none}.base-button.small[data-v-04f4c89d]{height:3rem}.base-button.small>span[data-v-04f4c89d]{font-size:1.3rem}.base-button.large[data-v-04f4c89d]{height:5rem;font-size:1.8rem;padding:0 2.2rem}.base-button.large>span[data-v-04f4c89d]{font-size:1.8rem}.base-button.primary[data-v-04f4c89d]{background:var(--color-active)}.base-button.primary>span[data-v-04f4c89d]{color:#fff}.base-button.gary[data-v-04f4c89d]{background:#4b5563}.base-button.link[data-v-04f4c89d]{border-radius:0;border-bottom:2px solid transparent}.base-button.link>span[data-v-04f4c89d]{color:var(--color-font-8)}.base-button.active[data-v-04f4c89d]{opacity:.4}.key-notice[data-v-04f4c89d]{margin-left:1rem;display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:#fff}.key-notice .key[data-v-04f4c89d]{transform:scale(.8)}.post-editor-wrapper[data-v-0612e02f]{width:100%;box-sizing:border-box;position:relative;overflow:hidden;transition:all .3s;color:var(--color-font)}.post-editor-wrapper.isFocus .post-editor[data-v-0612e02f]{border:1px solid var(--color-active)}.post-editor-wrapper .post-editor[data-v-0612e02f]{border:1px solid var(--color-line);border-radius:var(--box-border-radius);transition:border .3s;width:100%;max-width:100%;padding:.6rem 1.4rem;box-sizing:border-box;outline:none;font-family:Avenir,Helvetica,Arial,sans-serif;font-size:1.6rem;min-height:13rem;resize:none;background:var(--box-background-color);color:var(--color-font-pure)}.post-editor-wrapper .toolbar[data-v-0612e02f]{box-sizing:border-box;padding:.5rem 1rem;width:100%;position:relative;display:flex;justify-content:space-between;align-items:center}.post-editor-wrapper .toolbar .left[data-v-0612e02f]{display:flex;gap:1rem}.post-editor-wrapper .toolbar .left .upload input[data-v-0612e02f]{position:absolute;width:20px;height:20px;opacity:0}.post-editor-wrapper .toolbar span[data-v-0612e02f]{color:gray;font-size:1.3rem}.post-editor-wrapper .get-cursor[data-v-0612e02f]{border:1px solid var(--color-line);border-radius:var(--box-border-radius);transition:border .3s;width:100%;max-width:100%;padding:.6rem 1.4rem;box-sizing:border-box;outline:none;font-family:Avenir,Helvetica,Arial,sans-serif;font-size:1.6rem;min-height:13rem;resize:none;background:var(--box-background-color);color:var(--color-font-pure);position:absolute;top:0;z-index:-100}.post-editor-wrapper .emoticon-pack[data-v-0612e02f]{z-index:999999999;border-radius:1rem;padding:1rem;width:31rem;max-width:31rem;height:30rem;max-height:30rem;overflow:auto;background:var(--color-third-bg);border:1px solid var(--color-font-3);box-shadow:0 9px 24px -3px #0000000f,0 4px 8px -1px #0000001f;position:fixed;bottom:11rem;left:14rem}.post-editor-wrapper .emoticon-pack i[data-v-0612e02f]{position:absolute;right:2rem;font-size:2rem;color:#e2e2e2}.post-editor-wrapper .emoticon-pack .list[data-v-0612e02f]{margin:1rem 0}.post-editor-wrapper .emoticon-pack img[data-v-0612e02f]{width:3rem;height:3rem;padding:.5rem}.post-editor-wrapper .emoticon-pack span[data-v-0612e02f]{display:inline-block;font-size:2.3rem;padding:.5rem}.v-enter-active[data-v-f8165980],.v-leave-active[data-v-f8165980]{transition:opacity .3s ease}.v-enter-from[data-v-f8165980],.v-leave-to[data-v-f8165980]{opacity:0}.fade-in[data-v-f8165980]{animation:fade-in-f8165980 .3s}.fade-out[data-v-f8165980]{animation:fade-out-f8165980 .4s}@keyframes fade-in-f8165980{0%{opacity:0}to{opacity:1}}@keyframes fade-out-f8165980{0%{opacity:1}to{opacity:0;display:none}}.username[data-v-f8165980]{font-weight:700;font-size:1.4rem;margin-right:1rem}.link-num[data-v-f8165980]{font-size:1.4rem;color:#e02a2a}.owner[data-v-f8165980]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;margin-right:1rem;transform:scale(.8)}.mod[data-v-f8165980]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;transform:scale(.8);background:#1484cd;color:#fff;margin-right:1rem}.my-tag[data-v-f8165980]{font-size:1.4rem;color:red;margin-left:1rem}.my-tag .remove[data-v-f8165980]{margin-left:.5rem;display:none}.add-tag[data-v-f8165980]{font-size:2.4rem;transform:translateY(.2rem);line-height:1rem;display:inline-block;margin-left:1rem;position:absolute;display:none}.floor[data-v-f8165980]{font-size:1.1rem;line-height:1rem;border-radius:.5rem;display:inline-block;color:var(--color-floor-font);cursor:default;margin-right:1rem}.base-avatar[data-v-f8165980]{margin-right:1rem;display:inline-flex}.base-avatar img[data-v-f8165980]{width:2.8rem;height:2.8rem;border-radius:.4rem}html[data-v-f8165980]{font-size:10px}[data-v-f8165980]:root{--box-border-radius: 8px}#site-header[data-v-f8165980]{height:4rem}#site-header #site-header-menu #menu-body[data-v-f8165980]{top:5rem;right:1rem}#Wrapper .cell .count_livid[data-v-f8165980]{font-size:14px;font-weight:700;padding:3px 10px;border-radius:5px}a[data-v-f8165980]{-webkit-tap-highlight-color:rgba(255,255,255,0);-webkit-user-select:none;-moz-user-focus:none;-moz-user-select:none}.post-item[data-v-f8165980]{background:var(--box-background-color)}.post-item .new-item[data-v-f8165980]{display:flex;justify-content:space-between}.post-item .new-item .left .top[data-v-f8165980]{display:flex;align-items:center;line-height:1.2;gap:1rem}.post-item .new-item .left .small[data-v-f8165980],.post-item .new-item .left a.node[data-v-f8165980]{font-size:1.2rem}.post-item .new-item .left .bottom[data-v-f8165980]{margin:1rem 0 .5rem}.post-item .new-item .left .bottom .item_title[data-v-f8165980]{font-size:1.6rem}.post-item .new-item .left .bottom a[data-v-f8165980]{text-decoration:none!important}.post-item .new-item .right[data-v-f8165980]{min-width:5rem;display:flex;justify-content:flex-end;align-items:center}.post-item .new-item .right .count_livid[data-v-f8165980]{font-size:1.4rem!important;margin-right:0;padding:.3rem 1rem!important;border-radius:.5rem!important}.post-item .post-content[data-v-f8165980]{display:block;max-height:30rem;overflow:hidden;line-break:anywhere;-webkit-mask-image:linear-gradient(180deg,#000 60%,transparent);height:0;color:#000;text-decoration:none!important}.post-item .post-content blockquote[data-v-f8165980]{margin-top:.5rem}.post-item .post-content p[data-v-f8165980]:first-child{margin-top:0}.post-item .post-content[data-v-f8165980]:visited{color:var(--link-visited-color)}.post-item .show-more[data-v-f8165980]{font-size:1.3rem;text-align:right;height:3rem;align-items:center;justify-content:center;position:relative;z-index:9;display:none}.preview[data-v-f8165980]{margin-bottom:.7rem;border-radius:var(--box-border-radius)}.preview .topic-link[data-v-f8165980]:link{color:#000!important}.preview .show-all[data-v-f8165980]{max-height:unset;-webkit-mask-image:none}.preview .post-content[data-v-f8165980]{height:unset!important}.preview .show-more[data-v-f8165980]{display:flex}.preview .item_title[data-v-f8165980]{font-weight:700}.Night .post-item[data-v-f8165980]{background:#18222d!important}.Night .preview[data-v-f8165980]{border:1px solid #3b536e}.Night .preview>.post-content[data-v-f8165980]:link{color:#d1d5d9}.Night .preview>.post-content[data-v-f8165980]:visited{color:#393f4e!important}.Night .preview .topic-link[data-v-f8165980]:link{color:#c0dbff!important}[data-v-f8165980]:root{--color-main-bg: #e2e2e2;--color-second-bg: white;--color-third-bg: #e2e2e2;--color-four-bg: #e7e9eb;--color-item-bg: white;--color-swtich-bg: #dcdfe6;--color-active: #409eff;--color-font: #999;--color-font-8: rgba(0, 0, 0, .8);--color-font-3: rgba(0, 0, 0, .3);--color-font-pure: black;--color-input-bg: white;--color-input-border: #e2e2e2;--color-input-border-hover: #a3a6ad;--color-radio-border: #e2e2e2;--color-tooltip-bg: white;--color-tooltip-shadow: #bbbbbb;--color-scrollbar: #93ade3;--color-line: #e2e2e2;--color-line2: #cecece;--color-loading-1: #00000033;--color-loading-2: #000;--color-floor: #f0f0f0;--color-floor-font: #bdbdbd;--color-editor-toolbar: #f6f7f8;--color-sp-btn-bg: #f1f1f1;--color-call-list-bg: white;--space: 1rem}html.dark[data-v-f8165980]{--color-main-bg: #22303f;--color-second-bg: #18222d;--color-third-bg: #31475e;--color-four-bg: #22303f;--color-item-bg: #18222d;--color-swtich-bg: #4c4d4f;--color-active: #409eff;--color-font: rgba(255, 255, 255, .5);--color-font-8: rgba(255, 255, 255, .8);--color-font-3: rgba(255, 255, 255, .3);--color-font-pure: white;--color-input-bg: #333333;--color-input-border: #6c6e72;--color-input-border-hover: #a3a6ad;--color-radio-border: #454847;--color-tooltip-bg: #31475e;--color-tooltip-shadow: #3b3b3b;--color-scrollbar: #5c5d5e;--color-line: var(--box-border-color);--color-loading-1: rgba(178, 177, 177, .2);--color-loading-2: #ffffff;--color-floor: #293b4d;--color-floor-font: rgba(255, 255, 255, .3);--color-editor-toolbar: var(--box-background-hover-color);--color-sp-btn-bg: #31475e;--color-call-list-bg: #31475e}.flex[data-v-f8165980]{display:flex;align-items:center;justify-content:space-between}.flex-end[data-v-f8165980]{justify-content:flex-end}.flex-center[data-v-f8165980]{justify-content:center}.p1[data-v-f8165980]{padding:1rem}.p2[data-v-f8165980]{padding:2rem}.p0[data-v-f8165980]{padding:0!important}body :is(.topic_content,.reply_content) a[href^=http][data-v-f8165980]{text-underline-offset:.46ex;color:currentcolor;text-decoration:underline 1.5px}a[data-v-f8165980]{text-decoration:none}.tool[data-v-f8165980]{position:relative;display:flex;align-items:center;border-radius:.3rem;height:2.6rem;padding:0 .5rem;gap:.6rem}.tool>svg[data-v-f8165980]{width:2.2rem!important;height:2.2rem!important}.tool.disabled[data-v-f8165980]{cursor:not-allowed}.tool span[data-v-f8165980]{line-height:1rem}.my-node[data-v-f8165980]{border-radius:.2rem;padding:.4rem;font-size:1rem;color:#999;background:#f5f5f5}.msgs[data-v-f8165980]{position:fixed;margin-left:calc(50% - 25rem);width:50rem;z-index:9999;bottom:0;left:0;right:0}.my-box[data-v-f8165980]{background:var(--box-background-color);margin-bottom:.5rem;width:100%;overflow:hidden;box-sizing:border-box;transition:background-color .3s}.my-box .box-content[data-v-f8165980]{padding:.5rem}.my-cell[data-v-f8165980]{color:var(--color-font);height:4.2rem;padding:0 1rem;font-size:1.4rem;line-height:150%;text-align:left;border-bottom:1px solid var(--color-line)}.modal[data-v-f8165980]{position:fixed;z-index:100;width:100vw;height:100vh;left:0;top:0;display:flex;justify-content:center;align-items:center}.modal .title[data-v-f8165980]{font-size:2.4rem;margin-bottom:1rem;text-align:center}.modal .option[data-v-f8165980]{display:flex;align-items:center;padding:.6rem 0}.modal .option>span[data-v-f8165980]{position:relative}.radio-group2[data-v-f8165980]{display:inline-flex;border-radius:.5rem;overflow:hidden;border:1px solid var(--color-radio-border);background:var(--box-background-alt-color)}.radio-group2 .radio[data-v-f8165980]{background:transparent;padding:.5rem 1.2rem;border-left:1px solid var(--color-radio-border);font-size:1.3rem;color:var(--color-gray)}.radio-group2 .radio[data-v-f8165980]:first-child{border-left:none}.radio-group2 .active[data-v-f8165980]{background:var(--color-active);color:#fff}.pop-confirm[data-v-f8165980]{position:relative;display:inline-flex;justify-content:center}input[data-v-f8165980]{width:10rem;height:3rem;outline:unset;border:1px solid var(--color-input-border);padding:0 .5rem;border-radius:5px;box-sizing:border-box;transition:all .3s;background:var(--color-input-bg);color:var(--color-font)}input[data-v-f8165980]:focus{border:1px solid var(--color-active)}.danger[data-v-f8165980]{color:red!important}.topic_content[data-v-f8165980],.reply_content[data-v-f8165980]{font-size:1.6rem}.mask[data-v-f8165980]{z-index:10;position:fixed;top:0;width:100vw;height:100vh;background:#000000bb}.mask.dark[data-v-f8165980]{background:#000000bb}.mask.light[data-v-f8165980]{background:transparent}.mask.lightgray[data-v-f8165980]{background:rgba(0,0,0,.25)}.mask.white[data-v-f8165980]{background:transparent}.slide[data-v-f8165980]{flex:1;width:100vw;height:100vh;transition:height .3s;position:relative;overflow:hidden}.slide .slide-list[data-v-f8165980]{height:100%;width:100%;display:flex;position:relative;transition:transform .3s}.slide .slide-list .slide-item[data-v-f8165980]{height:100%;width:100%;flex-shrink:0;position:relative;overflow:auto}.page1[data-v-f8165980]{overflow:hidden!important}.post-wrapper[data-v-f8165980],.setting-wrapper[data-v-f8165980]{position:absolute;left:0;top:0;height:100%;width:100%;background:var(--color-main-bg);overflow:auto}.setting-wrapper[data-v-f8165980],.setting-wrapper2[data-v-f8165980]{height:100%;overflow:hidden;background:var(--color-second-bg)}.mobile-page[data-v-f8165980]{height:100%;overflow:hidden;font-size:1.8rem;display:flex;flex-direction:column}.mobile-page>.page-content[data-v-f8165980]{padding:1rem;padding-top:0;box-sizing:border-box;overflow:auto}.html-wrapper[data-v-f8165980]{position:relative}.html-wrapper .htmlMask[data-v-f8165980]{max-height:90rem;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,#000 80%,transparent)}.html-wrapper .expand[data-v-f8165980]{position:absolute;z-index:1;bottom:2rem;padding:.2rem 1.5rem;border-radius:2rem;border:1px solid gray;background:white;color:gray;left:50%;transform:translate(-50%)}.comment[data-v-312e9541]{width:100%;box-sizing:border-box;margin-top:.6rem}.comment.isLevelOne[data-v-312e9541]{border-bottom:1px solid var(--color-line);padding:.8rem 1rem;margin-top:0}.comment.ding[data-v-312e9541]{background:rgba(255,255,0,.3)!important}.comment .comment-content-w .more[data-v-312e9541]{text-align:center;margin:1rem 0}.comment .comment-content[data-v-312e9541]{display:flex;position:relative}.comment .comment-content .expand-line[data-v-312e9541]{margin-top:.6rem;width:1.8rem;min-width:1.8rem;position:relative}.comment .comment-content .expand-line[data-v-312e9541]:after{position:absolute;left:30%;content:" ";height:100%;width:0;border-right:1px solid var(--color-line)}.comment .comment-content .right[data-v-312e9541]{flex:1;width:calc(100% - 3rem)}.comment .comment-content .right .w[data-v-312e9541]{margin:.5rem 0}.wrong-wrapper[data-v-312e9541]{font-size:1.4rem;margin-bottom:1rem}.wrong-wrapper .del-line[data-v-312e9541]{text-decoration:line-through}.wrong-wrapper .wrong-icon[data-v-312e9541]{margin-left:.5rem}.wrong-wrapper .warning[data-v-312e9541]{border-top:1px solid #e1e1e1;border-bottom:1px solid #e1e1e1;padding:1rem 0;margin-top:1rem;font-size:1.2rem;color:red}.toolbar[data-v-6234240d]{border-top:1px solid var(--color-line);height:4rem;padding:0 1rem;display:flex;align-items:center;color:var(--color-font);font-size:1.4rem;justify-content:space-between}.toolbar .left[data-v-6234240d],.toolbar .right[data-v-6234240d]{gap:1rem;display:flex}.toolbar .right[data-v-6234240d]{gap:.6rem}.comment[data-v-0869dab5]{width:100%;box-sizing:border-box;display:flex;gap:1rem;padding:1rem;border-bottom:1px solid var(--color-line)}.comment .base-avatar[data-v-0869dab5]{display:flex;margin-right:0}.comment .base-avatar img[data-v-0869dab5]{width:2.8rem;height:2.8rem;border-radius:.3rem}.comment .comment-body[data-v-0869dab5]{flex:1;display:flex;flex-direction:column}.comment .comment-body .texts[data-v-0869dab5]{display:flex;align-items:center}.comment .comment-body .reply_content[data-v-0869dab5]{margin-top:1rem;max-width:calc(100% - 5rem)}.comment .isRight[data-v-0869dab5]{align-items:flex-end}.comment .isRight .owner[data-v-0869dab5],.comment .isRight .mod[data-v-0869dab5],.comment .isRight .username[data-v-0869dab5]{margin:0 0 0 1rem}.comment .Author-right[data-v-0869dab5]{display:flex;flex-direction:column;align-items:center}.comment .Author-right .floor[data-v-0869dab5]{margin:0;border-radius:.5rem;background-color:var(--color-floor);padding:3px 9px}.comment .Author-right .jump[data-v-0869dab5]{color:#929596;margin-top:.4rem;font-size:1.4rem}.comment .point[data-v-0869dab5]{margin:0 1rem;display:flex;gap:.5rem;align-items:center}.comment .point svg[data-v-0869dab5]{font-size:1.6rem}.FromBottomDialog[data-v-3a54f208]{z-index:11;position:fixed;width:100%;overflow-y:auto;bottom:0;box-sizing:border-box;border-radius:var(--0013fa15);transition:all .3s;background:var(--color-four-bg)}.FromBottomDialog.no-heng-gang[data-v-3a54f208]{padding-top:0}.FromBottomDialog .heng-gang[data-v-3a54f208]{border-radius:.5rem .5rem 0 0;border-radius:var(--0013fa15);z-index:3;width:100%;position:fixed;min-height:3rem;display:flex;justify-content:center;align-items:center}.FromBottomDialog .heng-gang .gang-content[data-v-3a54f208]{background:darkgray;border-radius:2px;height:.4rem;width:3rem}.FromBottomDialog .dialog-wrapper[data-v-3a54f208]{margin-top:3rem}.wrapper .options[data-v-ae322b31]{padding:1rem 2rem 3rem;display:grid;grid-template-columns:repeat(5,1fr);justify-content:space-between;gap:2rem}.wrapper .options .item[data-v-ae322b31]{display:flex;flex-direction:column;align-items:center;color:gray;font-size:1.2rem}.wrapper .options .item.disabled[data-v-ae322b31]{opacity:.5}.wrapper .options .item.disabled svg[data-v-ae322b31]{color:gray!important}.wrapper .options .item .icon-wrap[data-v-ae322b31]{margin-bottom:.5rem;width:100%;height:15vw;display:flex;justify-content:center;align-items:center;background:var(--color-second-bg);border-radius:1rem}.wrapper .options .item .icon-wrap svg[data-v-ae322b31]{font-size:3rem}.wrapper .options .black[data-v-ae322b31]{color:var(--color-font-pure)}.wrapper .cancel[data-v-ae322b31]{border-top:1px solid var(--color-tooltip-bg);display:flex;align-items:center;justify-content:center;font-size:1.6rem;height:5rem;color:#646f81}.wrapper .options[data-v-8ef13a81]{padding:1rem 2rem 3rem;display:grid;grid-template-columns:repeat(5,1fr);justify-content:space-between;gap:2rem}.wrapper .options .item[data-v-8ef13a81]{display:flex;flex-direction:column;align-items:center;color:gray;font-size:1.2rem}.wrapper .options .item.disabled[data-v-8ef13a81]{opacity:.5}.wrapper .options .item.disabled svg[data-v-8ef13a81]{color:gray!important}.wrapper .options .item.full svg[data-v-8ef13a81]{color:#e02a2a!important}.wrapper .options .item .icon-wrap[data-v-8ef13a81]{margin-bottom:.5rem;width:100%;height:15vw;display:flex;justify-content:center;align-items:center;background:var(--color-second-bg);border-radius:1rem}.wrapper .options .item .icon-wrap svg[data-v-8ef13a81]{font-size:3rem;color:#39ae55}.wrapper .cancel[data-v-8ef13a81]{border-top:1px solid var(--color-line2);display:flex;align-items:center;justify-content:center;font-size:1.6rem;height:5rem;color:#646f81}.sticky{position:sticky;bottom:-2px;z-index:2;background:var(--box-background-hover-color)!important}.sticky[stuck]{box-shadow:0 2px 20px #00000059!important}.v-enter-active[data-v-546d3b11],.v-leave-active[data-v-546d3b11]{transition:opacity .3s ease}.v-enter-from[data-v-546d3b11],.v-leave-to[data-v-546d3b11]{opacity:0}.fade-in[data-v-546d3b11]{animation:fade-in-546d3b11 .3s}.fade-out[data-v-546d3b11]{animation:fade-out-546d3b11 .4s}@keyframes fade-in-546d3b11{0%{opacity:0}to{opacity:1}}@keyframes fade-out-546d3b11{0%{opacity:1}to{opacity:0;display:none}}.username[data-v-546d3b11]{font-weight:700;font-size:1.4rem;margin-right:1rem}.link-num[data-v-546d3b11]{font-size:1.4rem;color:#e02a2a}.owner[data-v-546d3b11]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;margin-right:1rem;transform:scale(.8)}.mod[data-v-546d3b11]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;transform:scale(.8);background:#1484cd;color:#fff;margin-right:1rem}.my-tag[data-v-546d3b11]{font-size:1.4rem;color:red;margin-left:1rem}.my-tag .remove[data-v-546d3b11]{margin-left:.5rem;display:none}.add-tag[data-v-546d3b11]{font-size:2.4rem;transform:translateY(.2rem);line-height:1rem;display:inline-block;margin-left:1rem;position:absolute;display:none}.floor[data-v-546d3b11]{font-size:1.1rem;line-height:1rem;border-radius:.5rem;display:inline-block;color:var(--color-floor-font);cursor:default;margin-right:1rem}.base-avatar[data-v-546d3b11]{margin-right:1rem;display:inline-flex}.base-avatar img[data-v-546d3b11]{width:2.8rem;height:2.8rem;border-radius:.4rem}html[data-v-546d3b11]{font-size:10px}[data-v-546d3b11]:root{--box-border-radius: 8px}#site-header[data-v-546d3b11]{height:4rem}#site-header #site-header-menu #menu-body[data-v-546d3b11]{top:5rem;right:1rem}#Wrapper .cell .count_livid[data-v-546d3b11]{font-size:14px;font-weight:700;padding:3px 10px;border-radius:5px}a[data-v-546d3b11]{-webkit-tap-highlight-color:rgba(255,255,255,0);-webkit-user-select:none;-moz-user-focus:none;-moz-user-select:none}.post-item[data-v-546d3b11]{background:var(--box-background-color)}.post-item .new-item[data-v-546d3b11]{display:flex;justify-content:space-between}.post-item .new-item .left .top[data-v-546d3b11]{display:flex;align-items:center;line-height:1.2;gap:1rem}.post-item .new-item .left .small[data-v-546d3b11],.post-item .new-item .left a.node[data-v-546d3b11]{font-size:1.2rem}.post-item .new-item .left .bottom[data-v-546d3b11]{margin:1rem 0 .5rem}.post-item .new-item .left .bottom .item_title[data-v-546d3b11]{font-size:1.6rem}.post-item .new-item .left .bottom a[data-v-546d3b11]{text-decoration:none!important}.post-item .new-item .right[data-v-546d3b11]{min-width:5rem;display:flex;justify-content:flex-end;align-items:center}.post-item .new-item .right .count_livid[data-v-546d3b11]{font-size:1.4rem!important;margin-right:0;padding:.3rem 1rem!important;border-radius:.5rem!important}.post-item .post-content[data-v-546d3b11]{display:block;max-height:30rem;overflow:hidden;line-break:anywhere;-webkit-mask-image:linear-gradient(180deg,#000 60%,transparent);height:0;color:#000;text-decoration:none!important}.post-item .post-content blockquote[data-v-546d3b11]{margin-top:.5rem}.post-item .post-content p[data-v-546d3b11]:first-child{margin-top:0}.post-item .post-content[data-v-546d3b11]:visited{color:var(--link-visited-color)}.post-item .show-more[data-v-546d3b11]{font-size:1.3rem;text-align:right;height:3rem;align-items:center;justify-content:center;position:relative;z-index:9;display:none}.preview[data-v-546d3b11]{margin-bottom:.7rem;border-radius:var(--box-border-radius)}.preview .topic-link[data-v-546d3b11]:link{color:#000!important}.preview .show-all[data-v-546d3b11]{max-height:unset;-webkit-mask-image:none}.preview .post-content[data-v-546d3b11]{height:unset!important}.preview .show-more[data-v-546d3b11]{display:flex}.preview .item_title[data-v-546d3b11]{font-weight:700}.Night .post-item[data-v-546d3b11]{background:#18222d!important}.Night .preview[data-v-546d3b11]{border:1px solid #3b536e}.Night .preview>.post-content[data-v-546d3b11]:link{color:#d1d5d9}.Night .preview>.post-content[data-v-546d3b11]:visited{color:#393f4e!important}.Night .preview .topic-link[data-v-546d3b11]:link{color:#c0dbff!important}[data-v-546d3b11]:root{--color-main-bg: #e2e2e2;--color-second-bg: white;--color-third-bg: #e2e2e2;--color-four-bg: #e7e9eb;--color-item-bg: white;--color-swtich-bg: #dcdfe6;--color-active: #409eff;--color-font: #999;--color-font-8: rgba(0, 0, 0, .8);--color-font-3: rgba(0, 0, 0, .3);--color-font-pure: black;--color-input-bg: white;--color-input-border: #e2e2e2;--color-input-border-hover: #a3a6ad;--color-radio-border: #e2e2e2;--color-tooltip-bg: white;--color-tooltip-shadow: #bbbbbb;--color-scrollbar: #93ade3;--color-line: #e2e2e2;--color-line2: #cecece;--color-loading-1: #00000033;--color-loading-2: #000;--color-floor: #f0f0f0;--color-floor-font: #bdbdbd;--color-editor-toolbar: #f6f7f8;--color-sp-btn-bg: #f1f1f1;--color-call-list-bg: white;--space: 1rem}html.dark[data-v-546d3b11]{--color-main-bg: #22303f;--color-second-bg: #18222d;--color-third-bg: #31475e;--color-four-bg: #22303f;--color-item-bg: #18222d;--color-swtich-bg: #4c4d4f;--color-active: #409eff;--color-font: rgba(255, 255, 255, .5);--color-font-8: rgba(255, 255, 255, .8);--color-font-3: rgba(255, 255, 255, .3);--color-font-pure: white;--color-input-bg: #333333;--color-input-border: #6c6e72;--color-input-border-hover: #a3a6ad;--color-radio-border: #454847;--color-tooltip-bg: #31475e;--color-tooltip-shadow: #3b3b3b;--color-scrollbar: #5c5d5e;--color-line: var(--box-border-color);--color-loading-1: rgba(178, 177, 177, .2);--color-loading-2: #ffffff;--color-floor: #293b4d;--color-floor-font: rgba(255, 255, 255, .3);--color-editor-toolbar: var(--box-background-hover-color);--color-sp-btn-bg: #31475e;--color-call-list-bg: #31475e}.flex[data-v-546d3b11]{display:flex;align-items:center;justify-content:space-between}.flex-end[data-v-546d3b11]{justify-content:flex-end}.flex-center[data-v-546d3b11]{justify-content:center}.p1[data-v-546d3b11]{padding:1rem}.p2[data-v-546d3b11]{padding:2rem}.p0[data-v-546d3b11]{padding:0!important}body :is(.topic_content,.reply_content) a[href^=http][data-v-546d3b11]{text-underline-offset:.46ex;color:currentcolor;text-decoration:underline 1.5px}a[data-v-546d3b11]{text-decoration:none}.tool[data-v-546d3b11]{position:relative;display:flex;align-items:center;border-radius:.3rem;height:2.6rem;padding:0 .5rem;gap:.6rem}.tool>svg[data-v-546d3b11]{width:2.2rem!important;height:2.2rem!important}.tool.disabled[data-v-546d3b11]{cursor:not-allowed}.tool span[data-v-546d3b11]{line-height:1rem}.my-node[data-v-546d3b11]{border-radius:.2rem;padding:.4rem;font-size:1rem;color:#999;background:#f5f5f5}.msgs[data-v-546d3b11]{position:fixed;margin-left:calc(50% - 25rem);width:50rem;z-index:9999;bottom:0;left:0;right:0}.my-box[data-v-546d3b11]{background:var(--box-background-color);margin-bottom:.5rem;width:100%;overflow:hidden;box-sizing:border-box;transition:background-color .3s}.my-box .box-content[data-v-546d3b11]{padding:.5rem}.my-cell[data-v-546d3b11]{color:var(--color-font);height:4.2rem;padding:0 1rem;font-size:1.4rem;line-height:150%;text-align:left;border-bottom:1px solid var(--color-line)}.modal[data-v-546d3b11]{position:fixed;z-index:100;width:100vw;height:100vh;left:0;top:0;display:flex;justify-content:center;align-items:center}.modal .title[data-v-546d3b11]{font-size:2.4rem;margin-bottom:1rem;text-align:center}.modal .option[data-v-546d3b11]{display:flex;align-items:center;padding:.6rem 0}.modal .option>span[data-v-546d3b11]{position:relative}.radio-group2[data-v-546d3b11]{display:inline-flex;border-radius:.5rem;overflow:hidden;border:1px solid var(--color-radio-border);background:var(--box-background-alt-color)}.radio-group2 .radio[data-v-546d3b11]{background:transparent;padding:.5rem 1.2rem;border-left:1px solid var(--color-radio-border);font-size:1.3rem;color:var(--color-gray)}.radio-group2 .radio[data-v-546d3b11]:first-child{border-left:none}.radio-group2 .active[data-v-546d3b11]{background:var(--color-active);color:#fff}.pop-confirm[data-v-546d3b11]{position:relative;display:inline-flex;justify-content:center}input[data-v-546d3b11]{width:10rem;height:3rem;outline:unset;border:1px solid var(--color-input-border);padding:0 .5rem;border-radius:5px;box-sizing:border-box;transition:all .3s;background:var(--color-input-bg);color:var(--color-font)}input[data-v-546d3b11]:focus{border:1px solid var(--color-active)}.danger[data-v-546d3b11]{color:red!important}.topic_content[data-v-546d3b11],.reply_content[data-v-546d3b11]{font-size:1.6rem}.mask[data-v-546d3b11]{z-index:10;position:fixed;top:0;width:100vw;height:100vh;background:#000000bb}.mask.dark[data-v-546d3b11]{background:#000000bb}.mask.light[data-v-546d3b11]{background:transparent}.mask.lightgray[data-v-546d3b11]{background:rgba(0,0,0,.25)}.mask.white[data-v-546d3b11]{background:transparent}.slide[data-v-546d3b11]{flex:1;width:100vw;height:100vh;transition:height .3s;position:relative;overflow:hidden}.slide .slide-list[data-v-546d3b11]{height:100%;width:100%;display:flex;position:relative;transition:transform .3s}.slide .slide-list .slide-item[data-v-546d3b11]{height:100%;width:100%;flex-shrink:0;position:relative;overflow:auto}.page1[data-v-546d3b11]{overflow:hidden!important}.post-wrapper[data-v-546d3b11],.setting-wrapper[data-v-546d3b11]{position:absolute;left:0;top:0;height:100%;width:100%;background:var(--color-main-bg);overflow:auto}.setting-wrapper[data-v-546d3b11],.setting-wrapper2[data-v-546d3b11]{height:100%;overflow:hidden;background:var(--color-second-bg)}.mobile-page[data-v-546d3b11]{height:100%;overflow:hidden;font-size:1.8rem;display:flex;flex-direction:column}.mobile-page>.page-content[data-v-546d3b11]{padding:1rem;padding-top:0;box-sizing:border-box;overflow:auto}.post-detail[data-v-546d3b11]{text-align:start;background:var(--color-main-bg);font-size:1.6rem;display:flex;justify-content:center;flex-wrap:wrap;padding-bottom:10rem}.post-detail[data-v-546d3b11] .subtle{background-color:#ecfdf5e6;border-left:4px solid #a7f3d0}.post-detail.isNight[data-v-546d3b11] .subtle{background-color:#1a3332;border-left:4px solid #047857}.post-detail .nav-bar[data-v-546d3b11]{position:fixed;top:0;z-index:9;height:4.6rem;display:flex;justify-content:space-between;align-items:center;padding:1rem;margin-bottom:-1px}.post-detail .nav-bar svg[data-v-546d3b11]{width:2rem;height:2rem;color:var(--color-font)}.post-detail .nav-bar .left[data-v-546d3b11],.post-detail .nav-bar .right[data-v-546d3b11]{display:flex;align-items:center;gap:1rem}.post-detail .post-main-body .box-header[data-v-546d3b11]{padding:0 .5rem}.post-detail .post-main-body .box-header h1[data-v-546d3b11]{font-size:2.2rem;font-weight:700}.post-detail .post-main-body .box-header small[data-v-546d3b11]{display:flex;align-items:center}.post-detail .loading-wrapper[data-v-546d3b11]{height:20rem;display:flex;justify-content:center;align-items:center}.post-detail .comments-header[data-v-546d3b11]{width:100%;padding:0 1rem;box-sizing:border-box;background:var(--box-background-color)}.post-detail #no-comments-yet[data-v-546d3b11]{color:#a9a9a9;font-weight:700;text-align:center;width:100%;margin:2rem 1rem;box-sizing:border-box}.post-detail .relationReply[data-v-546d3b11]{position:fixed;width:25vw;top:6.5rem;bottom:15rem;z-index:100;transform:translate(calc(100% + 2rem));font-size:2rem;overflow:hidden}.post-detail .relationReply .my-cell[data-v-546d3b11]{background:var(--color-second-bg);border-radius:var(--box-border-radius) var(--box-border-radius) 0 0}.post-detail .relationReply .comments[data-v-546d3b11]{max-height:calc(100% - 4.2rem);overflow:auto;background:var(--color-second-bg);border-radius:0 0 var(--box-border-radius) var(--box-border-radius)}.post-detail .call-list[data-v-546d3b11]{z-index:9;position:absolute;top:12rem;border:1px solid var(--color-main-bg);background:var(--color-call-list-bg);box-shadow:0 5px 15px #0000001a;overflow:auto;max-height:30rem;border-radius:var(--box-border-radius);min-width:8rem;box-sizing:content-box}.post-detail .call-list .call-item[data-v-546d3b11]{border-top:1px solid var(--color-main-bg);height:3rem;display:flex;padding:0 1rem;align-items:center;font-size:14px;box-sizing:border-box}.post-detail .call-list .call-item .select[data-v-546d3b11],.post-detail .call-list .call-item.select[data-v-546d3b11]{background:var(--color-main-bg);text-decoration:none}.post-detail .call-list .call-item[data-v-546d3b11]:nth-child(1){border-top:1px solid transparent}.post-detail .top-reply[data-v-546d3b11]{color:var(--color-font-3);font-size:2rem;margin-right:1rem}.base64_tooltip[data-v-1988f33b]{box-shadow:0 3px 6px -4px #0000001f,0 6px 16px #00000014,0 9px 28px 8px #0000000d;background:var(--color-third-bg);min-height:2.2rem;max-width:20rem;padding:1rem;position:fixed;z-index:9998;display:flex;align-items:center;border-radius:.5rem;line-break:anywhere;font-size:1.4rem;color:var(--color-font-8)}.base64_tooltip svg[data-v-1988f33b]{margin-left:1rem;min-width:1.8rem}.base64_tooltip[data-v-1988f33b] .base-button{margin-left:1rem;margin-top:1rem}.msg[data-v-0dcc0508]{cursor:default;margin-bottom:2rem;display:flex;font-size:1.4rem;box-sizing:border-box;border-radius:var(--box-border-radius);color:var(--color-font-8);background:var(--color-tooltip-bg);box-shadow:0 0 6px 1px var(--color-tooltip-shadow)}.msg.success .left[data-v-0dcc0508]{background:var(--color-active)}.msg.warning .left[data-v-0dcc0508]{background:#c8c002}.msg.error .left[data-v-0dcc0508]{background:red}.msg .left[data-v-0dcc0508]{border-radius:var(--box-border-radius) 0 0 var(--box-border-radius);display:flex;align-items:center;background:var(--color-active)}.msg .left svg[data-v-0dcc0508]{color:#fff;font-size:2.2rem;margin:0 .6rem}.msg .right[data-v-0dcc0508]{flex:1;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center}.tag-modal .wrapper[data-v-674b86aa]{z-index:9;background:var(--color-main-bg);color:var(--color-font-8);border-radius:1.6rem;font-size:1.4rem;padding:2rem 4rem;width:25rem}.tag-modal .wrapper .title[data-v-674b86aa]{font-weight:700}.tag-modal .wrapper .btns[data-v-674b86aa]{margin-top:1.5rem;display:flex;justify-content:flex-end;align-items:center;gap:1.5rem;font-size:1.4rem}.msgs[data-v-93c4dec0]{position:fixed;margin-left:calc(50% - 40vw);width:80vw;z-index:9999;bottom:0;left:0;right:0}.tag-modal .modal-root[data-v-19a5903e]{z-index:9;background:var(--color-second-bg);color:var(--color-font-8);border-radius:1.6rem;font-size:1.4rem;width:50vw;height:70vh;display:flex;flex-direction:column}.tag-modal .modal-root .modal-header[data-v-19a5903e]{padding:2.4rem;display:flex;justify-content:space-between}.tag-modal .modal-root .modal-header .title[data-v-19a5903e]{font-size:2.6rem;font-weight:700;text-align:left;margin-bottom:0}.tag-modal .modal-root .modal-header i[data-v-19a5903e]{font-size:2.2rem}.tag-modal .modal-root .modal-body[data-v-19a5903e]{padding:2rem;padding-top:0;flex:1;overflow:auto}.tag-modal .modal-root .modal-body[data-v-19a5903e] .cell{padding:2rem}.v-enter-active,.v-leave-active{transition:opacity .3s ease}.v-enter-from,.v-leave-to{opacity:0}.fade-in{animation:fade-in .3s}.fade-out{animation:fade-out .4s}@keyframes fade-in{0%{opacity:0}to{opacity:1}}@keyframes fade-out{0%{opacity:1}to{opacity:0;display:none}}.username{font-weight:700;font-size:1.4rem;margin-right:1rem}.link-num{font-size:1.4rem;color:#e02a2a}.owner{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;margin-right:1rem;transform:scale(.8)}.mod{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;transform:scale(.8);background:#1484cd;color:#fff;margin-right:1rem}.my-tag{font-size:1.4rem;color:red;margin-left:1rem}.my-tag .remove{margin-left:.5rem;display:none}.add-tag{font-size:2.4rem;transform:translateY(.2rem);line-height:1rem;display:inline-block;margin-left:1rem;position:absolute;display:none}.floor{font-size:1.1rem;line-height:1rem;border-radius:.5rem;display:inline-block;color:var(--color-floor-font);cursor:default;margin-right:1rem}.base-avatar{margin-right:1rem;display:inline-flex}.base-avatar img{width:2.8rem;height:2.8rem;border-radius:.4rem}html{font-size:10px}:root{--box-border-radius: 8px}#site-header{height:4rem}#site-header #site-header-menu #menu-body{top:5rem;right:1rem}#Wrapper .cell .count_livid{font-size:14px;font-weight:700;padding:3px 10px;border-radius:5px}a{-webkit-tap-highlight-color:rgba(255,255,255,0);-webkit-user-select:none;-moz-user-focus:none;-moz-user-select:none}.post-item{background:var(--box-background-color)}.post-item .new-item{display:flex;justify-content:space-between}.post-item .new-item .left .top{display:flex;align-items:center;line-height:1.2;gap:1rem}.post-item .new-item .left .small,.post-item .new-item .left a.node{font-size:1.2rem}.post-item .new-item .left .bottom{margin:1rem 0 .5rem}.post-item .new-item .left .bottom .item_title{font-size:1.6rem}.post-item .new-item .left .bottom a{text-decoration:none!important}.post-item .new-item .right{min-width:5rem;display:flex;justify-content:flex-end;align-items:center}.post-item .new-item .right .count_livid{font-size:1.4rem!important;margin-right:0;padding:.3rem 1rem!important;border-radius:.5rem!important}.post-item .post-content{display:block;max-height:30rem;overflow:hidden;line-break:anywhere;-webkit-mask-image:linear-gradient(180deg,#000 60%,transparent);height:0;color:#000;text-decoration:none!important}.post-item .post-content blockquote{margin-top:.5rem}.post-item .post-content p:first-child{margin-top:0}.post-item .post-content:visited{color:var(--link-visited-color)}.post-item .show-more{font-size:1.3rem;text-align:right;height:3rem;align-items:center;justify-content:center;position:relative;z-index:9;display:none}.preview{margin-bottom:.7rem;border-radius:var(--box-border-radius)}.preview .topic-link:link{color:#000!important}.preview .show-all{max-height:unset;-webkit-mask-image:none}.preview .post-content{height:unset!important}.preview .show-more{display:flex}.preview .item_title{font-weight:700}.Night .post-item{background:#18222d!important}.Night .preview{border:1px solid #3b536e}.Night .preview>.post-content:link{color:#d1d5d9}.Night .preview>.post-content:visited{color:#393f4e!important}.Night .preview .topic-link:link{color:#c0dbff!important}:root{--color-main-bg: #e2e2e2;--color-second-bg: white;--color-third-bg: #e2e2e2;--color-four-bg: #e7e9eb;--color-item-bg: white;--color-swtich-bg: #dcdfe6;--color-active: #409eff;--color-font: #999;--color-font-8: rgba(0, 0, 0, .8);--color-font-3: rgba(0, 0, 0, .3);--color-font-pure: black;--color-input-bg: white;--color-input-border: #e2e2e2;--color-input-border-hover: #a3a6ad;--color-radio-border: #e2e2e2;--color-tooltip-bg: white;--color-tooltip-shadow: #bbbbbb;--color-scrollbar: #93ade3;--color-line: #e2e2e2;--color-line2: #cecece;--color-loading-1: #00000033;--color-loading-2: #000;--color-floor: #f0f0f0;--color-floor-font: #bdbdbd;--color-editor-toolbar: #f6f7f8;--color-sp-btn-bg: #f1f1f1;--color-call-list-bg: white;--space: 1rem}html.dark{--color-main-bg: #22303f;--color-second-bg: #18222d;--color-third-bg: #31475e;--color-four-bg: #22303f;--color-item-bg: #18222d;--color-swtich-bg: #4c4d4f;--color-active: #409eff;--color-font: rgba(255, 255, 255, .5);--color-font-8: rgba(255, 255, 255, .8);--color-font-3: rgba(255, 255, 255, .3);--color-font-pure: white;--color-input-bg: #333333;--color-input-border: #6c6e72;--color-input-border-hover: #a3a6ad;--color-radio-border: #454847;--color-tooltip-bg: #31475e;--color-tooltip-shadow: #3b3b3b;--color-scrollbar: #5c5d5e;--color-line: var(--box-border-color);--color-loading-1: rgba(178, 177, 177, .2);--color-loading-2: #ffffff;--color-floor: #293b4d;--color-floor-font: rgba(255, 255, 255, .3);--color-editor-toolbar: var(--box-background-hover-color);--color-sp-btn-bg: #31475e;--color-call-list-bg: #31475e}.flex{display:flex;align-items:center;justify-content:space-between}.flex-end{justify-content:flex-end}.flex-center{justify-content:center}.p1{padding:1rem}.p2{padding:2rem}.p0{padding:0!important}body :is(.topic_content,.reply_content) a[href^=http]{text-underline-offset:.46ex;color:currentcolor;text-decoration:underline 1.5px}a{text-decoration:none}.tool{position:relative;display:flex;align-items:center;border-radius:.3rem;height:2.6rem;padding:0 .5rem;gap:.6rem}.tool>svg{width:2.2rem!important;height:2.2rem!important}.tool.disabled{cursor:not-allowed}.tool span{line-height:1rem}.my-node{border-radius:.2rem;padding:.4rem;font-size:1rem;color:#999;background:#f5f5f5}.msgs{position:fixed;margin-left:calc(50% - 25rem);width:50rem;z-index:9999;bottom:0;left:0;right:0}.my-box{background:var(--box-background-color);margin-bottom:.5rem;width:100%;overflow:hidden;box-sizing:border-box;transition:background-color .3s}.my-box .box-content{padding:.5rem}.my-cell{color:var(--color-font);height:4.2rem;padding:0 1rem;font-size:1.4rem;line-height:150%;text-align:left;border-bottom:1px solid var(--color-line)}.modal{position:fixed;z-index:100;width:100vw;height:100vh;left:0;top:0;display:flex;justify-content:center;align-items:center}.modal .title{font-size:2.4rem;margin-bottom:1rem;text-align:center}.modal .option{display:flex;align-items:center;padding:.6rem 0}.modal .option>span{position:relative}.radio-group2{display:inline-flex;border-radius:.5rem;overflow:hidden;border:1px solid var(--color-radio-border);background:var(--box-background-alt-color)}.radio-group2 .radio{background:transparent;padding:.5rem 1.2rem;border-left:1px solid var(--color-radio-border);font-size:1.3rem;color:var(--color-gray)}.radio-group2 .radio:first-child{border-left:none}.radio-group2 .active{background:var(--color-active);color:#fff}.pop-confirm{position:relative;display:inline-flex;justify-content:center}input{width:10rem;height:3rem;outline:unset;border:1px solid var(--color-input-border);padding:0 .5rem;border-radius:5px;box-sizing:border-box;transition:all .3s;background:var(--color-input-bg);color:var(--color-font)}input:focus{border:1px solid var(--color-active)}.danger{color:red!important}.topic_content,.reply_content{font-size:1.6rem}.mask{z-index:10;position:fixed;top:0;width:100vw;height:100vh;background:#000000bb}.mask.dark{background:#000000bb}.mask.light{background:transparent}.mask.lightgray{background:rgba(0,0,0,.25)}.mask.white{background:transparent}.slide{flex:1;width:100vw;height:100vh;transition:height .3s;position:relative;overflow:hidden}.slide .slide-list{height:100%;width:100%;display:flex;position:relative;transition:transform .3s}.slide .slide-list .slide-item{height:100%;width:100%;flex-shrink:0;position:relative;overflow:auto}.page1{overflow:hidden!important}.post-wrapper,.setting-wrapper{position:absolute;left:0;top:0;height:100%;width:100%;background:var(--color-main-bg);overflow:auto}.setting-wrapper,.setting-wrapper2{height:100%;overflow:hidden;background:var(--color-second-bg)}.mobile-page{height:100%;overflow:hidden;font-size:1.8rem;display:flex;flex-direction:column}.mobile-page>.page-content{padding:1rem;padding-top:0;box-sizing:border-box;overflow:auto}.target-user-tags[data-v-cf079729]{background:var(--color-second-bg);color:var(--color-font);word-break:break-all;text-align:start;font-size:1.4rem;box-shadow:0 2px 3px #0000001a;border-bottom-left-radius:3px;border-bottom-right-radius:3px}.target-user-tags .add-tag[data-v-cf079729]{display:inline-block}.loaded[data-v-cf079729]{font-size:1.4rem;display:flex;align-items:center;gap:1rem} ');

    console.log("V2EX 移动端");
    (function() {
      if (/eruda=1/.test(location.href) || localStorage.getItem("active-eruda")) {
        let src = "//cdn.jsdelivr.net/npm/eruda@3.0.1";
        console.log(1);
        let s = document.createElement("script");
        s.src = src;
        s.onload = () => {
          let s1 = document.createElement("script");
          s1.innerText = `eruda.init();`;
          document.body.append(s1);
        };
        document.body.append(s);
      }
    })();
    run();
    let vueApp = vue.createApp(App);
    vueApp.config.unwrapInjectedRef = true;
    vueApp.mount($section);
  }

})(Vue);