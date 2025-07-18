const v = "year", k = "month", M = "day", D = "hour", Y = "minute", L = "second", S = "millisecond", d = {
  parse_duration(n) {
    const e = /([0-9]+)(y|m|d|h|min|s|ms)/gm.exec(n);
    if (e !== null) {
      if (e[2] === "y")
        return { duration: parseInt(e[1]), scale: "year" };
      if (e[2] === "m")
        return { duration: parseInt(e[1]), scale: "month" };
      if (e[2] === "d")
        return { duration: parseInt(e[1]), scale: "day" };
      if (e[2] === "h")
        return { duration: parseInt(e[1]), scale: "hour" };
      if (e[2] === "min")
        return { duration: parseInt(e[1]), scale: "minute" };
      if (e[2] === "s")
        return { duration: parseInt(e[1]), scale: "second" };
      if (e[2] === "ms")
        return { duration: parseInt(e[1]), scale: "millisecond" };
    }
  },
  parse(n, t = "-", e = /[.:]/) {
    if (n instanceof Date)
      return n;
    if (typeof n == "string") {
      let i, s;
      const r = n.split(" ");
      i = r[0].split(t).map((o) => parseInt(o, 10)), s = r[1] && r[1].split(e), i[1] = i[1] ? i[1] - 1 : 0;
      let a = i;
      return s && s.length && (s.length === 4 && (s[3] = "0." + s[3], s[3] = parseFloat(s[3]) * 1e3), a = a.concat(s)), new Date(...a);
    }
  },
  to_string(n, t = !1) {
    if (!(n instanceof Date))
      throw new TypeError("Invalid argument type");
    const e = this.get_date_values(n).map((r, a) => (a === 1 && (r = r + 1), a === 6 ? x(r + "", 3, "0") : x(r + "", 2, "0"))), i = `${e[0]}-${e[1]}-${e[2]}`, s = `${e[3]}:${e[4]}:${e[5]}.${e[6]}`;
    return i + (t ? " " + s : "");
  },
  format(n, t = "YYYY-MM-DD HH:mm:ss.SSS", e = "en") {
    const i = new Intl.DateTimeFormat(e, {
      month: "long"
    }), s = new Intl.DateTimeFormat(e, {
      month: "short"
    }), r = i.format(n), a = r.charAt(0).toUpperCase() + r.slice(1), o = this.get_date_values(n).map((g) => x(g, 2, 0)), h = {
      YYYY: o[0],
      MM: x(+o[1] + 1, 2, 0),
      DD: o[2],
      HH: o[3],
      mm: o[4],
      ss: o[5],
      SSS: o[6],
      D: o[2],
      MMMM: a,
      MMM: s.format(n)
    };
    let l = t;
    const _ = [];
    return Object.keys(h).sort((g, c) => c.length - g.length).forEach((g) => {
      l.includes(g) && (l = l.replaceAll(g, `$${_.length}`), _.push(h[g]));
    }), _.forEach((g, c) => {
      l = l.replaceAll(`$${c}`, g);
    }), l;
  },
  diff(n, t, e = "day") {
    let i, s, r, a, o, h, l;
    i = n - t + (t.getTimezoneOffset() - n.getTimezoneOffset()) * 6e4, s = i / 1e3, a = s / 60, r = a / 60, o = r / 24;
    let _ = n.getFullYear() - t.getFullYear(), g = n.getMonth() - t.getMonth();
    return g += o % 30 / 30, h = _ * 12 + g, n.getDate() < t.getDate() && h--, l = h / 12, e.endsWith("s") || (e += "s"), Math.round(
      {
        milliseconds: i,
        seconds: s,
        minutes: a,
        hours: r,
        days: o,
        months: h,
        years: l
      }[e] * 100
    ) / 100;
  },
  today() {
    const n = this.get_date_values(/* @__PURE__ */ new Date()).slice(0, 3);
    return new Date(...n);
  },
  now() {
    return /* @__PURE__ */ new Date();
  },
  add(n, t, e) {
    t = parseInt(t, 10);
    const i = [
      n.getFullYear() + (e === v ? t : 0),
      n.getMonth() + (e === k ? t : 0),
      n.getDate() + (e === M ? t : 0),
      n.getHours() + (e === D ? t : 0),
      n.getMinutes() + (e === Y ? t : 0),
      n.getSeconds() + (e === L ? t : 0),
      n.getMilliseconds() + (e === S ? t : 0)
    ];
    return new Date(...i);
  },
  start_of(n, t) {
    const e = {
      [v]: 6,
      [k]: 5,
      [M]: 4,
      [D]: 3,
      [Y]: 2,
      [L]: 1,
      [S]: 0
    };
    function i(r) {
      const a = e[t];
      return e[r] <= a;
    }
    const s = [
      n.getFullYear(),
      i(v) ? 0 : n.getMonth(),
      i(k) ? 1 : n.getDate(),
      i(M) ? 0 : n.getHours(),
      i(D) ? 0 : n.getMinutes(),
      i(Y) ? 0 : n.getSeconds(),
      i(L) ? 0 : n.getMilliseconds()
    ];
    return new Date(...s);
  },
  clone(n) {
    return new Date(...this.get_date_values(n));
  },
  get_date_values(n) {
    return [
      n.getFullYear(),
      n.getMonth(),
      n.getDate(),
      n.getHours(),
      n.getMinutes(),
      n.getSeconds(),
      n.getMilliseconds()
    ];
  },
  convert_scales(n, t) {
    const e = {
      millisecond: 11574074074074074e-24,
      second: 11574074074074073e-21,
      minute: 6944444444444445e-19,
      hour: 0.041666666666666664,
      day: 1,
      month: 30,
      year: 365
    }, { duration: i, scale: s } = this.parse_duration(n);
    return i * e[s] / e[t];
  },
  get_days_in_month(n) {
    const t = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], e = n.getMonth();
    if (e !== 1)
      return t[e];
    const i = n.getFullYear();
    return i % 4 === 0 && i % 100 != 0 || i % 400 === 0 ? 29 : 28;
  },
  get_days_in_year(n) {
    return n.getFullYear() % 4 ? 365 : 366;
  }
};
function x(n, t, e) {
  return n = n + "", t = t >> 0, e = String(typeof e < "u" ? e : " "), n.length > t ? String(n) : (t = t - n.length, t > e.length && (e += e.repeat(t / e.length)), e.slice(0, t) + String(n));
}
function p(n, t) {
  return typeof n == "string" ? (t || document).querySelector(n) : n || null;
}
function f(n, t) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (let i in t)
    i === "append_to" ? t.append_to.appendChild(e) : i === "innerHTML" ? e.innerHTML = t.innerHTML : i === "clipPath" ? e.setAttribute("clip-path", "url(#" + t[i] + ")") : e.setAttribute(i, t[i]);
  return e;
}
function T(n, t, e, i) {
  const s = W(n, t, e, i);
  if (s === n) {
    const r = document.createEvent("HTMLEvents");
    r.initEvent("click", !0, !0), r.eventName = "click", s.dispatchEvent(r);
  }
}
function W(n, t, e, i, s = "0.4s", r = "0.1s") {
  const a = n.querySelector("animate");
  if (a)
    return p.attr(a, {
      attributeName: t,
      from: e,
      to: i,
      dur: s,
      begin: "click + " + r
      // artificial click
    }), n;
  const o = f("animate", {
    attributeName: t,
    from: e,
    to: i,
    dur: s,
    begin: r,
    calcMode: "spline",
    values: e + ";" + i,
    keyTimes: "0; 1",
    keySplines: q("ease-out")
  });
  return n.appendChild(o), n;
}
function q(n) {
  return {
    ease: ".25 .1 .25 1",
    linear: "0 0 1 1",
    "ease-in": ".42 0 1 1",
    "ease-out": "0 0 .58 1",
    "ease-in-out": ".42 0 .58 1"
  }[n];
}
p.on = (n, t, e, i) => {
  i ? p.delegate(n, t, e, i) : (i = e, p.bind(n, t, i));
};
p.off = (n, t, e) => {
  n.removeEventListener(t, e);
};
p.bind = (n, t, e) => {
  t.split(/\s+/).forEach(function(i) {
    n.addEventListener(i, e);
  });
};
p.delegate = (n, t, e, i) => {
  n.addEventListener(t, function(s) {
    const r = s.target.closest(e);
    r && (s.delegatedTarget = r, i.call(this, s, r));
  });
};
p.closest = (n, t) => t ? t.matches(n) ? t : p.closest(n, t.parentNode) : null;
p.attr = (n, t, e) => {
  if (!e && typeof t == "string")
    return n.getAttribute(t);
  if (typeof t == "object") {
    for (let i in t)
      p.attr(n, i, t[i]);
    return;
  }
  n.setAttribute(t, e);
};
class C {
  constructor(t, e, i) {
    this.gantt = t, this.from_task = e, this.to_task = i, this.calculate_path(), this.draw();
  }
  calculate_path() {
    let t = this.from_task.$bar.getX() + this.from_task.$bar.getWidth() / 2;
    const e = () => this.to_task.$bar.getX() < t + this.gantt.options.padding && t > this.from_task.$bar.getX() + this.gantt.options.padding;
    for (; e(); )
      t -= 10;
    t -= 10;
    let i = this.gantt.config.header_height + this.gantt.options.bar_height + (this.gantt.options.padding + this.gantt.options.bar_height) * this.from_task.task._index + this.gantt.options.padding / 2, s = this.to_task.$bar.getX() - 13, r = this.gantt.config.header_height + this.gantt.options.bar_height / 2 + (this.gantt.options.padding + this.gantt.options.bar_height) * this.to_task.task._index + this.gantt.options.padding / 2;
    const a = this.from_task.task._index > this.to_task.task._index;
    let o = this.gantt.options.arrow_curve;
    const h = a ? 1 : 0;
    let l = a ? -o : o;
    if (this.to_task.$bar.getX() <= this.from_task.$bar.getX() + this.gantt.options.padding) {
      let _ = this.gantt.options.padding / 2 - o;
      _ < 0 && (_ = 0, o = this.gantt.options.padding / 2, l = a ? -o : o);
      const g = this.to_task.$bar.getY() + this.to_task.$bar.getHeight() / 2 - l, c = this.to_task.$bar.getX() - this.gantt.options.padding;
      this.path = `
                M ${t} ${i}
                v ${_}
                a ${o} ${o} 0 0 1 ${-o} ${o}
                H ${c}
                a ${o} ${o} 0 0 ${h} ${-o} ${l}
                V ${g}
                a ${o} ${o} 0 0 ${h} ${o} ${l}
                L ${s} ${r}
                m -5 -5
                l 5 5
                l -5 5`;
    } else {
      s < t + o && (o = s - t);
      let _ = a ? r + o : r - o;
      this.path = `
              M ${t} ${i}
              V ${_}
              a ${o} ${o} 0 0 ${h} ${o} ${o}
              L ${s} ${r}
              m -5 -5
              l 5 5
              l -5 5`;
    }
  }
  draw() {
    this.element = f("path", {
      d: this.path,
      "data-from": this.from_task.task.id,
      "data-to": this.to_task.task.id
    });
  }
  update() {
    this.calculate_path(), this.element.setAttribute("d", this.path);
  }
}
class F {
  constructor(t, e) {
    this.set_defaults(t, e), this.prepare_wrappers(), this.prepare_helpers(), this.refresh();
  }
  refresh() {
    this.bar_group.innerHTML = "", this.handle_group.innerHTML = "", this.task.custom_class ? this.group.classList.add(this.task.custom_class) : this.group.classList = ["bar-wrapper"], this.prepare_values(), this.draw(), this.bind();
  }
  set_defaults(t, e) {
    this.action_completed = !1, this.gantt = t, this.task = e, this.name = this.name || "";
  }
  prepare_wrappers() {
    this.group = f("g", {
      class: "bar-wrapper" + (this.task.custom_class ? " " + this.task.custom_class : ""),
      "data-id": this.task.id
    }), this.bar_group = f("g", {
      class: "bar-group",
      append_to: this.group
    }), this.handle_group = f("g", {
      class: "handle-group",
      append_to: this.group
    });
  }
  prepare_values() {
    this.invalid = this.task.invalid, this.height = this.gantt.options.bar_height, this.image_size = this.height - 5, this.task._start = new Date(this.task.start), this.task._end = new Date(this.task.end), this.compute_x(), this.compute_y(), this.compute_duration(), this.corner_radius = this.gantt.options.bar_corner_radius, this.width = this.gantt.config.column_width * this.duration, (!this.task.progress || this.task.progress < 0) && (this.task.progress = 0), this.task.progress > 100 && (this.task.progress = 100);
  }
  prepare_helpers() {
    SVGElement.prototype.getX = function() {
      return +this.getAttribute("x");
    }, SVGElement.prototype.getY = function() {
      return +this.getAttribute("y");
    }, SVGElement.prototype.getWidth = function() {
      return +this.getAttribute("width");
    }, SVGElement.prototype.getHeight = function() {
      return +this.getAttribute("height");
    }, SVGElement.prototype.getEndX = function() {
      return this.getX() + this.getWidth();
    };
  }
  prepare_expected_progress_values() {
    this.compute_expected_progress(), this.expected_progress_width = this.gantt.options.column_width * this.duration * (this.expected_progress / 100) || 0;
  }
  draw() {
    this.draw_bar(), this.draw_progress_bar(), this.gantt.options.show_expected_progress && (this.prepare_expected_progress_values(), this.draw_expected_progress_bar()), this.draw_label(), this.draw_resize_handles(), this.task.thumbnail && this.draw_thumbnail();
  }
  draw_bar() {
    this.$bar = f("rect", {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rx: this.corner_radius,
      ry: this.corner_radius,
      class: "bar",
      append_to: this.bar_group
    }), this.task.color && (this.$bar.style.fill = this.task.color), T(this.$bar, "width", 0, this.width), this.invalid && this.$bar.classList.add("bar-invalid");
  }
  draw_expected_progress_bar() {
    this.invalid || (this.$expected_bar_progress = f("rect", {
      x: this.x,
      y: this.y,
      width: this.expected_progress_width,
      height: this.height,
      rx: this.corner_radius,
      ry: this.corner_radius,
      class: "bar-expected-progress",
      append_to: this.bar_group
    }), T(
      this.$expected_bar_progress,
      "width",
      0,
      this.expected_progress_width
    ));
  }
  draw_progress_bar() {
    if (this.invalid) return;
    this.progress_width = this.calculate_progress_width();
    let t = this.corner_radius;
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (t = this.corner_radius + 2), this.$bar_progress = f("rect", {
      x: this.x,
      y: this.y,
      width: this.progress_width,
      height: this.height,
      rx: t,
      ry: t,
      class: "bar-progress",
      append_to: this.bar_group
    }), this.task.color_progress && (this.$bar_progress.style.fill = this.task.color);
    const e = d.diff(
      this.task._start,
      this.gantt.gantt_start,
      this.gantt.config.unit
    ) / this.gantt.config.step * this.gantt.config.column_width;
    let i = this.gantt.create_el({
      classes: `date-range-highlight hide highlight-${this.task.id}`,
      width: this.width,
      left: e
    });
    this.$date_highlight = i, this.gantt.$lower_header.prepend(this.$date_highlight), T(this.$bar_progress, "width", 0, this.progress_width);
  }
  calculate_progress_width() {
    const t = this.$bar.getWidth(), e = this.x + t, i = this.gantt.config.ignored_positions.reduce((h, l) => h + (l >= this.x && l < e), 0) * this.gantt.config.column_width;
    let s = (t - i) * this.task.progress / 100;
    const r = this.x + s, a = this.gantt.config.ignored_positions.reduce((h, l) => h + (l >= this.x && l < r), 0) * this.gantt.config.column_width;
    s += a;
    let o = this.gantt.get_ignored_region(
      this.x + s
    );
    for (; o.length; )
      s += this.gantt.config.column_width, o = this.gantt.get_ignored_region(
        this.x + s
      );
    return this.progress_width = s, s;
  }
  draw_label() {
    let t = this.x + this.$bar.getWidth() / 2;
    this.task.thumbnail && (t = this.x + this.image_size + 5), f("text", {
      x: t,
      y: this.y + this.height / 2,
      innerHTML: this.task.name,
      class: "bar-label",
      append_to: this.bar_group
    }), requestAnimationFrame(() => this.update_label_position());
  }
  draw_thumbnail() {
    let t = 10, e = 2, i, s;
    i = f("defs", {
      append_to: this.bar_group
    }), f("rect", {
      id: "rect_" + this.task.id,
      x: this.x + t,
      y: this.y + e,
      width: this.image_size,
      height: this.image_size,
      rx: "15",
      class: "img_mask",
      append_to: i
    }), s = f("clipPath", {
      id: "clip_" + this.task.id,
      append_to: i
    }), f("use", {
      href: "#rect_" + this.task.id,
      append_to: s
    }), f("image", {
      x: this.x + t,
      y: this.y + e,
      width: this.image_size,
      height: this.image_size,
      class: "bar-img",
      href: this.task.thumbnail,
      clipPath: "clip_" + this.task.id,
      append_to: this.bar_group
    });
  }
  draw_resize_handles() {
    if (this.invalid || this.gantt.options.readonly) return;
    const t = this.$bar, e = 3;
    if (this.handles = [], this.gantt.options.readonly_dates || (this.handles.push(
      f("rect", {
        x: t.getEndX() - e / 2,
        y: t.getY() + this.height / 4,
        width: e,
        height: this.height / 2,
        rx: 2,
        ry: 2,
        class: "handle right",
        append_to: this.handle_group
      })
    ), this.handles.push(
      f("rect", {
        x: t.getX() - e / 2,
        y: t.getY() + this.height / 4,
        width: e,
        height: this.height / 2,
        rx: 2,
        ry: 2,
        class: "handle left",
        append_to: this.handle_group
      })
    )), !this.gantt.options.readonly_progress) {
      const i = this.$bar_progress;
      this.$handle_progress = f("circle", {
        cx: i.getEndX(),
        cy: i.getY() + i.getHeight() / 2,
        r: 4.5,
        class: "handle progress",
        append_to: this.handle_group
      }), this.handles.push(this.$handle_progress);
    }
    for (let i of this.handles)
      p.on(i, "mouseenter", () => i.classList.add("active")), p.on(i, "mouseleave", () => i.classList.remove("active"));
  }
  bind() {
    this.invalid || this.setup_click_event();
  }
  setup_click_event() {
    let t = this.task.id;
    p.on(this.group, "mouseover", (i) => {
      this.gantt.trigger_event("hover", [
        this.task,
        i.screenX,
        i.screenY,
        i
      ]);
    }), this.gantt.options.popup_on === "click" && p.on(this.group, "mouseup", (i) => {
      const s = i.offsetX || i.layerX;
      if (this.$handle_progress) {
        const r = +this.$handle_progress.getAttribute("cx");
        if (r > s - 1 && r < s + 1 || this.gantt.bar_being_dragged) return;
      }
      this.gantt.show_popup({
        x: i.offsetX || i.layerX,
        y: i.offsetY || i.layerY,
        task: this.task,
        target: this.$bar
      });
    });
    let e;
    p.on(this.group, "mouseenter", (i) => {
      e = setTimeout(() => {
        this.gantt.options.popup_on === "hover" && this.gantt.show_popup({
          x: i.offsetX || i.layerX,
          y: i.offsetY || i.layerY,
          task: this.task,
          target: this.$bar
        }), this.gantt.$container.querySelector(`.highlight-${t}`).classList.remove("hide");
      }, 200);
    }), p.on(this.group, "mouseleave", () => {
      var i, s;
      clearTimeout(e), this.gantt.options.popup_on === "hover" && ((s = (i = this.gantt.popup) == null ? void 0 : i.hide) == null || s.call(i)), this.gantt.$container.querySelector(`.highlight-${t}`).classList.add("hide");
    }), p.on(this.group, "click", () => {
      this.gantt.trigger_event("click", [this.task]);
    }), p.on(this.group, "dblclick", (i) => {
      this.action_completed || (this.group.classList.remove("active"), this.gantt.popup && this.gantt.popup.parent.classList.remove("hide"), this.gantt.trigger_event("double_click", [this.task]));
    });
  }
  update_bar_position({ x: t = null, width: e = null }) {
    const i = this.$bar;
    if (t) {
      if (!this.task.dependencies.map((a) => this.gantt.get_bar(a).$bar.getX()).reduce((a, o) => t >= o, t)) return;
      this.update_attr(i, "x", t), this.x = t, this.$date_highlight.style.left = t + "px";
    }
    e > 0 && (this.update_attr(i, "width", e), this.$date_highlight.style.width = e + "px"), this.update_label_position(), this.update_handle_position(), this.date_changed(), this.compute_duration(), this.gantt.options.show_expected_progress && this.update_expected_progressbar_position(), this.update_progressbar_position(), this.update_arrow_position();
  }
  update_label_position_on_horizontal_scroll({ x: t, sx: e }) {
    const i = this.gantt.$container.querySelector(".gantt-container"), s = this.group.querySelector(".bar-label"), r = this.group.querySelector(".bar-img") || "", a = this.bar_group.querySelector(".img_mask") || "";
    let o = this.$bar.getX() + this.$bar.getWidth(), h = s.getX() + t, l = r && r.getX() + t || 0, _ = r && r.getBBox().width + 7 || 7, g = h + s.getBBox().width + 7, c = e + i.clientWidth / 2;
    s.classList.contains("big") || (g < o && t > 0 && g < c || h - _ > this.$bar.getX() && t < 0 && g > c) && (s.setAttribute("x", h), r && (r.setAttribute("x", l), a.setAttribute("x", l)));
  }
  date_changed() {
    let t = !1;
    const { new_start_date: e, new_end_date: i } = this.compute_start_end_date();
    Number(this.task._start) !== Number(e) && (t = !0, this.task._start = e), Number(this.task._end) !== Number(i) && (t = !0, this.task._end = i), t && this.gantt.trigger_event("date_change", [
      this.task,
      e,
      d.add(i, -1, "second")
    ]);
  }
  progress_changed() {
    this.task.progress = this.compute_progress(), this.gantt.trigger_event("progress_change", [
      this.task,
      this.task.progress
    ]);
  }
  set_action_completed() {
    this.action_completed = !0, setTimeout(() => this.action_completed = !1, 1e3);
  }
  compute_start_end_date() {
    const t = this.$bar, e = t.getX() / this.gantt.config.column_width;
    let i = d.add(
      this.gantt.gantt_start,
      e * this.gantt.config.step,
      this.gantt.config.unit
    );
    const s = t.getWidth() / this.gantt.config.column_width, r = d.add(
      i,
      s * this.gantt.config.step,
      this.gantt.config.unit
    );
    return { new_start_date: i, new_end_date: r };
  }
  compute_progress() {
    this.progress_width = this.$bar_progress.getWidth(), this.x = this.$bar_progress.getBBox().x;
    const t = this.x + this.progress_width, e = this.progress_width - this.gantt.config.ignored_positions.reduce((s, r) => s + (r >= this.x && r <= t), 0) * this.gantt.config.column_width;
    if (e < 0) return 0;
    const i = this.$bar.getWidth() - this.ignored_duration_raw * this.gantt.config.column_width;
    return parseInt(e / i * 100, 10);
  }
  compute_expected_progress() {
    this.expected_progress = d.diff(d.today(), this.task._start, "hour") / this.gantt.config.step, this.expected_progress = (this.expected_progress < this.duration ? this.expected_progress : this.duration) * 100 / this.duration;
  }
  compute_x() {
    const { column_width: t } = this.gantt.config, e = this.task._start, i = this.gantt.gantt_start;
    let r = d.diff(e, i, this.gantt.config.unit) / this.gantt.config.step * t;
    this.x = r;
  }
  compute_y() {
    this.y = this.gantt.config.header_height + this.gantt.options.padding / 2 + this.task._index * (this.height + this.gantt.options.padding);
  }
  compute_duration() {
    let t = 0, e = 0;
    for (let i = new Date(this.task._start); i < this.task._end; i.setDate(i.getDate() + 1))
      e++, !this.gantt.config.ignored_dates.find(
        (s) => s.getTime() === i.getTime()
      ) && (!this.gantt.config.ignored_function || !this.gantt.config.ignored_function(i)) && t++;
    this.task.actual_duration = t, this.task.ignored_duration = e - t, this.duration = d.convert_scales(
      e + "d",
      this.gantt.config.unit
    ) / this.gantt.config.step, this.actual_duration_raw = d.convert_scales(
      t + "d",
      this.gantt.config.unit
    ) / this.gantt.config.step, this.ignored_duration_raw = this.duration - this.actual_duration_raw;
  }
  update_attr(t, e, i) {
    return i = +i, isNaN(i) || t.setAttribute(e, i), t;
  }
  update_expected_progressbar_position() {
    this.invalid || (this.$expected_bar_progress.setAttribute("x", this.$bar.getX()), this.compute_expected_progress(), this.$expected_bar_progress.setAttribute(
      "width",
      this.gantt.config.column_width * this.actual_duration_raw * (this.expected_progress / 100) || 0
    ));
  }
  update_progressbar_position() {
    this.invalid || this.gantt.options.readonly || (this.$bar_progress.setAttribute("x", this.$bar.getX()), this.$bar_progress.setAttribute(
      "width",
      this.calculate_progress_width()
    ));
  }
  update_label_position() {
    const t = this.bar_group.querySelector(".img_mask") || "", e = this.$bar, i = this.group.querySelector(".bar-label"), s = this.group.querySelector(".bar-img");
    let r = 5, a = this.image_size + 10;
    const o = i.getBBox().width, h = e.getWidth();
    o > h ? (i.classList.add("big"), s ? (s.setAttribute("x", e.getEndX() + r), t.setAttribute("x", e.getEndX() + r), i.setAttribute("x", e.getEndX() + a)) : i.setAttribute("x", e.getEndX() + r)) : (i.classList.remove("big"), s ? (s.setAttribute("x", e.getX() + r), t.setAttribute("x", e.getX() + r), i.setAttribute(
      "x",
      e.getX() + h / 2 + a
    )) : i.setAttribute(
      "x",
      e.getX() + h / 2 - o / 2
    ));
  }
  update_handle_position() {
    if (this.invalid || this.gantt.options.readonly) return;
    const t = this.$bar;
    this.handle_group.querySelector(".handle.left").setAttribute("x", t.getX()), this.handle_group.querySelector(".handle.right").setAttribute("x", t.getEndX());
    const e = this.group.querySelector(".handle.progress");
    e && e.setAttribute("cx", this.$bar_progress.getEndX());
  }
  update_arrow_position() {
    this.arrows = this.arrows || [];
    for (let t of this.arrows)
      t.update();
  }
}
class O {
  constructor(t, e, i) {
    this.parent = t, this.popup_func = e, this.gantt = i, this.make();
  }
  make() {
    this.parent.innerHTML = `
            <div class="title"></div>
            <div class="subtitle"></div>
            <div class="details"></div>
            <div class="actions"></div>
        `, this.hide(), this.title = this.parent.querySelector(".title"), this.subtitle = this.parent.querySelector(".subtitle"), this.details = this.parent.querySelector(".details"), this.actions = this.parent.querySelector(".actions");
  }
  show({ x: t, y: e, task: i, target: s }) {
    this.actions.innerHTML = "";
    let r = this.popup_func({
      task: i,
      chart: this.gantt,
      get_title: () => this.title,
      set_title: (a) => this.title.innerHTML = a,
      get_subtitle: () => this.subtitle,
      set_subtitle: (a) => this.subtitle.innerHTML = a,
      get_details: () => this.details,
      set_details: (a) => this.details.innerHTML = a,
      add_action: (a, o) => {
        let h = this.gantt.create_el({
          classes: "action-btn",
          type: "button",
          append_to: this.actions
        });
        typeof a == "function" && (a = a(i)), h.innerHTML = a, h.onclick = (l) => o(i, this.gantt, l);
      }
    });
    r !== !1 && (r && (this.parent.innerHTML = r), this.actions.innerHTML === "" ? this.actions.remove() : this.parent.appendChild(this.actions), this.parent.style.left = t + 10 + "px", this.parent.style.top = e - 10 + "px", this.parent.classList.remove("hide"));
  }
  hide() {
    this.parent.classList.add("hide");
  }
}
function A(n) {
  const t = n.getFullYear();
  return t - t % 10 + "";
}
function I(n, t, e) {
  let i = d.add(n, 6, "day"), s = i.getMonth() !== n.getMonth() ? "D MMM" : "D", r = !t || n.getMonth() !== t.getMonth() ? "D MMM" : "D";
  return `${d.format(n, r, e)} - ${d.format(i, s, e)}`;
}
const b = [
  {
    name: "Hour",
    padding: "7d",
    step: "1h",
    date_format: "YYYY-MM-DD HH:",
    lower_text: "HH",
    upper_text: (n, t, e) => !t || n.getDate() !== t.getDate() ? d.format(n, "D MMMM", e) : "",
    upper_text_frequency: 24
  },
  {
    name: "Quarter Day",
    padding: "7d",
    step: "6h",
    date_format: "YYYY-MM-DD HH:",
    lower_text: "HH",
    upper_text: (n, t, e) => !t || n.getDate() !== t.getDate() ? d.format(n, "D MMM", e) : "",
    upper_text_frequency: 4
  },
  {
    name: "Half Day",
    padding: "14d",
    step: "12h",
    date_format: "YYYY-MM-DD HH:",
    lower_text: "HH",
    upper_text: (n, t, e) => !t || n.getDate() !== t.getDate() ? n.getMonth() !== n.getMonth() ? d.format(n, "D MMM", e) : d.format(n, "D", e) : "",
    upper_text_frequency: 2
  },
  {
    name: "Day",
    padding: "7d",
    date_format: "YYYY-MM-DD",
    step: "1d",
    lower_text: (n, t, e) => !t || n.getDate() !== t.getDate() ? d.format(n, "D", e) : "",
    upper_text: (n, t, e) => !t || n.getMonth() !== t.getMonth() ? d.format(n, "MMMM", e) : "",
    thick_line: (n) => n.getDay() === 1
  },
  {
    name: "Week",
    padding: "1m",
    step: "7d",
    date_format: "YYYY-MM-DD",
    column_width: 140,
    lower_text: I,
    upper_text: (n, t, e) => !t || n.getMonth() !== t.getMonth() ? d.format(n, "MMMM", e) : "",
    thick_line: (n) => n.getDate() >= 1 && n.getDate() <= 7,
    upper_text_frequency: 4
  },
  {
    name: "Month",
    padding: "2m",
    step: "1m",
    column_width: 120,
    date_format: "YYYY-MM",
    lower_text: "MMMM",
    upper_text: (n, t, e) => !t || n.getFullYear() !== t.getFullYear() ? d.format(n, "YYYY", e) : "",
    thick_line: (n) => n.getMonth() % 3 === 0,
    snap_at: "7d"
  },
  {
    name: "Year",
    padding: "2y",
    step: "1y",
    column_width: 120,
    date_format: "YYYY",
    upper_text: (n, t, e) => !t || A(n) !== A(t) ? A(n) : "",
    lower_text: "YYYY",
    snap_at: "30d"
  }
], z = {
  arrow_curve: 5,
  auto_move_label: !1,
  bar_corner_radius: 3,
  bar_height: 30,
  container_height: "auto",
  column_width: null,
  date_format: "YYYY-MM-DD HH:mm",
  upper_header_height: 45,
  lower_header_height: 30,
  snap_at: null,
  infinite_padding: !0,
  holidays: { "var(--g-weekend-highlight-color)": "weekend" },
  ignore: [],
  language: "en",
  lines: "both",
  move_dependencies: !0,
  padding: 18,
  popup: (n) => {
    n.set_title(n.task.name), n.task.description ? n.set_subtitle(n.task.description) : n.set_subtitle("");
    const t = d.format(
      n.task._start,
      "MMM D",
      n.chart.options.language
    ), e = d.format(
      d.add(n.task._end, -1, "second"),
      "MMM D",
      n.chart.options.language
    );
    n.set_details(
      `${t} - ${e} (${n.task.actual_duration} days${n.task.ignored_duration ? " + " + n.task.ignored_duration + " excluded" : ""})<br/>Progress: ${Math.floor(n.task.progress * 100) / 100}%`
    );
  },
  popup_on: "click",
  readonly_progress: !1,
  readonly_dates: !1,
  readonly: !1,
  scroll_to: "today",
  show_expected_progress: !1,
  today_button: !0,
  view_mode: "Day",
  view_mode_select: !1,
  view_modes: b
};
class B {
  constructor(t, e, i) {
    this.setup_wrapper(t), this.setup_options(i), this.setup_tasks(e), this.change_view_mode(), this.bind_events();
  }
  setup_wrapper(t) {
    let e, i;
    if (typeof t == "string") {
      let s = document.querySelector(t);
      if (!s)
        throw new ReferenceError(
          `CSS selector "${t}" could not be found in DOM`
        );
      t = s;
    }
    if (t instanceof HTMLElement)
      i = t, e = t.querySelector("svg");
    else if (t instanceof SVGElement)
      e = t;
    else
      throw new TypeError(
        "Frappe Gantt only supports usage of a string CSS selector, HTML DOM element or SVG DOM element for the 'element' parameter"
      );
    e ? (this.$svg = e, this.$svg.classList.add("gantt")) : this.$svg = f("svg", {
      append_to: i,
      class: "gantt"
    }), this.$container = this.create_el({
      classes: "gantt-container",
      append_to: this.$svg.parentElement
    }), this.$container.appendChild(this.$svg), this.$popup_wrapper = this.create_el({
      classes: "popup-wrapper",
      append_to: this.$container
    });
  }
  setup_options(t) {
    this.original_options = t, this.options = { ...z, ...t };
    const e = {
      "grid-height": "container_height",
      "bar-height": "bar_height",
      "lower-header-height": "lower_header_height",
      "upper-header-height": "upper_header_height"
    };
    for (let i in e) {
      let s = this.options[e[i]];
      s !== "auto" && this.$container.style.setProperty(
        "--gv-" + i,
        s + "px"
      );
    }
    if (this.config = {
      ignored_dates: [],
      ignored_positions: [],
      extend_by_units: 10
    }, typeof this.options.ignore != "function") {
      typeof this.options.ignore == "string" && (this.options.ignore = [this.options.ignord]);
      for (let i of this.options.ignore) {
        if (typeof i == "function") {
          this.config.ignored_function = i;
          continue;
        }
        typeof i == "string" && (i === "weekend" ? this.config.ignored_function = (s) => s.getDay() == 6 || s.getDay() == 0 : this.config.ignored_dates.push(/* @__PURE__ */ new Date(i + " ")));
      }
    } else
      this.config.ignored_function = this.options.ignore;
  }
  update_options(t) {
    this.setup_options({ ...this.original_options, ...t }), this.change_view_mode(void 0, !0);
  }
  setup_tasks(t) {
    this.tasks = t.map((e, i) => {
      if (!e.start)
        return console.error(
          `task "${e.id}" doesn't have a start date`
        ), !1;
      if (e._start = d.parse(e.start), e.end === void 0 && e.duration !== void 0 && (e.end = e._start, e.duration.split(" ").forEach((o) => {
        let { duration: h, scale: l } = d.parse_duration(o);
        e.end = d.add(e.end, h, l);
      })), !e.end)
        return console.error(`task "${e.id}" doesn't have an end date`), !1;
      if (e._end = d.parse(e.end), d.diff(e._end, e._start, "year") < 0)
        return console.error(
          `start of task can't be after end of task: in task "${e.id}"`
        ), !1;
      if (d.diff(e._end, e._start, "year") > 10)
        return console.error(
          `the duration of task "${e.id}" is too long (above ten years)`
        ), !1;
      if (e._index = i, d.get_date_values(e._end).slice(3).every((a) => a === 0) && (e._end = d.add(e._end, 24, "hour")), typeof e.dependencies == "string" || !e.dependencies) {
        let a = [];
        e.dependencies && (a = e.dependencies.split(",").map((o) => o.trim().replaceAll(" ", "_")).filter((o) => o)), e.dependencies = a;
      }
      return e.id ? typeof e.id == "string" ? e.id = e.id.replaceAll(" ", "_") : e.id = `${e.id}` : e.id = N(e), e;
    }).filter((e) => e), this.setup_dependencies();
  }
  setup_dependencies() {
    this.dependency_map = {};
    for (let t of this.tasks)
      for (let e of t.dependencies)
        this.dependency_map[e] = this.dependency_map[e] || [], this.dependency_map[e].push(t.id);
  }
  refresh(t) {
    this.setup_tasks(t), this.change_view_mode();
  }
  update_task(t, e) {
    let i = this.tasks.find((r) => r.id === t), s = this.bars[i._index];
    Object.assign(i, e), s.refresh();
  }
  change_view_mode(t = this.options.view_mode, e = !1) {
    typeof t == "string" && (t = this.options.view_modes.find((r) => r.name === t));
    let i, s;
    e && (i = this.$container.scrollLeft, s = this.options.scroll_to, this.options.scroll_to = null), this.options.view_mode = t.name, this.config.view_mode = t, this.update_view_scale(t), this.setup_dates(e), this.render(), e && (this.$container.scrollLeft = i, this.options.scroll_to = s), this.trigger_event("view_change", [t]);
  }
  update_view_scale(t) {
    let { duration: e, scale: i } = d.parse_duration(t.step);
    this.config.step = e, this.config.unit = i, this.config.column_width = this.options.column_width || t.column_width || 45, this.$container.style.setProperty(
      "--gv-column-width",
      this.config.column_width + "px"
    ), this.config.header_height = this.options.lower_header_height + this.options.upper_header_height + 10;
  }
  setup_dates(t = !1) {
    this.setup_gantt_dates(t), this.setup_date_values();
  }
  setup_gantt_dates(t) {
    let e, i;
    this.tasks.length || (e = /* @__PURE__ */ new Date(), i = /* @__PURE__ */ new Date());
    for (let s of this.tasks)
      (!e || s._start < e) && (e = s._start), (!i || s._end > i) && (i = s._end);
    if (e = d.start_of(e, this.config.unit), i = d.start_of(i, this.config.unit), !t)
      if (this.options.infinite_padding)
        this.gantt_start = d.add(
          e,
          -this.config.extend_by_units * 3,
          this.config.unit
        ), this.gantt_end = d.add(
          i,
          this.config.extend_by_units * 3,
          this.config.unit
        );
      else {
        typeof this.config.view_mode.padding == "string" && (this.config.view_mode.padding = [
          this.config.view_mode.padding,
          this.config.view_mode.padding
        ]);
        let [s, r] = this.config.view_mode.padding.map(
          d.parse_duration
        );
        this.gantt_start = d.add(
          e,
          -s.duration,
          s.scale
        ), this.gantt_end = d.add(
          i,
          r.duration,
          r.scale
        );
      }
    this.config.date_format = this.config.view_mode.date_format || this.options.date_format, this.gantt_start.setHours(0, 0, 0, 0);
  }
  setup_date_values() {
    let t = this.gantt_start;
    for (this.dates = [t]; t < this.gantt_end; )
      t = d.add(
        t,
        this.config.step,
        this.config.unit
      ), this.dates.push(t);
  }
  bind_events() {
    this.bind_grid_click(), this.bind_holiday_labels(), this.bind_bar_events();
  }
  render() {
    this.clear(), this.setup_layers(), this.make_grid(), this.make_dates(), this.make_grid_extras(), this.make_bars(), this.make_arrows(), this.map_arrows_on_bars(), this.set_dimensions(), this.set_scroll_position(this.options.scroll_to);
  }
  setup_layers() {
    this.layers = {};
    const t = ["grid", "arrow", "progress", "bar"];
    for (let e of t)
      this.layers[e] = f("g", {
        class: e,
        append_to: this.$svg
      });
    this.$extras = this.create_el({
      classes: "extras",
      append_to: this.$container
    }), this.$adjust = this.create_el({
      classes: "adjust hide",
      append_to: this.$extras,
      type: "button"
    }), this.$adjust.innerHTML = "&larr;";
  }
  make_grid() {
    this.make_grid_background(), this.make_grid_rows(), this.make_grid_header(), this.make_side_header();
  }
  make_grid_extras() {
    this.make_grid_highlights(), this.make_grid_ticks();
  }
  make_grid_background() {
    const t = this.dates.length * this.config.column_width, e = Math.max(
      this.config.header_height + this.options.padding + (this.options.bar_height + this.options.padding) * this.tasks.length - 10,
      this.options.container_height !== "auto" ? this.options.container_height : 0
    );
    f("rect", {
      x: 0,
      y: 0,
      width: t,
      height: e,
      class: "grid-background",
      append_to: this.$svg
    }), p.attr(this.$svg, {
      height: e,
      width: "100%"
    }), this.grid_height = e, this.options.container_height === "auto" && (this.$container.style.height = e + "px");
  }
  make_grid_rows() {
    const t = f("g", { append_to: this.layers.grid }), e = this.dates.length * this.config.column_width, i = this.options.bar_height + this.options.padding;
    this.config.header_height;
    for (let s = this.config.header_height; s < this.grid_height; s += i)
      f("rect", {
        x: 0,
        y: s,
        width: e,
        height: i,
        class: "grid-row",
        append_to: t
      });
  }
  make_grid_header() {
    this.$header = this.create_el({
      width: this.dates.length * this.config.column_width,
      classes: "grid-header",
      append_to: this.$container
    }), this.$upper_header = this.create_el({
      classes: "upper-header",
      append_to: this.$header
    }), this.$lower_header = this.create_el({
      classes: "lower-header",
      append_to: this.$header
    });
  }
  make_side_header() {
    if (this.$side_header = this.create_el({ classes: "side-header" }), this.$upper_header.prepend(this.$side_header), this.options.view_mode_select) {
      const t = document.createElement("select");
      t.classList.add("viewmode-select");
      const e = document.createElement("option");
      e.selected = !0, e.disabled = !0, e.textContent = "Mode", t.appendChild(e);
      for (const i of this.options.view_modes) {
        const s = document.createElement("option");
        s.value = i.name, s.textContent = i.name, i.name === this.config.view_mode.name && (s.selected = !0), t.appendChild(s);
      }
      t.addEventListener(
        "change",
        (function() {
          this.change_view_mode(t.value, !0);
        }).bind(this)
      ), this.$side_header.appendChild(t);
    }
    if (this.options.today_button) {
      let t = document.createElement("button");
      t.classList.add("today-button"), t.textContent = "Today", t.onclick = this.scroll_current.bind(this), this.$side_header.prepend(t), this.$today_button = t;
    }
  }
  make_grid_ticks() {
    if (this.options.lines === "none") return;
    let t = 0, e = this.config.header_height, i = this.grid_height - this.config.header_height, s = f("g", {
      class: "lines_layer",
      append_to: this.layers.grid
    }), r = this.config.header_height;
    const a = this.dates.length * this.config.column_width, o = this.options.bar_height + this.options.padding;
    if (this.options.lines !== "vertical")
      for (let h = this.config.header_height; h < this.grid_height; h += o)
        f("line", {
          x1: 0,
          y1: r + o,
          x2: a,
          y2: r + o,
          class: "row-line",
          append_to: s
        }), r += o;
    if (this.options.lines !== "horizontal")
      for (let h of this.dates) {
        let l = "tick";
        this.config.view_mode.thick_line && this.config.view_mode.thick_line(h) && (l += " thick"), f("path", {
          d: `M ${t} ${e} v ${i}`,
          class: l,
          append_to: this.layers.grid
        }), this.view_is("month") ? t += d.get_days_in_month(h) * this.config.column_width / 30 : this.view_is("year") ? t += d.get_days_in_year(h) * this.config.column_width / 365 : t += this.config.column_width;
      }
  }
  highlight_holidays() {
    let t = {};
    if (this.options.holidays)
      for (let e in this.options.holidays) {
        let i = this.options.holidays[e];
        i === "weekend" && (i = (r) => r.getDay() === 0 || r.getDay() === 6);
        let s;
        if (typeof i == "object") {
          let r = i.find((a) => typeof a == "function");
          if (r && (s = r), this.options.holidays.name) {
            let a = /* @__PURE__ */ new Date(i.date + " ");
            i = (o) => a.getTime() === o.getTime(), t[a] = i.name;
          } else
            i = (a) => this.options.holidays[e].filter((o) => typeof o != "function").map((o) => {
              if (o.name) {
                let h = /* @__PURE__ */ new Date(o.date + " ");
                return t[h] = o.name, h.getTime();
              }
              return (/* @__PURE__ */ new Date(o + " ")).getTime();
            }).includes(a.getTime());
        }
        for (let r = new Date(this.gantt_start); r <= this.gantt_end; r.setDate(r.getDate() + 1))
          if (!(this.config.ignored_dates.find(
            (a) => a.getTime() == r.getTime()
          ) || this.config.ignored_function && this.config.ignored_function(r)) && (i(r) || s && s(r))) {
            const a = d.diff(
              r,
              this.gantt_start,
              this.config.unit
            ) / this.config.step * this.config.column_width, o = this.grid_height - this.config.header_height, h = d.format(r, "YYYY-MM-DD", this.options.language).replace(" ", "_");
            if (t[r]) {
              let l = this.create_el({
                classes: "holiday-label label_" + h,
                append_to: this.$extras
              });
              l.textContent = t[r];
            }
            f("rect", {
              x: Math.round(a),
              y: this.config.header_height,
              width: this.config.column_width / d.convert_scales(
                this.config.view_mode.step,
                "day"
              ),
              height: o,
              class: "holiday-highlight " + h,
              style: `fill: ${e};`,
              append_to: this.layers.grid
            });
          }
      }
  }
  /**
   * Compute the horizontal x-axis distance and associated date for the current date and view.
   *
   * @returns Object containing the x-axis distance and date of the current date, or null if the current date is out of the gantt range.
   */
  highlight_current() {
    const t = this.get_closest_date();
    if (!t) return;
    const [e, i] = t;
    i.classList.add("current-date-highlight");
    const r = d.diff(
      /* @__PURE__ */ new Date(),
      this.gantt_start,
      this.config.unit
    ) / this.config.step * this.config.column_width;
    this.$current_highlight = this.create_el({
      top: this.config.header_height,
      left: r,
      height: this.grid_height - this.config.header_height,
      classes: "current-highlight",
      append_to: this.$container
    }), this.$current_ball_highlight = this.create_el({
      top: this.config.header_height - 6,
      left: r - 2.5,
      width: 6,
      height: 6,
      classes: "current-ball-highlight",
      append_to: this.$header
    });
  }
  make_grid_highlights() {
    this.highlight_holidays(), this.config.ignored_positions = [];
    const t = (this.options.bar_height + this.options.padding) * this.tasks.length;
    this.layers.grid.innerHTML += `<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
          <path d="M-1,1 l2,-2
                   M0,4 l4,-4
                   M3,5 l2,-2"
                style="stroke:grey; stroke-width:0.3" />
        </pattern>`;
    for (let i = new Date(this.gantt_start); i <= this.gantt_end; i.setDate(i.getDate() + 1)) {
      if (!this.config.ignored_dates.find(
        (r) => r.getTime() == i.getTime()
      ) && (!this.config.ignored_function || !this.config.ignored_function(i)))
        continue;
      let s = d.convert_scales(
        d.diff(i, this.gantt_start) + "d",
        this.config.unit
      ) / this.config.step;
      this.config.ignored_positions.push(s * this.config.column_width), f("rect", {
        x: s * this.config.column_width,
        y: this.config.header_height,
        width: this.config.column_width,
        height: t,
        class: "ignored-bar",
        style: "fill: url(#diagonalHatch);",
        append_to: this.$svg
      });
    }
    this.highlight_current(
      this.config.view_mode
    );
  }
  create_el({ left: t, top: e, width: i, height: s, id: r, classes: a, append_to: o, type: h }) {
    let l = document.createElement(h || "div");
    for (let _ of a.split(" ")) l.classList.add(_);
    return l.style.top = e + "px", l.style.left = t + "px", r && (l.id = r), i && (l.style.width = i + "px"), s && (l.style.height = s + "px"), o && o.appendChild(l), l;
  }
  make_dates() {
    this.get_dates_to_draw().forEach((t, e) => {
      if (t.lower_text) {
        let i = this.create_el({
          left: t.x,
          top: t.lower_y,
          classes: "lower-text date_" + $(t.formatted_date),
          append_to: this.$lower_header
        });
        i.innerText = t.lower_text;
      }
      if (t.upper_text) {
        let i = this.create_el({
          left: t.x,
          top: t.upper_y,
          classes: "upper-text",
          append_to: this.$upper_header
        });
        i.innerText = t.upper_text;
      }
    }), this.upperTexts = Array.from(
      this.$container.querySelectorAll(".upper-text")
    );
  }
  get_dates_to_draw() {
    let t = null;
    return this.dates.map((i, s) => {
      const r = this.get_date_info(i, t, s);
      return t = r, r;
    });
  }
  get_date_info(t, e) {
    let i = e ? e.date : null;
    this.config.column_width;
    const s = e ? e.x + e.column_width : 0;
    let r = this.config.view_mode.upper_text, a = this.config.view_mode.lower_text;
    return r ? typeof r == "string" && (this.config.view_mode.upper_text = (o) => d.format(o, r, this.options.language)) : this.config.view_mode.upper_text = () => "", a ? typeof a == "string" && (this.config.view_mode.lower_text = (o) => d.format(o, a, this.options.language)) : this.config.view_mode.lower_text = () => "", {
      date: t,
      formatted_date: $(
        d.format(
          t,
          this.config.date_format,
          this.options.language
        )
      ),
      column_width: this.config.column_width,
      x: s,
      upper_text: this.config.view_mode.upper_text(
        t,
        i,
        this.options.language
      ),
      lower_text: this.config.view_mode.lower_text(
        t,
        i,
        this.options.language
      ),
      upper_y: 17,
      lower_y: this.options.upper_header_height + 5
    };
  }
  make_bars() {
    this.bars = this.tasks.map((t) => {
      const e = new F(this, t);
      return this.layers.bar.appendChild(e.group), e;
    });
  }
  make_arrows() {
    this.arrows = [];
    for (let t of this.tasks) {
      let e = [];
      e = t.dependencies.map((i) => {
        const s = this.get_task(i);
        if (!s) return;
        const r = new C(
          this,
          this.bars[s._index],
          // from_task
          this.bars[t._index]
          // to_task
        );
        return this.layers.arrow.appendChild(r.element), r;
      }).filter(Boolean), this.arrows = this.arrows.concat(e);
    }
  }
  map_arrows_on_bars() {
    for (let t of this.bars)
      t.arrows = this.arrows.filter((e) => e.from_task.task.id === t.task.id || e.to_task.task.id === t.task.id);
  }
  set_dimensions() {
    const { width: t } = this.$svg.getBoundingClientRect(), e = this.$svg.querySelector(".grid .grid-row") ? this.$svg.querySelector(".grid .grid-row").getAttribute("width") : 0;
    t < e && this.$svg.setAttribute("width", e);
  }
  set_scroll_position(t) {
    if (this.options.infinite_padding && (!t || t === "start")) {
      let [a, ...o] = this.get_start_end_positions();
      this.$container.scrollLeft = a;
      return;
    }
    if (!t || t === "start")
      t = this.gantt_start;
    else if (t === "end")
      t = this.gantt_end;
    else {
      if (t === "today")
        return this.scroll_current();
      typeof t == "string" && (t = d.parse(t));
    }
    const i = d.diff(
      t,
      this.gantt_start,
      this.config.unit
    ) / this.config.step * this.config.column_width;
    this.$container.scrollTo({
      left: i - this.config.column_width / 6,
      behavior: "smooth"
    }), this.$current && this.$current.classList.remove("current-upper"), this.current_date = d.add(
      this.gantt_start,
      this.$container.scrollLeft / this.config.column_width,
      this.config.unit
    );
    let s = this.config.view_mode.upper_text(
      this.current_date,
      null,
      this.options.language
    ), r = this.upperTexts.find(
      (a) => a.textContent === s
    );
    this.current_date = d.add(
      this.gantt_start,
      (this.$container.scrollLeft + r.clientWidth) / this.config.column_width,
      this.config.unit
    ), s = this.config.view_mode.upper_text(
      this.current_date,
      null,
      this.options.language
    ), r = this.upperTexts.find((a) => a.textContent === s), r.classList.add("current-upper"), this.$current = r;
  }
  scroll_current() {
    let t = this.get_closest_date();
    t && this.set_scroll_position(t[0]);
  }
  get_closest_date() {
    let t = /* @__PURE__ */ new Date();
    if (t < this.gantt_start || t > this.gantt_end) return null;
    let e = /* @__PURE__ */ new Date(), i = this.$container.querySelector(
      ".date_" + $(
        d.format(
          e,
          this.config.date_format,
          this.options.language
        )
      )
    ), s = 0;
    for (; !i && s < this.config.step; )
      e = d.add(e, -1, this.config.unit), i = this.$container.querySelector(
        ".date_" + $(
          d.format(
            e,
            this.config.date_format,
            this.options.language
          )
        )
      ), s++;
    return [
      /* @__PURE__ */ new Date(
        d.format(
          e,
          this.config.date_format,
          this.options.language
        ) + " "
      ),
      i
    ];
  }
  bind_grid_click() {
    p.on(
      this.$container,
      "click",
      ".grid-row, .grid-header, .ignored-bar, .holiday-highlight",
      () => {
        this.unselect_all(), this.hide_popup();
      }
    );
  }
  bind_holiday_labels() {
    const t = this.$container.querySelectorAll(".holiday-highlight");
    for (let e of t) {
      const i = this.$container.querySelector(
        ".label_" + e.classList[1]
      );
      if (!i) continue;
      let s;
      e.onmouseenter = (r) => {
        s = setTimeout(() => {
          i.classList.add("show"), i.style.left = (r.offsetX || r.layerX) + "px", i.style.top = (r.offsetY || r.layerY) + "px";
        }, 300);
      }, e.onmouseleave = (r) => {
        clearTimeout(s), i.classList.remove("show");
      };
    }
  }
  get_start_end_positions() {
    if (!this.bars.length) return [0, 0, 0];
    let { x: t, width: e } = this.bars[0].group.getBBox(), i = t, s = t, r = t + e;
    return Array.prototype.forEach.call(this.bars, function({ group: a }, o) {
      let { x: h, width: l } = a.getBBox();
      h < i && (i = h), h > s && (s = h), h + l > r && (r = h + l);
    }), [i, s, r];
  }
  bind_bar_events() {
    let t = !1, e = 0, i = 0, s = !1, r = !1, a = null, o = [];
    this.bar_being_dragged = null;
    const h = () => t || s || r;
    this.$svg.onclick = (_) => {
      _.target.classList.contains("grid-row") && this.unselect_all();
    };
    let l = 0;
    if (p.on(this.$svg, "mousemove", ".bar-wrapper, .handle", (_) => {
      this.bar_being_dragged === !1 && Math.abs((_.offsetX || _.layerX) - l) > 10 && (this.bar_being_dragged = !0);
    }), p.on(this.$svg, "mousedown", ".bar-wrapper, .handle", (_, g) => {
      const c = p.closest(".bar-wrapper", g);
      g.classList.contains("left") ? (s = !0, g.classList.add("visible")) : g.classList.contains("right") ? (r = !0, g.classList.add("visible")) : g.classList.contains("bar-wrapper") && (t = !0), this.popup && this.popup.hide(), e = _.offsetX || _.layerX, _.offsetY || _.layerY, a = c.getAttribute("data-id");
      let u;
      this.options.move_dependencies ? u = [
        a,
        ...this.get_all_dependent_tasks(a)
      ] : u = [a], o = u.map((y) => this.get_bar(y)), this.bar_being_dragged = !1, l = e, o.forEach((y) => {
        const m = y.$bar;
        m.ox = m.getX(), m.oy = m.getY(), m.owidth = m.getWidth(), m.finaldx = 0;
      });
    }), this.options.infinite_padding) {
      let _ = !1;
      p.on(this.$container, "mousewheel", (g) => {
        let c = this.$container.scrollWidth / 2;
        if (!_ && g.currentTarget.scrollLeft <= c) {
          let u = g.currentTarget.scrollLeft;
          _ = !0, this.gantt_start = d.add(
            this.gantt_start,
            -this.config.extend_by_units,
            this.config.unit
          ), this.setup_date_values(), this.render(), g.currentTarget.scrollLeft = u + this.config.column_width * this.config.extend_by_units, setTimeout(() => _ = !1, 300);
        }
        if (!_ && g.currentTarget.scrollWidth - (g.currentTarget.scrollLeft + g.currentTarget.clientWidth) <= c) {
          let u = g.currentTarget.scrollLeft;
          _ = !0, this.gantt_end = d.add(
            this.gantt_end,
            this.config.extend_by_units,
            this.config.unit
          ), this.setup_date_values(), this.render(), g.currentTarget.scrollLeft = u, setTimeout(() => _ = !1, 300);
        }
      });
    }
    p.on(this.$container, "scroll", (_) => {
      let g = [];
      const c = this.bars.map(
        ({ group: w }) => w.getAttribute("data-id")
      );
      let u;
      i && (u = _.currentTarget.scrollLeft - i), this.current_date = d.add(
        this.gantt_start,
        _.currentTarget.scrollLeft / this.config.column_width * this.config.step,
        this.config.unit
      );
      let y = this.config.view_mode.upper_text(
        this.current_date,
        null,
        this.options.language
      ), m = this.upperTexts.find(
        (w) => w.textContent === y
      );
      this.current_date = d.add(
        this.gantt_start,
        (_.currentTarget.scrollLeft + m.clientWidth) / this.config.column_width * this.config.step,
        this.config.unit
      ), y = this.config.view_mode.upper_text(
        this.current_date,
        null,
        this.options.language
      ), m = this.upperTexts.find(
        (w) => w.textContent === y
      ), m !== this.$current && (this.$current && this.$current.classList.remove("current-upper"), m.classList.add("current-upper"), this.$current = m), i = _.currentTarget.scrollLeft;
      let [E, H, X] = this.get_start_end_positions();
      i > X + 100 ? (this.$adjust.innerHTML = "&larr;", this.$adjust.classList.remove("hide"), this.$adjust.onclick = () => {
        this.$container.scrollTo({
          left: H,
          behavior: "smooth"
        });
      }) : i + _.currentTarget.offsetWidth < E - 100 ? (this.$adjust.innerHTML = "&rarr;", this.$adjust.classList.remove("hide"), this.$adjust.onclick = () => {
        this.$container.scrollTo({
          left: E,
          behavior: "smooth"
        });
      }) : this.$adjust.classList.add("hide"), u && (g = c.map((w) => this.get_bar(w)), this.options.auto_move_label && g.forEach((w) => {
        w.update_label_position_on_horizontal_scroll({
          x: u,
          sx: _.currentTarget.scrollLeft
        });
      }));
    }), p.on(this.$svg, "mousemove", (_) => {
      if (!h()) return;
      const g = (_.offsetX || _.layerX) - e;
      o.forEach((c) => {
        const u = c.$bar;
        u.finaldx = this.get_snap_position(g, u.ox), this.hide_popup(), s ? a === c.task.id ? c.update_bar_position({
          x: u.ox + u.finaldx,
          width: u.owidth - u.finaldx
        }) : c.update_bar_position({
          x: u.ox + u.finaldx
        }) : r ? a === c.task.id && c.update_bar_position({
          width: u.owidth + u.finaldx
        }) : t && !this.options.readonly && !this.options.readonly_dates && c.update_bar_position({ x: u.ox + u.finaldx });
      });
    }), document.addEventListener("mouseup", () => {
      var _, g, c;
      t = !1, s = !1, r = !1, (c = (g = (_ = this.$container.querySelector(".visible")) == null ? void 0 : _.classList) == null ? void 0 : g.remove) == null || c.call(g, "visible");
    }), p.on(this.$svg, "mouseup", (_) => {
      this.bar_being_dragged = null, o.forEach((g) => {
        g.$bar.finaldx && (g.date_changed(), g.compute_progress(), g.set_action_completed());
      });
    }), this.bind_bar_progress();
  }
  bind_bar_progress() {
    let t = 0, e = null, i = null, s = null, r = null;
    p.on(this.$svg, "mousedown", ".handle.progress", (o, h) => {
      e = !0, t = o.offsetX || o.layerX, y_on_start = o.offsetY || o.layerY;
      const _ = p.closest(".bar-wrapper", h).getAttribute("data-id");
      i = this.get_bar(_), s = i.$bar_progress, r = i.$bar, s.finaldx = 0, s.owidth = s.getWidth(), s.min_dx = -s.owidth, s.max_dx = r.getWidth() - s.getWidth();
    });
    const a = this.config.ignored_positions.map((o) => [
      o,
      o + this.config.column_width
    ]);
    p.on(this.$svg, "mousemove", (o) => {
      if (!e) return;
      let h = o.offsetX || o.layerX;
      if (h > t) {
        let g = a.find(
          ([c, u]) => h >= c && h < u
        );
        for (; g; )
          h = g[1], g = a.find(
            ([c, u]) => h >= c && h < u
          );
      } else {
        let g = a.find(
          ([c, u]) => h > c && h <= u
        );
        for (; g; )
          h = g[0], g = a.find(
            ([c, u]) => h > c && h <= u
          );
      }
      let _ = h - t;
      _ > s.max_dx && (_ = s.max_dx), _ < s.min_dx && (_ = s.min_dx), s.setAttribute("width", s.owidth + _), p.attr(i.$handle_progress, "cx", s.getEndX()), s.finaldx = _;
    }), p.on(this.$svg, "mouseup", () => {
      e = !1, s && s.finaldx && (s.finaldx = 0, i.progress_changed(), i.set_action_completed(), i = null, s = null, r = null);
    });
  }
  get_all_dependent_tasks(t) {
    let e = [], i = [t];
    for (; i.length; ) {
      const s = i.reduce((r, a) => (r = r.concat(this.dependency_map[a]), r), []);
      e = e.concat(s), i = s.filter((r) => !i.includes(r));
    }
    return e.filter(Boolean);
  }
  get_snap_position(t, e) {
    let i = 1;
    const s = this.options.snap_at || this.config.view_mode.snap_at || "1d";
    if (s !== "unit") {
      const { duration: _, scale: g } = d.parse_duration(s);
      i = d.convert_scales(this.config.view_mode.step, g) / _;
    }
    const r = t % (this.config.column_width / i);
    let a = t - r + (r < this.config.column_width / i * 2 ? 0 : this.config.column_width / i), o = e + a;
    const h = a > 0 ? 1 : -1;
    let l = this.get_ignored_region(o, h);
    for (; l.length; )
      o += this.config.column_width * h, l = this.get_ignored_region(o, h), l.length || (o -= this.config.column_width * h);
    return o - e;
  }
  get_ignored_region(t, e = 1) {
    return e === 1 ? this.config.ignored_positions.filter((i) => t > i && t <= i + this.config.column_width) : this.config.ignored_positions.filter(
      (i) => t >= i && t < i + this.config.column_width
    );
  }
  unselect_all() {
    this.popup && this.popup.parent.classList.add("hide"), this.$container.querySelectorAll(".date-range-highlight").forEach((t) => t.classList.add("hide"));
  }
  view_is(t) {
    return typeof t == "string" ? this.config.view_mode.name === t : Array.isArray(t) ? t.some(view_is) : this.config.view_mode.name === t.name;
  }
  get_task(t) {
    return this.tasks.find((e) => e.id === t);
  }
  get_bar(t) {
    return this.bars.find((e) => e.task.id === t);
  }
  show_popup(t) {
    this.options.popup !== !1 && (this.popup || (this.popup = new O(
      this.$popup_wrapper,
      this.options.popup,
      this
    )), this.popup.show(t));
  }
  hide_popup() {
    this.popup && this.popup.hide();
  }
  trigger_event(t, e) {
    this.options["on_" + t] && this.options["on_" + t].apply(this, e);
  }
  /**
   * Gets the oldest starting date from the list of tasks
   *
   * @returns Date
   * @memberof Gantt
   */
  get_oldest_starting_date() {
    return this.tasks.length ? this.tasks.map((t) => t._start).reduce(
      (t, e) => e <= t ? e : t
    ) : /* @__PURE__ */ new Date();
  }
  /**
   * Clear all elements from the parent svg element
   *
   * @memberof Gantt
   */
  clear() {
    var t, e, i, s, r, a, o, h, l, _;
    this.$svg.innerHTML = "", (e = (t = this.$header) == null ? void 0 : t.remove) == null || e.call(t), (s = (i = this.$side_header) == null ? void 0 : i.remove) == null || s.call(i), (a = (r = this.$current_highlight) == null ? void 0 : r.remove) == null || a.call(r), (h = (o = this.$extras) == null ? void 0 : o.remove) == null || h.call(o), (_ = (l = this.popup) == null ? void 0 : l.hide) == null || _.call(l);
  }
}
B.VIEW_MODE = {
  HOUR: b[0],
  QUARTER_DAY: b[1],
  HALF_DAY: b[2],
  DAY: b[3],
  WEEK: b[4],
  MONTH: b[5],
  YEAR: b[6]
};
function N(n) {
  return n.name + "_" + Math.random().toString(36).slice(2, 12);
}
function $(n) {
  return n.replaceAll(" ", "_").replaceAll(":", "_").replaceAll(".", "_");
}
export {
  B as default
};
