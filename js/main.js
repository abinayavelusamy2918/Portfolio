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
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

      // Anything already on screen is revealed outright. This runs late (after the
      // boot intro), so waiting on the observer's first dispatch would leave the
      // hero blank; it also lets the hero stagger in as part of the intro.
      var vh = window.innerHeight;
      revealEls.forEach(function(el){
        var top = el.getBoundingClientRect().top;
        if(top < vh * 0.9){ el.classList.add('is-visible'); }
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
  }

  /* ========== SITE PREVIEW: cursor-tracked tilt ========== */
  // The card leans toward the cursor and lifts slightly, so it reads as openable.
  if(!reduceMotion){
    document.querySelectorAll('.site-preview').forEach(function(card){
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
