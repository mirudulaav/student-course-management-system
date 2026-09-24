export function getCurrentStudent() {
    return App.session.getLoggedInStudent();
}

export function getCurrentAdmin() {
    return App.session.getLoggedInAdmin();
}

export function isStudentLoggedIn() {
    return !!App.session.getLoggedInStudent();
}

export function isAdminLoggedIn() {
    return !!App.session.getLoggedInAdmin();
}

export function logout() {
    App.session.logout();
}

export function loginStudent(account) {
    App.session.setLoggedInStudent(account);
}

export function loginAdmin(account) {
    App.session.setLoggedInAdmin(account);
}