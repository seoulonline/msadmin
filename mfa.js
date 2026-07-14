// ===== 사용자 단위 다단계 인증 페이지 =====

// 메인 페이지(index.html)가 localStorage에 저장한 학생 명단 불러오기
let mfaUsers = [];
try {
  mfaUsers = JSON.parse(localStorage.getItem('msAdminStudents')) || [];
} catch (e) {
  mfaUsers = [];
}

// MFA 상태 (id → disabled | enabled | enforced), 새로고침해도 유지
let mfaStatus = {};
try {
  mfaStatus = JSON.parse(localStorage.getItem('msAdminMfaStatus')) || {};
} catch (e) {
  mfaStatus = {};
}

function saveStatus() {
  try {
    localStorage.setItem('msAdminMfaStatus', JSON.stringify(mfaStatus));
  } catch (e) { /* 저장 불가 환경 무시 */ }
}

function statusOf(user) {
  return mfaStatus[user.id] || 'disabled';
}

// ===== 테이블 렌더링 =====
const mfaTbody = document.getElementById('mfaTbody');
let mfaRendered = mfaUsers;

function renderMfaTable(list) {
  mfaRendered = list;
  if (!list.length) {
    mfaTbody.innerHTML =
      '<tr><td colspan="4" class="mfa-empty">표시할 사용자가 없습니다. 관리 센터의 활성 사용자 페이지를 먼저 열어주세요.</td></tr>';
    updateActionState();
    return;
  }
  mfaTbody.innerHTML = list
    .map(
      (u, i) => `
    <tr data-index="${i}">
      <td class="col-check"><input type="checkbox" class="mfa-check"></td>
      <td class="col-name">${u.display}</td>
      <td class="col-upn">${u.id}</td>
      <td class="col-status">${statusOf(u)}</td>
    </tr>`
    )
    .join('');
  updateActionState();
}

// ===== 선택 상태 → 작업 버튼 활성화 =====
function selectedUsers() {
  return [...document.querySelectorAll('.mfa-check:checked')].map(
    (cb) => mfaRendered[Number(cb.closest('tr').dataset.index)]
  );
}

function updateActionState() {
  const selected = selectedUsers();
  document.querySelectorAll('.mfa-check').forEach((cb) => {
    cb.closest('tr').classList.toggle('selected', cb.checked);
  });

  const anyDisabled = selected.some((u) => statusOf(u) === 'disabled');
  const anyActive = selected.some((u) => statusOf(u) !== 'disabled');
  const anyEnabled = selected.some((u) => statusOf(u) === 'enabled');

  document.getElementById('actEnable').disabled = !anyDisabled;
  document.getElementById('actDisable').disabled = !anyActive;
  document.getElementById('actEnforce').disabled = !anyEnabled;
  document.getElementById('actSettings').disabled = selected.length === 0;

  const checks = [...document.querySelectorAll('.mfa-check')];
  const checkAll = document.getElementById('mfaCheckAll');
  checkAll.checked = checks.length > 0 && checks.every((cb) => cb.checked);
}

mfaTbody.addEventListener('change', (e) => {
  if (e.target.classList.contains('mfa-check')) updateActionState();
});

document.getElementById('mfaCheckAll').addEventListener('change', (e) => {
  document.querySelectorAll('.mfa-check').forEach((cb) => (cb.checked = e.target.checked));
  updateActionState();
});

// ===== 검색 / 필터 초기화 =====
const mfaSearch = document.getElementById('mfaSearch');

function applySearch() {
  const q = mfaSearch.value.trim().toLowerCase();
  document.getElementById('mfaSearchClear').hidden = !q;
  renderMfaTable(
    q
      ? mfaUsers.filter(
          (u) => u.display.toLowerCase().includes(q) || u.id.toLowerCase().includes(q)
        )
      : mfaUsers
  );
}

mfaSearch.addEventListener('input', applySearch);

document.getElementById('mfaSearchClear').addEventListener('click', () => {
  mfaSearch.value = '';
  applySearch();
});

document.getElementById('filterReset').addEventListener('click', () => {
  mfaSearch.value = '';
  applySearch();
});

// ===== 토스트 =====
let toastTimer = null;
function showToast(title, sub) {
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastSub').textContent = sub;
  document.getElementById('mfaToast').hidden = false;

  // 알림 배지
  const badge = document.getElementById('bellBadge');
  badge.textContent = Number(badge.textContent || 0) + (badge.hidden ? 1 : 1);
  if (badge.hidden) badge.textContent = 1;
  badge.hidden = false;

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (document.getElementById('mfaToast').hidden = true), 6000);
}

document.getElementById('toastClose').addEventListener('click', () => {
  document.getElementById('mfaToast').hidden = true;
});

// ===== MFA 사용 (활성화 모달) =====
const enableModal = document.getElementById('enableModal');

document.getElementById('actEnable').addEventListener('click', () => {
  enableModal.hidden = false;
});

document.getElementById('enableCancel').addEventListener('click', () => {
  enableModal.hidden = true;
});

enableModal.addEventListener('click', (e) => {
  if (e.target === enableModal) enableModal.hidden = true;
});

document.getElementById('enableConfirm').addEventListener('click', () => {
  selectedUsers().forEach((u) => (mfaStatus[u.id] = 'enabled'));
  saveStatus();
  enableModal.hidden = true;
  renderMfaTable(mfaRendered);
  showToast('다단계 인증이 활성화됨', '다단계 인증 활성화 성공');
});

// ===== MFA 사용 안 함 =====
document.getElementById('actDisable').addEventListener('click', () => {
  selectedUsers().forEach((u) => delete mfaStatus[u.id]);
  saveStatus();
  renderMfaTable(mfaRendered);
  showToast('다단계 인증이 비활성화됨', '다단계 인증 비활성화 성공');
});

// ===== MFA 적용 =====
document.getElementById('actEnforce').addEventListener('click', () => {
  selectedUsers().forEach((u) => {
    if (statusOf(u) === 'enabled') mfaStatus[u.id] = 'enforced';
  });
  saveStatus();
  renderMfaTable(mfaRendered);
  showToast('다단계 인증이 적용됨', '다단계 인증 적용 성공');
});

// ===== 사용자 MFA 설정 패널 =====
const settingsPanel = document.getElementById('settingsPanel');

function resetSettingsPanel() {
  document.querySelectorAll('.ms-option').forEach((cb) => (cb.checked = false));
  document.getElementById('settingsSave').disabled = true;
}

document.getElementById('actSettings').addEventListener('click', () => {
  resetSettingsPanel();
  settingsPanel.hidden = false;
});

document.querySelectorAll('.ms-option').forEach((cb) => {
  cb.addEventListener('change', () => {
    document.getElementById('settingsSave').disabled =
      ![...document.querySelectorAll('.ms-option')].some((c) => c.checked);
  });
});

document.getElementById('settingsSave').addEventListener('click', () => {
  settingsPanel.hidden = true;
  showToast('사용자 MFA 설정이 저장됨', '설정 저장 성공');
});

['settingsX', 'settingsCancel'].forEach((id) => {
  document.getElementById(id).addEventListener('click', () => (settingsPanel.hidden = true));
});

// ===== 페이지 닫기 =====
document.getElementById('pageClose').addEventListener('click', () => {
  window.close();
});

// 초기 렌더링
renderMfaTable(mfaUsers);
