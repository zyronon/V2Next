let u = ".__cf_email__"
  , f = "data-cfemail"
  , d = document.createElement("div");

function e(e) {
  console.error(e)
}

function r(e, t) {
  let r = e.substr(t, 2);
  return parseInt(r, 16)
}

function n(href, index) {
  let o = "", a = r(href, index)
  for (let i = index + 2; i < href.length; i += 2) {
    let l = r(href, i) ^ a;
    o += String.fromCharCode(l)
  }
  try {
    o = decodeURIComponent(escape(o))
  } catch (u) {
    e(u)
  }
  d.innerHTML = '<a href="' + o.replace(/"/g, "&quot;") + '"></a>'
  return d.childNodes[0].getAttribute("href") || ""
}

export function decodeEmail(body) {
  try {
    let as = body.find(u)
    as.each(function () {
      try {
        let o = this
          , a = o.parentNode
          , i = o.getAttribute(f);
        if (i) {
          let l = n(i, 0)
            , d = document.createTextNode(l);
          a.replaceChild(d, o)
        }
      } catch (h) {
        e(h)
      }
    })
  } catch (s) {
    e(s)
  }
}