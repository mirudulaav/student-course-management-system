const App = (function () {

	const listeners = {};

	function on(event, handler) {
		if (!listeners[event]) listeners[event] = [];
		listeners[event].push(handler);
		return function () {
			listeners[event] = listeners[event].filter(function (h) { return h !== handler; });
		};
	}

	function emit(event, payload) {
		(listeners[event] || []).forEach(function (handler) { handler(payload); });
	}

	function read(key, fallback) {
		try {
			const raw = sessionStorage.getItem(key);
			return raw ? JSON.parse(raw) : fallback;
		} catch (e) {
			return fallback;
		}
	}

	function write(key, value) {
		sessionStorage.setItem(key, JSON.stringify(value));
		emit("change:" + key, value);
		return value;
	}

	function clear(key) {
		sessionStorage.removeItem(key);
		emit("change:" + key, null);
	}

	const store = { read: read, write: write, clear: clear, on: on, emit: emit };

	const utils = {

		qs: function (selector, scope) {
			return (scope || document).querySelector(selector);
		},

		qsa: function (selector, scope) {
			return Array.from((scope || document).querySelectorAll(selector));
		},

		isValidEmail: function (value) {
			return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
		},

		isValidPhone: function (value) {
			return /^[0-9+\-\s]{7,15}$/.test(String(value || "").trim());
		},

		isRequired: function (value) {
			return String(value || "").trim().length > 0;
		},

		showFieldError: function (input, message) {
			utils.clearFieldError(input);
			input.classList.add("invalid");
			const error = document.createElement("span");
			error.className = "field-error";
			error.textContent = message;
			input.insertAdjacentElement("afterend", error);
		},

		clearFieldError: function (input) {
			input.classList.remove("invalid");
			const next = input.nextElementSibling;
			if (next && next.classList.contains("field-error")) next.remove();
		},

		clearFormErrors: function (form) {
			utils.qsa(".invalid", form).forEach(function (input) { utils.clearFieldError(input); });
		},

		generateId: function (prefix) {
			return (prefix || "id") + "-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
		},

		currentPage: function () {
			const path = window.location.pathname.split("/").pop();
			return path === "" ? "index.html" : path;
		}

	};

	const courses = {

		"Machine Learning": { duration: "12 Weeks", level: "Beginner", faculty: "AI Department", seats: "120", description: "Build predictive models using supervised and unsupervised learning algorithms, regression, classification and clustering.", prerequisites: "Basic Python and statistics.", objectives: ["Understand core ML concepts", "Build and evaluate models", "Apply ML to real datasets"], topics: ["Regression", "Classification", "Clustering", "Model Evaluation"], skills: ["Scikit-learn", "Data Preprocessing", "Model Tuning"], career: ["Machine Learning Engineer", "Data Analyst", "AI Associate"] },
		"Deep Learning": { duration: "14 Weeks", level: "Intermediate", faculty: "AI Department", seats: "100", description: "Learn neural networks, CNNs, RNNs and deep learning models using TensorFlow and Keras.", prerequisites: "Machine Learning fundamentals.", objectives: ["Design neural networks", "Train CNNs and RNNs", "Deploy deep learning models"], topics: ["Neural Networks", "CNNs", "RNNs", "TensorFlow/Keras"], skills: ["TensorFlow", "Keras", "Model Optimization"], career: ["Deep Learning Engineer", "AI Researcher"] },
		"Large Language Models": { duration: "10 Weeks", level: "Advanced", faculty: "AI Department", seats: "80", description: "Understand Transformers, GPT models, Prompt Engineering, Fine-tuning and AI Agents.", prerequisites: "Deep Learning basics.", objectives: ["Understand transformer architecture", "Fine-tune LLMs", "Build AI agents"], topics: ["Transformers", "Prompt Engineering", "Fine-tuning", "AI Agents"], skills: ["Prompt Design", "Fine-tuning", "Agent Frameworks"], career: ["LLM Engineer", "AI Product Engineer"] },
		"Natural Language Processing": { duration: "10 Weeks", level: "Intermediate", faculty: "AI Department", seats: "90", description: "Learn text preprocessing, tokenization, sentiment analysis and language modeling.", prerequisites: "Python and basic ML knowledge.", objectives: ["Process and analyze text data", "Build sentiment models", "Understand language modeling"], topics: ["Tokenization", "Sentiment Analysis", "Language Modeling"], skills: ["NLTK/spaCy", "Text Vectorization"], career: ["NLP Engineer", "Data Scientist"] },
		"Computer Vision": { duration: "11 Weeks", level: "Intermediate", faculty: "AI Department", seats: "70", description: "Develop image recognition systems using OpenCV, CNNs and object detection algorithms.", prerequisites: "Basic Python and Deep Learning.", objectives: ["Process images programmatically", "Build detection models", "Apply CV to real problems"], topics: ["OpenCV", "CNNs", "Object Detection"], skills: ["OpenCV", "Image Processing"], career: ["Computer Vision Engineer", "AI Engineer"] },
		"Generative AI": { duration: "8 Weeks", level: "Advanced", faculty: "AI Department", seats: "60", description: "Create AI-powered applications using LLMs, diffusion models and prompt engineering.", prerequisites: "LLM or Deep Learning basics.", objectives: ["Build generative applications", "Work with diffusion models", "Engineer effective prompts"], topics: ["LLMs", "Diffusion Models", "Prompt Engineering"], skills: ["Prompt Engineering", "API Integration"], career: ["Generative AI Engineer", "AI Product Developer"] },
		"Python Programming": { duration: "8 Weeks", level: "Beginner", faculty: "Programming Department", seats: "150", description: "Master Python fundamentals, OOP, file handling and automation projects.", prerequisites: "None.", objectives: ["Write clean Python code", "Understand OOP concepts", "Automate simple tasks"], topics: ["Syntax & Data Types", "OOP", "File Handling", "Automation"], skills: ["Python", "Debugging", "Scripting"], career: ["Junior Developer", "Automation Engineer"] },
		"Data Science": { duration: "12 Weeks", level: "Intermediate", faculty: "Data Science Department", seats: "90", description: "Analyze data using Python, Pandas, NumPy, visualization and machine learning.", prerequisites: "Python Programming.", objectives: ["Clean and analyze datasets", "Visualize data", "Apply basic ML models"], topics: ["Pandas", "NumPy", "Visualization", "ML Basics"], skills: ["Pandas", "Data Visualization"], career: ["Data Analyst", "Data Scientist"] },
		"Cloud Computing": { duration: "10 Weeks", level: "Intermediate", faculty: "Cloud Department", seats: "100", description: "Learn cloud deployment, virtualization, AWS basics and cloud architecture.", prerequisites: "Basic networking knowledge.", objectives: ["Understand cloud architecture", "Deploy applications to the cloud", "Work with AWS basics"], topics: ["Virtualization", "AWS Basics", "Cloud Architecture"], skills: ["AWS", "Deployment"], career: ["Cloud Engineer", "DevOps Associate"] },
		"Cyber Security": { duration: "10 Weeks", level: "Intermediate", faculty: "Security Department", seats: "90", description: "Study ethical hacking, network security, cryptography and cyber defense.", prerequisites: "Basic networking knowledge.", objectives: ["Understand common attack vectors", "Apply cryptography basics", "Secure networks"], topics: ["Ethical Hacking", "Network Security", "Cryptography"], skills: ["Security Auditing", "Risk Assessment"], career: ["Security Analyst", "Penetration Tester"] },
		"Blockchain": { duration: "9 Weeks", level: "Intermediate", faculty: "Blockchain Department", seats: "60", description: "Explore distributed ledger technology, cryptocurrencies and smart contracts.", prerequisites: "Basic programming knowledge.", objectives: ["Understand distributed ledgers", "Write smart contracts", "Evaluate blockchain use cases"], topics: ["Distributed Ledgers", "Cryptocurrencies", "Smart Contracts"], skills: ["Smart Contract Development", "Solidity Basics"], career: ["Blockchain Developer", "Smart Contract Engineer"] },
		"Internet of Things": { duration: "10 Weeks", level: "Intermediate", faculty: "IoT Department", seats: "70", description: "Build smart systems using sensors, Arduino, Raspberry Pi and cloud connectivity.", prerequisites: "Basic electronics and programming.", objectives: ["Interface sensors and microcontrollers", "Build connected devices", "Send data to the cloud"], topics: ["Sensors", "Arduino", "Raspberry Pi", "Cloud Connectivity"], skills: ["Embedded Programming", "Sensor Integration"], career: ["IoT Developer", "Embedded Systems Engineer"] },
		"Big Data Analytics": { duration: "12 Weeks", level: "Advanced", faculty: "Data Engineering Department", seats: "75", description: "Analyze massive datasets using Hadoop, Spark and distributed computing tools.", prerequisites: "Data Science fundamentals.", objectives: ["Process large-scale datasets", "Use distributed computing tools", "Build data pipelines"], topics: ["Hadoop", "Spark", "Distributed Computing"], skills: ["Spark", "Data Pipelines"], career: ["Big Data Engineer", "Data Engineer"] },
		"DevOps": { duration: "10 Weeks", level: "Intermediate", faculty: "DevOps Department", seats: "85", description: "Learn Docker, Kubernetes, CI/CD pipelines and deployment automation.", prerequisites: "Basic Linux and networking knowledge.", objectives: ["Containerize applications", "Automate deployments", "Manage CI/CD pipelines"], topics: ["Docker", "Kubernetes", "CI/CD"], skills: ["Docker", "Kubernetes", "CI/CD Pipelines"], career: ["DevOps Engineer", "Site Reliability Engineer"] },
		"Data Structures & Algorithms": { duration: "12 Weeks", level: "Beginner", faculty: "Computer Science Department", seats: "150", description: "Learn arrays, linked lists, trees, graphs, sorting and problem-solving techniques.", prerequisites: "Basic programming knowledge.", objectives: ["Master core data structures", "Analyze algorithm complexity", "Solve coding problems efficiently"], topics: ["Arrays & Linked Lists", "Trees & Graphs", "Sorting & Searching"], skills: ["Problem Solving", "Algorithm Design"], career: ["Software Engineer", "Backend Developer"] }

	};

	const session = {

		getAccount: function () { return read("student", null); },
		setAccount: function (student) { return write("student", student); },

		getLoggedInStudent: function () { return read("loggedInStudent", null); },
		setLoggedInStudent: function (student) { return write("loggedInStudent", student); },
		clearLoggedInStudent: function () { clear("loggedInStudent"); },

		getLoggedInAdmin: function () { return read("loggedInAdmin", null); },
		setLoggedInAdmin: function (admin) { return write("loggedInAdmin", admin); },
		clearLoggedInAdmin: function () { clear("loggedInAdmin"); },

		logout: function () {
			session.clearLoggedInStudent();
			session.clearLoggedInAdmin();
		}

	};

	const students = {

		getAll: function () { return read("students", []); },

		find: function (id) {
			return students.getAll().find(function (s) { return s.id === id; }) || null;
		},

		add: function (student) {
			const list = students.getAll();
			const record = Object.assign({ id: utils.generateId("s") }, student);
			list.push(record);
			write("students", list);
			return record;
		},

		update: function (id, changes) {
			const list = students.getAll();
			const record = list.find(function (s) { return s.id === id; });
			if (!record) return null;
			Object.assign(record, changes);
			write("students", list);
			return record;
		},

		remove: function (id) {
			const list = students.getAll().filter(function (s) { return s.id !== id; });
			write("students", list);
		},

		search: function (keyword) {
			const term = String(keyword || "").trim().toLowerCase();
			if (!term) return students.getAll();
			return students.getAll().filter(function (s) {
				return s.name.toLowerCase().includes(term);
			});
		}

	};

	const enrollments = {

		getAll: function () { return read("enrollments", []); },

		add: function (enrollment) {
			const list = enrollments.getAll();
			const record = Object.assign({ id: utils.generateId("e") }, enrollment);
			list.push(record);
			write("enrollments", list);
			return record;
		},

		removeAt: function (index) {
			const list = enrollments.getAll();
			list.splice(index, 1);
			write("enrollments", list);
		},

		countByCourse: function () {
			const counts = {};
			Object.keys(courses).forEach(function (name) { counts[name] = 0; });
			enrollments.getAll().forEach(function (enrollment) {
				if (counts[enrollment.course] !== undefined) counts[enrollment.course]++;
			});
			return counts;
		},

		search: function (keyword) {
			const term = String(keyword || "").trim().toLowerCase();
			if (!term) return enrollments.getAll();
			return enrollments.getAll().filter(function (e) {
				return e.studentName.toLowerCase().includes(term) || e.course.toLowerCase().includes(term);
			});
		}
		getByStudent: function (email) {
			return enrollments.getAll().filter(function (enrollment) {
				return enrollment.email === email;
			});
		},

		updateProgress: function (id, progress) {

			const list = enrollments.getAll();

			const enrollment = list.find(function (e) {
				return e.id === id;
			});

			if (!enrollment) return null;

			enrollment.progress = Math.max(
				0,
				Math.min(100, Number(progress))
			);

			enrollment.status =
				enrollment.progress >= 100
					? "Completed"
					: "In Progress";

			write("enrollments", list);

			return enrollment;
		}
	};

	return { store: store, utils: utils, courses: courses, session: session, students: students, enrollments: enrollments };

})();