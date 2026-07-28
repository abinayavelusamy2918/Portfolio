(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var page = document.body.getAttribute('data-page') || 'home';

  // Mobile nav toggle
  var menuBtn = document.getElementById('menuBtn');
  var sidebar = document.getElementById('sidebar');
  if(menuBtn){
    menuBtn.addEventListener('click', function(){ sidebar.classList.toggle('open'); });
  }
  document.querySelectorAll('#navlinks a').forEach(function(a){
    a.addEventListener('click', function(){ sidebar.classList.remove('open'); });
  });

  /* ========== BOOT INTRO ==========
     Injected from JS so the site stays fully usable with JS disabled.
     Plays once per tab session; skipped entirely under reduced-motion. */

  var BOOT_LINES = [
    { text: '> initializing AV://console',        ok: false },
    { text: '> loading profile ............. ok', ok: false },
    { text: '> programs shipped · 250K+ users',   ok: false },
    { text: '> ACCESS GRANTED',                   ok: true  }
  ];
  var GLYPHS = '01<>/\\[]{}#*+=-_$%&@ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function runBoot(done){
    var root = document.documentElement;
    root.classList.add('booting');

    var boot = document.createElement('div');
    boot.className = 'boot';
    boot.id = 'boot';
    boot.setAttribute('role', 'status');
    boot.setAttribute('aria-label', 'Loading portfolio');

    var inner = document.createElement('div');
    inner.className = 'boot-inner';

    var brand = document.createElement('div');
    brand.className = 'boot-brand';
    brand.textContent = 'AV://console';
    inner.appendChild(brand);

    var lineEls = BOOT_LINES.map(function(l){
      var el = document.createElement('div');
      el.className = 'boot-line' + (l.ok ? ' ok' : '');
      el.textContent = '';
      inner.appendChild(el);
      return el;
    });

    var bar = document.createElement('div');
    bar.className = 'boot-bar';
    var barFill = document.createElement('i');
    bar.appendChild(barFill);
    inner.appendChild(bar);

    var sweep = document.createElement('div');
    sweep.className = 'boot-sweep';

    boot.appendChild(inner);
    boot.appendChild(sweep);
    document.body.appendChild(boot);

    var timers = [];
    var finished = false;

    // Scramble-in: characters resolve left to right, unresolved ones churn.
    function scramble(el, text, duration, cb){
      var start = null;
      var total = text.length;
      function frame(ts){
        if(finished) return;
        if(start === null) start = ts;
        var p = Math.min(1, (ts - start) / duration);
        var locked = Math.floor(p * total);
        var out = text.slice(0, locked);
        for(var i = locked; i < total; i++){
          out += text[i] === ' '
            ? ' '
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
        if(p < 1){ requestAnimationFrame(frame); }
        else { el.textContent = text; if(cb) cb(); }
      }
      requestAnimationFrame(frame);
    }

    var STAGGER = 170;
    BOOT_LINES.forEach(function(l, i){
      timers.push(setTimeout(function(){
        if(finished) return;
        scramble(lineEls[i], l.text, 230);
        barFill.style.width = Math.round(((i + 1) / BOOT_LINES.length) * 100) + '%';
      }, i * STAGGER));
    });

    var END = BOOT_LINES.length * STAGGER + 260;

    function finish(skipped){
      if(finished) return;
      finished = true;
      timers.forEach(clearTimeout);

      // When skipped, jump straight to the wipe rather than replaying anything.
      boot.classList.add('sweeping');
      barFill.style.width = '100%';

      setTimeout(function(){
        boot.classList.add('done');
        root.classList.remove('booting');
        done();
        setTimeout(function(){
          if(boot.parentNode) boot.parentNode.removeChild(boot);
        }, 700);
      }, skipped ? 120 : 420);
    }

    timers.push(setTimeout(function(){ finish(false); }, END));

    // Let people bail out — recruiters in a hurry should never feel trapped.
    boot.addEventListener('click', function(){ finish(true); });
    window.addEventListener('keydown', function onKey(e){
      window.removeEventListener('keydown', onKey);
      finish(true);
    });
  }

  /* ========== PAGE MOTION (held until boot completes) ========== */

  function startPageMotion(){
    // Reveal on scroll
    var revealEls = document.querySelectorAll('.reveal');
    if(reduceMotion){
      revealEls.forEach(function(el){ el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      // Expand the trigger area downward instead of shrinking it: content
      // straddling the fold must be visible, otherwise the page looks finished
      // and nobody scrolls.
      }, { threshold: 0, rootMargin: '0px 0px 18% 0px' });

      // Anything already on screen is revealed outright. This runs late (after the
      // boot intro), so waiting on the observer's first dispatch would leave the
      // hero blank; it also lets the hero stagger in as part of the intro.
      var vh = window.innerHeight;
      revealEls.forEach(function(el){
        var top = el.getBoundingClientRect().top;
        if(top < vh){ el.classList.add('is-visible'); }
        else { io.observe(el); }
      });
    }

    // Animated counters
    var counters = document.querySelectorAll('[data-count]');
    function animateCounter(el){
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      if(reduceMotion){ el.textContent = target + suffix; return; }
      var dur = 1400;
      var start = null;
      function step(ts){
        if(start === null) start = ts;
        var progress = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(eased * target);
        el.textContent = current + suffix;
        if(progress < 1){ requestAnimationFrame(step); }
      }
      requestAnimationFrame(step);
    }
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    // Same reasoning as the reveals: counters already on screen run immediately.
    var cvh = window.innerHeight;
    counters.forEach(function(el){
      var box = el.getBoundingClientRect();
      if(box.top < cvh * 0.9 && box.bottom > 0){ animateCounter(el); }
      else { cio.observe(el); }
    });

    // Non-numeric console cells can't count up, so they decrypt instead —
    // same glyph-scramble used by the boot intro, so the four cells animate together.
    var scrambles = document.querySelectorAll('[data-scramble]');
    function scrambleIn(el){
      var text = el.getAttribute('data-scramble');
      if(reduceMotion){ el.textContent = text; return; }
      var start = null, dur = 1100;
      function frame(ts){
        if(start === null) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var locked = Math.floor(p * text.length);
        var out = text.slice(0, locked);
        for(var i = locked; i < text.length; i++){
          out += text[i] === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
        if(p < 1){ requestAnimationFrame(frame); } else { el.textContent = text; }
      }
      requestAnimationFrame(frame);
    }
    var svh = window.innerHeight;
    scrambles.forEach(function(el){
      var box = el.getBoundingClientRect();
      if(box.top < svh * 0.9 && box.bottom > 0){ scrambleIn(el); }
      else {
        var sio = new IntersectionObserver(function(entries){
          entries.forEach(function(e){ if(e.isIntersecting){ scrambleIn(e.target); sio.unobserve(e.target); } });
        }, { threshold: 0.6 });
        sio.observe(el);
      }
    });
  }

  /* ========== HERO: cursor depth parallax ========== */
  // Background layers drift at different rates, so the hero reads as layered
  // rather than flat. Written as CSS vars; the CSS uses the standalone
  // `translate` property so it composes with the existing drift keyframes.
  if(!reduceMotion && window.matchMedia('(pointer: fine)').matches){
    var root = document.documentElement;
    var pending = false, lastX = 0, lastY = 0;
    window.addEventListener('mousemove', function(e){
      lastX = e.clientX; lastY = e.clientY;
      if(pending) return;
      pending = true;
      requestAnimationFrame(function(){
        pending = false;
        var px = (lastX / window.innerWidth  - 0.5) * 2;   // -1 .. 1
        var py = (lastY / window.innerHeight - 0.5) * 2;
        root.style.setProperty('--px', px.toFixed(3));
        root.style.setProperty('--py', py.toFixed(3));
      });
    }, { passive: true });
  }

  /* ========== EXPERTISE: sliding card stack ========== */
  // Cards are layered; advancing slides the front one up and out and promotes
  // the next. Under reduced motion the CSS falls back to a plain stacked list.
  (function(){
    var stack = document.getElementById('pillarStack');
    var dotsWrap = document.getElementById('stackDots');
    if(!stack || reduceMotion) return;

    var cards = Array.prototype.slice.call(stack.querySelectorAll('.pillar'));
    if(cards.length < 2) return;
    var n = cards.length, active = 0, animating = false, timer = null;

    var dots = cards.map(function(card, i){
      var label = (card.querySelector('.tag') || {}).textContent || ('0' + (i + 1));
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sc-dot';
      b.innerHTML = '<i></i>' + label.trim();
      b.setAttribute('aria-label', 'Show ' + label.trim());
      b.addEventListener('click', function(e){ e.stopPropagation(); go(i); });
      dotsWrap.appendChild(b);
      return b;
    });

    function paint(){
      cards.forEach(function(c, i){
        c.setAttribute('data-pos', (i - active + n) % n);
      });
      dots.forEach(function(d, i){
        d.classList.toggle('active', i === active);
        // borrow the card's accent so the dot matches the discipline
        d.style.setProperty('--accent', getComputedStyle(cards[i]).getPropertyValue('--accent'));
      });
    }

    function go(next){
      if(animating || next === active) return;
      animating = true;
      var leaving = cards[active];
      leaving.classList.add('is-leaving');
      active = (next + n) % n;
      setTimeout(function(){
        leaving.classList.remove('is-leaving');
        paint();
        animating = false;
      }, 260);
      paint();
      restart();
    }

    function step(d){ go((active + d + n) % n); }

    stack.addEventListener('click', function(){ step(1); });
    document.querySelectorAll('#stackControls .sc-btn').forEach(function(b){
      b.addEventListener('click', function(e){
        e.stopPropagation();
        step(parseInt(b.getAttribute('data-dir'), 10));
      });
    });

    // gentle autoplay, paused whenever someone is actually looking at it
    function restart(){ clearInterval(timer); timer = setInterval(function(){ step(1); }, 5200); }
    stack.addEventListener('mouseenter', function(){ clearInterval(timer); });
    stack.addEventListener('mouseleave', restart);

    paint();
    restart();
  })();

  /* ========== SELECTED WORK: horizontal carousel ========== */
  (function(){
    var wrap = document.getElementById('projCarousel');
    var track = document.getElementById('projTrack');
    var dotsWrap = document.getElementById('pcDots');
    var prev = document.getElementById('pcPrev');
    var next = document.getElementById('pcNext');
    if(!wrap || !track) return;

    var cards = Array.prototype.slice.call(track.querySelectorAll('.proj-card'));
    if(!cards.length) return;
    var i = 0;

    // Mirror the CSS breakpoint directly. Measuring rendered widths was
    // unreliable before layout settled and produced a wrong dot count.
    var oneUp = window.matchMedia('(max-width: 860px)');
    function perView(){ return oneUp.matches ? 1 : 2; }
    function maxIndex(){ return Math.max(0, cards.length - perView()); }

    function paint(){
      var step = cards[0].getBoundingClientRect().width + 22;
      i = Math.min(i, maxIndex());
      track.style.transform = 'translateX(' + (-i * step) + 'px)';
      prev.disabled = i <= 0;
      next.disabled = i >= maxIndex();
      Array.prototype.forEach.call(dotsWrap.children, function(d, n){
        d.classList.toggle('active', n === i);
      });
    }

    function buildDots(){
      dotsWrap.innerHTML = '';
      for(var n = 0; n <= maxIndex(); n++){
        (function(n){
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'pc-dot';
          b.setAttribute('aria-label', 'Go to project ' + (n + 1));
          b.addEventListener('click', function(){ i = n; paint(); });
          dotsWrap.appendChild(b);
        })(n);
      }
    }

    prev.addEventListener('click', function(){ i = Math.max(0, i - 1); paint(); });
    next.addEventListener('click', function(){ i = Math.min(maxIndex(), i + 1); paint(); });

    function sync(){ buildDots(); paint(); }

    var rt = null;
    window.addEventListener('resize', function(){
      clearTimeout(rt);
      rt = setTimeout(sync, 150);
    });

    sync();
    // Measuring at parse time can read a pre-layout width, which makes perView
    // too high and wrongly disables the arrows. Re-sync once layout settles.
    requestAnimationFrame(sync);
    window.addEventListener('load', sync);
    if(window.ResizeObserver){
      new ResizeObserver(sync).observe(track.parentNode);
    }
  })();

  /* ========== SITE PREVIEW: cursor-tracked tilt ========== */
  // The card leans toward the cursor and lifts slightly, so it reads as openable.
  if(!reduceMotion){
    document.querySelectorAll('.site-preview, .pillar').forEach(function(card){
      var raf = null;
      function apply(e){
        raf = null;
        var r = card.getBoundingClientRect();
        // normalise cursor position within the card to -1..1 on each axis
        var mx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        var my = ((e.clientY - r.top)  / r.height - 0.5) * 2;
        card.style.setProperty('--mx', Math.max(-1, Math.min(1, mx)).toFixed(3));
        card.style.setProperty('--my', Math.max(-1, Math.min(1, my)).toFixed(3));
      }
      card.addEventListener('mouseenter', function(){ card.classList.add('is-tracking'); });
      card.addEventListener('mousemove', function(e){
        if(raf === null){ raf = requestAnimationFrame(function(){ apply(e); }); }
      });
      card.addEventListener('mouseleave', function(){
        if(raf !== null){ cancelAnimationFrame(raf); raf = null; }
        card.classList.remove('is-tracking'); // ease back to flat
        card.style.setProperty('--mx', 0);
        card.style.setProperty('--my', 0);
      });
    });
  }

  /* ========== ALWAYS-ON (independent of the intro) ========== */

  // Timeline item visibility (for node highlight)
  var tlItems = document.querySelectorAll('.tl-item');
  var tio = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.classList.add('is-visible'); }
    });
  }, { threshold: 0.4 });
  tlItems.forEach(function(el){ tio.observe(el); });

  // Timeline fill line tied to scroll progress within the timeline block
  var timeline = document.getElementById('timeline');
  var fill = document.getElementById('timelineFill');
  function updateFill(){
    if(!timeline || !fill) return;
    var rect = timeline.getBoundingClientRect();
    var vh = window.innerHeight;
    var total = rect.height;
    var visibleTop = vh * 0.8; // line starts filling when top passes 80% viewport height
    var progressPx = visibleTop - rect.top;
    var pct = Math.max(0, Math.min(1, progressPx / total));
    fill.style.height = (pct * 100) + '%';
  }
  if(!reduceMotion){
    window.addEventListener('scroll', function(){ requestAnimationFrame(updateFill); }, { passive: true });
    window.addEventListener('resize', updateFill);
    updateFill();
  } else if(fill){
    fill.style.height = '100%';
  }

  // Active nav link on scroll
  var sections = page === 'home' ? document.querySelectorAll('.section[id]') : [];
  var navA = document.querySelectorAll('#navlinks a');
  var navIO = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      var id = entry.target.getAttribute('id');
      var link = document.querySelector('#navlinks a[href="#' + id + '"]');
      if(!link) return;
      if(entry.isIntersecting){
        navA.forEach(function(a){ a.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }, { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' });
  sections.forEach(function(s){ navIO.observe(s); });

  /* ========== KICK OFF ========== */

  var seen = false;
  try { seen = sessionStorage.getItem('av_booted') === '1'; } catch(e){ /* private mode */ }

  // Deep links (#experience etc.) shouldn't sit behind an intro.
  var deepLink = window.location.hash && window.location.hash !== '#home';

  if(reduceMotion || seen || deepLink || page !== 'home'){
    startPageMotion();
  } else {
    try { sessionStorage.setItem('av_booted', '1'); } catch(e){}
    runBoot(startPageMotion);
  }
})();
