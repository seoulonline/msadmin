// ===== 사이드바 메뉴 토글 =====
document.querySelectorAll('.nav-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.closest('.nav-item').classList.toggle('expanded');
  });
});

// ===== 햄버거: 사이드바 축소/확장 =====
const sidebar = document.getElementById('sidebar');
document.getElementById('hamburgerBtn').addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

// ===== 페이지 라우팅 =====
function showPage(pageId) {
  document.querySelectorAll('.main-content .page').forEach((p) => {
    p.hidden = p.id !== 'page-' + pageId;
  });

  // 사이드바 활성 표시 갱신
  document.querySelectorAll('.nav-item.active').forEach((el) => el.classList.remove('active'));
  document.querySelectorAll('.sub-list a.active').forEach((el) => el.classList.remove('active'));

  const link = document.querySelector(`.sidebar [data-page="${pageId}"]`);
  if (link) {
    if (link.classList.contains('nav-link')) {
      link.closest('.nav-item').classList.add('active');
    } else {
      link.classList.add('active');
      link.closest('.nav-item')?.classList.add('expanded');
    }
  }
  window.scrollTo(0, 0);
}

document.querySelectorAll('[data-page]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

// ===== 새 대시보드 토글 =====
document.getElementById('dashboardSwitch').addEventListener('change', (e) => {
  console.log('새 대시보드:', e.target.checked ? '켜짐' : '꺼짐');
});

// =====================================================
// 활성 사용자 데이터 생성 (약 100명)
// =====================================================
const DOMAIN = 'schoolname.sen.hs.kr';

const SURNAMES = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍', '문', '양', '손', '배', '백'];
const GIVEN_NAMES = [
  '민준', '서연', '도윤', '하은', '지호', '수아', '예준', '지우', '시우', '서현',
  '주원', '하윤', '지민', '채원', '건우', '유나', '현우', '다은', '우진', '소율',
  '민서', '예은', '준서', '수빈', '지안', '예린', '도현', '가은', '선우', '나윤',
  '은우', '시아', '정우', '윤서', '승현', '하린', '유준', '채은', '민재', '서윤',
  '태윤', '지유', '한결', '예나', '시윤', '다인', '지환', '아린', '재윤', '세아',
  '동현', '혜림', '수지', '혜원', '지선', '예주', '기원', '한중', '승아', '규민',
];

const LICENSE_BASIC = '학생용 Microsoft 365 A3 사용 혜택';
const LICENSE_PA = 'Microsoft Power Automate Free , 학생용 Microsoft 365 A3 사용 혜택';

// 시드 기반 난수 (새로고침해도 같은 목록 유지)
let seed = 20260714;
function rand() {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
}
function pick(arr) {
  return arr[Math.floor(rand() * arr.length)];
}

// 랜덤 아이디 생성 (실제 화면처럼 여러 패턴 혼합)
function makeUserId() {
  const consonants = 'bcdfghjklmnpqrstvwxyz';
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const syllables = ['min', 'seo', 'jun', 'ha', 'ji', 'woo', 'yeon', 'soo', 'hyun', 'eun', 'tae', 'chan', 'young', 'kyu', 'sung', 'jae', 'ye', 'na', 'ro', 'da'];

  function randStr(pool, n) {
    let s = '';
    for (let i = 0; i < n; i++) s += pool[Math.floor(rand() * pool.length)];
    return s;
  }
  function randNum(n) {
    let s = '';
    for (let i = 0; i < n; i++) s += Math.floor(rand() * 10);
    return s;
  }

  const style = Math.floor(rand() * 5);
  switch (style) {
    case 0: // 음절 조합 + 숫자  ex) minjae0512
      return pick(syllables) + pick(syllables) + randNum(2 + Math.floor(rand() * 3));
    case 1: // 짧은문자.문자  ex) hvx.rimn
      return randStr(consonants, 3) + '.' + randStr(letters, 4);
    case 2: // 문자_test숫자  ex) thensj_test00
      return randStr(letters, 5) + '_' + pick(['test', 'main', 'sub']) + randNum(2);
    case 3: // 숫자+문자  ex) 2085main
      return randNum(4) + pick(['main', 'st', 'edu', 'kr']);
    default: // 문자+숫자  ex) lululala122
      return pick(syllables) + randStr(letters, 3) + randNum(2 + Math.floor(rand() * 2));
  }
}

function generateStudents(count) {
  const students = [];
  const usedNames = new Set();
  const usedIds = new Set();

  // 실제 화면처럼 교과 계정 몇 개 포함
  const subjects = ['국어', '수학', '영어'];
  subjects.forEach((subj, i) => {
    students.push({
      display: `[1학년 ${i + 1}반]${subj}`,
      id: makeUserId() + '_S@' + DOMAIN,
      license: LICENSE_BASIC,
      hasKey: false,
    });
  });

  while (students.length < count) {
    const grade = 1 + Math.floor(rand() * 3); // 1~3학년
    const klass = 1 + Math.floor(rand() * 8); // 1~8반
    const name = pick(SURNAMES) + pick(GIVEN_NAMES);
    const display = `[${grade}학년 ${klass}반]${name}`;
    if (usedNames.has(display)) continue;
    usedNames.add(display);

    let uid = makeUserId();
    while (usedIds.has(uid)) uid = makeUserId();
    usedIds.add(uid);

    students.push({
      display,
      id: uid + '@' + DOMAIN,
      license: rand() < 0.25 ? LICENSE_PA : LICENSE_BASIC,
      hasKey: rand() < 0.05, // 일부 계정에 암호 재설정 아이콘
    });
  }

  // 표시 이름 오름차순 정렬 (학년 > 반 > 이름)
  students.sort((a, b) => a.display.localeCompare(b.display, 'ko'));
  return students;
}

const STUDENTS = generateStudents(100);

// ===== 테이블 렌더링 =====
const tbody = document.getElementById('usersTbody');
let lastRendered = STUDENTS; // 현재 화면에 그려진 목록 (검색 필터 반영)

function renderUsers(list) {
  lastRendered = list;
  tbody.innerHTML = list
    .map(
      (s, i) => `
    <tr data-index="${i}" class="${s.hasKey ? 'has-key' : ''}">
      <td class="col-check"><input type="checkbox" class="row-check"></td>
      <td class="col-name">
        <div class="name-cell">
          <span class="display-name">${s.display}</span>
          <span class="name-cell-icons">
            <button class="key-btn" title="암호 초기화">
              <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#0f6cbd" stroke-width="1.5">
                <circle cx="13.5" cy="6.5" r="3.5"/><path d="M11 9l-7 7v2h2l7-7M6.5 13.5l1.5 1.5"/>
              </svg>
            </button>
            <button class="row-more" title="추가 작업">
              <svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor">
                <circle cx="10" cy="5" r="1.2"/><circle cx="10" cy="10" r="1.2"/><circle cx="10" cy="15" r="1.2"/>
              </svg>
            </button>
          </span>
        </div>
      </td>
      <td class="col-id">${s.id}</td>
      <td class="col-license">${s.license}</td>
      <td class="col-columns"></td>
    </tr>`
    )
    .join('');
  updateSelectionUI();
}

// ===== 선택 상태 → 행 강조 + 도구 모음 전환 =====
function updateSelectionUI() {
  const checks = [...document.querySelectorAll('.row-check')];
  const selected = checks.filter((cb) => cb.checked);
  checks.forEach((cb) => cb.closest('tr').classList.toggle('selected', cb.checked));
  document.getElementById('toolbarDefault').hidden = selected.length > 0;
  document.getElementById('toolbarSelected').hidden = selected.length === 0;
  const checkAll = document.getElementById('checkAll');
  checkAll.checked = checks.length > 0 && selected.length === checks.length;
}

tbody.addEventListener('change', (e) => {
  if (e.target.classList.contains('row-check')) updateSelectionUI();
});

// 행의 열쇠 아이콘 → 암호 초기화 패널
tbody.addEventListener('click', (e) => {
  const btn = e.target.closest('.key-btn');
  if (btn) {
    const idx = Number(btn.closest('tr').dataset.index);
    openResetPanel([lastRendered[idx]]);
  }
});

renderUsers(STUDENTS);

// ===== 전체 선택 =====
document.getElementById('checkAll').addEventListener('change', (e) => {
  document.querySelectorAll('.row-check').forEach((cb) => (cb.checked = e.target.checked));
  updateSelectionUI();
});

// ===== 검색 필터 =====
document.getElementById('userSearch').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  renderUsers(
    q
      ? STUDENTS.filter(
          (s) => s.display.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
        )
      : STUDENTS
  );
});

// =====================================================
// 사용자 추가 마법사
// =====================================================
const LICENSES = [
  { name: 'Microsoft Copilot Studio 바이럴 평가판', avail: '9960/10000개 라이선스 사용 가능' },
  { name: 'Microsoft Power Apps for Developer', avail: '9982/10000개 라이선스 사용 가능' },
  { name: 'Microsoft Power Automate Free', avail: '9400/10000개 라이선스 사용 가능' },
  { name: '교직원용 Microsoft 365 A3', avail: '3/60개 라이선스 사용 가능' },
  { name: '학생용 Microsoft 365 A3 사용 혜택', avail: '1201/2400개 라이선스 사용 가능' },
];

const APPS = [
  'Avatars for Teams',
  'Common Data Service',
  'Common Data Service for Teams',
  'Education Analytics',
  'Exchange Foundation for Government',
  'Exchange Online(계획 2)',
  'Insights by MyAnalytics',
  'Intune ServiceNow Integration',
  'Microsoft 365 Apps for Enterprise',
  { name: 'Microsoft 365 Lighthouse(플랜 1)', orgLevel: true },
  'Microsoft Azure Active Directory Premium',
  'Microsoft Azure Active Directory 권한',
  'Microsoft Azure Multi-Factor Authentication',
  'Microsoft Bookings',
  'Microsoft Clipchamp',
  'Microsoft Defender for Cloud Apps Discovery',
  'Microsoft Forms(플랜 2)',
  'Microsoft Intune A 다이렉트',
  'Microsoft Intune Plan 1 for Education',
  'Microsoft Kaizala Pro',
  'Microsoft Loop',
  'Microsoft Planner',
  'Microsoft Power Apps for Office 365(플랜 3)',
  'Microsoft Power Automate for Office 365',
  'Microsoft Search',
  'Microsoft StaffHub',
  'Microsoft Stream for Office 365 E3',
  'Microsoft Teams',
  'Mobile Device Management for Office 365',
  'Nucleus',
  'Office 365 ProPlus(교육용)',
  'Office for the Web(교육용)',
  'OneDrive for Business(플랜 2)',
  'Power Virtual Agents for Office 365',
  'Project for Office(플랜 E3)',
  'School Data Sync(플랜 2)',
  'SharePoint(플랜 2)',
  'Skype for Business Online(플랜 2)',
  'Sway',
  'To-Do(플랜 2)',
  'Universal Print',
  'Viva Engage Core',
  'Whiteboard(플랜 2)',
];

const WIZARD_STEPS = ['기본 사항', '제품 라이선스', '설정(선택 사항)', '마침'];

const wizard = document.getElementById('addUserWizard');
const stepperEl = document.getElementById('wizardStepper');
const nextBtn = document.getElementById('wizNext');
const backBtn = document.getElementById('wizBack');
let currentStep = 1;

// ----- 라이선스 목록 렌더링 -----
document.getElementById('licenseList').innerHTML = LICENSES.map(
  (lic, i) => `
  <label class="license-item">
    <input type="checkbox" class="lic-check" data-index="${i}">
    <span>
      <div class="license-name">${lic.name}</div>
      <div class="license-avail">${lic.avail}</div>
    </span>
  </label>`
).join('');

// ----- 앱 목록 렌더링 -----
document.getElementById('appList').innerHTML = APPS.map((app) => {
  const isOrg = typeof app === 'object' && app.orgLevel;
  const name = isOrg ? app.name : app;
  return `
  <label class="app-item">
    <input type="checkbox" class="app-check" ${isOrg ? 'disabled' : 'checked'}>
    <span>
      <div class="app-name">${name}</div>
      <div class="app-sub">학생용 Microsoft 365 A3 사용 혜택</div>
      ${isOrg ? '<div class="app-note">이 앱은 조직 수준에서 할당됩니다. 사용자 단위로 할당할 수 없습니다.</div>' : ''}
    </span>
  </label>`;
}).join('');

// ----- 단계 표시기 렌더링 -----
function renderStepper() {
  stepperEl.innerHTML = WIZARD_STEPS.map((label, i) => {
    const n = i + 1;
    const state = n < currentStep ? 'done' : n === currentStep ? 'current' : '';
    const check =
      n < currentStep
        ? '<svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.8"><polyline points="2.5,6.5 5,9 9.5,3.5"/></svg>'
        : '';
    return `
    <div class="step-item ${state}">
      <span class="step-circle">${check}</span>
      <span class="step-label">${label}</span>
    </div>`;
  }).join('');
}

// ----- 단계 전환 -----
function showStep(n) {
  currentStep = n;
  document.querySelectorAll('.wizard-step').forEach((s) => {
    s.hidden = Number(s.dataset.step) !== n;
  });
  backBtn.hidden = n === 1;
  nextBtn.textContent = n === 4 ? '추가 완료' : '다음';
  renderStepper();
  updateNextState();
  wizard.querySelector('.wizard-content').scrollTop = 0;
}

// ----- 유효성 검사 → 다음 버튼 활성화 -----
function selectedLicenses() {
  return [...document.querySelectorAll('.lic-check:checked')].map(
    (cb) => LICENSES[cb.dataset.index].name
  );
}

function updateNextState() {
  if (currentStep === 1) {
    const display = document.getElementById('fDisplay').value.trim();
    const username = document.getElementById('fUsername').value.trim();
    const autoPw = document.getElementById('fAutoPw').checked;
    const pw = document.getElementById('fPassword').value;
    nextBtn.disabled = !(display && username && (autoPw || pw));
  } else if (currentStep === 2) {
    const mode = document.querySelector('input[name="licMode"]:checked').value;
    nextBtn.disabled = mode === 'assign' && selectedLicenses().length === 0;
  } else {
    nextBtn.disabled = false;
  }
}

// ----- 열기 / 닫기 -----
function openWizard() {
  wizard.hidden = false;
  showStep(1);
}

function closeWizard() {
  wizard.hidden = true;
  // 폼 초기화
  ['fLast', 'fFirst', 'fDisplay', 'fUsername', 'fPassword'].forEach(
    (id) => (document.getElementById(id).value = '')
  );
  document.getElementById('fAutoPw').checked = false;
  document.getElementById('fChangePw').checked = false;
  document.getElementById('fPassword').disabled = false;
  document.querySelectorAll('.lic-check').forEach((cb) => (cb.checked = false));
  document.querySelector('input[name="licMode"][value="assign"]').checked = true;
  document.getElementById('licSection').hidden = false;
  document.getElementById('licHeader').querySelector('.collapse-chevron').classList.add('up');
  document.getElementById('appsSection').hidden = true;
  document.getElementById('appsHeader').querySelector('.collapse-chevron').classList.remove('up');
  // 3단계 초기화
  document.querySelector('input[name="roleMode"][value="user"]').checked = true;
  document.querySelectorAll('.role-check').forEach((cb) => {
    cb.checked = false;
    cb.disabled = true;
  });
  document.getElementById('roleList').classList.remove('enabled');
  document.querySelectorAll('.profile-input').forEach((input) => (input.value = ''));
  document.getElementById('pCountry').selectedIndex = 0;
  document.getElementById('roleSection').hidden = false;
  document.getElementById('profileSection').hidden = false;
  displayEdited = false;
  updateLicCounts();
}

// "사용자 추가" 텍스트를 가진 버튼(홈 도구 모음, 사용자 관리 카드, 활성 사용자 도구 모음) 연결
document.querySelectorAll('button').forEach((btn) => {
  if (btn.textContent.trim() === '사용자 추가') {
    btn.addEventListener('click', openWizard);
  }
});

// [취소] → 확인 팝업
const cancelConfirm = document.getElementById('cancelConfirm');
document.getElementById('wizCancel').addEventListener('click', () => {
  cancelConfirm.hidden = false;
});
document.getElementById('confirmYes').addEventListener('click', () => {
  cancelConfirm.hidden = true;
  closeWizard();
});
['confirmNo', 'confirmX'].forEach((id) => {
  document.getElementById(id).addEventListener('click', () => (cancelConfirm.hidden = true));
});
cancelConfirm.addEventListener('click', (e) => {
  if (e.target === cancelConfirm) cancelConfirm.hidden = true;
});
backBtn.addEventListener('click', () => showStep(currentStep - 1));

nextBtn.addEventListener('click', () => {
  if (currentStep < 4) {
    if (currentStep === 3) fillReview();
    showStep(currentStep + 1);
  } else {
    finishWizard();
  }
});

// ----- 1단계 동작 -----
// 성/이름 입력 시 표시 이름 자동 완성
let displayEdited = false;
document.getElementById('fDisplay').addEventListener('input', () => {
  displayEdited = document.getElementById('fDisplay').value !== '';
  updateNextState();
});
['fLast', 'fFirst'].forEach((id) => {
  document.getElementById(id).addEventListener('input', () => {
    if (!displayEdited) {
      document.getElementById('fDisplay').value =
        document.getElementById('fLast').value + document.getElementById('fFirst').value;
    }
    updateNextState();
  });
});

document.getElementById('fUsername').addEventListener('input', updateNextState);
document.getElementById('fPassword').addEventListener('input', updateNextState);

// 자동으로 암호 만들기
document.getElementById('fAutoPw').addEventListener('change', (e) => {
  const pwInput = document.getElementById('fPassword');
  if (e.target.checked) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let pw = '';
    for (let i = 0; i < 12; i++) pw += chars[Math.floor(Math.random() * chars.length)];
    pwInput.value = pw;
    pwInput.disabled = true;
  } else {
    pwInput.value = '';
    pwInput.disabled = false;
  }
  updateNextState();
});

// 암호 표시/숨김
document.getElementById('pwToggle').addEventListener('click', () => {
  const pwInput = document.getElementById('fPassword');
  pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
});

// ----- 2단계 동작 -----
function updateLicCounts() {
  const count = selectedLicenses().length;
  document.getElementById('licCount').textContent = count;
  document.getElementById('appCount').textContent = count > 0 ? APPS.length : 0;
}

document.querySelectorAll('.lic-check').forEach((cb) => {
  cb.addEventListener('change', () => {
    if (cb.checked) {
      document.querySelector('input[name="licMode"][value="assign"]').checked = true;
    }
    updateLicCounts();
    updateNextState();
  });
});

document.querySelectorAll('input[name="licMode"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    if (radio.value === 'none') {
      document.querySelectorAll('.lic-check').forEach((cb) => (cb.checked = false));
      updateLicCounts();
    }
    updateNextState();
  });
});

// 라이선스/앱 섹션 접기·펼치기
document.getElementById('licHeader').addEventListener('click', () => {
  const section = document.getElementById('licSection');
  section.hidden = !section.hidden;
  document.getElementById('licHeader').querySelector('.collapse-chevron').classList.toggle('up', !section.hidden);
});

document.getElementById('appsHeader').addEventListener('click', () => {
  const section = document.getElementById('appsSection');
  section.hidden = !section.hidden;
  document.getElementById('appsHeader').querySelector('.collapse-chevron').classList.toggle('up', !section.hidden);
});

// 앱 모두 선택
document.getElementById('appsAll').addEventListener('change', (e) => {
  document.querySelectorAll('.app-check:not(:disabled)').forEach((cb) => (cb.checked = e.target.checked));
});

// ----- 3단계: 역할 / 프로필 정보 -----
// 관리 센터 액세스 선택 시에만 역할 체크박스 활성화
document.querySelectorAll('input[name="roleMode"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    const admin = document.querySelector('input[name="roleMode"]:checked').value === 'admin';
    document.querySelectorAll('.role-check').forEach((cb) => {
      cb.disabled = !admin;
      if (!admin) cb.checked = false;
    });
    document.getElementById('roleList').classList.toggle('enabled', admin);
  });
});

// 역할/프로필 섹션 접기·펼치기
[
  ['roleHeader', 'roleSection'],
  ['profileHeader', 'profileSection'],
].forEach(([headerId, sectionId]) => {
  document.getElementById(headerId).addEventListener('click', () => {
    const section = document.getElementById(sectionId);
    section.hidden = !section.hidden;
    document.getElementById(headerId).querySelector('.collapse-chevron').classList.toggle('up', !section.hidden);
  });
});

// ----- 4단계: 검토 후 완료 -----
function selectedRoles() {
  return [...document.querySelectorAll('.role-check:checked')].map(
    (cb) => cb.closest('.role-item').querySelector('.role-name').textContent
  );
}

function fillReview() {
  const display = document.getElementById('fDisplay').value.trim();
  const username = document.getElementById('fUsername').value.trim();
  const domain = document.getElementById('fDomain').value;
  const licenses = selectedLicenses();
  const mode = document.querySelector('input[name="licMode"]:checked').value;

  // 표시 이름 및 사용자 이름
  document.getElementById('revName').textContent = display;
  document.getElementById('revId').textContent = username + '@' + domain;

  // 암호
  document.getElementById('revPwType').textContent =
    '유형: ' + (document.getElementById('fAutoPw').checked ? '자동 생성 암호' : '사용자 지정 암호');

  // 제품 라이선스
  document.getElementById('revLoc').textContent = '위치: ' + document.getElementById('fLocation').value;
  document.getElementById('revLicense').textContent =
    '라이선스: ' + (mode === 'none' ? '제품 라이선스 없음' : licenses.join(', '));

  if (mode === 'none') {
    document.getElementById('revApps').textContent = '앱: 없음';
  } else {
    const apps = [...document.querySelectorAll('.app-check:checked')].map(
      (cb) => cb.closest('.app-item').querySelector('.app-name').textContent
    );
    const head = apps.slice(0, 3).join(', ');
    const rest = apps.length - 3;
    document.getElementById('revApps').textContent =
      '앱: ' + (apps.length ? head + (rest > 0 ? `, 추가 ${rest}개` : '') : '없음');
  }

  // 역할
  const admin = document.querySelector('input[name="roleMode"]:checked').value === 'admin';
  const roles = selectedRoles();
  const isDefault = !admin || roles.length === 0;
  document.getElementById('revRoleTitle').textContent = isDefault ? '역할 (기본값)' : '역할';
  document.getElementById('revRole').textContent = isDefault
    ? '사용자(관리자 센터 액세스 권한 없음)'
    : roles.join(', ');

  // 프로필 정보
  const profileParts = [
    ['직함', 'pTitle'],
    ['부서', 'pDept'],
    ['사무실', 'pOffice'],
    ['휴대폰', 'pMobile'],
  ]
    .map(([label, id]) => {
      const v = document.getElementById(id).value.trim();
      return v ? `${label}: ${v}` : null;
    })
    .filter(Boolean);
  document.getElementById('revProfile').textContent = profileParts.length
    ? profileParts.join(' · ')
    : '입력 안 함';
}

// 검토 화면의 [편집] 링크 → 해당 단계로 이동
document.querySelectorAll('.edit-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showStep(Number(link.dataset.goto));
  });
});

// =====================================================
// 암호 초기화 패널
// =====================================================
const resetPanel = document.getElementById('resetPanel');
let resetTargets = [];

function makeTempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
  let pw = '';
  for (let i = 0; i < 12; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  return pw;
}

function openResetPanel(users) {
  resetTargets = users;
  const u = users[0];
  document.getElementById('resetUserName').textContent =
    u.display + (users.length > 1 ? ` 외 ${users.length - 1}명` : '');
  document.getElementById('resetUserId').textContent = u.id;

  // 폼 초기 상태
  document.getElementById('resetForm').hidden = false;
  document.getElementById('resetResult').hidden = true;
  document.getElementById('resetSubmit').hidden = false;
  const autoPw = document.getElementById('rAutoPw');
  const pwInput = document.getElementById('rPassword');
  autoPw.checked = true;
  pwInput.value = '';
  pwInput.disabled = true;
  pwInput.type = 'password';
  document.getElementById('rChangePw').checked = true;

  resetPanel.hidden = false;
}

function closeResetPanel() {
  resetPanel.hidden = true;
}

// 도구 모음(선택 시)의 [암호 초기화]
document.getElementById('resetPwSelected').addEventListener('click', () => {
  const selected = [...document.querySelectorAll('.row-check:checked')].map(
    (cb) => lastRendered[Number(cb.closest('tr').dataset.index)]
  );
  if (selected.length) openResetPanel(selected);
});

// 자동으로 암호 만들기 체크
document.getElementById('rAutoPw').addEventListener('change', (e) => {
  const pwInput = document.getElementById('rPassword');
  pwInput.disabled = e.target.checked;
  if (e.target.checked) pwInput.value = '';
});

// 암호 표시/숨김
document.getElementById('rPwToggle').addEventListener('click', () => {
  const pwInput = document.getElementById('rPassword');
  pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
});

// [암호 초기화] 실행 → 결과 표시
document.getElementById('resetSubmit').addEventListener('click', () => {
  const auto = document.getElementById('rAutoPw').checked;
  const typed = document.getElementById('rPassword').value;
  const newPw = auto || !typed ? makeTempPassword() : typed;

  document.getElementById('resetNewPw').textContent = newPw;
  document.getElementById('resetNote').hidden = !document.getElementById('rChangePw').checked;
  document.getElementById('resetForm').hidden = true;
  document.getElementById('resetSubmit').hidden = true;
  document.getElementById('resetResult').hidden = false;

  // 초기화된 계정에 열쇠 아이콘 고정 표시
  resetTargets.forEach((u) => (u.hasKey = true));
  renderUsers(lastRendered);
});

['resetClose', 'resetX'].forEach((id) => {
  document.getElementById(id).addEventListener('click', closeResetPanel);
});

// 선택 상태 도구 모음의 검색창도 동일하게 동작
document.getElementById('userSearchSelected').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  renderUsers(
    q
      ? STUDENTS.filter(
          (s) => s.display.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
        )
      : STUDENTS
  );
});

// =====================================================
// 사용자 삭제 패널
// =====================================================
const deletePanel = document.getElementById('deletePanel');
const delList = document.getElementById('delList');
let delPickerList = []; // 선택 목록에 그려진 사용자
let delTargets = []; // 삭제 대상

const AVATAR_COLORS = [
  '#7719aa', '#038387', '#8e192e', '#c239b3', '#00758f',
  '#4f6bed', '#ca5010', '#498205', '#881798', '#986f0b',
];

function avatarColor(name) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.codePointAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

// ----- 1) 선택 목록 -----
function renderDelList(query = '') {
  const q = query.trim().toLowerCase();
  delPickerList = q
    ? STUDENTS.filter(
        (s) => s.display.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
      )
    : STUDENTS;

  delList.innerHTML = delPickerList
    .map(
      (s, i) => `
    <label class="del-item">
      <input type="checkbox" class="del-check" data-index="${i}">
      <span class="del-avatar" style="background:${avatarColor(s.display)}">
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4">
          <circle cx="10" cy="7" r="3.2"/><path d="M4 17c.9-2.8 3.2-4.2 6-4.2s5.1 1.4 6 4.2"/>
        </svg>
      </span>
      <span>
        <div class="del-name">${s.display}</div>
        <div class="del-id">${s.id}</div>
      </span>
    </label>`
    )
    .join('');
  updateDelSelectState();
}

function updateDelSelectState() {
  document.getElementById('delSelectBtn').disabled =
    document.querySelectorAll('.del-check:checked').length === 0;
}

delList.addEventListener('change', (e) => {
  if (e.target.classList.contains('del-check')) updateDelSelectState();
});

document.getElementById('delAll').addEventListener('change', (e) => {
  document.querySelectorAll('.del-check').forEach((cb) => (cb.checked = e.target.checked));
  updateDelSelectState();
});

document.getElementById('delSearch').addEventListener('input', (e) => {
  renderDelList(e.target.value);
  document.getElementById('delAll').checked = false;
});

// ----- 화면 전환 -----
let delFromPicker = false; // 선택 목록을 거쳐 왔는지 (뒤로 버튼 표시용)

function showDelView(view) {
  const views = {
    delPick: 'pick',
    delConfirmView: 'confirm',
    delBulkConfirmView: 'bulkConfirm',
    delDoneView: 'done',
    delBulkDoneView: 'bulkDone',
  };
  Object.entries(views).forEach(([id, v]) => {
    document.getElementById(id).hidden = v !== view;
  });

  const isConfirm = view === 'confirm' || view === 'bulkConfirm';
  const isDone = view === 'done' || view === 'bulkDone';
  document.getElementById('delBack').hidden = !(isConfirm && delFromPicker);
  document.getElementById('delSelectBtn').hidden = view !== 'pick';
  document.getElementById('delCancelBtn').hidden = view !== 'pick';
  document.getElementById('delDeleteBtn').hidden = !isConfirm;
  const closeBtn = document.getElementById('delCloseBtn');
  closeBtn.hidden = !isDone;
  closeBtn.classList.toggle('btn-primary', view === 'bulkDone');
  deletePanel.querySelector('.delete-body').scrollTop = 0;
}

// 대상 수에 따라 확인 화면 분기: 1명 → 상세 확인, 여러 명 → 일괄 확인
function goDelConfirm() {
  if (delTargets.length > 1) {
    document.getElementById('delBulkCount').textContent = `사용자 ${delTargets.length}명 선택됨`;
    showDelView('bulkConfirm');
  } else {
    fillDelConfirm();
    showDelView('confirm');
  }
}

// ----- 2) 삭제 확인 화면 채우기 (1명) -----
function fillDelConfirm() {
  document.getElementById('delConfirmTitle').textContent = `${delTargets[0].display} 삭제`;

  const firstLic = delTargets[0].license;
  const banner = document.getElementById('delBanner');
  if (firstLic && firstLic !== '-') {
    banner.hidden = false;
    document.getElementById('delBannerLic').textContent = firstLic.split(' , ')[0];
  } else {
    banner.hidden = true;
  }
  // 확인 화면 체크박스 초기화
  document.querySelector('#delConfirmView .del-opt:not(.disabled) input').checked = false;
}

// ----- 패널 열기/닫기 -----
function openDeletePanel(preselected) {
  if (preselected && preselected.length) {
    delTargets = preselected;
    delFromPicker = false;
    goDelConfirm();
  } else {
    document.getElementById('delSearch').value = '';
    document.getElementById('delAll').checked = false;
    renderDelList();
    showDelView('pick');
  }
  deletePanel.hidden = false;
}

function closeDeletePanel() {
  deletePanel.hidden = true;
}

// [사용자 삭제] 버튼 연결: 기본 도구 모음 → 선택 목록, 선택 도구 모음 → 체크된 사용자 바로 확인
document.querySelectorAll('button').forEach((btn) => {
  if (btn.textContent.trim() === '사용자 삭제' && btn.classList.contains('toolbar-btn')) {
    btn.addEventListener('click', () => {
      if (btn.closest('#toolbarSelected')) {
        const selected = [...document.querySelectorAll('.row-check:checked')].map(
          (cb) => lastRendered[Number(cb.closest('tr').dataset.index)]
        );
        openDeletePanel(selected);
      } else {
        openDeletePanel();
      }
    });
  }
});

// [선택] → 확인 화면
document.getElementById('delSelectBtn').addEventListener('click', () => {
  delTargets = [...document.querySelectorAll('.del-check:checked')].map(
    (cb) => delPickerList[Number(cb.dataset.index)]
  );
  if (!delTargets.length) return;
  delFromPicker = true;
  goDelConfirm();
});

// [뒤로] → 선택 목록으로
document.getElementById('delBack').addEventListener('click', () => showDelView('pick'));

// [사용자 삭제] 실행 → 완료 화면
document.getElementById('delDeleteBtn').addEventListener('click', () => {
  const bulk = delTargets.length > 1;

  if (bulk) {
    // 여러 명: 삭제된 사용자 수 + 사용자/상태 표
    document.getElementById('delBulkDoneTitle').textContent = `삭제된 사용자: ${delTargets.length}`;
    document.getElementById('delBulkDoneRows').innerHTML = delTargets
      .map((u) => `<tr><td>${u.id}</td><td>User deleted</td></tr>`)
      .join('');
  } else {
    // 1명: 라이선스 할당 취소 상세
    document.getElementById('delDoneTitle').textContent = `${delTargets[0].display} 님이 삭제되었습니다.`;
    const lics = [
      ...new Set(
        delTargets.flatMap((u) => u.license.split(' , ')).filter((l) => l && l !== '-')
      ),
    ];
    document.getElementById('delDoneLicGroup').hidden = lics.length === 0;
    document.getElementById('delDoneLics').innerHTML = lics
      .map((l) => `<li>${l}</li>`)
      .join('');
  }

  // 목록에서 실제로 제거
  delTargets.forEach((u) => {
    const idx = STUDENTS.indexOf(u);
    if (idx > -1) STUDENTS.splice(idx, 1);
  });
  document.getElementById('userSearch').value = '';
  document.getElementById('userSearchSelected').value = '';
  renderUsers(STUDENTS);

  showDelView(bulk ? 'bulkDone' : 'done');
});

['delX', 'delCancelBtn', 'delCloseBtn'].forEach((id) => {
  document.getElementById(id).addEventListener('click', closeDeletePanel);
});

function finishWizard() {
  const display = document.getElementById('fDisplay').value.trim();
  const username = document.getElementById('fUsername').value.trim();
  const domain = document.getElementById('fDomain').value;
  const licenses = selectedLicenses();
  const mode = document.querySelector('input[name="licMode"]:checked').value;

  STUDENTS.push({
    display,
    id: username + '@' + domain,
    license: mode === 'none' ? '-' : licenses.join(' , '),
    hasKey: false,
  });
  STUDENTS.sort((a, b) => a.display.localeCompare(b.display, 'ko'));
  renderUsers(STUDENTS);

  closeWizard();
  showPage('users');
}
