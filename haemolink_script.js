'use strict';

/* ── Page & nav registry ── */
var ALL_PAGES = ['home','register','login','profile','donor','find','hospital','appointment','notif'];
var NAV_IDS   = {home:'nb-home',find:'nb-find',donor:'nb-donor',hospital:'nb-hospital',appointment:'nb-appointment',notif:'nb-notif',register:'nb-register'};
var DOT_ORDER = ['home','find','donor','hospital','appointment','notif','profile'];

/* ── Navigation ── */
function nav(id) {
  ALL_PAGES.forEach(function(p) {
    var el = document.getElementById('page-' + p);
    if (el) el.classList.remove('active');
  });
  document.querySelectorAll('.nb').forEach(function(b) { b.classList.remove('active'); });
  var pg = document.getElementById('page-' + id);
  if (pg) pg.classList.add('active');
  var nb = document.getElementById(NAV_IDS[id]);
  if (nb) nb.classList.add('active');
  document.querySelectorAll('.pdot').forEach(function(d, i) {
    d.classList.toggle('active', DOT_ORDER[i] === id);
  });
  window.scrollTo(0, 0);
  // Close mobile menu
  document.getElementById('mob-menu').classList.remove('open');
}

/* ── Scroll ── */
window.addEventListener('scroll', function() {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

/* ── Mobile menu ── */
function toggleMob() {
  document.getElementById('mob-menu').classList.toggle('open');
}

/* ── Toast ── */
function toast(icon, title, msg) {
  var wrap = document.getElementById('toast-wrap');
  var t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML =
    '<span class="t-icon">' + icon + '</span>' +
    '<div style="flex:1"><div class="t-title">' + title + '</div>' +
    (msg ? '<div class="t-msg">' + msg + '</div>' : '') + '</div>' +
    '<span class="t-x" onclick="this.parentElement.remove()">×</span>';
  wrap.appendChild(t);
  setTimeout(function() {
    t.style.opacity = '0';
    t.style.transform = 'translateX(28px)';
    setTimeout(function() { if (t.parentNode) t.remove(); }, 320);
  }, 4200);
}

/* ── Modal ── */
function openModal(html) {
  document.getElementById('modal-cnt').innerHTML = html;
  document.getElementById('modal-bg').classList.add('open');
}
function closeModal() {
  document.getElementById('modal-bg').classList.remove('open');
}
function bgClick(e) {
  if (e.target === document.getElementById('modal-bg')) closeModal();
}

function openDonorModal(name, bt, city) {
  var initials = name.split(' ').map(function(n) { return n[0]; }).join('');
  openModal(
    '<h3 style="font-family:var(--fh);font-size:22px;font-weight:800;margin-bottom:6px">Donor Details</h3>' +
    '<p style="font-size:13px;color:var(--muted);margin-bottom:22px">Full profile for this blood donor</p>' +
    '<div class="flex aic g16 mb20">' +
    '<div class="d-av" style="width:58px;height:58px;font-size:22px">' + initials + '</div>' +
    '<div style="flex:1"><div style="font-family:var(--fh);font-size:20px;font-weight:800">' + name + '</div>' +
    '<div style="font-size:13px;color:var(--muted)">Verified Donor · ' + city + ', Cameroon</div></div>' +
    '<span class="btc">' + bt + '</span></div>' +
    '<div class="card" style="padding:0;overflow:hidden;margin-bottom:22px">' +
    '<div class="prow" style="padding:12px 16px"><span class="prow-l">Blood Type</span><span class="btc btc-sm">' + bt + '</span></div>' +
    '<div class="prow" style="padding:12px 16px"><span class="prow-l">Location</span><span class="prow-v">' + city + ', Cameroon</span></div>' +
    '<div class="prow" style="padding:12px 16px"><span class="prow-l">Total Donations</span><span class="prow-v">8</span></div>' +
    '<div class="prow" style="padding:12px 16px"><span class="prow-l">Last Donated</span><span class="prow-v">2 weeks ago</span></div>' +
    '<div class="prow" style="padding:12px 16px"><span class="prow-l">Status</span><span class="badge b-grn">Available</span></div>' +
    '<div class="prow" style="padding:12px 16px;border:none"><span class="prow-l">Verified</span><span class="prow-v">✓ Identity &amp; Health Verified</span></div></div>' +
    '<div class="flex g12">' +
    '<button class="btn btn-p btn-md fw" onclick="toast(\'📨\',\'Request Sent\',\'' + name + ' has been notified\');closeModal()">Request Donation</button>' +
    '<button class="btn btn-s btn-md fw" onclick="toast(\'💬\',\'Message Sent\',\'Your message was delivered\');closeModal()">Send Message</button></div>'
  );
}

/* ── Blood type grid ── */
var BT_TEXTS = {
  'A+':  'A+ donors give to <strong style="color:var(--r300)">A+ and AB+</strong>. With 840 active donors across Cameroon, this is a very common type.',
  'A−':  'A− donors give to <strong style="color:var(--r300)">A+, A−, AB+, AB−</strong>. Universal plasma donor. 210 donors currently available.',
  'B+':  'B+ donors give to <strong style="color:var(--r300)">B+ and AB+</strong>. 650 active donors available across the network.',
  'B−':  'B− donors give to <strong style="color:var(--r300)">B+, B−, AB+, AB−</strong>. Rare type — only 120 donors available in Cameroon.',
  'AB+': 'AB+ is the <strong style="color:var(--r300)">Universal Recipient</strong> — can receive blood from all types. 390 active donors.',
  'AB−': 'AB− donors give to <strong style="color:var(--r300)">AB+ and AB−</strong>. Very rare — only 54 donors. Also a universal plasma donor.',
  'O+':  'O+ is the <strong style="color:var(--r300)">most common type in Cameroon</strong> — donates to all positive types. 1,320 donors available.',
  'O−':  'O− is the <strong style="color:var(--r300)">Universal Donor</strong> — compatible with every blood type. Only 280 donors — critically needed!'
};
function selBT(el, type) {
  document.querySelectorAll('.bt-cell').forEach(function(c) { c.classList.remove('sel'); });
  el.classList.add('sel');
  var box = document.getElementById('bt-info');
  if (box) box.innerHTML = '<strong style="color:#fff">' + type + '</strong> — ' + (BT_TEXTS[type] || '');
}

/* ── Blood type picker (forms) ── */
function pickBTP(groupId, el) {
  document.querySelectorAll('#' + groupId + ' .btp-btn').forEach(function(b) { b.classList.remove('active'); });
  el.classList.add('active');
}

/* ── Role picker ── */
function pickRole(groupId, el) {
  var g = document.getElementById(groupId);
  if (!g) return;
  g.querySelectorAll('.ropt').forEach(function(o) { o.classList.remove('active'); });
  el.classList.add('active');
  // On register page: hide blood type field for hospitals
  if (groupId === 'rp-reg') {
    var wrap = document.getElementById('reg-bt-wrap');
    if (wrap) {
      var txt = el.innerText || el.textContent;
      wrap.style.display = txt.indexOf('Hospital') > -1 ? 'none' : '';
    }
  }
}

/* ── Donation type picker ── */
function pickDT(el) {
  document.querySelectorAll('#dt-grid .dt-btn').forEach(function(b) { b.classList.remove('active'); });
  el.classList.add('active');
}

/* ── Toggle switch ── */
function toggleSw(el) { el.classList.toggle('off'); }

/* ── Auth actions ── */
function doRegister() {
  var name  = document.getElementById('reg-name');
  var email = document.getElementById('reg-email');
  var pass  = document.getElementById('reg-pass');
  if (!name || !name.value.trim())  { toast('⚠️', 'Missing name', 'Please enter your full name'); return; }
  if (!email || !email.value.trim()){ toast('⚠️', 'Missing email', 'Please enter your email address'); return; }
  if (!pass  || pass.value.length < 6){ toast('⚠️', 'Weak password', 'Password must be at least 6 characters'); return; }
  toast('🎉', 'Account Created!', 'Welcome to HaemoLink Cameroon!');
  setTimeout(function() { nav('profile'); }, 900);
}

function doLogin() {
  var email = document.getElementById('login-email');
  var pass  = document.getElementById('login-pass');
  if (!email || !email.value.trim()){ toast('⚠️', 'Missing email', 'Please enter your email'); return; }
  if (!pass  || !pass.value.trim()) { toast('⚠️', 'Missing password', 'Please enter your password'); return; }
  toast('✅', 'Signed In', 'Welcome back to HaemoLink Cameroon!');
  document.getElementById('npip').style.display = 'block';
  setTimeout(function() { nav('profile'); }, 900);
}

/* ── Notifications ── */
function setNTab(el) {
  document.querySelectorAll('.ntab').forEach(function(t) { t.classList.remove('active'); });
  el.classList.add('active');
}
function markAllRead() {
  document.querySelectorAll('.ni.unread').forEach(function(i) { i.classList.remove('unread'); });
  document.querySelectorAll('.ni-pip').forEach(function(p) { p.remove(); });
  document.getElementById('npip').style.display = 'none';
  toast('✓', 'All Read', 'All notifications marked as read');
}
function readNI(el) {
  el.classList.remove('unread');
  var p = el.querySelector('.ni-pip');
  if (p) p.remove();
}

/* ── Animated counters ── */
function animCount(id, target) {
  var el = document.getElementById(id);
  if (!el) return;
  var cur = 0, step = Math.ceil(target / 60);
  var t = setInterval(function() {
    cur = Math.min(cur + step, target);
    el.textContent = cur.toLocaleString();
    if (cur >= target) clearInterval(t);
  }, 22);
}

/* ── Init ── */
(function init() {
  // Default appointment date = tomorrow
  var d = new Date();
  d.setDate(d.getDate() + 1);
  var ad = document.getElementById('appt-date');
  if (ad) ad.value = d.toISOString().split('T')[0];

  // Run counters
  setTimeout(function() {
    animCount('cnt-d', 3864);
    animCount('cnt-l', 9200);
    animCount('cnt-h', 48);
  }, 350);
})();