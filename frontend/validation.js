(function () {

	const qs = App.utils.qs;
	const qsa = App.utils.qsa;

	function highlightActiveNav() {
		const current = App.utils.currentPage();
		qsa("nav ul li a").forEach(function (link) {
			const href = link.getAttribute("href");
			if (href === current) {
				link.classList.add("active");
			} else {
				link.classList.remove("active");
			}
		});
	}

	function wireLogout() {
		qsa("nav a").forEach(function (link) {
			if (link.textContent.trim() === "Logout") {
				link.addEventListener("click", function () {
					App.session.logout();
				});
			}
		});
	}

	function guardStudentPage() {
		const marker = qs("[data-requires-auth='student']");
		if (!marker) return;
		if (!App.session.getLoggedInStudent()) {
			window.location.href = "login.html";
		}
	}

	function guardAdminPage() {
		const marker = qs("[data-requires-auth='admin']");
		if (!marker) return;
		if (!App.session.getLoggedInAdmin()) {
			window.location.href = "login.html";
		}
	}

	function redirectIfAlreadyLoggedIn() {
		if (!qs("#studentLoginForm") && !qs("#adminLoginForm")) return;
		if (App.session.getLoggedInStudent()) {
			window.location.href = "student-dashboard.html";
		} else if (App.session.getLoggedInAdmin()) {
			window.location.href = "admin-dashboard.html";
		}
	}

	function validateField(input, rules) {
		for (let i = 0; i < rules.length; i++) {
			const rule = rules[i];
			if (!rule.test(input.value)) {
				App.utils.showFieldError(input, rule.message);
				return false;
			}
		}
		App.utils.clearFieldError(input);
		return true;
	}

	function required(message) {
		return { test: App.utils.isRequired, message: message || "This field is required." };
	}

	function email(message) {
		return { test: App.utils.isValidEmail, message: message || "Enter a valid email address." };
	}

	function phone(message) {
		return { test: App.utils.isValidPhone, message: message || "Enter a valid phone number." };
	}

	function minLength(length, message) {
		return { test: function (value) { return String(value || "").trim().length >= length; }, message: message || ("Must be at least " + length + " characters.") };
	}

	function initRegisterForm() {
		const form = qs(".register-box form");
		if (!form) return;

		form.addEventListener("submit", function (e) {
			e.preventDefault();

			const fullname = qs('input[name="fullname"]', form);
			const emailInput = qs('input[name="email"]', form);
			const phoneInput = qs('input[name="phone"]', form);
			const dob = qs('input[name="dob"]', form);
			const gender = qs('select[name="gender"]', form);
			const course = qs('select[name="course"]', form);
			const password = qs('input[name="password"]', form);
			const confirmPassword = qs('input[name="confirmPassword"]', form);

			let valid = true;
			valid = validateField(fullname, [required("Enter your full name.")]) && valid;
			valid = validateField(emailInput, [required(), email()]) && valid;
			valid = validateField(phoneInput, [required(), phone()]) && valid;
			valid = validateField(dob, [required("Select your date of birth.")]) && valid;
			valid = validateField(gender, [required("Select a gender.")]) && valid;
			valid = validateField(course, [required("Select a course.")]) && valid;
			valid = validateField(password, [required(), minLength(6)]) && valid;

			if (confirmPassword.value !== password.value) {
				App.utils.showFieldError(confirmPassword, "Passwords do not match.");
				valid = false;
			} else {
				App.utils.clearFieldError(confirmPassword);
			}

			if (!valid) return;

			const account = {
				fullname: fullname.value.trim(),
				email: emailInput.value.trim(),
				phone: phoneInput.value.trim(),
				dob: dob.value,
				gender: gender.value,
				course: course.value,
				password: password.value
			};

			App.session.setAccount(account);

			App.students.add({
				name: fullname.value.trim(),
				email: emailInput.value.trim(),
				phone: phoneInput.value.trim(),
				course: course.value
			});

			window.location.href = "login.html";
		});
	}

	function initStudentLogin() {
		const form = qs("#studentLoginForm");
		if (!form) return;

		form.addEventListener("submit", function (e) {
			e.preventDefault();

			const emailInput = qs("#studentEmail");
			const passwordInput = qs("#studentPassword");
			const error = qs("#studentError");

			let valid = true;
			valid = validateField(emailInput, [required(), email()]) && valid;
			valid = validateField(passwordInput, [required()]) && valid;
			if (!valid) return;

			const account = App.session.getAccount();

			if (account && emailInput.value.trim() === account.email && passwordInput.value === account.password) {
				error.textContent = "";
				App.session.setLoggedInStudent(account);
				window.location.href = "student-dashboard.html";
			} else {
				error.textContent = "Invalid email or password.";
			}
		});
	}

	function initAdminLogin() {
		const form = qs("#adminLoginForm");
		if (!form) return;

		form.addEventListener("submit", function (e) {
			e.preventDefault();

			const emailInput = qs("#adminEmail");
			const passwordInput = qs("#adminPassword");
			const error = qs("#adminError");

			let valid = true;
			valid = validateField(emailInput, [required(), email()]) && valid;
			valid = validateField(passwordInput, [required()]) && valid;
			if (!valid) return;

			if (emailInput.value.trim() === "admin@gmail.com" && passwordInput.value === "admin123") {
				error.textContent = "";
				App.session.setLoggedInAdmin({ email: emailInput.value.trim() });
				window.location.href = "admin-dashboard.html";
			} else {
				error.textContent = "Invalid admin email or password.";
			}
		});
	}

	function initResetPasswordForm() {
		const form = qs("#resetPasswordForm");
		if (!form) return;

		form.addEventListener("submit", function (e) {
			e.preventDefault();

			const emailInput = qs("#resetEmail");
			const newPassword = qs("#newPassword");
			const confirmNewPassword = qs("#confirmNewPassword");

			let valid = true;
			valid = validateField(emailInput, [required(), email()]) && valid;
			valid = validateField(newPassword, [required(), minLength(6)]) && valid;

			if (confirmNewPassword.value !== newPassword.value) {
				App.utils.showFieldError(confirmNewPassword, "Passwords do not match.");
				valid = false;
			} else {
				App.utils.clearFieldError(confirmNewPassword);
			}

			if (!valid) return;

			const account = App.session.getAccount();
			if (account && account.email === emailInput.value.trim()) {
				account.password = newPassword.value;
				App.session.setAccount(account);
			}

			window.location.href = "login.html";
		});
	}

	function initEnrollForm() {
		const form = qs("#enrollForm");
		if (!form) return;

		const departmentSelect = qs("#department");
		const courseField = qs("#course");
		const successMessage = qs("#successMessage");

		if (successMessage) successMessage.style.display = "none";

		const params = new URLSearchParams(window.location.search);
		const preselected = params.get("course");
		if (preselected && departmentSelect && App.courses[preselected]) {
			departmentSelect.value = preselected;
			courseField.value = preselected;
		}

		if (departmentSelect) {
			departmentSelect.addEventListener("change", function () {
				courseField.value = departmentSelect.value;
				App.utils.clearFieldError(departmentSelect);
			});
		}

		form.addEventListener("submit", function (e) {
			e.preventDefault();

			const nameInput = qs("#studentName");
			const emailInput = qs("#email");
			const phoneInput = qs("#phone");
			const dateInput = qs("#date");

			let valid = true;
			valid = validateField(nameInput, [required("Enter your full name.")]) && valid;
			valid = validateField(emailInput, [required(), email()]) && valid;
			valid = validateField(phoneInput, [required(), phone()]) && valid;
			valid = validateField(departmentSelect, [required("Select a course.")]) && valid;
			valid = validateField(dateInput, [required("Select an enrollment date.")]) && valid;
			if (!valid) return;

			App.enrollments.add({
				studentName: nameInput.value.trim(),
				email: emailInput.value.trim(),
				phone: phoneInput.value.trim(),
				course: departmentSelect.value,
				date: dateInput.value,
				notes: qs("#notes") ? qs("#notes").value.trim() : ""
			});

			if (successMessage) successMessage.style.display = "block";
			form.reset();
			if (courseField) courseField.value = "";
		});
	}

	function renderStudentsTable() {
		const tableBody = qs("#studentTableBody");
		if (!tableBody) return;

		const searchInput = qs("#studentSearch");
		const countEl = qs("#studentCount");
		const modal = qs("#studentModal");
		const nameInput = qs("#studentNameInput", modal);
		const emailInput = qs("#studentEmailInput", modal);
		const phoneInput = qs("#studentPhoneInput", modal);
		const courseSelect = qs("#studentCourseInput", modal);
		const saveBtn = qs("#saveStudent", modal);
		const closeBtn = qs("#closeStudentModal", modal);
		let editingId = null;

		function render(list) {
			const data = list || App.students.getAll();
			tableBody.innerHTML = "";

			if (data.length === 0) {
				tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">No student records yet.</td></tr>';
			}

			data.forEach(function (student, index) {
				const row = document.createElement("tr");
				row.dataset.id = student.id;
				row.innerHTML =
					'<td data-label="#">' + (index + 1) + "</td>" +
					'<td data-label="Name" class="row-name"></td>' +
					'<td data-label="Email"></td>' +
					'<td data-label="Phone"></td>' +
					'<td data-label="Course"><span class="course-badge"></span></td>' +
					'<td data-label="Actions"><div class="row-actions">' +
					'<button class="edit" type="button">Edit</button>' +
					'<button class="delete" type="button">Delete</button>' +
					"</div></td>";
				row.children[1].textContent = student.name;
				row.children[2].textContent = student.email;
				row.children[3].textContent = student.phone;
				qs(".course-badge", row).textContent = student.course;
				tableBody.appendChild(row);
			});

			if (countEl) {
				countEl.textContent = data.length + (data.length === 1 ? " student" : " students");
			}
		}

		function openModal(student) {
			editingId = student ? student.id : null;
			qs("#studentModalTitle", modal).textContent = student ? "Edit Student" : "Add Student";
			nameInput.value = student ? student.name : "";
			emailInput.value = student ? student.email : "";
			phoneInput.value = student ? student.phone : "";
			courseSelect.value = student ? student.course : "";
			App.utils.clearFormErrors(modal);
			modal.classList.add("open");
			modal.style.display = "flex";
		}

		function closeModal() {
			modal.classList.remove("open");
			modal.style.display = "none";
			editingId = null;
		}

		render();

		if (searchInput) {
			searchInput.addEventListener("input", function () {
				render(App.students.search(searchInput.value));
			});
		}

		const addBtn = qs("#addStudent");
		if (addBtn) addBtn.addEventListener("click", function () { openModal(null); });
		if (closeBtn) closeBtn.addEventListener("click", closeModal);

		modal.addEventListener("click", function (e) {
			if (e.target === modal) closeModal();
		});

		tableBody.addEventListener("click", function (e) {
			const row = e.target.closest("tr[data-id]");
			if (!row) return;
			const student = App.students.find(row.dataset.id);
			if (!student) return;

			if (e.target.classList.contains("edit")) {
				openModal(student);
			} else if (e.target.classList.contains("delete")) {
				if (confirm("Remove " + student.name + "'s record?")) {
					App.students.remove(student.id);
					render();
				}
			}
		});

		if (saveBtn) {
			saveBtn.addEventListener("click", function () {
				let valid = true;
				valid = validateField(nameInput, [required("Enter the student's name.")]) && valid;
				valid = validateField(emailInput, [required(), email()]) && valid;
				valid = validateField(phoneInput, [required(), phone()]) && valid;
				valid = validateField(courseSelect, [required("Select a course.")]) && valid;
				if (!valid) return;

				if (editingId) {
					App.students.update(editingId, {
						name: nameInput.value.trim(),
						email: emailInput.value.trim(),
						phone: phoneInput.value.trim(),
						course: courseSelect.value
					});
				} else {
					App.students.add({
						name: nameInput.value.trim(),
						email: emailInput.value.trim(),
						phone: phoneInput.value.trim(),
						course: courseSelect.value
					});
				}

				render();
				closeModal();
			});
		}
	}

	function renderEnrollmentsTable() {
		const tableBody = qs("#enrollmentTableBody");
		if (!tableBody) return;

		const searchInput = qs("#enrollmentSearch");
		const countEl = qs("#enrollmentCount");
		const emptyMessage = qs("#noEnrollments");
		const tableWrapper = qs("#enrollmentTableWrapper");

		function render(list) {
			const data = list || App.enrollments.getAll();
			tableBody.innerHTML = "";

			const hasData = data.length > 0;
			if (emptyMessage) emptyMessage.style.display = hasData ? "none" : "block";
			if (tableWrapper) tableWrapper.style.display = hasData ? "" : "none";

			data.forEach(function (enrollment, index) {
				const row = document.createElement("tr");
				row.dataset.index = index;
				row.innerHTML =
					'<td data-label="Student" class="row-name"></td>' +
					'<td data-label="Email"></td>' +
					'<td data-label="Phone"></td>' +
					'<td data-label="Course"><span class="course-badge"></span></td>' +
					'<td data-label="Date"></td>' +
					'<td data-label="Notes" class="notes-cell"></td>' +
					'<td data-label="Actions"><div class="row-actions">' +
					'<button class="delete" type="button">Remove</button>' +
					"</div></td>";
				row.children[0].textContent = enrollment.studentName;
				row.children[1].textContent = enrollment.email;
				row.children[2].textContent = enrollment.phone;
				qs(".course-badge", row).textContent = enrollment.course;
				row.children[4].textContent = enrollment.date || "—";
				row.children[5].textContent = enrollment.notes || "—";
				row.children[5].title = enrollment.notes || "";
				tableBody.appendChild(row);
			});

			if (countEl) {
				countEl.textContent = data.length + (data.length === 1 ? " enrollment" : " enrollments");
			}
		}

		render();

		if (searchInput) {
			searchInput.addEventListener("input", function () {
				render(App.enrollments.search(searchInput.value));
			});
		}

		tableBody.addEventListener("click", function (e) {
			if (!e.target.classList.contains("delete")) return;
			const row = e.target.closest("tr");
			const index = Number(row.dataset.index);
			if (confirm("Remove this enrollment record?")) {
				App.enrollments.removeAt(index);
				render();
			}
		});
	}

	function renderReportsPage() {
		const totalStudentsEl = qs("#reportTotalStudents");
		if (!totalStudentsEl) return;

		const courseNames = Object.keys(App.courses);
		totalStudentsEl.textContent = App.students.getAll().length;
		qs("#reportTotalCourses").textContent = courseNames.length;
		qs("#reportTotalEnrollments").textContent = App.enrollments.getAll().length;

		const tableBody = qs("#reportTableBody");
		if (!tableBody) return;

		tableBody.innerHTML = "";
		const counts = App.enrollments.countByCourse();
		const maxCount = Math.max.apply(null, courseNames.map(function (name) { return counts[name]; }).concat([1]));
		const sortedNames = courseNames.slice().sort(function (a, b) { return counts[b] - counts[a]; });

		sortedNames.forEach(function (name) {
			const count = counts[name];
			const percent = Math.round((count / maxCount) * 100);
			const row = document.createElement("tr");
			row.innerHTML =
				'<td data-label="Course" class="row-name"></td>' +
				'<td data-label="Enrollments"></td>' +
				'<td data-label="Share" class="bar-cell"><div class="bar-track"><div class="bar-fill" style="width:' + percent + '%"></div></div></td>';
			row.children[0].textContent = name;
			row.children[1].textContent = count;
			tableBody.appendChild(row);
		});
	}	
		function renderStudentDashboard() {
		const courseList = qs("#studentCourseList");
		if (!courseList) return;
		const student = App.session.getLoggedInStudent();
		if (!student) return;
		const studentName =
			student.fullname || student.name || "Student";
		const welcome = qs("#studentWelcome");
		if (welcome) {
			welcome.textContent = "Hello, " + studentName;
		}

		const enrollments =
			App.enrollments.getByStudent(student.email);
		const enrolledCount = enrollments.length;
		const completedCount = enrollments.filter(function (e) {
			return Number(e.progress || 0) >= 100;
		}).length;

		const totalProgress = enrollments.reduce(
			function (total, enrollment) {
				return total + Number(enrollment.progress || 0);
			},
			0
		);

		const overallProgress =
			enrolledCount > 0
				? Math.round(totalProgress / enrolledCount)
				: 0;

		const enrolledEl = qs("#studentEnrolledCount");
		const completedEl = qs("#studentCompletedCount");
		const certificateEl = qs("#studentCertificateCount");
		const progressEl = qs("#studentOverallProgress");

		if (enrolledEl)
			enrolledEl.textContent = enrolledCount;

		if (completedEl)
			completedEl.textContent = completedCount;

		if (certificateEl)
			certificateEl.textContent = completedCount;

		if (progressEl)
			progressEl.textContent = overallProgress + "%";


		courseList.innerHTML = "";


		if (enrollments.length === 0) {

			courseList.innerHTML = `
				<div class="course-item">
					<h3>No Courses Enrolled</h3>
					<p>
						You have not enrolled in any course yet.
					</p>

					<a href="student-courses.html" class="btn">
						Explore Courses
					</a>
				</div>
			`;

			return;
		}


		enrollments.forEach(function (enrollment) {

			const progress =
				Number(enrollment.progress || 0);

			const item =
				document.createElement("div");

			item.className = "course-item";

			item.innerHTML = `
				<h3>${enrollment.course}</h3>

				<p>
					Enrolled on: ${enrollment.date || "—"}
				</p>

				<div class="progress-container">

					<div class="progress-track">

						<div
							class="progress-fill"
							style="width:${progress}%">
						</div>

					</div>

					<span>
						${progress}% Complete
					</span>

				</div>
				<p>
					Status:
					<strong>
						${enrollment.status || "In Progress"}
					</strong>
				</p>
			`;
			courseList.appendChild(item);
		});
	}
	
	function renderStudentCourses() {
    const container = qs("#availableCourses");
    if (!container) return;

    container.innerHTML = "";

    Object.keys(App.courses).forEach(function (courseName) {
        const course = App.courses[courseName];

        const card =document.createElement("div");

        card.className = "card";

        card.innerHTML = `

            <h2>${courseName}</h2>
            <p> ${course.description}</p>
            <p><strong>Duration:</strong>${course.duration}</p>
            <p><strong>Level:</strong>${course.level}</p>
            <p><strong>Available Seats:</strong>${course.seats}</p>

            <a
                href="enroll-now.html?course=${encodeURIComponent(courseName)}"
                class="btn">
                Enroll Now
            </a>
        `;
        container.appendChild(card);
    });
}

function renderAdminDashboard() {

    const body = qs("#adminEnrollmentBody");

    if (!body) return;

    const students = App.students.getAll();
    const enrollments = App.enrollments.getAll();

    const totalStudents =
        qs("#adminTotalStudents");

    const totalCourses =
        qs("#adminTotalCourses");

    const totalEnrollments =
        qs("#adminTotalEnrollments");

    const activeStudents =
        qs("#adminActiveStudents");


    if (totalStudents)
        totalStudents.textContent =
            students.length;


    if (totalCourses)
        totalCourses.textContent =
            Object.keys(App.courses).length;


    if (totalEnrollments)
        totalEnrollments.textContent =
            enrollments.length;


    const activeEmails = new Set(
        enrollments
            .filter(function (e) {
                return Number(e.progress || 0) < 100;
            })
            .map(function (e) {
                return e.email;
            })
    );

    if (activeStudents)
        activeStudents.textContent =
            activeEmails.size;


    body.innerHTML = "";


    if (enrollments.length === 0) {

        body.innerHTML = `
            <tr>
                <td colspan="6">
                    No enrollments available.
                </td>
            </tr>
        `;

        return;
    }


    enrollments.forEach(function (enrollment, index) {

        const progress =
            Number(enrollment.progress || 0);

        const status =
            progress >= 100
                ? "Completed"
                : "In Progress";


        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${enrollment.studentName}</td>
            <td>${enrollment.email}</td>
            <td>${enrollment.course}</td>
            <td>
                <div class="progress-track">
                    <div
                        class="progress-fill"
                        style="width:${progress}%">
                    </div>
                </div>
                ${progress}%
            </td>
            <td>${status}</td>
        `;
        body.appendChild(row);
    });
}

	document.addEventListener("DOMContentLoaded", function () {
		highlightActiveNav();
		wireLogout();
		guardStudentPage();
		guardAdminPage();
		redirectIfAlreadyLoggedIn();

		initRegisterForm();
		initStudentLogin();
		initAdminLogin();
		initResetPasswordForm();
		initEnrollForm();

		renderStudentsTable();
		renderEnrollmentsTable();
		renderReportsPage();
		
		renderStudentDashboard();
	});

})();