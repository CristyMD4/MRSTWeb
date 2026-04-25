const EMPLOYEE_USERS_KEY = "sw_employees_v1";
const EMPLOYEE_SESSION_KEY = "sw_employee_session_v1";
const VALID_EMPLOYEE_STATUSES = ["working", "resting", "late"];
const DEFAULT_SCHEDULE = {
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  start: "09:00",
  end: "17:00",
};
const DEFAULT_ASSIGNMENT = {
  area: "Exterior",
  start: "09:00",
  end: "17:00",
};

const DEMO_EMPLOYEES = [
  {
    id: "EMP_DEMO_1",
    name: "Alex Operator",
    email: "employee@sparklewash.com",
    phone: "+373 600 11 111",
    locationId: "loc_1",
    password: "employee123",
    role: "employee",
    status: "working",
    schedule: DEFAULT_SCHEDULE,
    assignments: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

function normalizeEmployee(user) {
  const status = VALID_EMPLOYEE_STATUSES.includes(user?.status) ? user.status : "resting";
  const days = Array.isArray(user?.schedule?.days)
    ? user.schedule.days
    : DEFAULT_SCHEDULE.days;
  const schedule = {
    days,
    start: user?.schedule?.start || DEFAULT_SCHEDULE.start,
    end: user?.schedule?.end || DEFAULT_SCHEDULE.end,
  };
  const assignments = Array.isArray(user?.assignments)
    ? user.assignments
        .filter((assignment) => assignment?.date)
        .map((assignment) => ({
          date: assignment.date,
          area: assignment.area || DEFAULT_ASSIGNMENT.area,
          start: assignment.start || schedule.start,
          end: assignment.end || schedule.end,
          locationId: assignment.locationId || user?.locationId || "loc_1",
        }))
    : [];

  return {
    ...user,
    locationId: user?.locationId || "loc_1",
    status,
    schedule,
    assignments,
    createdAt: user?.createdAt || Date.now(),
    updatedAt: user?.updatedAt || user?.createdAt || Date.now(),
  };
}

function readEmployees() {
  try {
    const raw = localStorage.getItem(EMPLOYEE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(EMPLOYEE_USERS_KEY, JSON.stringify(DEMO_EMPLOYEES));
      return [...DEMO_EMPLOYEES];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(EMPLOYEE_USERS_KEY, JSON.stringify(DEMO_EMPLOYEES));
      return [...DEMO_EMPLOYEES];
    }
    const normalized = parsed.map(normalizeEmployee);
    localStorage.setItem(EMPLOYEE_USERS_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    localStorage.setItem(EMPLOYEE_USERS_KEY, JSON.stringify(DEMO_EMPLOYEES));
    return [...DEMO_EMPLOYEES];
  }
}

function writeEmployees(users) {
  localStorage.setItem(EMPLOYEE_USERS_KEY, JSON.stringify(users));
}

function createSession(user) {
  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: "employee",
    loggedInAt: Date.now(),
  };

  localStorage.setItem(EMPLOYEE_SESSION_KEY, JSON.stringify(session));
  return session;
}

export function registerEmployee({ name, email, phone, password, locationId }) {
  const users = readEmployees();

  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "auth.errors.emailExists" };
  }

  const user = {
    id: `EMP_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    name,
    email,
    phone: phone || "",
    locationId: locationId || "loc_1",
    password,
    role: "employee",
    status: "resting",
    schedule: DEFAULT_SCHEDULE,
    assignments: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  users.push(user);
  writeEmployees(users);

  return { ok: true, user, session: createSession(user) };
}

export function loginEmployee({ email, password }) {
  const users = readEmployees();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { ok: false, error: "auth.errors.invalidCredentials" };
  }

  return { ok: true, user, session: createSession(user) };
}

export function getEmployeeSession() {
  try {
    const raw = localStorage.getItem(EMPLOYEE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function requireEmployee() {
  return !!getEmployeeSession();
}

export function logoutEmployee() {
  localStorage.removeItem(EMPLOYEE_SESSION_KEY);
}

export function listEmployees() {
  return readEmployees();
}

export function getEmployeeById(employeeId) {
  return readEmployees().find((user) => user.id === employeeId) || null;
}

export function updateEmployeeStatus(employeeId, status) {
  if (!VALID_EMPLOYEE_STATUSES.includes(status)) {
    return { ok: false, error: "Invalid employee status." };
  }

  const users = readEmployees();
  const nextUsers = users.map((user) =>
    user.id === employeeId
      ? { ...user, status, updatedAt: Date.now() }
      : user
  );

  const employee = nextUsers.find((user) => user.id === employeeId);
  if (!employee) {
    return { ok: false, error: "Employee not found." };
  }

  writeEmployees(nextUsers);
  return { ok: true, employee };
}

export function updateEmployeeAssignment(employeeId, patch) {
  const users = readEmployees();
  const nextUsers = users.map((user) =>
    user.id === employeeId
      ? { ...user, ...patch, updatedAt: Date.now() }
      : user
  );

  const employee = nextUsers.find((user) => user.id === employeeId);
  if (!employee) {
    return { ok: false, error: "Employee not found." };
  }

  writeEmployees(nextUsers);
  return { ok: true, employee };
}

export function updateEmployeeSchedule(employeeId, schedule) {
  const normalizedSchedule = {
    days: Array.isArray(schedule?.days) ? schedule.days : DEFAULT_SCHEDULE.days,
    start: schedule?.start || DEFAULT_SCHEDULE.start,
    end: schedule?.end || DEFAULT_SCHEDULE.end,
  };

  const users = readEmployees();
  const nextUsers = users.map((user) =>
    user.id === employeeId
      ? { ...user, schedule: normalizedSchedule, updatedAt: Date.now() }
      : user
  );

  const employee = nextUsers.find((user) => user.id === employeeId);
  if (!employee) {
    return { ok: false, error: "Employee not found." };
  }

  writeEmployees(nextUsers);
  return { ok: true, employee };
}

export function upsertEmployeeAssignment(employeeId, assignment) {
  if (!assignment?.date) {
    return { ok: false, error: "Assignment date is required." };
  }

  const users = readEmployees();
  const nextUsers = users.map((user) => {
    if (user.id !== employeeId) return user;

    const normalizedAssignment = {
      date: assignment.date,
      area: assignment.area || DEFAULT_ASSIGNMENT.area,
      start: assignment.start || DEFAULT_ASSIGNMENT.start,
      end: assignment.end || DEFAULT_ASSIGNMENT.end,
      locationId: assignment.locationId || user.locationId || "loc_1",
    };

    const existingAssignments = Array.isArray(user.assignments) ? user.assignments : [];
    const filteredAssignments = existingAssignments.filter((item) => item.date !== assignment.date);

    return {
      ...user,
      assignments: [...filteredAssignments, normalizedAssignment].sort((a, b) => a.date.localeCompare(b.date)),
      updatedAt: Date.now(),
    };
  });

  const employee = nextUsers.find((user) => user.id === employeeId);
  if (!employee) {
    return { ok: false, error: "Employee not found." };
  }

  writeEmployees(nextUsers);
  return { ok: true, employee };
}

export function removeEmployeeAssignment(employeeId, date) {
  const users = readEmployees();
  const nextUsers = users.map((user) =>
    user.id === employeeId
      ? {
          ...user,
          assignments: (Array.isArray(user.assignments) ? user.assignments : []).filter((item) => item.date !== date),
          updatedAt: Date.now(),
        }
      : user
  );

  const employee = nextUsers.find((user) => user.id === employeeId);
  if (!employee) {
    return { ok: false, error: "Employee not found." };
  }

  writeEmployees(nextUsers);
  return { ok: true, employee };
}
