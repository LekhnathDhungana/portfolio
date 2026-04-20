(function () {
  var THEME_KEY = "portfolio-theme";

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function syncThemeToggleLabel() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    btn.setAttribute(
      "aria-label",
      dark ? "Use light appearance" : "Use dark appearance"
    );
  }

  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    syncThemeToggleLabel();
    themeBtn.addEventListener("click", function () {
      var next =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "light"
          : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {}
      syncThemeToggleLabel();
    });
  }

  var toggle = document.querySelector(".nav-menu-toggle");
  var panel = document.getElementById("site-nav-panel");
  if (toggle && panel) {
    function setPanelOpen(open) {
      panel.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    toggle.addEventListener("click", function () {
      setPanelOpen(!panel.classList.contains("is-open"));
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setPanelOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setPanelOpen(false);
    });
  }

  function safeHref(href) {
    if (!href || typeof href !== "string") return "#";
    if (/^#[\w-]+$/.test(href)) return href;
    if (/^mailto:/i.test(href)) return href;
    if (/^https?:\/\//i.test(href)) return href;
    if (href.indexOf("..") !== -1) return "#";
    if (/^[\w./-]+$/.test(href)) return href;
    return "#";
  }

  function appendRichParagraph(container, para) {
    if (para == null) return;
    var p = document.createElement("p");
    p.className = "view-depth-p";
    if (typeof para === "string") {
      p.textContent = para;
    } else if (Array.isArray(para)) {
      appendSegments(p, para);
    }
    container.appendChild(p);
  }

  function appendSegments(container, segments) {
    if (!segments || !segments.length) return;
    segments.forEach(function (seg) {
      if (seg == null) return;
      if (typeof seg.text === "string") {
        container.appendChild(document.createTextNode(seg.text));
        return;
      }
      if (seg.link && seg.link.href) {
        var a = document.createElement("a");
        a.href = safeHref(seg.link.href);
        a.textContent = seg.link.text || "";
        if (seg.link.newTab === true) {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        } else if (/^https?:\/\//i.test(seg.link.href)) {
          a.rel = "noopener noreferrer";
          a.target = "_blank";
        }
        if (seg.link.download && seg.link.newTab !== true) {
          a.setAttribute("download", "");
        }
        container.appendChild(a);
        return;
      }
      if (typeof seg.strong === "string") {
        var s = document.createElement("strong");
        s.textContent = seg.strong;
        container.appendChild(s);
      }
    });
  }

  function appendOutlineCta(container, cta) {
    if (!container || !cta || !(cta.href || cta.file)) return;
    var ctaHref = cta.href || cta.file;
    var ctaWrap = document.createElement("p");
    ctaWrap.className = "intro-cta-wrap";
    var a = document.createElement("a");
    a.className = "btn-outline";
    a.href = safeHref(ctaHref);
    a.textContent = cta.label || "Resume";
    if (cta.newTab === true) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    } else if (!/^#/.test(ctaHref)) {
      a.setAttribute("download", "");
    }
    ctaWrap.appendChild(a);
    container.appendChild(ctaWrap);
  }

  function findBulletsForItem(item, positions) {
    if (!positions || !positions.length) return [];
    var title = (item.title || "").trim();
    if (!title) return [];
    for (var i = 0; i < positions.length; i++) {
      var pos = positions[i];
      if ((pos.title || "").trim() === title) {
        return pos.bullets || [];
      }
    }
    return [];
  }

  var EXPERIENCE_ICON_HTML = {
    education:
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    briefcase:
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke-linecap="round"/></svg>',
    chart:
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M18 20V10M12 20V4M6 20v-6" stroke-linecap="round"/></svg>',
    heart:
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke-linejoin="round"/></svg>',
    users:
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke-linecap="round"/></svg>',
  };

  function renderExperienceCanvas(root, data, opts) {
    opts = opts || {};
    if (opts.clear !== false) {
      root.innerHTML = "";
    }
    root.removeAttribute("aria-busy");
    root.classList.add("exp-canvas-host");

    var wrap = document.createElement("div");
    wrap.className = "exp-view";
    if (opts.variant === "home") {
      wrap.classList.add("exp-view--home");
    }

    var head = document.createElement("header");
    head.className = "exp-view-head";

    var h2 = document.createElement("h2");
    h2.className = "intro-title exp-view-hero-title";
    h2.id =
      opts.variant === "home"
        ? "home-experience-heading"
        : "view-experience-heading";
    var lead = typeof data.heroLead === "string" && data.heroLead.trim();
    if (lead) {
      var greet = document.createElement("span");
      greet.className = "intro-greet";
      greet.textContent = data.heroLead.trim();
      h2.appendChild(greet);
    }
    var name = document.createElement("span");
    name.className = "intro-name";
    name.textContent = data.heading || "Experience";
    h2.appendChild(name);
    head.appendChild(h2);

    if (data.subSegments && data.subSegments.length) {
      var sub = document.createElement("p");
      sub.className = "intro-lede exp-view-lede";
      appendSegments(sub, data.subSegments);
      head.appendChild(sub);
    }
    appendOutlineCta(head, data.cta);
    wrap.appendChild(head);

    var groupsEl = document.createElement("div");
    groupsEl.className = "exp-groups";

    (data.groups || []).forEach(function (grp) {
      var sec = document.createElement("section");
      sec.className = "exp-group";

      var gh = document.createElement("h3");
      gh.className = "exp-group-heading";
      gh.textContent = grp.heading || "";
      sec.appendChild(gh);

      var items = document.createElement("div");
      items.className = "exp-group-items";

      (grp.items || []).forEach(function (item) {
        var art = document.createElement("article");
        art.className = "exp-row";

        var main = document.createElement("div");
        main.className = "exp-row-main";

        var iconWrap = document.createElement("span");
        iconWrap.className = "exp-row-icon";
        iconWrap.innerHTML =
          EXPERIENCE_ICON_HTML[item.icon] || EXPERIENCE_ICON_HTML.briefcase;
        main.appendChild(iconWrap);

        var text = document.createElement("div");
        text.className = "exp-row-text";
        var titleEl = document.createElement("strong");
        titleEl.className = "exp-row-title";
        titleEl.textContent = item.title || "";
        text.appendChild(titleEl);
        var meta = document.createElement("p");
        meta.className = "exp-row-meta";
        meta.textContent = item.meta || "";
        text.appendChild(meta);

        var bullets = findBulletsForItem(item, opts.positions);
        if (bullets.length) {
          var ul = document.createElement("ul");
          ul.className = "exp-row-bullets";
          bullets.forEach(function (b) {
            var li = document.createElement("li");
            li.textContent = b;
            ul.appendChild(li);
          });
          text.appendChild(ul);
        }

        main.appendChild(text);

        art.appendChild(main);

        if (item.aside || item.asideImage) {
          art.classList.add("exp-row--aside");
          var aside = document.createElement("div");
          aside.className = "exp-row-aside";
          if (item.asideImage) {
            var logo = document.createElement("img");
            logo.className = "exp-row-aside-logo";
            logo.src = safeHref(item.asideImage);
            logo.alt = item.asideAlt || item.aside || "Organization logo";
            logo.loading = "lazy";
            logo.decoding = "async";
            aside.appendChild(logo);
          } else {
            aside.setAttribute("aria-hidden", "true");
            aside.textContent = item.aside;
          }
          art.appendChild(aside);
        }

        items.appendChild(art);
      });

      sec.appendChild(items);
      groupsEl.appendChild(sec);
    });

    wrap.appendChild(groupsEl);
    root.appendChild(wrap);
    root.setAttribute("data-content-loaded", "true");
  }

  function renderAbout(data) {
    var root = document.getElementById("intro");
    if (!root) return;
    root.innerHTML = "";
    root.removeAttribute("aria-busy");

    var h1 = document.createElement("h1");
    h1.className = "intro-title";
    var greet = document.createElement("span");
    greet.className = "intro-greet";
    greet.textContent = data.greet || "Hey, I'm";
    var name = document.createElement("span");
    name.className = "intro-name";
    name.textContent = data.name || "";
    h1.appendChild(greet);
    h1.appendChild(name);
    root.appendChild(h1);

    var rolesP = document.createElement("p");
    rolesP.className = "intro-roles";
    (data.roles || []).forEach(function (role, i) {
      if (i > 0) {
        var pipe = document.createElement("span");
        pipe.className = "intro-pipe";
        pipe.setAttribute("aria-hidden", "true");
        pipe.textContent = "|";
        rolesP.appendChild(pipe);
      }
      var span = document.createElement("span");
      span.textContent = role;
      rolesP.appendChild(span);
    });
    root.appendChild(rolesP);

    (data.paragraphs || []).forEach(function (segments) {
      var p = document.createElement("p");
      p.className = "intro-lede";
      appendSegments(p, segments);
      root.appendChild(p);
    });

    appendOutlineCta(root, data.cta);

    root.setAttribute("data-content-loaded", "true");
  }

  function renderExperienceInto(root, data, opts) {
    opts = opts || {};
    if (!root || !data) return;
    if (opts.clear !== false) {
      root.innerHTML = "";
    }
    root.classList.remove("exp-canvas-host");
    root.removeAttribute("aria-busy");

    var h2 = document.createElement("h2");
    h2.className = "section-heading";
    h2.id = "home-experience-heading";
    h2.textContent = data.heading || "Experience";
    root.appendChild(h2);

    var sub = document.createElement("p");
    sub.className = "section-sub";
    appendSegments(sub, data.subSegments || []);
    root.appendChild(sub);

    var ol = document.createElement("ol");
    ol.className = "timeline";
    (data.positions || []).forEach(function (pos) {
      var li = document.createElement("li");
      li.className = "timeline-item";

      var dates = document.createElement("p");
      dates.className = "timeline-dates";
      dates.textContent = pos.dates || "";
      li.appendChild(dates);

      var body = document.createElement("div");
      body.className = "timeline-body";

      var h3 = document.createElement("h3");
      h3.textContent = pos.title || "";
      body.appendChild(h3);

      var org = document.createElement("p");
      org.className = "timeline-org";
      org.textContent = pos.org || "";
      body.appendChild(org);

      var ul = document.createElement("ul");
      (pos.bullets || []).forEach(function (b) {
        var item = document.createElement("li");
        item.textContent = b;
        ul.appendChild(item);
      });
      body.appendChild(ul);

      li.appendChild(body);
      ol.appendChild(li);
    });
    root.appendChild(ol);
    root.setAttribute("data-content-loaded", "true");
  }

  function renderExperience(data) {
    var root = document.getElementById("home-experience");
    if (!root || !data) return;
    var ev = viewsCache && viewsCache.experienceView;
    if (ev && ev.groups && ev.groups.length) {
      renderExperienceCanvas(root, ev, {
        clear: true,
        variant: "home",
        positions: data.positions || [],
      });
    } else {
      renderExperienceInto(root, data, { clear: true });
    }
  }

  function renderProjectsInto(root, data, opts) {
    opts = opts || {};
    if (!root || !data) return;
    if (opts.clear !== false) {
      root.innerHTML = "";
    }
    root.removeAttribute("aria-busy");

    var head = document.createElement("header");
    head.className = "exp-view-head";

    var h2 = document.createElement("h2");
    h2.className = "intro-title exp-view-hero-title";
    var name = document.createElement("span");
    name.className = "intro-name";
    name.textContent = data.heading || "Projects";
    h2.appendChild(name);
    head.appendChild(h2);

    if (data.sub) {
      var sub = document.createElement("p");
      sub.className = "intro-lede exp-view-lede";
      sub.textContent = data.sub;
      head.appendChild(sub);
    }

    root.appendChild(head);

    var grid = document.createElement("div");
    grid.className = "project-grid";

    (data.items || []).forEach(function (item) {
      var card = document.createElement("article");
      card.className = "project-card";

      var media = document.createElement("div");
      media.className = "project-card-media";
      media.setAttribute("aria-hidden", "true");
      media.style.background =
        item.coverGradient ||
        "linear-gradient(145deg, rgba(39, 174, 96, 0.22), rgba(41, 128, 185, 0.22))";

      var mediaLabel = document.createElement("span");
      mediaLabel.className = "project-card-media-label";
      mediaLabel.textContent = item.coverLabel || item.title || "Project";
      media.appendChild(mediaLabel);
      card.appendChild(media);

      var text = document.createElement("div");
      text.className = "project-card-text";

      var tagEl = document.createElement("p");
      tagEl.className = "project-card-tag";
      tagEl.textContent = item.tag || "PROJECT";
      text.appendChild(tagEl);

      var titleEl = document.createElement("h3");
      titleEl.className = "project-card-title";
      titleEl.textContent = item.title || "";
      text.appendChild(titleEl);

      if (item.summary) {
        var summary = document.createElement("p");
        summary.className = "project-card-summary";
        summary.textContent = item.summary;
        text.appendChild(summary);
      }
      card.appendChild(text);

      var href = typeof item.href === "string" ? item.href.trim() : "";
      if (href) {
        var link = document.createElement("a");
        link.className = "project-card-link";
        link.href = safeHref(href);
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute(
          "aria-label",
          "Open " + (item.title || "project") + " website"
        );
        link.appendChild(card);
        grid.appendChild(link);
      } else {
        grid.appendChild(card);
      }
    });

    root.appendChild(grid);
    root.setAttribute("data-content-loaded", "true");
  }

  function renderProjects(data) {
    renderProjectsInto(document.getElementById("home-projects"), data);
  }

  function showLoadError(id, message) {
    var root = document.getElementById(id);
    if (!root) return;
    root.removeAttribute("aria-busy");
    root.removeAttribute("data-content-loaded");
    root.innerHTML =
      '<p class="content-error" role="alert">' +
      (message || "Could not load this section.") +
      "</p>";
  }

  function fetchJson(path) {
    return fetch(path, { credentials: "same-origin" }).then(function (r) {
      if (!r.ok) throw new Error(r.status + " " + path);
      return r.json();
    });
  }

  function closeMobileNavPanel() {
    var toggle = document.querySelector(".nav-menu-toggle");
    var panel = document.getElementById("site-nav-panel");
    if (toggle && panel) {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  var viewsCache = null;
  var experienceCache = null;
  var projectsCache = null;

  function appendViewNarrative(container, block) {
    if (!container || !block) return;
    if (block.title) {
      var h3 = document.createElement("h3");
      h3.className = "view-depth-title";
      h3.textContent = block.title;
      container.appendChild(h3);
    }
    if (block.lead) {
      var lead = document.createElement("p");
      lead.className = "view-depth-lead";
      if (typeof block.lead === "string") {
        lead.textContent = block.lead;
      } else if (Array.isArray(block.lead)) {
        appendSegments(lead, block.lead);
      }
      container.appendChild(lead);
    }
    (block.sections || []).forEach(function (sec) {
      var box = document.createElement("div");
      box.className = "view-depth-section";
      if (sec.heading) {
        var h4 = document.createElement("h4");
        h4.className = "view-depth-heading";
        h4.textContent = sec.heading;
        box.appendChild(h4);
      }
      (sec.paragraphs || []).forEach(function (para) {
        appendRichParagraph(box, para);
      });
      if (sec.bullets && sec.bullets.length) {
        var ul = document.createElement("ul");
        ul.className = "view-depth-list";
        sec.bullets.forEach(function (b) {
          var li = document.createElement("li");
          li.textContent = b;
          ul.appendChild(li);
        });
        box.appendChild(ul);
      }
      container.appendChild(box);
    });
  }

  function populateDedicatedExperience() {
    var root = document.getElementById("view-experience-body");
    if (!root || root.getAttribute("data-populated") === "1") return;
    root.innerHTML = "";
    root.classList.remove("exp-canvas-host");
    if (viewsCache && viewsCache.experience) {
      appendViewNarrative(root, viewsCache.experience);
    }
    var ev = viewsCache && viewsCache.experienceView;
    var hasExperienceView = ev && ev.groups && ev.groups.length;
    if (!hasExperienceView && experienceCache) {
      var divider = document.createElement("div");
      divider.className = "view-narrative-divider";
      divider.textContent = "Timeline";
      root.appendChild(divider);
    }
    if (hasExperienceView) {
      renderExperienceCanvas(root, ev, {
        clear: false,
        positions:
          experienceCache && experienceCache.positions
            ? experienceCache.positions
            : [],
      });
    } else if (experienceCache) {
      renderExperienceInto(root, experienceCache, { clear: false });
    }
    root.setAttribute("data-populated", "1");
  }

  function populateDedicatedProjects() {
    var root = document.getElementById("view-projects-body");
    if (!root) return;
    root.innerHTML = "";
    if (projectsCache) {
      renderProjectsInto(root, projectsCache, { clear: false });
    }
  }

  function setNavActive(navId) {
    document.querySelectorAll(".nav-link[data-nav]").forEach(function (link) {
      var m = link.getAttribute("data-nav") === navId;
      link.classList.toggle("is-active", m);
    });
  }

  function applyRoute(route, opts) {
    opts = opts || {};
    var home = document.getElementById("route-home");
    var rx = document.getElementById("route-experience");
    var rp = document.getElementById("route-projects");
    if (!home || !rx || !rp) return;
    document.body.setAttribute("data-route", route);
    closeMobileNavPanel();

    if (route === "home") {
      home.removeAttribute("hidden");
      rx.setAttribute("hidden", "");
      rp.setAttribute("hidden", "");
      setNavActive("intro");
      window.scrollTo(0, 0);
      if (opts.smoothScrollIntro) {
        var introEl = document.getElementById("intro");
        if (introEl) {
          var reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;
          introEl.scrollIntoView({
            behavior: reduce ? "auto" : "smooth",
            block: "start",
          });
        }
      }
      if (opts.replaceHash !== false) {
        try {
          history.replaceState(null, "", "#intro");
        } catch (e) {}
      }
    } else if (route === "experience") {
      home.setAttribute("hidden", "");
      rx.removeAttribute("hidden");
      rp.setAttribute("hidden", "");
      setNavActive("experience");
      populateDedicatedExperience();
      window.scrollTo(0, 0);
      if (opts.replaceHash !== false) {
        try {
          history.replaceState(null, "", "#experience");
        } catch (e2) {}
      }
    } else if (route === "projects") {
      home.setAttribute("hidden", "");
      rx.setAttribute("hidden", "");
      rp.removeAttribute("hidden");
      setNavActive("projects");
      populateDedicatedProjects();
      window.scrollTo(0, 0);
      if (opts.replaceHash !== false) {
        try {
          history.replaceState(null, "", "#projects");
        } catch (e3) {}
      }
    }
  }

  function sectionIdToNav(sectionId) {
    if (sectionId === "home-experience") return "experience";
    if (sectionId === "home-projects") return "projects";
    return "intro";
  }

  function initScrollSpyHome() {
    var sections = document.querySelectorAll(
      "#intro, #home-experience, #home-projects"
    );
    if (!sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        if (document.body.getAttribute("data-route") !== "home") return;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          setNavActive(sectionIdToNav(entry.target.id));
        });
      },
      { rootMargin: "-5% 0px -10% 0px", threshold: 0 }
    );

    sections.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initAutoHideHeaderOnScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    var lastY = window.scrollY || 0;
    var revealTimer = null;
    var HIDE_MIN_SCROLL = 96;
    var DELTA = 6;
    var REVEAL_DELAY_MS = 140;

    function revealSoon() {
      if (revealTimer) {
        clearTimeout(revealTimer);
      }
      revealTimer = setTimeout(function () {
        header.classList.remove("is-hidden");
        revealTimer = null;
      }, REVEAL_DELAY_MS);
    }

    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY || 0;
        var dy = y - lastY;

        // Keep the header visible near the top of the page.
        if (y <= HIDE_MIN_SCROLL) {
          header.classList.remove("is-hidden");
          lastY = y;
          revealSoon();
          return;
        }

        if (dy > DELTA) {
          header.classList.add("is-hidden");
        } else if (dy < -DELTA) {
          header.classList.remove("is-hidden");
        }

        lastY = y;
        revealSoon();
      },
      { passive: true }
    );
  }

  function syncRouteFromHash() {
    var h = (location.hash || "").replace("#", "");
    if (h === "experience") {
      applyRoute("experience", { replaceHash: false });
    } else if (h === "projects") {
      applyRoute("projects", { replaceHash: false });
    } else {
      applyRoute("home", {
        replaceHash: true,
        smoothScrollIntro: false,
      });
    }
  }

  function initMainNavRouting() {
    function onNavClick(e) {
      var href = this.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      var id = href.replace("#", "");
      if (id !== "intro" && id !== "experience" && id !== "projects") return;
      e.preventDefault();
      if (id === "intro") {
        applyRoute("home", { smoothScrollIntro: false, replaceHash: true });
        return;
      }
      if (id === "experience") {
        applyRoute("experience");
        return;
      }
      if (id === "projects") {
        applyRoute("projects");
      }
    }

    document.querySelectorAll(".nav-link[href^='#']").forEach(function (a) {
      a.addEventListener("click", onNavClick);
    });

    var avatar = document.querySelector('.avatar-link[href="#intro"]');
    if (avatar) {
      avatar.addEventListener("click", function (e) {
        e.preventDefault();
        applyRoute("home", { smoothScrollIntro: false, replaceHash: true });
      });
    }

    window.addEventListener("hashchange", function () {
      syncRouteFromHash();
    });
  }

  function runSequentialSectionReveals() {
    var intro = document.getElementById("intro");
    var ex = document.getElementById("home-experience");
    var pr = document.getElementById("home-projects");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var animMs = 720;
    var gapMs = 120;
    var step = animMs + gapMs;

    function reveal(el) {
      if (!el) return;
      if (el.getAttribute("data-content-loaded") === "true") {
        el.classList.add("reveal-section--in");
      }
    }

    if (reduce) {
      reveal(intro);
      reveal(ex);
      reveal(pr);
      return;
    }

    requestAnimationFrame(function () {
      reveal(intro);
    });

    setTimeout(function () {
      reveal(ex);
    }, step);

    setTimeout(function () {
      reveal(pr);
    }, 2 * step);
  }

  Promise.allSettled([
    fetchJson("data/about.json")
      .then(renderAbout)
      .catch(function (e) {
        console.error(e);
        showLoadError(
          "intro",
          "Could not load about content. Open the site via a local server (not file://) or check data/about.json."
        );
      }),
    fetchJson("data/experience.json")
      .then(function (data) {
        experienceCache = data;
        return data;
      })
      .catch(function (e) {
        console.error(e);
        showLoadError("home-experience", "Could not load experience data.");
      }),
    fetchJson("data/projects.json")
      .then(function (data) {
        projectsCache = data;
        renderProjects(data);
        return data;
      })
      .catch(function (e) {
        console.error(e);
        showLoadError("home-projects", "Could not load projects data.");
      }),
    fetchJson("data/views.json").catch(function (e) {
      console.warn(e);
      return null;
    }),
  ]).then(function (results) {
    viewsCache =
      results[3] && results[3].status === "fulfilled" ? results[3].value : null;
    if (experienceCache) {
      renderExperience(experienceCache);
    }
    initMainNavRouting();
    syncRouteFromHash();
    initAutoHideHeaderOnScroll();
    initScrollSpyHome();
    runSequentialSectionReveals();
  });
})();
