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
      hasKey: false, // 열쇠 아이콘은 암호를 초기화한 계정에만 표시
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

// MFA 페이지(mfa.html) 등 다른 탭과 학생 명단 공유
function saveStudentsToStorage() {
  try {
    localStorage.setItem('msAdminStudents', JSON.stringify(STUDENTS));
  } catch (e) { /* 저장 불가 환경 무시 */ }
}

function renderUsers(list) {
  lastRendered = list;
  saveStudentsToStorage();
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
  document.getElementById('selCountNum').textContent = `${selected.length}개 선택됨`;
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

// [취소] → 확인 팝업 (단일/여러 사용자 마법사 공용)
const cancelConfirm = document.getElementById('cancelConfirm');
let confirmYesAction = null; // [예] 클릭 시 실행할 동작

document.getElementById('wizCancel').addEventListener('click', () => {
  document.getElementById('confirmMsg').textContent = '사용자에 대해 입력한 모든 정보가 손실됩니다.';
  confirmYesAction = closeWizard;
  cancelConfirm.hidden = false;
});
document.getElementById('confirmYes').addEventListener('click', () => {
  cancelConfirm.hidden = true;
  if (confirmYesAction) confirmYesAction();
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

// =====================================================
// 여러 사용자 추가 마법사
// =====================================================
const multiWizard = document.getElementById('multiUserWizard');
const M_STEPS = ['기본 사항', '제품 라이선스', '마침'];
let mCurrentStep = 1;

// 그리드 열 정의 (이름/성은 열 제거 가능)
const M_ALL_COLS = [
  { key: 'first', label: '이름', removable: true },
  { key: 'last', label: '성', removable: true },
  { key: 'display', label: '표시 이름', required: true },
  { key: 'username', label: '사용자 이름', required: true },
  { key: 'domain', label: '도메인' },
];
let multiCols = [...M_ALL_COLS];

function emptyMultiRow() {
  return { first: '', last: '', display: '', username: '', domain: DOMAIN };
}
let multiRows = [emptyMultiRow(), emptyMultiRow(), emptyMultiRow()];

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ----- 그리드 렌더링 -----
function renderMultiGrid() {
  const grid = document.getElementById('multiGrid');
  const head =
    '<tr>' +
    multiCols
      .map(
        (c) =>
          `<th>${c.label}${c.required ? ' <span class="req">*</span>' : ''}${
            c.removable
              ? ` <button type="button" class="col-remove" data-key="${c.key}" title="열 제거">
                   <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/></svg>
                 </button>`
              : ''
          }</th>`
      )
      .join('') +
    '<th class="row-del-col"></th></tr>';

  const body = multiRows
    .map(
      (r, i) =>
        '<tr>' +
        multiCols
          .map((c) => {
            if (c.key === 'domain') {
              return `<td><select class="grid-input" data-row="${i}" data-key="domain"><option>${DOMAIN}</option></select></td>`;
            }
            return `<td><input class="grid-input" data-row="${i}" data-key="${c.key}" value="${escapeHtml(r[c.key] || '')}"></td>`;
          })
          .join('') +
        `<td class="row-del-col"><button type="button" class="row-remove" data-row="${i}" title="행 제거">
           <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/></svg>
         </button></td></tr>`
    )
    .join('');

  grid.innerHTML = `<thead>${head}</thead><tbody>${body}</tbody>`;
  updateMNextState();
}

// 그리드 입력/삭제 (위임)
document.getElementById('multiGrid').addEventListener('input', (e) => {
  const el = e.target;
  if (el.classList.contains('grid-input')) {
    multiRows[Number(el.dataset.row)][el.dataset.key] = el.value;
    updateMNextState();
  }
});

document.getElementById('multiGrid').addEventListener('click', (e) => {
  const colBtn = e.target.closest('.col-remove');
  if (colBtn) {
    multiCols = multiCols.filter((c) => c.key !== colBtn.dataset.key);
    renderMultiGrid();
    return;
  }
  const rowBtn = e.target.closest('.row-remove');
  if (rowBtn && multiRows.length > 1) {
    multiRows.splice(Number(rowBtn.dataset.row), 1);
    renderMultiGrid();
  }
});

// [행 추가]
document.getElementById('mAddRow').addEventListener('click', () => {
  multiRows.push(emptyMultiRow());
  renderMultiGrid();
});

// ----- CSV 섹션 토글 -----
document.getElementById('mCsvHeader').addEventListener('click', () => {
  const section = document.getElementById('mCsvSection');
  section.hidden = !section.hidden;
  document.getElementById('mCsvHeader').querySelector('.collapse-chevron').classList.toggle('up', !section.hidden);
});

// ----- CSV 서식 파일 다운로드 (실제 M365 서식과 동일) -----
const CSV_HEADER =
  '사용자 이름,이름,성,표시 이름,직함,부서,사무실 번호,사무실 전화,휴대폰,팩스,대체 전자 메일 주소,주소,구/군/시,시/도,우편 번호,국가 또는 지역';
const CSV_SAMPLE_ROWS = [
  `hong123@${DOMAIN},길동,홍,[1학년 1반]홍길동,,,,,,,,,,,,`,
  `kim456@${DOMAIN},철수,김,[1학년 2반]김철수,,,,,,,,,,,,`,
  `lee789@${DOMAIN},영희,이,[2학년 1반]이영희,,,,,,,,,,,,`,
];

function downloadCsv(filename, content) {
  if (typeof URL.createObjectURL !== 'function') return; // 테스트 환경 보호
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

document.getElementById('mCsvHeaderOnly').addEventListener('click', (e) => {
  e.preventDefault();
  downloadCsv('사용자_추가_서식.csv', CSV_HEADER + '\n');
});

document.getElementById('mCsvSample').addEventListener('click', (e) => {
  e.preventDefault();
  downloadCsv('사용자_추가_샘플.csv', CSV_HEADER + '\n' + CSV_SAMPLE_ROWS.join('\n') + '\n');
});

// ----- CSV 업로드 → 그리드 채우기 -----
// 1열: 계정(사용자 이름, 도메인 포함 가능), 이후 이름, 성, 표시 이름 순 (나머지 열은 무시)
function parseMultiCsv(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim());
  let rows = lines.map((l) => l.split(',').map((c) => c.trim()));
  if (rows.length && /사용자 이름|계정|username/i.test(rows[0][0])) rows = rows.slice(1);
  return rows
    .filter((cols) => cols[0])
    .map(([account = '', first = '', last = '', display = '']) => {
      const [username, domain] = account.split('@');
      return {
        username,
        first,
        last,
        display: display || last + first,
        domain: domain || DOMAIN,
      };
    });
}

document.getElementById('mBrowseBtn').addEventListener('click', () => {
  document.getElementById('mCsvInput').click();
});

document.getElementById('mCsvInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  document.getElementById('mCsvFileName').textContent = file.name;
  const reader = new FileReader();
  reader.onload = () => {
    const parsed = parseMultiCsv(reader.result);
    if (parsed.length) {
      multiCols = [...M_ALL_COLS]; // 제거했던 열 복원
      multiRows = parsed;
      renderMultiGrid();
      document.getElementById('mCsvStatus').textContent = `${parsed.length}명의 사용자 정보를 불러왔습니다.`;
    } else {
      document.getElementById('mCsvStatus').textContent = '가져올 사용자 정보가 없습니다. 파일 형식을 확인하세요.';
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

// ----- 라이선스 목록 렌더링 -----
document.getElementById('mLicenseList').innerHTML = LICENSES.map(
  (lic, i) => `
  <label class="license-item">
    <input type="checkbox" class="m-lic-check" data-index="${i}">
    <span>
      <div class="license-name">${lic.name}</div>
      <div class="license-avail">${lic.avail}</div>
    </span>
  </label>`
).join('');

function mSelectedLicenses() {
  return [...document.querySelectorAll('.m-lic-check:checked')].map(
    (cb) => LICENSES[cb.dataset.index].name
  );
}

document.querySelectorAll('.m-lic-check').forEach((cb) => {
  cb.addEventListener('change', () => {
    if (cb.checked) {
      document.querySelector('input[name="mLicMode"][value="assign"]').checked = true;
    }
    document.getElementById('mLicCount').textContent = mSelectedLicenses().length;
    updateMNextState();
  });
});

document.querySelectorAll('input[name="mLicMode"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    if (radio.value === 'none') {
      document.querySelectorAll('.m-lic-check').forEach((cb) => (cb.checked = false));
      document.getElementById('mLicCount').textContent = 0;
    }
    updateMNextState();
  });
});

// ----- 단계 표시/전환 -----
function renderMStepper() {
  document.getElementById('mStepper').innerHTML = M_STEPS.map((label, i) => {
    const n = i + 1;
    const state = n < mCurrentStep ? 'done' : n === mCurrentStep ? 'current' : '';
    const check =
      n < mCurrentStep
        ? '<svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.8"><polyline points="2.5,6.5 5,9 9.5,3.5"/></svg>'
        : '';
    return `
    <div class="step-item ${state}">
      <span class="step-circle">${check}</span>
      <span class="step-label">${label}</span>
    </div>`;
  }).join('');
}

function validMultiRows() {
  return multiRows.filter((r) => r.display.trim() && r.username.trim());
}

function updateMNextState() {
  const next = document.getElementById('mNext');
  if (mCurrentStep === 1) {
    next.disabled = validMultiRows().length === 0;
  } else if (mCurrentStep === 2) {
    const mode = document.querySelector('input[name="mLicMode"]:checked').value;
    next.disabled = mode === 'assign' && mSelectedLicenses().length === 0;
  } else {
    next.disabled = false;
  }
}

function showMStep(n) {
  mCurrentStep = n;
  document.querySelectorAll('.m-step').forEach((s) => {
    s.hidden = Number(s.dataset.step) !== n;
  });
  document.getElementById('mBack').hidden = n === 1;
  document.getElementById('mNext').textContent = n === 3 ? '추가 완료' : '다음';
  renderMStepper();
  updateMNextState();
  multiWizard.querySelector('.wizard-content').scrollTop = 0;
}

// ----- 검토 화면 -----
function fillMultiReview() {
  const rows = validMultiRows();
  const names = rows.map((r) => r.display.trim());
  const headNames = names.slice(0, 3).join(', ');
  document.getElementById('mRevUsers').textContent =
    `총 ${rows.length}명 — ${headNames}${names.length > 3 ? ` 외 ${names.length - 3}명` : ''}`;

  document.getElementById('mRevLoc').textContent = '위치: ' + document.getElementById('mLocation').value;
  const mode = document.querySelector('input[name="mLicMode"]:checked').value;
  document.getElementById('mRevLicense').textContent =
    '라이선스: ' + (mode === 'none' ? '제품 라이선스 없음' : mSelectedLicenses().join(', '));
}

// ----- 열기/닫기/완료 -----
function openMultiWizard() {
  multiWizard.hidden = false;
  showMStep(1);
}

function closeMultiWizard() {
  multiWizard.hidden = true;
  multiCols = [...M_ALL_COLS];
  multiRows = [emptyMultiRow(), emptyMultiRow(), emptyMultiRow()];
  renderMultiGrid();
  document.querySelectorAll('.m-lic-check').forEach((cb) => (cb.checked = false));
  document.querySelector('input[name="mLicMode"][value="assign"]').checked = true;
  document.getElementById('mLicCount').textContent = 0;
  document.getElementById('mCsvSection').hidden = true;
  document.getElementById('mCsvHeader').querySelector('.collapse-chevron').classList.remove('up');
  document.getElementById('mCsvFileName').textContent = '선택된 파일 없음';
  document.getElementById('mCsvStatus').textContent = '';
}

function finishMultiWizard() {
  const mode = document.querySelector('input[name="mLicMode"]:checked').value;
  const licenseStr = mode === 'none' ? '-' : mSelectedLicenses().join(' , ');

  validMultiRows().forEach((r) => {
    STUDENTS.push({
      display: r.display.trim(),
      id: r.username.trim() + '@' + (r.domain || DOMAIN),
      license: licenseStr,
      hasKey: false,
    });
  });
  STUDENTS.sort((a, b) => a.display.localeCompare(b.display, 'ko'));
  renderUsers(STUDENTS);

  closeMultiWizard();
  showPage('users');
}

// [여러 사용자 추가] 버튼 연결
document.querySelectorAll('button').forEach((btn) => {
  if (btn.textContent.trim() === '여러 사용자 추가') {
    btn.addEventListener('click', openMultiWizard);
  }
});

document.getElementById('mBack').addEventListener('click', () => showMStep(mCurrentStep - 1));

document.getElementById('mNext').addEventListener('click', () => {
  if (mCurrentStep < 3) {
    if (mCurrentStep === 2) fillMultiReview();
    showMStep(mCurrentStep + 1);
  } else {
    finishMultiWizard();
  }
});

document.getElementById('mCancel').addEventListener('click', () => {
  document.getElementById('confirmMsg').textContent = '사용자에 대해 입력한 모든 정보가 손실됩니다.';
  confirmYesAction = closeMultiWizard;
  cancelConfirm.hidden = false;
});

// 초기 그리드 렌더링
renderMultiGrid();

// =====================================================
// 다단계 인증: Entra 관리 센터 페이지를 새 탭으로 열기
// =====================================================
document.querySelectorAll('button').forEach((btn) => {
  if (btn.textContent.trim() === '다단계 인증' && btn.classList.contains('toolbar-btn')) {
    btn.addEventListener('click', () => {
      saveStudentsToStorage();
      window.open('mfa.html', '_blank');
    });
  }
});

// =====================================================
// 활성 팀 및 그룹
// =====================================================
const TEAMS = [
  { name: '서울온라인학교 교직원', desc: '교직원 협업 공간', email: 'seoulstaff@' + DOMAIN, type: '팀', owners: 'TT강현욱', members: 18 },
  { name: '1학년 1반', desc: '1학년 1반 학급 팀', email: 'grade1c1@' + DOMAIN, type: '팀', owners: '[1학년 1반]국어', members: 12 },
  { name: '정보안전팀', desc: '', email: 'security@' + DOMAIN, type: '팀', owners: 'TT강현욱', members: 5 },
];

const teamsTbody = document.getElementById('teamsTbody');
let teamsRendered = TEAMS;

function renderTeams(list = TEAMS) {
  teamsRendered = list;
  teamsTbody.innerHTML = list
    .map(
      (t, i) => `
    <tr data-index="${i}">
      <td class="col-check"><input type="checkbox" class="team-check"></td>
      <td><span class="display-name">${t.name}</span></td>
      <td>${t.email}</td>
      <td>
        <span class="sync-icon" title="클라우드">
          <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.3">
            <path d="M14.5 8a4 4 0 0 0-7.8-1A3.5 3.5 0 0 0 5 14h9a3 3 0 0 0 .5-6z"/>
          </svg>
        </span>
      </td>
      <td>
        ${t.type === '팀' ? `
        <span class="teamstat-icon" title="팀">
          <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.3">
            <circle cx="6.5" cy="6" r="2.2"/><circle cx="13.5" cy="6" r="2.2"/>
            <path d="M2.5 15c.6-2.2 2.1-3.5 4-3.5s3.4 1.3 4 3.5M9.5 15c.6-2.2 2.1-3.5 4-3.5s3.4 1.3 4 3.5"/>
          </svg>
        </span>` : ''}
      </td>
    </tr>`
    )
    .join('');
}
renderTeams();

document.getElementById('teamCheckAll').addEventListener('change', (e) => {
  document.querySelectorAll('.team-check').forEach((cb) => (cb.checked = e.target.checked));
});

document.getElementById('teamSearch').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  renderTeams(
    q ? TEAMS.filter((t) => t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)) : TEAMS
  );
});

// =====================================================
// 사람 선택기 (소유자/구성원 자동 완성 + 칩)
// =====================================================
function setupPeoplePicker(rootId, options = {}) {
  const root = document.getElementById(rootId);
  const input = root.querySelector('.picker-input');
  const dropdown = root.querySelector('.picker-dropdown');
  const chipsEl = root.querySelector('.picker-chips');
  const max = options.max || Infinity;
  let selected = [];

  function renderChips() {
    chipsEl.innerHTML = selected
      .map(
        (u, i) => `
      <span class="person-chip">
        <span class="chip-avatar" style="background:${avatarColor(u.display)}">
          <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="10" cy="7" r="3.2"/><path d="M4 17c.9-2.8 3.2-4.2 6-4.2s5.1 1.4 6 4.2"/>
          </svg>
        </span>
        <span>${u.display}</span>
        <button type="button" class="chip-x" data-index="${i}" title="제거">
          <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.4">
            <line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/>
          </svg>
        </button>
      </span>`
      )
      .join('');

    // 최대 인원 도달 시 입력 잠금
    const full = selected.length >= max;
    input.disabled = full;
    if (options.limitEl) document.getElementById(options.limitEl).hidden = !full;
    if (options.hintEl) document.getElementById(options.hintEl).hidden = selected.length > 0;
    if (options.onChange) options.onChange(selected);
  }

  function showMatches() {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      dropdown.hidden = true;
      return;
    }
    const picked = new Set(selected.map((u) => u.id));
    const matches = STUDENTS.filter(
      (u) => !picked.has(u.id) && (u.display.toLowerCase().includes(q) || u.id.toLowerCase().includes(q))
    ).slice(0, 8);

    dropdown.innerHTML = matches.length
      ? matches
          .map(
            (u, i) => `
        <div class="picker-item" data-id="${u.id}">
          <span class="picker-avatar" style="background:${avatarColor(u.display)}">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4">
              <circle cx="10" cy="7" r="3.2"/><path d="M4 17c.9-2.8 3.2-4.2 6-4.2s5.1 1.4 6 4.2"/>
            </svg>
          </span>
          <span>
            <div class="picker-item-name">${u.display}</div>
            <div class="picker-item-id">${u.id}</div>
          </span>
        </div>`
          )
          .join('')
      : '<div class="picker-empty">일치하는 사용자가 없습니다.</div>';
    dropdown.hidden = false;
  }

  input.addEventListener('input', showMatches);
  input.addEventListener('focus', showMatches);
  input.addEventListener('blur', () => setTimeout(() => (dropdown.hidden = true), 150));

  dropdown.addEventListener('mousedown', (e) => {
    const item = e.target.closest('.picker-item');
    if (!item) return;
    e.preventDefault();
    const user = STUDENTS.find((u) => u.id === item.dataset.id);
    if (user && selected.length < max) {
      selected.push(user);
      input.value = '';
      dropdown.hidden = true;
      renderChips();
    }
  });

  chipsEl.addEventListener('click', (e) => {
    const x = e.target.closest('.chip-x');
    if (x) {
      selected.splice(Number(x.dataset.index), 1);
      renderChips();
    }
  });

  return {
    getSelected: () => [...selected],
    reset() {
      selected = [];
      input.value = '';
      dropdown.hidden = true;
      renderChips();
    },
  };
}

// =====================================================
// 팀 추가 마법사 (5단계)
// =====================================================
const T_STEPS = ['기본 사항', '소유자', '구성원', '설정', '마침'];
let tCurrentStep = 1;

const ownerPicker = setupPeoplePicker('ownerPicker', {
  hintEl: 'ownerHint',
  onChange: () => updateTNextState(),
});

const memberPicker = setupPeoplePicker('memberPicker', {
  max: 20,
  limitEl: 'memberLimit',
  onChange: () => updateTNextState(),
});

function renderTStepper() {
  document.getElementById('tStepper').innerHTML = T_STEPS.map((label, i) => {
    const n = i + 1;
    const state = n < tCurrentStep ? 'done' : n === tCurrentStep ? 'current' : '';
    const check =
      n < tCurrentStep
        ? '<svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.8"><polyline points="2.5,6.5 5,9 9.5,3.5"/></svg>'
        : '';
    return `
    <div class="step-item ${state}">
      <span class="step-circle">${check}</span>
      <span class="step-label">${label}</span>
    </div>`;
  }).join('');
}

// 마법사 모드: 'team'(팀 추가) | 'group'(Microsoft 365 그룹 추가)
let tMode = 'team';

const T_MODE_TEXT = {
  team: {
    crumb: '팀 추가',
    step1Desc:
      '팀은 Microsoft Teams 파일에서 채팅하고 공동 작업할 수 있는 장소를 제공합니다. 팀의 모든 사용자에게 연락하기 위한 전자 메일 주소와 정보를 게시하기 위한 SharePoint 사이트가 포함되어 있습니다. 시작하려면 이 새 팀에 대한 몇 가지 기본 정보를 입력하세요.<br><a href="#" class="inline-link">Microsoft Teams에 대해 자세히 알아보기</a>',
    nameLabel: '팀 이름 <span class="req">*</span>',
    namePlaceholder: '예: Contoso 배송',
    descLabel: '이 팀 설명',
    descPlaceholder: '새 팀에 관한 설명을 입력하세요.',
    emailLabel: '팀 전자 메일 주소 <span class="req">*</span>',
    emailHint: '팀 전자 메일 주소를 입력합니다.',
    finishTitle: '팀 추가 검토 및 완료',
    finishBtn: '팀 추가',
    cancelMsg: '팀에 대해 입력한 모든 정보가 손실됩니다.',
    type: '팀',
  },
  group: {
    crumb: 'Microsoft 365 그룹 추가',
    step1Desc:
      'Microsoft 365 그룹은 사람들이 공동 작업을 하는 데 도움이 되며, 그룹의 모든 사용자에게 연락하기 위한 전자 메일 주소와 정보를 게시하기 위한 SharePoint 사이트가 포함됩니다. 시작하려면 만들려는 그룹에 관한 몇 가지 기본 정보를 입력하세요.',
    nameLabel: '이름 <span class="req">*</span>',
    namePlaceholder: '새 그룹',
    descLabel: '설명',
    descPlaceholder: '새 그룹에 관한 설명을 입력하세요.',
    emailLabel: '그룹 전자 메일 주소 <span class="req">*</span>',
    emailHint: '그룹 전자 메일 주소를 입력합니다.',
    finishTitle: 'Microsoft 365 그룹 추가 검토 및 완료',
    finishBtn: '그룹 추가',
    cancelMsg: '그룹에 대해 입력한 모든 정보가 손실됩니다.',
    type: 'Microsoft 365 그룹',
  },
};

function updateTNextState() {
  const next = document.getElementById('tNext');
  if (tCurrentStep === 1) {
    next.disabled = !document.getElementById('tTeamName').value.trim();
  } else if (tCurrentStep === 2) {
    next.disabled = ownerPicker.getSelected().length === 0;
  } else if (tCurrentStep === 4) {
    const empty = !document.getElementById('tTeamEmail').value.trim();
    next.disabled = empty;
    document.getElementById('tEmailRow').classList.toggle('invalid', empty);
    document.getElementById('tEmailHint').hidden = !empty;
  } else {
    next.disabled = false;
  }
}

function showTStep(n) {
  tCurrentStep = n;
  document.querySelectorAll('.t-step').forEach((s) => {
    s.hidden = Number(s.dataset.step) !== n;
  });
  document.getElementById('tBack').hidden = n === 1;
  document.getElementById('tNext').textContent = n === 5 ? T_MODE_TEXT[tMode].finishBtn : '다음';
  renderTStepper();
  updateTNextState();
  window.scrollTo(0, 0);
}

function fillTeamReview() {
  document.getElementById('tRevName').textContent =
    '이름: ' + document.getElementById('tTeamName').value.trim();
  document.getElementById('tRevDesc').textContent =
    '설명: ' + document.getElementById('tTeamDesc').value.trim();
  document.getElementById('tRevOwners').textContent = ownerPicker
    .getSelected()
    .map((u) => u.display)
    .join(', ');
  const members = memberPicker.getSelected();
  document.getElementById('tRevMembers').textContent = members.length
    ? members.map((u) => u.display).join(', ')
    : '없음';
  document.getElementById('tRevEmail').textContent =
    '전자 메일: ' + document.getElementById('tTeamEmail').value.trim() + '@' + DOMAIN;
  document.getElementById('tRevPrivacy').textContent =
    '공개 범위: ' + document.getElementById('tPrivacySelect').value;
}

function applyTModeTexts() {
  const t = T_MODE_TEXT[tMode];
  document.getElementById('tCrumbCurrent').textContent = t.crumb;
  document.getElementById('tStep1Desc').innerHTML = t.step1Desc;
  document.getElementById('tNameLabel').innerHTML = t.nameLabel;
  document.getElementById('tTeamName').placeholder = t.namePlaceholder;
  document.getElementById('tDescLabel').textContent = t.descLabel;
  document.getElementById('tTeamDesc').placeholder = t.descPlaceholder;
  document.getElementById('tEmailLabel').innerHTML = t.emailLabel;
  document.getElementById('tEmailHint').textContent = t.emailHint;
  document.getElementById('tFinishTitle').textContent = t.finishTitle;
}

function resetTeamWizard() {
  document.getElementById('tTeamName').value = '';
  document.getElementById('tTeamDesc').value = '';
  document.getElementById('tTeamEmail').value = '';
  document.getElementById('tPrivacySelect').selectedIndex = 0;
  ownerPicker.reset();
  memberPicker.reset();
  showTStep(1);
}

function openAddTeam(mode = 'team') {
  tMode = mode;
  applyTModeTexts();
  resetTeamWizard();
  showPage('addteam');
  // 사이드바에는 '활성 팀 및 그룹'을 활성으로 유지
  const teamsLink = document.querySelector('.sidebar [data-page="teams"]');
  if (teamsLink) {
    teamsLink.classList.add('active');
    teamsLink.closest('.nav-item').classList.add('expanded');
  }
}

function finishTeamWizard() {
  const owners = ownerPicker.getSelected();

  TEAMS.push({
    name: document.getElementById('tTeamName').value.trim(),
    desc: document.getElementById('tTeamDesc').value.trim(),
    email: document.getElementById('tTeamEmail').value.trim() + '@' + DOMAIN,
    type: T_MODE_TEXT[tMode].type,
    owners: owners.map((u) => u.display).join(', '),
    members: memberPicker.getSelected().length,
  });
  renderTeams();
  document.getElementById('teamSearch').value = '';
  showPage('teams');
}

// [팀 추가]/[Microsoft 365 그룹 추가] 버튼 연결
document.querySelectorAll('button').forEach((btn) => {
  const label = btn.textContent.trim();
  if (!btn.classList.contains('toolbar-btn')) return;
  if (label === '팀 추가') btn.addEventListener('click', () => openAddTeam('team'));
  if (label === 'Microsoft 365 그룹 추가') btn.addEventListener('click', () => openAddTeam('group'));
});

document.getElementById('tTeamName').addEventListener('input', updateTNextState);
document.getElementById('tTeamEmail').addEventListener('input', updateTNextState);

document.getElementById('tBack').addEventListener('click', () => showTStep(tCurrentStep - 1));

document.getElementById('tNext').addEventListener('click', () => {
  if (tCurrentStep < 5) {
    if (tCurrentStep === 4) fillTeamReview();
    showTStep(tCurrentStep + 1);
  } else {
    finishTeamWizard();
  }
});

// [취소] → 확인 팝업 (팀/그룹 문구)
document.getElementById('tCancel').addEventListener('click', () => {
  document.getElementById('confirmMsg').textContent = T_MODE_TEXT[tMode].cancelMsg;
  confirmYesAction = () => {
    resetTeamWizard();
    showPage('teams');
  };
  cancelConfirm.hidden = false;
});

// 검토 화면 [편집] 링크 → 해당 단계로 이동
document.querySelectorAll('.t-edit-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showTStep(Number(link.dataset.goto));
  });
});

// =====================================================
// 팀 이름 및 설명 편집 패널
// =====================================================
const editTeamPanel = document.getElementById('editTeamPanel');
let editTeamTarget = null;

document.getElementById('editNameBtn').addEventListener('click', () => {
  const checked = [...document.querySelectorAll('.team-check:checked')];
  if (checked.length !== 1) return; // 정확히 하나 선택된 경우에만
  editTeamTarget = teamsRendered[Number(checked[0].closest('tr').dataset.index)];
  document.getElementById('editTeamName').value = editTeamTarget.name;
  document.getElementById('editTeamDesc').value = editTeamTarget.desc || '';
  document.getElementById('editTeamSave').disabled = true;
  editTeamPanel.hidden = false;
});

['editTeamName', 'editTeamDesc'].forEach((id) => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById('editTeamSave').disabled =
      !document.getElementById('editTeamName').value.trim();
  });
});

document.getElementById('editTeamSave').addEventListener('click', () => {
  if (editTeamTarget) {
    editTeamTarget.name = document.getElementById('editTeamName').value.trim();
    editTeamTarget.desc = document.getElementById('editTeamDesc').value.trim();
    renderTeams(teamsRendered);
  }
  editTeamPanel.hidden = true;
});

document.getElementById('editTeamX').addEventListener('click', () => {
  editTeamPanel.hidden = true;
});

// =====================================================
// 활성 팀 및 그룹: 탭 전환 (Teams / 메일 그룹 / 보안 그룹)
// =====================================================
document.querySelectorAll('#page-teams .team-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('#page-teams .team-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('#page-teams .tab-panel').forEach((panel) => {
      panel.hidden = panel.id !== tab.dataset.tab;
    });
  });
});

// =====================================================
// 활성 사용자: ⋯ 드롭다운 메뉴
// =====================================================
[
  ['moreBtnDefault', 'moreMenuDefault'],
  ['moreBtnSelected', 'moreMenuSelected'],
].forEach(([btnId, menuId]) => {
  document.getElementById(btnId).addEventListener('click', (e) => {
    e.stopPropagation();
    const menu = document.getElementById(menuId);
    const wasHidden = menu.hidden;
    document.querySelectorAll('.more-menu').forEach((m) => (m.hidden = true));
    menu.hidden = !wasHidden;
  });
});

// 메뉴 바깥 클릭 시 닫기
document.addEventListener('click', (e) => {
  if (!e.target.closest('.more-wrap')) {
    document.querySelectorAll('.more-menu').forEach((m) => (m.hidden = true));
  }
});

// 선택 개수 옆 ✕ → 전체 선택 해제
document.getElementById('selClear').addEventListener('click', () => {
  document.querySelectorAll('.row-check').forEach((cb) => (cb.checked = false));
  updateSelectionUI();
});

// =====================================================
// 그룹 관리 패널
// =====================================================
const groupPanel = document.getElementById('groupPanel');
let gmSelectedEmail = null; // 그룹 1개만 선택 가능
let gmSavedEmail = null; // 방금 저장한 그룹 (체크는 풀리고 행 강조만 유지)

// 이름에서 아바타 이니셜 추출 (영문 시작이면 단어 첫 글자 최대 2개, 아니면 사람 아이콘)
function gmAvatarContent(name) {
  if (/^[A-Za-z]/.test(name)) {
    const initials = name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
    return initials;
  }
  return `<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4">
    <circle cx="10" cy="7" r="3.2"/><path d="M4 17c.9-2.8 3.2-4.2 6-4.2s5.1 1.4 6 4.2"/>
  </svg>`;
}

function renderGmList() {
  const q = document.getElementById('gmSearch').value.trim().toLowerCase();
  document.getElementById('gmSearchClear').hidden = !q;
  const list = TEAMS.filter(
    (t) => !q || t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)
  );

  document.getElementById('gmList').innerHTML = list.length
    ? list
        .map(
          (t) => `
    <label class="gm-item${gmSelectedEmail === t.email || gmSavedEmail === t.email ? ' selected' : ''}">
      <input type="checkbox" class="gm-check" data-email="${t.email}" ${gmSelectedEmail === t.email ? 'checked' : ''}>
      <span class="gm-avatar" style="background:${avatarColor(t.name)}">${gmAvatarContent(t.name)}</span>
      <span>
        <div class="gm-name">${t.name}</div>
        <div class="gm-email">${t.email}</div>
      </span>
    </label>`
        )
        .join('')
    : '<div class="gm-empty">일치하는 그룹이 없습니다.</div>';
}

// 그룹 1개만 선택 가능 (다른 항목 체크 시 기존 선택 해제)
document.getElementById('gmList').addEventListener('change', (e) => {
  if (!e.target.classList.contains('gm-check')) return;
  gmSelectedEmail = e.target.checked ? e.target.dataset.email : null;
  // 새로 편집을 시작하면 저장 완료 표시는 접는다
  gmSavedEmail = null;
  document.getElementById('gmSuccess').hidden = true;
  document.getElementById('gmInfoBanner').hidden = false;
  renderGmList();
  document.getElementById('gmSave').disabled = !gmSelectedEmail;
});

document.getElementById('gmSearch').addEventListener('input', renderGmList);
document.getElementById('gmSearchClear').addEventListener('click', () => {
  document.getElementById('gmSearch').value = '';
  renderGmList();
});

// [그룹 관리] 메뉴 → 패널 열기
document.getElementById('groupManageBtn').addEventListener('click', () => {
  document.querySelectorAll('.more-menu').forEach((m) => (m.hidden = true));
  document.getElementById('gmCount').textContent =
    document.querySelectorAll('.row-check:checked').length;

  gmSelectedEmail = null;
  gmSavedEmail = null;
  document.getElementById('gmSearch').value = '';
  renderGmList();
  document.getElementById('gmMain').hidden = false;
  document.getElementById('gmLoading').hidden = true;
  document.getElementById('gmSuccess').hidden = true;
  document.getElementById('gmInfoBanner').hidden = false;
  document.getElementById('gmSave').disabled = true;
  groupPanel.hidden = false;
});

// [변경 내용 저장] → 저장 중 스피너(약 1초) → 초록 "변경했습니다." 배너와 함께 목록 복귀
document.getElementById('gmSave').addEventListener('click', () => {
  document.getElementById('gmMain').hidden = true;
  document.getElementById('gmLoading').hidden = false;
  document.getElementById('gmSave').disabled = true;

  setTimeout(() => {
    // 체크는 풀리고 방금 저장한 그룹 행만 강조 유지
    gmSavedEmail = gmSelectedEmail;
    gmSelectedEmail = null;
    document.getElementById('gmSearch').value = '';
    renderGmList();

    document.getElementById('gmLoading').hidden = true;
    document.getElementById('gmMain').hidden = false;
    document.getElementById('gmSuccess').hidden = false;
    document.getElementById('gmInfoBanner').hidden = true;
    document.getElementById('gmSave').disabled = true;
  }, 1200);
});

document.getElementById('gmX').addEventListener('click', () => {
  groupPanel.hidden = true;
});

// =====================================================
// 제품 라이선스 관리 패널
// =====================================================
const licensePanel = document.getElementById('licensePanel');
let plTargets = []; // 라이선스를 변경할 사용자들

// 이 패널 전용 라이선스 목록 (실제 화면 순서)
const PL_LICENSES = [
  { name: '학생용 Microsoft 365 A3 사용 혜택', avail: '1204/2400개 라이선스 사용 가능' },
  { name: 'Microsoft Power Automate Free', avail: '9400/10000개 라이선스 사용 가능' },
  { name: 'Microsoft Copilot Studio 바이럴 평가판', avail: '9961/10000개 라이선스 사용 가능' },
  { name: '교직원용 Microsoft 365 A3', avail: '3/60개 라이선스 사용 가능' },
  { name: 'Microsoft Power Apps for Developer', avail: '9982/10000개 라이선스 사용 가능' },
];

// 라이선스별 포함 앱
const PL_APPS = {
  '학생용 Microsoft 365 A3 사용 혜택': [
    'Exchange Online(계획 2)', 'Microsoft Teams', 'SharePoint(플랜 2)',
    'OneDrive for Business(플랜 2)', 'Microsoft Forms(플랜 2)', 'Office for the Web(교육용)',
    'Microsoft Loop', 'Microsoft Planner', 'Whiteboard(플랜 2)',
  ],
  'Microsoft Power Automate Free': ['Common Data Service', 'Microsoft Power Automate Free'],
  'Microsoft Copilot Studio 바이럴 평가판': [
    'CCI Bots용 Common Data Service', 'CCI 봇용 Flow',
    'Dynamics 365 AI for Customer Service Virtual Agents 바이럴',
  ],
  '교직원용 Microsoft 365 A3': [
    'Exchange Online(계획 2)', 'Microsoft Teams', 'SharePoint(플랜 2)',
    'Microsoft Intune Plan 1 for Education', 'Microsoft Forms(플랜 2)',
  ],
  'Microsoft Power Apps for Developer': [
    'Common Data Service for Apps 개발자', 'Power Apps for Developer', 'Power Automate for Developer',
  ],
};

// 라이선스 목록 렌더링 (1회)
document.getElementById('plLicList').innerHTML = PL_LICENSES.map(
  (lic) => `
  <label class="license-item">
    <input type="checkbox" class="pl-lic-check" data-name="${lic.name}">
    <span>
      <div class="license-name">${lic.name}</div>
      <div class="license-avail">${lic.avail}</div>
    </span>
  </label>`
).join('');

function plSelectedLics() {
  return [...document.querySelectorAll('.pl-lic-check:checked')].map((cb) => cb.dataset.name);
}

function plMode() {
  return document.querySelector('input[name="plMode"]:checked')?.value || null;
}

// 앱 표시 드롭다운 옵션 재구성 (모든 라이선스 + 선택된 라이선스명)
function rebuildPlAppFilter() {
  const filter = document.getElementById('plAppFilter');
  const prev = filter.value;
  const options = ['모든 라이선스', ...plSelectedLics()];
  filter.innerHTML = options.map((o) => `<option>${o}</option>`).join('');
  if (options.includes(prev)) filter.value = prev;
}

function renderPlApps() {
  const filter = document.getElementById('plAppFilter').value;
  const items = plSelectedLics().flatMap((name) =>
    (PL_APPS[name] || []).map((app) => ({ app, lic: name }))
  ).filter((it) => filter === '모든 라이선스' || it.lic === filter);

  document.getElementById('plAppList').innerHTML = items.length
    ? items
        .map(
          (it) => `
    <label class="app-item">
      <input type="checkbox" class="pl-app-check" checked>
      <span>
        <div class="app-name">${it.app}</div>
        <div class="app-sub">${it.lic}</div>
      </span>
    </label>`
        )
        .join('')
    : '<div class="gm-empty">표시할 앱이 없습니다. 라이선스를 먼저 선택하세요.</div>';
  document.getElementById('plAppsAll').checked = true;
}

// 라디오/라이선스 선택에 따른 화면 상태 갱신
function updatePlState() {
  const mode = plMode();
  const sel = plSelectedLics();
  const needLics = mode === 'replace' || mode === 'add';

  document.getElementById('plLicArea').hidden = !needLics;
  document.getElementById('plLicCount').textContent = sel.length;
  document.getElementById('plAppCount').textContent = sel.reduce(
    (n, name) => n + (PL_APPS[name] || []).length, 0
  );
  document.getElementById('plSave').disabled = !mode || (needLics && sel.length === 0);
}

document.querySelectorAll('input[name="plMode"]').forEach((radio) => {
  radio.addEventListener('change', updatePlState);
});

document.getElementById('plLicList').addEventListener('change', (e) => {
  if (!e.target.classList.contains('pl-lic-check')) return;
  rebuildPlAppFilter();
  renderPlApps();
  updatePlState();
});

// 라이선스/앱 섹션 접기·펼치기
[
  ['plLicHeader', 'plLicList'],
  ['plAppsHeader', 'plAppsSection'],
].forEach(([headerId, sectionId]) => {
  document.getElementById(headerId).addEventListener('click', () => {
    const section = document.getElementById(sectionId);
    section.hidden = !section.hidden;
    document.getElementById(headerId).querySelector('.collapse-chevron').classList.toggle('up', !section.hidden);
  });
});

document.getElementById('plAppFilter').addEventListener('change', renderPlApps);

document.getElementById('plAppsAll').addEventListener('change', (e) => {
  document.querySelectorAll('.pl-app-check').forEach((cb) => (cb.checked = e.target.checked));
});

// [제품 라이선스 관리] 버튼 → 패널 열기
function openLicensePanel() {
  plTargets = [...document.querySelectorAll('.row-check:checked')].map(
    (cb) => lastRendered[Number(cb.closest('tr').dataset.index)]
  );
  if (!plTargets.length) return;

  document.getElementById('plCount').textContent = plTargets.length;
  document.querySelectorAll('input[name="plMode"]').forEach((r) => (r.checked = false));
  document.querySelectorAll('.pl-lic-check').forEach((cb) => (cb.checked = false));
  document.getElementById('plLicArea').hidden = true;
  document.getElementById('plLicList').hidden = false;
  document.getElementById('plLicHeader').querySelector('.collapse-chevron').classList.add('up');
  document.getElementById('plAppsSection').hidden = true;
  document.getElementById('plAppsHeader').querySelector('.collapse-chevron').classList.remove('up');
  rebuildPlAppFilter();
  renderPlApps();
  updatePlState();

  document.getElementById('plMain').hidden = false;
  document.getElementById('plLoading').hidden = true;
  document.getElementById('plDone').hidden = true;
  document.getElementById('plFooter').hidden = false;
  licensePanel.hidden = false;
}

document.querySelectorAll('#toolbarSelected button').forEach((btn) => {
  if (btn.textContent.trim() === '제품 라이선스 관리') {
    btn.addEventListener('click', openLicensePanel);
  }
});

// [변경 내용 저장] → 스피너 → 할당 결과 화면
document.getElementById('plSave').addEventListener('click', () => {
  const mode = plMode();
  const sel = plSelectedLics();

  document.getElementById('plMain').hidden = true;
  document.getElementById('plLoading').hidden = false;
  document.getElementById('plSave').disabled = true;

  setTimeout(() => {
    // 실제 라이선스 반영
    plTargets.forEach((u) => {
      if (mode === 'removeAll') {
        u.license = '-';
      } else if (mode === 'replace') {
        u.license = sel.join(' , ');
      } else {
        const existing = u.license === '-' ? [] : u.license.split(' , ');
        u.license = [...new Set([...existing, ...sel])].join(' , ');
      }
    });
    renderUsers(STUDENTS);

    // 완료 화면
    document.getElementById('plDoneSub').textContent =
      `사용자 ${plTargets.length}/${plTargets.length}명의 라이선스를 할당했습니다.`;
    document.getElementById('plDoneRows').innerHTML = plTargets
      .map(
        (u) => `<tr><td>${u.display}</td><td>${
          u.license === '-' ? '할당된 라이선스 없음' : u.license.split(' , ').join(', ')
        }</td></tr>`
      )
      .join('');

    document.getElementById('plLoading').hidden = true;
    document.getElementById('plDone').hidden = false;
    document.getElementById('plFooter').hidden = true;
  }, 1200);
});

// [다운로드] → 할당 결과 CSV
document.getElementById('plDownload').addEventListener('click', (e) => {
  e.preventDefault();
  const rows = plTargets.map((u) => `${u.display},"${u.license === '-' ? '' : u.license}"`);
  downloadCsv('할당된_라이선스.csv', '사용자 이름,라이선스\n' + rows.join('\n') + '\n');
});

document.getElementById('plX').addEventListener('click', () => {
  licensePanel.hidden = true;
});

// =====================================================
// 우측 하단 플로팅 버튼 → 사용자 매뉴얼 (새 탭)
// =====================================================
document.getElementById('manualBtn').addEventListener('click', () => {
  window.open('manual.html', '_blank');
});

// =====================================================
// 사용자 세부 정보 패널 (활성 사용자에서 이름 클릭)
// =====================================================
const userDetailPanel = document.getElementById('userDetailPanel');
let udUser = null;
let udView = 'main';
let udEmailDraft = null; // 편집 중인 기본 이메일 로컬 파트
let udAliasDraft = [];

// 표시 이름에서 성/이름 분리 ([x학년 y반] 접두사 제거)
// 연락처 정보 관리에서 직접 입력한 값이 있으면 그 값을 우선 사용
function udNameParts(user) {
  if (user.contact && (user.contact.first || user.contact.last)) {
    return { first: user.contact.first || '', last: user.contact.last || '' };
  }
  const name = user.display.replace(/^\[[^\]]*\]/, '');
  if (/^[A-Za-z]/.test(name)) {
    const parts = name.split(/[_\s]+/);
    return { last: parts[0] || '', first: parts.slice(1).join('_') || '' };
  }
  return { last: name[0] || '', first: name.slice(1) || '' };
}

// 아바타: 영문이면 이름+성 이니셜(예: test01+daegu → TD), 한글이면 사람 아이콘
function udAvatarContent(user) {
  const { first, last } = udNameParts(user);
  const fi = (first[0] || '').toUpperCase();
  const li = (last[0] || '').toUpperCase();
  if (/[A-Z]/.test(li)) return (fi + li) || li;
  return `<svg viewBox="0 0 20 20" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.3">
    <circle cx="10" cy="7" r="3.2"/><path d="M4 17c.9-2.8 3.2-4.2 6-4.2s5.1 1.4 6 4.2"/>
  </svg>`;
}

function fillUdMain() {
  const { first, last } = udNameParts(udUser);
  document.getElementById('udAvatar').innerHTML = udAvatarContent(udUser);
  document.getElementById('udName').textContent = udUser.display;
  document.getElementById('udEmailValue').textContent = udUser.id;
  document.getElementById('udDisplay').textContent = udUser.display;
  document.getElementById('udFirst').textContent = first;
  document.getElementById('udLast').textContent = last;

  const aliasEl = document.getElementById('udAliasValue');
  aliasEl.hidden = !(udUser.aliases && udUser.aliases.length);
  aliasEl.textContent = (udUser.aliases || []).join(', ');

  document.getElementById('udGroupsValue').textContent =
    udUser.groups && udUser.groups.length
      ? udUser.groups.map((g) => g.name).join(', ')
      : '제공된 항목 없음';

  document.getElementById('udRoleValue').textContent =
    udUser.adminAccess && udUser.adminRoles && udUser.adminRoles.length
      ? udUser.adminRoles.join(', ')
      : '관리자 액세스 권한 없음';
}

function showUdView(view) {
  udView = view;
  const views = {
    udMain: 'main', udEmail: 'email', udGroups: 'groups', udAssign: 'assign',
    udContact: 'contact', udDevices: 'devices', udRoles: 'roles',
  };
  Object.entries(views).forEach(([id, v]) => {
    document.getElementById(id).hidden = v !== view;
  });
  document.getElementById('udBack').hidden = view === 'main';
  document.getElementById('udFooter').hidden = view === 'main' || view === 'groups';
  document.getElementById('udSaveEmail').hidden = view !== 'email';
  document.getElementById('udAssignAdd').hidden = view !== 'assign';
  document.getElementById('udAssignCancel').hidden = view !== 'assign';
  document.getElementById('udSaveContact').hidden = view !== 'contact';
  document.getElementById('udSaveRoles').hidden = view !== 'roles';
  document.getElementById('udInviteBtn').hidden = view !== 'devices';
  userDetailPanel.querySelector('.delete-body').scrollTop = 0;
}

function openUserDetail(user) {
  udUser = user;
  udUser.aliases = udUser.aliases || [];
  udUser.groups = udUser.groups || [];
  fillUdMain();
  showUdTab('account'); // 항상 계정 탭부터
  // 로그아웃 안내 초기화
  document.getElementById('udSignout').hidden = false;
  document.getElementById('udSignoutMsg').hidden = true;
  showUdView('main');
  userDetailPanel.hidden = false;
}

// 활성 사용자 목록에서 이름 클릭 → 세부 정보
tbody.addEventListener('click', (e) => {
  const nameEl = e.target.closest('.display-name');
  if (nameEl) {
    const idx = Number(nameEl.closest('tr').dataset.index);
    openUserDetail(lastRendered[idx]);
  }
});

// 닫기 / 새로 고침 / 뒤로
document.getElementById('udX').addEventListener('click', () => (userDetailPanel.hidden = true));
document.getElementById('udRefresh').addEventListener('click', fillUdMain);
document.getElementById('udBack').addEventListener('click', () => {
  showUdView(udView === 'assign' ? 'groups' : 'main');
});

// 빠른 작업: 암호 재설정 / 사용자 삭제 (기존 패널 재사용)
document.getElementById('udResetPw').addEventListener('click', () => {
  userDetailPanel.hidden = true;
  openResetPanel([udUser]);
});
document.getElementById('udDelete').addEventListener('click', () => {
  userDetailPanel.hidden = true;
  openDeletePanel([udUser]);
});

// 다단계 인증 관리 → MFA 페이지 새 탭
document.getElementById('udMfaLink').addEventListener('click', (e) => {
  e.preventDefault();
  saveStudentsToStorage();
  window.open('mfa.html', '_blank');
});

// 모든 세션에서 로그아웃 → 안내 문구로 전환
document.getElementById('udSignout').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('udSignout').hidden = true;
  document.getElementById('udSignoutMsg').hidden = false;
});

// ----- 사용자 이름 및 전자 메일 관리 -----
function renderUdAliasList() {
  document.getElementById('udAliasList').innerHTML = udAliasDraft
    .map((a) => `<li><span>${a}</span></li>`)
    .join('');
}

function openUdEmailView() {
  const local = udUser.id.split('@')[0];
  document.getElementById('udEmailDesc').textContent =
    `기본 전자 메일도 사용자 이름인 경우 기본 전자 메일을 변경하면 현재 사용자 이름이 변경됩니다. 별칭은 사람들이 전자 메일을 보낼 때 사용할 수 있는 또 다른 전자 메일 주소입니다 ${local}.`;
  document.getElementById('udPrimaryText').textContent = udUser.id;
  document.getElementById('udPrimaryRow').hidden = false;
  document.getElementById('udPrimaryEdit').hidden = true;
  document.getElementById('udAliasInput').value = '';
  document.getElementById('udAliasAdd').disabled = true;
  udEmailDraft = null;
  udAliasDraft = [...udUser.aliases];
  renderUdAliasList();
  document.getElementById('udSaveEmail').disabled = true;
  showUdView('email');
}

document.querySelectorAll('.ud-manage-email').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openUdEmailView();
  });
});

// 연필 → 기본 이메일 편집
document.getElementById('udEditEmail').addEventListener('click', () => {
  const [local, domain] = udUser.id.split('@');
  document.getElementById('udPrimaryRow').hidden = true;
  document.getElementById('udPrimaryEdit').hidden = false;
  document.getElementById('udPrimaryInput').value = local;
  document.getElementById('udPrimaryDomain').textContent = domain;
});

document.getElementById('udPrimaryInput').addEventListener('input', (e) => {
  udEmailDraft = e.target.value.trim();
  document.getElementById('udSaveEmail').disabled =
    !udEmailDraft && udAliasDraft.length === udUser.aliases.length;
});

// 별칭 추가
document.getElementById('udAliasInput').addEventListener('input', (e) => {
  document.getElementById('udAliasAdd').disabled = !e.target.value.trim();
});

document.getElementById('udAliasAdd').addEventListener('click', () => {
  const name = document.getElementById('udAliasInput').value.trim();
  if (!name) return;
  udAliasDraft.push(name + '@' + document.getElementById('udAliasDomain').value);
  renderUdAliasList();
  document.getElementById('udAliasInput').value = '';
  document.getElementById('udAliasAdd').disabled = true;
  document.getElementById('udSaveEmail').disabled = false;
});

// 변경 내용 저장 → 실제 반영
document.getElementById('udSaveEmail').addEventListener('click', () => {
  if (udEmailDraft) {
    const domain = udUser.id.split('@')[1];
    udUser.id = udEmailDraft + '@' + domain;
  }
  udUser.aliases = [...udAliasDraft];
  renderUsers(STUDENTS);
  fillUdMain();
  showUdView('main');
});

// ----- 그룹 관리 -----
function renderUdGroups() {
  const rows = udUser.groups
    .map((g) => `
    <tr>
      <td class="col-check"><input type="checkbox"></td>
      <td><b>${g.name}</b></td>
      <td>${g.email}</td>
    </tr>`)
    .join('');
  document.getElementById('udGroupRows').innerHTML = rows;
  document.getElementById('udGroupsEmpty').hidden = udUser.groups.length > 0;
}

document.getElementById('udManageGroups').addEventListener('click', (e) => {
  e.preventDefault();
  // 계정 탭에서 새로 열 때는 저장 배너 숨김
  document.getElementById('udGroupsInfo').hidden = true;
  document.getElementById('udGroupsSaved').hidden = true;
  renderUdGroups();
  showUdView('groups');
});

// ----- 멤버십 할당 -----
function renderUdAssign() {
  const q = document.getElementById('udAssignSearch').value.trim().toLowerCase();
  const memberEmails = new Set(udUser.groups.map((g) => g.email));
  const list = TEAMS.filter(
    (t) => !memberEmails.has(t.email) &&
      (!q || t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q))
  );
  document.getElementById('udAssignRows').innerHTML = list.length
    ? list
        .map(
          (t) => `
    <tr>
      <td class="col-check"><input type="checkbox" class="ud-assign-check" data-email="${t.email}"></td>
      <td>${t.name}</td>
      <td>${t.email}</td>
    </tr>`
        )
        .join('')
    : '<tr><td colspan="3" class="gm-empty">할당할 수 있는 그룹이 없습니다.</td></tr>';
  document.getElementById('udAssignAdd').disabled = true;
  document.getElementById('udAssignAll').checked = false;
}

document.getElementById('udAssignBtn').addEventListener('click', () => {
  document.getElementById('udAssignSearch').value = '';
  renderUdAssign();
  showUdView('assign');
});

document.getElementById('udAssignSearch').addEventListener('input', renderUdAssign);

document.getElementById('udAssignRows').addEventListener('change', () => {
  document.getElementById('udAssignAdd').disabled =
    document.querySelectorAll('.ud-assign-check:checked').length === 0;
});

document.getElementById('udAssignAll').addEventListener('change', (e) => {
  document.querySelectorAll('.ud-assign-check').forEach((cb) => (cb.checked = e.target.checked));
  document.getElementById('udAssignAdd').disabled =
    document.querySelectorAll('.ud-assign-check:checked').length === 0;
});

document.getElementById('udAssignAdd').addEventListener('click', () => {
  [...document.querySelectorAll('.ud-assign-check:checked')].forEach((cb) => {
    const team = TEAMS.find((t) => t.email === cb.dataset.email);
    if (team) udUser.groups.push({ name: team.name, email: team.email });
  });
  fillUdMain();
  renderUdGroups();
  // 실제 화면처럼 안내 배너 + "저장됨" 표시
  document.getElementById('udGroupsInfo').hidden = false;
  document.getElementById('udGroupsSaved').hidden = false;
  showUdView('groups');
});

document.getElementById('udAssignCancel').addEventListener('click', () => showUdView('groups'));

// =====================================================
// 세부 정보: 연락처 정보 관리
// =====================================================
function openUdContact() {
  const { first, last } = udNameParts(udUser);
  const c = udUser.contact || {};
  document.getElementById('udcFirst').value = c.first || first;
  document.getElementById('udcLast').value = c.last || last;
  document.getElementById('udcDisplay').value = udUser.display;
  document.getElementById('udcTitle').value = c.title || '';
  document.getElementById('udcDept').value = c.dept || '';
  document.getElementById('udcOffice').value = c.office || '';
  document.getElementById('udcPhone').value = c.phone || '';
  document.getElementById('udcFax').value = c.fax || '';
  document.getElementById('udcMobile').value = c.mobile || '';
  document.getElementById('udcAddr').value = c.addr || '';
  document.getElementById('udSaveContact').disabled = true;
  showUdView('contact');
}

document.getElementById('udManageContact').addEventListener('click', (e) => {
  e.preventDefault();
  openUdContact();
});

document.querySelectorAll('.udc-input').forEach((el) => {
  el.addEventListener('input', () => {
    document.getElementById('udSaveContact').disabled =
      !document.getElementById('udcDisplay').value.trim();
  });
});

document.getElementById('udSaveContact').addEventListener('click', () => {
  udUser.contact = {
    first: document.getElementById('udcFirst').value.trim(),
    last: document.getElementById('udcLast').value.trim(),
    title: document.getElementById('udcTitle').value.trim(),
    dept: document.getElementById('udcDept').value.trim(),
    office: document.getElementById('udcOffice').value.trim(),
    phone: document.getElementById('udcPhone').value.trim(),
    fax: document.getElementById('udcFax').value.trim(),
    mobile: document.getElementById('udcMobile').value.trim(),
    addr: document.getElementById('udcAddr').value.trim(),
  };
  udUser.display = document.getElementById('udcDisplay').value.trim();
  renderUsers(STUDENTS);
  fillUdMain();
  showUdView('main');
});

// =====================================================
// 세부 정보: Microsoft 365 활성화 (로그인된 장치)
// =====================================================
function openUdDevices() {
  const fullName = udUser.display.replace(/^\[[^\]]*\]/, '');
  const local = (udUser.id.split('@')[0] || 'user').replace(/[^a-z0-9]/gi, '').toUpperCase() || 'USER';

  document.getElementById('udDevTitle').textContent =
    `${udUser.display}이 Microsoft 365에 로그인되어 있는 장치`;
  document.getElementById('udDevDesc').textContent =
    `모든 장치에서 ${udUser.display}을 초대하여 다운로드하고 로그인 Microsoft 365에 로그인합니다. 장치를 비활성화 해도 장치에서 Microsoft 365 앱 이나 데이터가 제거되는 것은 아니지만 원격으로 Microsoft 365에서 로그아웃할 수 있습니다.`;

  const devices = [
    { name: `${fullName}의 MacBook Pro`, os: 'Mac OSX 26.5.1', date: '2026. 6. 10.' },
    { name: `${local}_WIN`, os: 'Microsoft Windows 10 Home', date: '2026. 3. 27.' },
    { name: 'DESKTOP-UULQK0P', os: 'Microsoft Windows 10 Pro', date: '2026. 6. 10.' },
    { name: '프로젝트실2', os: 'Microsoft Windows 10 Pro', date: '2026. 6. 9.' },
    { name: '콘텐츠제작실2', os: 'Microsoft Windows 10 Enterprise', date: '2026. 5. 19.' },
    { name: fullName, os: 'Microsoft Windows 10 Pro', date: '2026. 5. 20.' },
    { name: fullName, os: 'Microsoft Windows 10 Pro', date: '2026. 5. 21.' },
    { name: fullName, os: 'Microsoft Windows 10 Pro', date: '2026. 4. 20.' },
  ];

  document.getElementById('udDeviceRows').innerHTML = devices
    .map(
      (d) => `
    <tr>
      <td>${d.name}</td>
      <td>${d.os}</td>
      <td>${d.date}</td>
      <td>
        <button class="dev-remove" title="비활성화">
          <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/>
          </svg>
        </button>
      </td>
    </tr>`
    )
    .join('');
  showUdView('devices');
}

document.getElementById('udM365Link').addEventListener('click', (e) => {
  e.preventDefault();
  openUdDevices();
});

// X → 해당 장치 비활성화(목록에서 제거)
document.getElementById('udDeviceRows').addEventListener('click', (e) => {
  const btn = e.target.closest('.dev-remove');
  if (btn) btn.closest('tr').remove();
});

// =====================================================
// 세부 정보: 관리자 역할 관리
// =====================================================
const UD_ROLES = [
  'AI 관리자', 'Exchange 관리자', 'SharePoint 관리자', 'Teams 관리자', '사용자 관리자',
  '사용자 환경 성공 관리자', '서비스 지원 관리자', '전역 관리자', '전역 독자', '지원 센터 관리자',
];

document.getElementById('udrList').innerHTML = UD_ROLES.map(
  (role) => `
  <label class="udr-item">
    <input type="checkbox" class="udr-check" data-role="${role}" disabled>
    <span>${role}</span>
    <span class="info-icon">&#9432;</span>
  </label>`
).join('');

function udRoleMode() {
  return document.querySelector('input[name="udRoleMode"]:checked').value;
}

function applyUdRoleMode() {
  const admin = udRoleMode() === 'admin';
  document.querySelectorAll('.udr-check').forEach((cb) => {
    cb.disabled = !admin;
    if (!admin) cb.checked = false;
  });
  document.getElementById('udrList').classList.toggle('enabled', admin);
}

function openUdRoles() {
  document.getElementById('udrUserName').textContent = udUser.display;
  const admin = !!udUser.adminAccess;
  document.querySelector(`input[name="udRoleMode"][value="${admin ? 'admin' : 'user'}"]`).checked = true;
  document.querySelectorAll('.udr-check').forEach((cb) => {
    cb.checked = admin && (udUser.adminRoles || []).includes(cb.dataset.role);
  });
  applyUdRoleMode();
  // 재설정: applyUdRoleMode가 체크를 지웠을 수 있으니 다시 반영
  if (admin) {
    document.querySelectorAll('.udr-check').forEach((cb) => {
      cb.checked = (udUser.adminRoles || []).includes(cb.dataset.role);
    });
  }
  document.getElementById('udSaveRoles').disabled = true;
  showUdView('roles');
}

document.getElementById('udManageRoles').addEventListener('click', (e) => {
  e.preventDefault();
  openUdRoles();
});

// 라디오: 사용자 → 체크박스 비활성, 관리 센터 액세스 → 다중 선택 활성
document.querySelectorAll('input[name="udRoleMode"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    applyUdRoleMode();
    document.getElementById('udSaveRoles').disabled = false;
  });
});

document.getElementById('udrList').addEventListener('change', (e) => {
  if (e.target.classList.contains('udr-check')) {
    document.getElementById('udSaveRoles').disabled = false;
  }
});

document.getElementById('udSaveRoles').addEventListener('click', () => {
  udUser.adminAccess = udRoleMode() === 'admin';
  udUser.adminRoles = udUser.adminAccess
    ? [...document.querySelectorAll('.udr-check:checked')].map((cb) => cb.dataset.role)
    : [];
  fillUdMain();
  showUdView('main');
});

// 초대 전자 메일 보내기 (표시용)
document.getElementById('udInviteBtn').addEventListener('click', () => {});

// =====================================================
// 세부 정보: 탭 전환 (계정 / 라이선스 및 앱 / OneDrive)
// =====================================================
const UD_TAB_CONTENT = {
  account: 'udTabAccount',
  licenses: 'udTabLicenses',
  onedrive: 'udTabOneDrive',
  empty: 'udTabEmpty',
  empty2: 'udTabEmpty',
};

function showUdTab(tabName) {
  document.querySelectorAll('.ud-tabs .team-tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.udtab === tabName);
  });
  const contentId = UD_TAB_CONTENT[tabName] || 'udTabAccount';
  ['udTabAccount', 'udTabLicenses', 'udTabOneDrive', 'udTabEmpty'].forEach((id) => {
    document.getElementById(id).hidden = id !== contentId;
  });
  if (tabName === 'licenses') fillUdLicenses();
  if (tabName === 'onedrive') fillUdOneDrive();
}

document.querySelectorAll('.ud-tabs .team-tab').forEach((tab) => {
  tab.addEventListener('click', () => showUdTab(tab.dataset.udtab));
});

// ----- 라이선스 및 앱 탭 -----
document.getElementById('udlList').innerHTML = PL_LICENSES.map(
  (lic) => `
  <label class="license-item">
    <input type="checkbox" class="udl-check" data-name="${lic.name}">
    <span>
      <div class="license-name">${lic.name}</div>
      <div class="license-avail">${lic.avail}</div>
    </span>
  </label>`
).join('');

function udlSelected() {
  return [...document.querySelectorAll('.udl-check:checked')].map((cb) => cb.dataset.name);
}

function updateUdlCounts() {
  const sel = udlSelected();
  document.getElementById('udlCount').textContent = sel.length;
  document.getElementById('udlAppCount').textContent = sel.reduce(
    (n, name) => n + (PL_APPS[name] || []).length, 0
  );
}

function renderUdlApps() {
  const items = udlSelected().flatMap((name) =>
    (PL_APPS[name] || []).map((app) => ({ app, lic: name }))
  );
  document.getElementById('udlAppList').innerHTML = items.length
    ? items
        .map(
          (it) => `
    <label class="app-item">
      <input type="checkbox" checked>
      <span>
        <div class="app-name">${it.app}</div>
        <div class="app-sub">${it.lic}</div>
      </span>
    </label>`
        )
        .join('')
    : '<div class="gm-empty">표시할 앱이 없습니다. 라이선스를 먼저 선택하세요.</div>';
}

// 사용자의 현재 라이선스로 체크 상태 채우기
function fillUdLicenses() {
  const current = udUser.license === '-' ? [] : udUser.license.split(' , ');
  document.querySelectorAll('.udl-check').forEach((cb) => {
    cb.checked = current.includes(cb.dataset.name);
  });
  updateUdlCounts();
  renderUdlApps();
  document.getElementById('udlSave').disabled = true;
}

document.getElementById('udlList').addEventListener('change', (e) => {
  if (!e.target.classList.contains('udl-check')) return;
  updateUdlCounts();
  renderUdlApps();
  document.getElementById('udlSave').disabled = false;
});

// 라이선스/앱 섹션 접기·펼치기
[
  ['udlHeader', 'udlList'],
  ['udlAppsHeader', 'udlAppsSection'],
].forEach(([headerId, sectionId]) => {
  document.getElementById(headerId).addEventListener('click', () => {
    const section = document.getElementById(sectionId);
    section.hidden = !section.hidden;
    document.getElementById(headerId).querySelector('.collapse-chevron').classList.toggle('up', !section.hidden);
  });
});

// 저장 → 사용자 라이선스에 실제 반영
document.getElementById('udlSave').addEventListener('click', () => {
  const sel = udlSelected();
  udUser.license = sel.length ? sel.join(' , ') : '-';
  renderUsers(STUDENTS);
  updateUdlCounts();
  document.getElementById('udlSave').disabled = true;
});

// ----- OneDrive 탭 -----
function fillUdOneDrive() {
  document.getElementById('udOdAccess').textContent =
    `${udUser.display} 님의 OneDrive 파일을 보고 편집할 링크를 만듭니다.`;
  document.getElementById('udOdShare').textContent =
    `${udUser.display}의 파일 및 폴더의 외부 공유를 제어합니다.`;
}

// SharePoint 관리 센터 새 탭 연결
document.getElementById('udOdRetention').addEventListener('click', (e) => {
  e.preventDefault();
  window.open('sharepoint.html#retention', '_blank');
});
document.getElementById('udOdStorage').addEventListener('click', (e) => {
  e.preventDefault();
  window.open('sharepoint.html#storage', '_blank');
});
