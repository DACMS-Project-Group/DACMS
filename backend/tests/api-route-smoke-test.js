#!/usr/bin/env node

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

const ROLE_CONFIG = {
  student: {
    title: 'Mr',
    first_name: 'Test',
    last_name: 'Student',
    password: 'Password123',
    role_id: 1,
    student_number: 'S-TEST-1001',
    study_level: 'Undergraduate',
    contact_details: 'student@example.com',
    bank_name: 'Test Bank',
    account_number: '123456789',
    branch_code: '000'
  },
  lecturer: {
    title: 'Dr',
    first_name: 'Test',
    last_name: 'Lecturer',
    password: 'Password123',
    role_id: 2,
    department: 'Computer Science'
  },
  admin: {
    title: 'Ms',
    first_name: 'Test',
    last_name: 'Admin',
    password: 'Password123',
    role_id: 3,
    mfa_enabled: true,
    budget_allocation_rights: true
  }
};

const COOKIE_JARS = {
  student: {},
  lecturer: {},
  admin: {}
};

const SUMMARY = {
  passed: 0,
  failed: 0,
  details: []
};

function recordSummary(label, success, status, note = '') {
  if (success) SUMMARY.passed += 1;
  else SUMMARY.failed += 1;

  SUMMARY.details.push({
    label,
    success,
    status,
    note
  });
}

function makeUniqueEmail(prefix) {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${prefix}_${suffix}@example.com`;
}

function parseSetCookieHeader(setCookieHeader) {
  if (!setCookieHeader) return null;

  const cookies = setCookieHeader.split(/,(?=\s?[A-Za-z0-9_-]+=)/);

  for (const cookie of cookies) {
    const match = cookie.match(/^\s*([^=;]+)=([^;]+)/);
    if (!match) continue;

    const name = match[1].trim();
    const value = match[2].trim();

    if (name === 'token') {
      return value;
    }
  }

  return null;
}

function buildCookieHeaderForRole(role) {
  const jar = COOKIE_JARS[role] || {};
  const entries = Object.entries(jar);
  if (!entries.length) return '';
  return entries.map(([key, value]) => `${key}=${value}`).join('; ');
}

function printRequest(label, method, url, payload) {
  console.log(`\n=== ${label} ===`);
  console.log('REQUEST METHOD:', method);
  console.log('REQUEST URL:', url);
  console.log('REQUEST BODY:', JSON.stringify(payload ?? {}, null, 2));
}

function printResponse(status, responseBody, token) {
  console.log('HTTP STATUS:', status);
  console.log('COOKIE TOKEN PRESENT:', !!token);
  console.log('RESPONSE BODY:', JSON.stringify(responseBody ?? {}, null, 2));
}

async function apiRequest({ role, endpoint, method, body = null, noCookie = false }) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {};

  if (!noCookie) {
    const cookieHeader = buildCookieHeaderForRole(role);
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }
  }

  const options = {
    method,
    headers
  };

  if (body !== null) {
    if (body instanceof FormData) {
      options.body = body;
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
  }

  const res = await fetch(url, options);
  const text = await res.text();

  let parsedBody = {};
  try {
    parsedBody = text ? JSON.parse(text) : {};
  } catch {
    parsedBody = text || { raw: 'Non-JSON response' };
  }

  const setCookieHeader = res.headers.get('set-cookie');
  const token = parseSetCookieHeader(setCookieHeader);

  if (token && role) {
    COOKIE_JARS[role].token = token;
  }

  return {
    status: res.status,
    ok: res.ok,
    body: parsedBody,
    token: token || COOKIE_JARS[role]?.token || null
  };
}

async function runCase({
  role,
  label,
  method,
  path,
  body = null,
  expectedStatus,
  noCookie = false
}) {
  printRequest(label, method, `${BASE_URL}${path}`, body);

  const result = await apiRequest({
    role,
    endpoint: path,
    method,
    body,
    noCookie
  });

  printResponse(result.status, result.body, result.token);

  const passed = result.status === expectedStatus;
  const outcome = passed ? 'SUCCESS' : 'FAILURE';

  const description = passed
    ? `Expected HTTP ${expectedStatus}, received HTTP ${result.status}.`
    : `Expected HTTP ${expectedStatus}, received HTTP ${result.status}.`;

  console.log(`CASE RESULT: ${outcome}`);
  console.log(description);

  recordSummary(label, passed, result.status, description);

  return result;
}

async function registerAndLogin(role) {
  const payload = { ...ROLE_CONFIG[role] };
  payload.email = makeUniqueEmail(role);

  const createResult = await apiRequest({
    role,
    endpoint: '/users/create',
    method: 'POST',
    body: payload,
    noCookie: true
  });

  console.log(`\n=== CREATE ${role.toUpperCase()} USER ===`);
  console.log('HTTP STATUS:', createResult.status);
  console.log('RESPONSE:', JSON.stringify(createResult.body, null, 2));

  if (!(createResult.status >= 200 && createResult.status < 300)) {
    console.log(`FAILURE: Could not create ${role} user.`);
    return null;
  }

  const loginResult = await apiRequest({
    role,
    endpoint: '/users/login',
    method: 'POST',
    body: {
      email: payload.email,
      password: payload.password
    },
    noCookie: true
  });

  console.log(`\n=== LOGIN ${role.toUpperCase()} USER ===`);
  console.log('HTTP STATUS:', loginResult.status);
  console.log('RESPONSE:', JSON.stringify(loginResult.body, null, 2));

  if (!(loginResult.status >= 200 && loginResult.status < 300)) {
    console.log(`FAILURE: Could not log in as ${role}.`);
    return null;
  }

  return {
    email: payload.email,
    password: payload.password
  };
}

function printFinalSummary() {
  console.log('\n\n========================================');
  console.log('FINAL TEST SUMMARY');
  console.log('========================================');
  console.log(`Passed: ${SUMMARY.passed}`);
  console.log(`Failed: ${SUMMARY.failed}`);
  console.log(`Total: ${SUMMARY.passed + SUMMARY.failed}`);

  if (SUMMARY.details.length > 0) {
    console.log('\nDetailed results:');
    SUMMARY.details.forEach((entry) => {
      const flag = entry.success ? 'PASS' : 'FAIL';
      console.log(`${flag} | ${entry.label} | HTTP ${entry.status} | ${entry.note}`);
    });
  }

  if (SUMMARY.failed > 0) {
    console.log('\nWARNING: Some checks failed. Review the failed entries above.');
  } else {
    console.log('\nAll checks passed.');
  }
}

async function main() {
  console.log('Starting API route smoke tests...');
  console.log('BASE URL:', BASE_URL);

  const sessions = {};

  for (const role of ['student', 'lecturer', 'admin']) {
    const session = await registerAndLogin(role);
    sessions[role] = session;
  }

  const studentCases = [
    { label: 'Student dashboard', method: 'GET', path: '/student/student/dashboard', expectedStatus: 200 },
    { label: 'Open listings', method: 'GET', path: '/student/student/listings/open', expectedStatus: 200 },
    { label: 'My applications', method: 'GET', path: '/student/student/applications', expectedStatus: 200 },
    { label: 'My documents', method: 'GET', path: '/student/student/documents', expectedStatus: 200 },
    { label: 'My positions', method: 'GET', path: '/student/student/positions', expectedStatus: 200 },
    { label: 'Student claims', method: 'GET', path: '/student/student/claims', expectedStatus: 200 },
    { label: 'Student profile', method: 'GET', path: '/student/student/profile/', expectedStatus: 200 },
    { label: 'Student unauthenticated access', method: 'GET', path: '/student/student/dashboard', expectedStatus: 401, noCookie: true }
  ];

  const lecturerCases = [
    { label: 'Lecturer dashboard', method: 'GET', path: '/lecturer/dashboard_statistics', expectedStatus: 200 },
    { label: 'Open listings', method: 'GET', path: '/lecturer/listings', expectedStatus: 200 },
    { label: 'Fetch listing by id', method: 'GET', path: '/lecturer/listings/fetch/1', expectedStatus: 200 },
    { label: 'Create listing', method: 'POST', path: '/lecturer/listings/create', body: { moduleId: 1, deadline: '2026-12-31T23:59:59.000Z', minimumGrade: '70' }, expectedStatus: 200 },
    { label: 'Edit listing', method: 'PATCH', path: '/lecturer/listings/edit/1', body: { moduleId: 1, deadline: '2026-12-31T23:59:59.000Z', minimumGrade: 65 }, expectedStatus: 200 },
    { label: 'Applications', method: 'GET', path: '/lecturer/applications', expectedStatus: 200 },
    { label: 'Application by id', method: 'GET', path: '/lecturer/applications/fetch/1', expectedStatus: 200 },
    { label: 'Review application', method: 'PATCH', path: '/lecturer/applications/review/1', body: { decision: 'Approved' }, expectedStatus: 200 },
    { label: 'Lecturer sessions', method: 'GET', path: '/lecturer/sessions', expectedStatus: 200 },
    { label: 'Session by id', method: 'GET', path: '/lecturer/sessions/fetch/1', expectedStatus: 200 },
    { label: 'Review session', method: 'PATCH', path: '/lecturer/sessions/review/1', body: { decision: true }, expectedStatus: 200 },
    { label: 'Claims summary', method: 'GET', path: '/lecturer/claims', expectedStatus: 200 },
    { label: 'Claim by id', method: 'GET', path: '/lecturer/claims/fetch/1', expectedStatus: 200 },
    { label: 'Review claim', method: 'PATCH', path: '/lecturer/claims/review', body: { claim_id: 1, status: 'Approved' }, expectedStatus: 200 },
    { label: 'Budgets summary', method: 'GET', path: '/lecturer/budgets', expectedStatus: 200 },
    { label: 'Budget by id', method: 'GET', path: '/lecturer/budgets/fetch/1', expectedStatus: 200 },
    { label: 'Lecturer unauthenticated access', method: 'GET', path: '/lecturer/dashboard_statistics', expectedStatus: 401, noCookie: true }
  ];

  const adminCases = [
    { label: 'Admin dashboard', method: 'GET', path: '/admin/dashboard_statistics', expectedStatus: 200 },
    { label: 'Budgets summary', method: 'GET', path: '/admin/budgets', expectedStatus: 200 },
    { label: 'Fetch budget by id', method: 'GET', path: '/admin/budgets/fetch/1', expectedStatus: 200 },
    { label: 'Create budget', method: 'POST', path: '/admin/budgets/create', body: { module_id: 1, lecturer_id: 11, allocated_budget: 1000, current_budget_usage: 0, max_allowable_work_hours: 120, academic_year: 2026 }, expectedStatus: 201 },
    { label: 'Edit budget', method: 'PUT', path: '/admin/budgets/edit/1', body: { allocated_budget: 1500 }, expectedStatus: 200 },
    { label: 'Claims summary', method: 'GET', path: '/admin/claims', expectedStatus: 200 },
    { label: 'Fetch claim by id', method: 'GET', path: '/admin/claims/fetch/1', expectedStatus: 200 },
    { label: 'Approve claim', method: 'PATCH', path: '/admin/claims/approve/1', body: { status: 'approved' }, expectedStatus: 200 },
    { label: 'Appointments', method: 'GET', path: '/admin/appointments', expectedStatus: 200 },
    { label: 'Fetch appointment by position', method: 'GET', path: '/admin/appointments/fetch/1', expectedStatus: 200 },
    { label: 'Review appointment', method: 'PATCH', path: '/admin/appointments/review/1', body: { action: 'Approved', comment: 'Looks good' }, expectedStatus: 200 },
    { label: 'Admin unauthenticated access', method: 'GET', path: '/admin/dashboard_statistics', expectedStatus: 401, noCookie: true }
  ];

  console.log('\n\n========================================');
  console.log('ROLE: STUDENT');
  console.log('========================================');

  for (const test of studentCases) {
    await runCase({
      role: 'student',
      ...test
    });
  }

  console.log('\n\n========================================');
  console.log('ROLE: LECTURER');
  console.log('========================================');

  for (const test of lecturerCases) {
    await runCase({
      role: 'lecturer',
      ...test
    });
  }

  console.log('\n\n========================================');
  console.log('ROLE: ADMIN');
  console.log('========================================');

  for (const test of adminCases) {
    await runCase({
      role: 'admin',
      ...test
    });
  }

  printFinalSummary();
}

main().catch((error) => {
  console.error('Fatal runner error:', error);
  process.exit(1);
});