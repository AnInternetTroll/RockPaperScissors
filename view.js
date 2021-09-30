var x, d, W, X, P, F, H, I, A = {
}, O = [], Y = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
function k(e, t) {
    for(var _ in t)e[_] = t[_];
    return e;
}
function R(e) {
    var t = e.parentNode;
    t && t.removeChild(e);
}
function Z(e, t, _) {
    var r, l, o, s = {
    };
    for(o in t)o == "key" ? r = t[o] : o == "ref" ? l = t[o] : s[o] = t[o];
    if (arguments.length > 2 && (s.children = arguments.length > 3 ? x.call(arguments, 2) : _), typeof e == "function" && e.defaultProps != null) for(o in e.defaultProps)s[o] === void 0 && (s[o] = e.defaultProps[o]);
    return S(e, s, r, l, null);
}
function S(e, t, _, r, l) {
    var o = {
        type: e,
        props: t,
        key: _,
        ref: r,
        __k: null,
        __: null,
        __b: 0,
        __e: null,
        __d: void 0,
        __c: null,
        __h: null,
        constructor: void 0,
        __v: l ?? ++W
    };
    return d.vnode != null && d.vnode(o), o;
}
function le() {
    return {
        current: null
    };
}
function U(e) {
    return e.children;
}
function D(e, t) {
    this.props = e, this.context = t;
}
function C(e, t) {
    if (t == null) return e.__ ? C(e.__, e.__.__k.indexOf(e) + 1) : null;
    for(var _; t < e.__k.length; t++)if ((_ = e.__k[t]) != null && _.__e != null) return _.__e;
    return typeof e.type == "function" ? C(e) : null;
}
function B(e) {
    var t, _;
    if ((e = e.__) != null && e.__c != null) {
        for(e.__e = e.__c.base = null, t = 0; t < e.__k.length; t++)if ((_ = e.__k[t]) != null && _.__e != null) {
            e.__e = e.__c.base = _.__e;
            break;
        }
        return B(e);
    }
}
function L(e) {
    (!e.__d && (e.__d = !0) && P.push(e) && !T.__r++ || H !== d.debounceRendering) && ((H = d.debounceRendering) || F)(T);
}
function T() {
    for(var e; T.__r = P.length;)e = P.sort(function(t, _) {
        return t.__v.__b - _.__v.__b;
    }), P = [], e.some(function(t) {
        var _, r, l, o, s, u;
        t.__d && (s = (o = (_ = t).__v).__e, (u = _.__P) && (r = [], (l = k({
        }, o)).__v = o.__v + 1, M(u, o, l, _.__n, u.ownerSVGElement !== void 0, o.__h != null ? [
            s
        ] : null, r, s ?? C(o), o.__h), J(r, o), o.__e != s && B(o)));
    });
}
function $(e, t, _, r, l, o, s, u, p, a) {
    var n, v, c, i, f, b, h, y = r && r.__k || O, m = y.length;
    for(_.__k = [], n = 0; n < t.length; n++)if ((i = _.__k[n] = (i = t[n]) == null || typeof i == "boolean" ? null : typeof i == "string" || typeof i == "number" || typeof i == "bigint" ? S(null, i, null, null, i) : Array.isArray(i) ? S(U, {
        children: i
    }, null, null, null) : i.__b > 0 ? S(i.type, i.props, i.key, null, i.__v) : i) != null) {
        if (i.__ = _, i.__b = _.__b + 1, (c = y[n]) === null || c && i.key == c.key && i.type === c.type) y[n] = void 0;
        else for(v = 0; v < m; v++){
            if ((c = y[v]) && i.key == c.key && i.type === c.type) {
                y[v] = void 0;
                break;
            }
            c = null;
        }
        M(e, i, c = c || A, l, o, s, u, p, a), f = i.__e, (v = i.ref) && c.ref != v && (h || (h = []), c.ref && h.push(c.ref, null, i), h.push(v, i.__c || f, i)), f != null ? (b == null && (b = f), typeof i.type == "function" && i.__k != null && i.__k === c.__k ? i.__d = p = V(i, p, e) : p = j(e, i, c, y, f, p), a || _.type !== "option" ? typeof _.type == "function" && (_.__d = p) : e.value = "") : p && c.__e == p && p.parentNode != e && (p = C(c));
    }
    for(_.__e = b, n = m; n--;)y[n] != null && (typeof _.type == "function" && y[n].__e != null && y[n].__e == _.__d && (_.__d = C(r, n + 1)), Q(y[n], y[n]));
    if (h) for(n = 0; n < h.length; n++)K(h[n], h[++n], h[++n]);
}
function V(e, t, _) {
    var r, l;
    for(r = 0; r < e.__k.length; r++)(l = e.__k[r]) && (l.__ = e, t = typeof l.type == "function" ? V(l, t, _) : j(_, l, l, e.__k, l.__e, t));
    return t;
}
function j(e, t, _, r, l, o) {
    var s, u, p;
    if (t.__d !== void 0) s = t.__d, t.__d = void 0;
    else if (_ == null || l != o || l.parentNode == null) e: if (o == null || o.parentNode !== e) e.appendChild(l), s = null;
    else {
        for(u = o, p = 0; (u = u.nextSibling) && p < r.length; p += 2)if (u == l) break e;
        e.insertBefore(l, o), s = o;
    }
    return s !== void 0 ? s : l.nextSibling;
}
function te(e, t, _, r, l) {
    var o;
    for(o in _)o === "children" || o === "key" || o in t || N(e, o, null, _[o], r);
    for(o in t)l && typeof t[o] != "function" || o === "children" || o === "key" || o === "value" || o === "checked" || _[o] === t[o] || N(e, o, t[o], _[o], r);
}
function z(e, t, _) {
    t[0] === "-" ? e.setProperty(t, _) : e[t] = _ == null ? "" : typeof _ != "number" || Y.test(t) ? _ : _ + "px";
}
function N(e, t, _, r, l) {
    var o;
    e: if (t === "style") if (typeof _ == "string") e.style.cssText = _;
    else {
        if (typeof r == "string" && (e.style.cssText = r = ""), r) for(t in r)_ && t in _ || z(e.style, t, "");
        if (_) for(t in _)r && _[t] === r[t] || z(e.style, t, _[t]);
    }
    else if (t[0] === "o" && t[1] === "n") o = t !== (t = t.replace(/Capture$/, "")), t = t.toLowerCase() in e ? t.toLowerCase().slice(2) : t.slice(2), e.l || (e.l = {
    }), e.l[t + o] = _, _ ? r || e.addEventListener(t, o ? q : G, o) : e.removeEventListener(t, o ? q : G, o);
    else if (t !== "dangerouslySetInnerHTML") {
        if (l) t = t.replace(/xlink[H:h]/, "h").replace(/sName$/, "s");
        else if (t !== "href" && t !== "list" && t !== "form" && t !== "tabIndex" && t !== "download" && t in e) try {
            e[t] = _ ?? "";
            break e;
        } catch (s) {
        }
        typeof _ == "function" || (_ != null && (_ !== !1 || t[0] === "a" && t[1] === "r") ? e.setAttribute(t, _) : e.removeAttribute(t));
    }
}
function G(e) {
    this.l[e.type + !1](d.event ? d.event(e) : e);
}
function q(e) {
    this.l[e.type + !0](d.event ? d.event(e) : e);
}
function M(e, t, _, r, l, o, s, u, p) {
    var a, n, v, c, i, f, b, h, y, m, w, g = t.type;
    if (t.constructor !== void 0) return null;
    _.__h != null && (p = _.__h, u = t.__e = _.__e, t.__h = null, o = [
        u
    ]), (a = d.__b) && a(t);
    try {
        e: if (typeof g == "function") {
            if (h = t.props, y = (a = g.contextType) && r[a.__c], m = a ? y ? y.props.value : a.__ : r, _.__c ? b = (n = t.__c = _.__c).__ = n.__E : ("prototype" in g && g.prototype.render ? t.__c = n = new g(h, m) : (t.__c = n = new D(h, m), n.constructor = g, n.render = ne), y && y.sub(n), n.props = h, n.state || (n.state = {
            }), n.context = m, n.__n = r, v = n.__d = !0, n.__h = []), n.__s == null && (n.__s = n.state), g.getDerivedStateFromProps != null && (n.__s == n.state && (n.__s = k({
            }, n.__s)), k(n.__s, g.getDerivedStateFromProps(h, n.__s))), c = n.props, i = n.state, v) g.getDerivedStateFromProps == null && n.componentWillMount != null && n.componentWillMount(), n.componentDidMount != null && n.__h.push(n.componentDidMount);
            else {
                if (g.getDerivedStateFromProps == null && h !== c && n.componentWillReceiveProps != null && n.componentWillReceiveProps(h, m), !n.__e && n.shouldComponentUpdate != null && n.shouldComponentUpdate(h, n.__s, m) === !1 || t.__v === _.__v) {
                    n.props = h, n.state = n.__s, t.__v !== _.__v && (n.__d = !1), n.__v = t, t.__e = _.__e, t.__k = _.__k, t.__k.forEach(function(E) {
                        E && (E.__ = t);
                    }), n.__h.length && s.push(n);
                    break e;
                }
                n.componentWillUpdate != null && n.componentWillUpdate(h, n.__s, m), n.componentDidUpdate != null && n.__h.push(function() {
                    n.componentDidUpdate(c, i, f);
                });
            }
            n.context = m, n.props = h, n.state = n.__s, (a = d.__r) && a(t), n.__d = !1, n.__v = t, n.__P = e, a = n.render(n.props, n.state, n.context), n.state = n.__s, n.getChildContext != null && (r = k(k({
            }, r), n.getChildContext())), v || n.getSnapshotBeforeUpdate == null || (f = n.getSnapshotBeforeUpdate(c, i)), w = a != null && a.type === U && a.key == null ? a.props.children : a, $(e, Array.isArray(w) ? w : [
                w
            ], t, _, r, l, o, s, u, p), n.base = t.__e, t.__h = null, n.__h.length && s.push(n), b && (n.__E = n.__ = null), n.__e = !1;
        } else o == null && t.__v === _.__v ? (t.__k = _.__k, t.__e = _.__e) : t.__e = _e(_.__e, t, _, r, l, o, s, p);
        (a = d.diffed) && a(t);
    } catch (E) {
        t.__v = null, (p || o != null) && (t.__e = u, t.__h = !!p, o[o.indexOf(u)] = null), d.__e(E, t, _);
    }
}
function J(e, t) {
    d.__c && d.__c(t, e), e.some(function(_) {
        try {
            e = _.__h, _.__h = [], e.some(function(r) {
                r.call(_);
            });
        } catch (r) {
            d.__e(r, _.__v);
        }
    });
}
function _e(e, t, _, r, l, o, s, u) {
    var p, a, n, v = _.props, c = t.props, i = t.type, f = 0;
    if (i === "svg" && (l = !0), o != null) {
        for(; f < o.length; f++)if ((p = o[f]) && (p === e || (i ? p.localName == i : p.nodeType == 3))) {
            e = p, o[f] = null;
            break;
        }
    }
    if (e == null) {
        if (i === null) return document.createTextNode(c);
        e = l ? document.createElementNS("http://www.w3.org/2000/svg", i) : document.createElement(i, c.is && c), o = null, u = !1;
    }
    if (i === null) v === c || u && e.data === c || (e.data = c);
    else {
        if (o = o && x.call(e.childNodes), a = (v = _.props || A).dangerouslySetInnerHTML, n = c.dangerouslySetInnerHTML, !u) {
            if (o != null) for(v = {
            }, f = 0; f < e.attributes.length; f++)v[e.attributes[f].name] = e.attributes[f].value;
            (n || a) && (n && (a && n.__html == a.__html || n.__html === e.innerHTML) || (e.innerHTML = n && n.__html || ""));
        }
        if (te(e, c, v, l, u), n) t.__k = [];
        else if (f = t.props.children, $(e, Array.isArray(f) ? f : [
            f
        ], t, _, r, l && i !== "foreignObject", o, s, o ? o[0] : _.__k && C(_, 0), u), o != null) for(f = o.length; f--;)o[f] != null && R(o[f]);
        u || ("value" in c && (f = c.value) !== void 0 && (f !== e.value || i === "progress" && !f) && N(e, "value", f, v.value, !1), "checked" in c && (f = c.checked) !== void 0 && f !== e.checked && N(e, "checked", f, v.checked, !1));
    }
    return e;
}
function K(e, t, _) {
    try {
        typeof e == "function" ? e(t) : e.current = t;
    } catch (r) {
        d.__e(r, _);
    }
}
function Q(e, t, _) {
    var r, l;
    if (d.unmount && d.unmount(e), (r = e.ref) && (r.current && r.current !== e.__e || K(r, null, t)), (r = e.__c) != null) {
        if (r.componentWillUnmount) try {
            r.componentWillUnmount();
        } catch (o) {
            d.__e(o, t);
        }
        r.base = r.__P = null;
    }
    if (r = e.__k) for(l = 0; l < r.length; l++)r[l] && Q(r[l], t, typeof e.type != "function");
    _ || e.__e == null || R(e.__e), e.__e = e.__d = void 0;
}
function ne(e, t, _) {
    return this.constructor(e, _);
}
function oe(e, t, _) {
    var r, l, o;
    d.__ && d.__(e, t), l = (r = typeof _ == "function") ? null : _ && _.__k || t.__k, o = [], M(t, e = (!r && _ || t).__k = Z(U, null, [
        e
    ]), l || A, A, t.ownerSVGElement !== void 0, !r && _ ? [
        _
    ] : l ? null : t.firstChild ? x.call(t.childNodes) : null, o, !r && _ ? _ : l ? l.__e : t.firstChild, r), J(o, e);
}
x = O.slice, d = {
    __e: function(e, t) {
        for(var _, r, l; t = t.__;)if ((_ = t.__c) && !_.__) try {
            if ((r = _.constructor) && r.getDerivedStateFromError != null && (_.setState(r.getDerivedStateFromError(e)), l = _.__d), _.componentDidCatch != null && (_.componentDidCatch(e), l = _.__d), l) return _.__E = _;
        } catch (o) {
            e = o;
        }
        throw e;
    }
}, W = 0, X = function(e) {
    return e != null && e.constructor === void 0;
}, D.prototype.setState = function(e, t) {
    var _;
    _ = this.__s != null && this.__s !== this.state ? this.__s : this.__s = k({
    }, this.state), typeof e == "function" && (e = e(k({
    }, _), this.props)), e && k(_, e), e != null && this.__v && (t && this.__h.push(t), L(this));
}, D.prototype.forceUpdate = function(e) {
    this.__v && (this.__e = !0, e && this.__h.push(e), L(this));
}, D.prototype.render = U, P = [], F = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, T.__r = 0, I = 0;
var c, r, l, i = 0, h = [], H1 = d.__b, p = d.__r, d1 = d.diffed, y = d.__c, E = d.unmount;
function a(_, n) {
    d.__h && d.__h(r, _, i || n), i = 0;
    var t = r.__H || (r.__H = {
        __: [],
        __h: []
    });
    return _ >= t.__.length && t.__.push({
    }), t.__[_];
}
function F1(_) {
    return i = 1, q1(A1, _);
}
function q1(_, n, t) {
    var u = a(c++, 2);
    return u.t = _, u.__c || (u.__ = [
        t ? t(n) : A1(void 0, n),
        function(o) {
            var f = u.t(u.__[0], o);
            u.__[0] !== f && (u.__ = [
                f,
                u.__[1]
            ], u.__c.setState({
            }));
        }
    ], u.__c = r), u.__;
}
function T1(_, n) {
    var t = a(c++, 3);
    !d.__s && v(t.__H, n) && (t.__ = _, t.__H = n, r.__H.__h.push(t));
}
function x1() {
    h.forEach(function(_) {
        if (_.__P) try {
            _.__H.__h.forEach(s), _.__H.__h.forEach(m), _.__H.__h = [];
        } catch (n) {
            _.__H.__h = [], d.__e(n, _.__v);
        }
    }), h = [];
}
d.__b = function(_) {
    r = null, H1 && H1(_);
}, d.__r = function(_) {
    p && p(_), c = 0;
    var n = (r = _.__c).__H;
    n && (n.__h.forEach(s), n.__h.forEach(m), n.__h = []);
}, d.diffed = function(_) {
    d1 && d1(_);
    var n = _.__c;
    n && n.__H && n.__H.__h.length && (h.push(n) !== 1 && l === d.requestAnimationFrame || ((l = d.requestAnimationFrame) || function(t) {
        var u, o = function() {
            clearTimeout(f), g && cancelAnimationFrame(u), setTimeout(t);
        }, f = setTimeout(o, 100);
        g && (u = requestAnimationFrame(o));
    })(x1)), r = void 0;
}, d.__c = function(_, n) {
    n.some(function(t) {
        try {
            t.__h.forEach(s), t.__h = t.__h.filter(function(u) {
                return !u.__ || m(u);
            });
        } catch (u) {
            n.some(function(o) {
                o.__h && (o.__h = []);
            }), n = [], d.__e(u, t.__v);
        }
    }), y && y(_, n);
}, d.unmount = function(_) {
    E && E(_);
    var n = _.__c;
    if (n && n.__H) try {
        n.__H.__.forEach(s);
    } catch (t) {
        d.__e(t, n.__v);
    }
};
var g = typeof requestAnimationFrame == "function";
function s(_) {
    var n = r;
    typeof _.__c == "function" && _.__c(), r = n;
}
function m(_) {
    var n = r;
    _.__c = _.__(), r = n;
}
function v(_, n) {
    return !_ || _.length !== n.length || n.some(function(t, u) {
        return t !== _[u];
    });
}
function A1(_, n) {
    return typeof n == "function" ? n(_) : n;
}
class Item {
    weakness;
    name;
    picture;
    constructor(weakness1, metadata){
        this.weakness = weakness1;
        this.name = metadata.name;
        this.picture = metadata.picture;
    }
}
const importMeta = {
    url: "file:///home/luca/OneDrive/Skole/Programmering/RockPaperScissors/src/Game.ts",
    main: false
};
class Game {
    tries;
    triesLimit;
    items;
    time;
    constructor({ tries: tries1 = 3 , time: time1 = 3 , items: items1 = [
        new Item([
            "paper"
        ], {
            name: "rock",
            picture: "./assets/rock.svg"
        }),
        new Item([
            "scissors"
        ], {
            name: "paper",
            picture: "./assets/paper.svg"
        }),
        new Item([
            "rock"
        ], {
            name: "scissors",
            picture: "./assets/scissors.svg"
        }), 
    ]  } = {
    }){
        this.tries = tries1;
        this.triesLimit = Math.floor(tries1 / 2) + 1;
        this.time = time1;
        this.items = items1;
    }
    get rules() {
        return {
            tries: this.tries,
            items: this.items.map((item)=>({
                    name: item.name,
                    weakness: item.weakness,
                    picture: item.picture
                })
            )
        };
    }
    static compare(item1, item2) {
        for(let i = 0; i < item1.weakness.length; i++){
            for(let ii = 0; ii < item2.weakness.length; ii++){
                if (item1.weakness[i] === item2.weakness[ii]) return "draw";
                else if (item2.weakness[i] === item1.name) return "win";
                else if (item1.weakness[i] === item2.name) return "lose";
                else return "draw";
            }
        }
        return "draw";
    }
    bot_attempt() {
        return this.items[Math.round(Math.random() * (this.items.length - 1))];
    }
}
class Offline extends Game {
    offline_round() {
        const res = prompt(`Pick one of: ${this.items.map((item)=>item.name.trim().toLowerCase()
        ).join(", ")}:`);
        const item1 = this.items.find((item)=>item.name.trim().toLowerCase() === res
        );
        if (!item1) throw new Error(`${res} not found. Please try again`);
        const item2 = this.bot_attempt();
        return Game.compare(item1, item2);
    }
    offline() {
        let triesLeft = this.tries;
        const results = [];
        for(let i = 0; i < triesLeft; i++){
            if (results.filter((res)=>res
            ).length >= this.triesLimit || results.filter((res)=>!res
            ).length >= this.triesLimit) {
                break;
            }
            const result = this.offline_round();
            switch(result){
                case "draw":
                    {
                        console.log("Draw, try again");
                        triesLeft++;
                        continue;
                    }
                case "lose":
                    {
                        console.log("You lost this round.");
                        results.push(false);
                        continue;
                    }
                case "win":
                    {
                        console.log("You won this round.");
                        results.push(true);
                        continue;
                    }
            }
        }
        console.log(results);
    }
}
if (importMeta.main) {
    const game = new Offline();
    game.offline();
}
function PlayerView({ player , game  } = {
    player: {
        bot: true,
        playerPos: 1
    },
    game: new Game()
}) {
    if (!player.bot) {
        return Z(U, null, game.items.map((item, index)=>Z(U, null, Z("img", {
                src: item.picture,
                onClick: ()=>player.setItem(item)
                ,
                class: `item player${player.playerPos} playable`,
                style: {
                    height: `${100 / (game.items.length + 2)}vh`,
                    visibility: player.item ? player.item.name === item.name ? "visible" : "hidden" : "visible",
                    gridColumn: player.playerPos === 2 ? 3 : player.playerPos,
                    gridRow: index + 1
                }
            }), Z("br", null))
        ));
    } else {
        const [botItemPreviewRandomlyInterval, setBotItemPreviewRandomlyInterval] = F1();
        const [botPreview, setBotPreview] = F1();
        T1(()=>{
            if (!player.item) setBotItemPreviewRandomlyInterval(undefined);
            setBotPreview(undefined);
        }, [
            setBotItemPreviewRandomlyInterval,
            setBotPreview,
            player.item
        ]);
        T1(()=>{
            if (!player.item && !botItemPreviewRandomlyInterval) {
                let index = game.items.length - 1;
                setBotItemPreviewRandomlyInterval(setInterval(()=>{
                    setBotPreview(game.items[index]);
                    index = index === 0 ? game.items.length - 1 : index - 1;
                }, 500));
            }
        }, [
            player.item,
            setBotItemPreviewRandomlyInterval,
            setBotPreview,
            game.items,
            setInterval,
            botItemPreviewRandomlyInterval, 
        ]);
        T1(()=>{
            if (player.item) {
                clearInterval(botItemPreviewRandomlyInterval);
                setBotPreview(player.item);
            }
        }, [
            player.item,
            clearInterval,
            botItemPreviewRandomlyInterval,
            setBotPreview, 
        ]);
        return Z("img", {
            src: botPreview?.picture,
            class: `item player${player.playerPos}`,
            style: {
                height: `${100 / (game.items.length + 2)}vh`
            }
        });
    }
}
function GameView({ player1 , player2 , game  }) {
    const [result, setResult] = F1("");
    const [results, setResults] = F1([]);
    const failSoundRef = le();
    const [timerPreview, setTimerPreview] = F1(game.time);
    const [timerPreviewInterval, setTimerPreviewInterval] = F1();
    function stopOrReset() {
        console.log(results);
        if (results.filter((res)=>res
        ).length >= game.triesLimit || results.filter((res)=>!res
        ).length >= game.triesLimit) {
            stop();
        } else reset();
    }
    function reset() {
        setTimerPreview(game.time);
        clearInterval(timerPreviewInterval);
        setTimerPreviewInterval(undefined);
        if (!player1.bot) player1.setItem(undefined);
        if (!player2.bot) player2.setItem(undefined);
    }
    function stop() {
        clearInterval(timerPreviewInterval);
        setTimerPreview(undefined);
        setResult("End game");
    }
    function restart() {
        setResult("");
        setResults([]);
        reset();
    }
    T1(()=>stopOrReset()
    , [
        results, 
    ]);
    if (game.time) {
        T1(()=>{
            if (player1.item && player2.item) {
                if (!player1.bot && timerPreview && timerPreview !== 1) {
                    setResult("Too early");
                    failSoundRef.current?.play();
                    clearInterval(timerPreviewInterval);
                    setResults([
                        ...results,
                        false
                    ]);
                } else if (!timerPreview) {
                    return;
                } else {
                    clearInterval(timerPreviewInterval);
                    const res = Game.compare(player1.item, player2.item);
                    setResult(res);
                    if (res === "draw") return reset();
                    if (res === "lose") failSoundRef.current?.play();
                    setResults([
                        ...results,
                        res === "win"
                    ]);
                }
            }
        }, [
            player1.item,
            player2.item,
            setResult,
            Game.compare,
            clearInterval,
            timerPreviewInterval, 
        ]);
        T1(()=>{
            if (!timerPreview || timerPreviewInterval) return;
            let timerPreviewTemp = timerPreview;
            setTimerPreviewInterval(setInterval(()=>{
                if (timerPreviewTemp !== -1) {
                    setTimerPreview(timerPreviewTemp--);
                }
            }, 1000));
            if (timerPreviewTemp === timerPreview) timerPreviewTemp--;
        }, [
            setTimerPreviewInterval,
            setInterval,
            setTimerPreview,
            timerPreview
        ]);
        T1(()=>{
            if (!timerPreview && timerPreviewInterval) {
                clearInterval(timerPreviewInterval);
                setResult("Too late");
                failSoundRef.current?.play();
                setResults([
                    ...results,
                    false
                ]);
            }
        }, [
            timerPreview,
            clearInterval,
            timerPreviewInterval,
            setResult
        ]);
    } else {
        T1(()=>{
            if (player1.item && player2.item) {
                const res = Game.compare(player1.item, player2.item);
                if (res === "draw") return reset();
                setResult(res);
                if (res === "lose") failSoundRef.current?.play();
                setResults([
                    ...results,
                    res === "win"
                ]);
            }
        }, [
            player1.item,
            player2.item,
            setResult,
            Game.compare
        ]);
    }
    return Z(U, null, Z("button", {
        onClick: restart
    }, "Restart"), Z("audio", {
        ref: failSoundRef
    }, Z("source", {
        src: "/assets/fail.mp3",
        type: "audio/mp3"
    })), Z("div", {
        class: "gameview"
    }, Z(PlayerView, {
        player: player1,
        game: game
    }), game.time ? Z("p", {
        class: "timer",
        style: {
            color: timerPreview !== 1 ? "red" : "green"
        }
    }, timerPreview) : "", Z("p", {
        class: "result"
    }, result), Z("p", {
        class: "results"
    }, results.map((result)=>result ? "x" : "o"
    )), Z(PlayerView, {
        player: player2,
        game: game
    })));
}
function Offline1() {
    const game = new Game({
        time: 3
    });
    const [userChoice, setUserChoice] = F1();
    const [botChoice, setBotChoice] = F1();
    T1(()=>{
        if (userChoice) setBotChoice(game.bot_attempt());
        else setBotChoice(undefined);
    }, [
        userChoice,
        setUserChoice,
        game.bot_attempt, 
    ]);
    return Z("div", {
        class: "offline"
    }, Z(GameView, {
        game: game,
        player1: {
            setItem: setUserChoice,
            bot: false,
            item: userChoice,
            playerPos: 1
        },
        player2: {
            bot: true,
            item: botChoice,
            playerPos: 2
        }
    }));
}
function Online() {
    const [lookForPlayer, setLookForPlayer] = F1(false);
    const [against, setAgainst] = F1("");
    const [username, setUsername] = F1("");
    const [player1Item, setPlayer1Item] = F1();
    const [player2Item, setPlayer2Item] = F1();
    const [game, setGame] = F1();
    const [ws, setWs] = F1();
    function connect() {
        if (!ws) return;
        ws.onopen = (e)=>{
            if (lookForPlayer) {
                ws.send(JSON.stringify({
                    op: 2,
                    d: {
                        against,
                        name: username
                    }
                }));
            } else {
                ws.send(JSON.stringify({
                    op: 2,
                    d: {
                        name: username
                    }
                }));
            }
        };
        ws.onmessage = (e)=>{
            const data = JSON.parse(e.data);
            console.log(e.data);
            switch(data.op){
                case 2:
                    {
                        if (data.d.status === "ready") {
                            setGame(new Game({
                                items: data.d.rules.items.map((item)=>new Item(item.weakness, {
                                        name: item.name,
                                        picture: item.picture
                                    })
                                ),
                                tries: data.d.rules.tries,
                                time: null
                            }));
                            setPlayer1Item(undefined);
                            setPlayer2Item(undefined);
                        }
                        break;
                    }
                case 3:
                    {
                        setPlayer2Item(game?.items.find((item)=>item.name === data.d
                        ));
                        break;
                    }
            }
        };
    }
    T1(()=>connect()
    , [
        ws,
        connect
    ]);
    T1(()=>ws && player1Item && ws.send(JSON.stringify({
            op: 3,
            d: player1Item.name
        }))
    , [
        ws,
        player1Item,
        JSON.stringify
    ]);
    return Z(U, null, Z("label", null, "What's your username?"), Z("input", {
        type: "text",
        name: "username",
        placeholder: "Steve",
        required: true,
        onChange: (e)=>setUsername(e.target.value)
    }), " ", Z("label", null, "Want to join a friend?"), Z("label", {
        class: "switch"
    }, Z("input", {
        type: "checkbox",
        onChange: (e)=>setLookForPlayer(e.target.checked)
    }), Z("span", {
        class: "slider round"
    })), lookForPlayer ? Z(U, null, Z("label", null, "Who are you looking for?"), Z("input", {
        type: "text",
        placeholder: "Alex",
        onChange: (e)=>setAgainst(e.target.value)
    })) : "", Z("button", {
        onClick: ()=>setWs(new WebSocket(`ws://${location.host}`))
    }, "Connect"), game ? Z(GameView, {
        player1: {
            username,
            bot: false,
            playerPos: 1,
            setItem: setPlayer1Item,
            item: player1Item
        },
        player2: {
            username,
            bot: true,
            playerPos: 2,
            item: player2Item
        },
        game: game
    }) : "");
}
function SplitScreen() {
    const game = new Game();
    const [player1Choice, setPlayer1Choice] = F1();
    const [player2Choice, setPlayer2Choice] = F1();
    return Z("div", {
        class: "splitscreen"
    }, Z(GameView, {
        game: game,
        player1: {
            setItem: setPlayer1Choice,
            bot: false,
            item: player1Choice,
            playerPos: 1
        },
        player2: {
            bot: false,
            item: player2Choice,
            setItem: setPlayer2Choice,
            playerPos: 2
        }
    }));
}
function Main() {
    const [gamemode, setGamemode] = F1(null);
    const [title, setTitle] = F1("Chose a gamemode");
    const [onlineAvailable, setOnlineAvailable] = F1(false);
    T1(()=>{
        try {
            const ws = new WebSocket(`ws://${location.host}`);
            ws.onmessage = (e)=>{
                const data = JSON.parse(e.data);
                if (data.op === 1 && data.d === "ping") setOnlineAvailable(true);
                ws.close();
            };
            ws.onopen = ()=>ws.send(JSON.stringify({
                    op: 1,
                    d: "ping"
                }))
            ;
        } catch (err) {
            setOnlineAvailable(false);
        }
    }, [
        setOnlineAvailable
    ]);
    return Z(U, null, Z("h1", null, title), Z("div", {
        class: "btn-group"
    }, Z("button", {
        onClick: ()=>{
            setGamemode("offline");
            setTitle("Vs. Bot");
        },
        class: gamemode === "offline" ? "active" : ""
    }, "Offline"), onlineAvailable ? Z("button", {
        onClick: ()=>{
            setGamemode("online");
            setTitle("Vs. Human");
        },
        class: gamemode === "online" ? "active" : ""
    }, "Online") : "", Z("button", {
        onClick: ()=>{
            setGamemode("split");
            setTitle("Split");
        },
        class: gamemode === "split" ? "active" : ""
    }, "SplitScreen")), Z("hr", null), gamemode === "offline" ? Z(Offline1, null) : gamemode === "online" ? Z(Online, null) : gamemode === "split" ? Z(SplitScreen, null) : Z(U, null, Z("p", null, "Welcome to Rock, Paper, Scissors")));
}
const bodyEl = document.querySelector("body");
if (bodyEl) oe(Z(Main, null), bodyEl);
