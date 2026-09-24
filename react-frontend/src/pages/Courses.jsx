import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";

function Courses() {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: "Machine Learning",
      description:
        "Learn machine learning concepts, algorithms and practical model building.",
      level: "Intermediate",
      duration: "8 Weeks"
    },
    {
      id: 2,
      title: "Deep Learning",
      description:
        "Explore neural networks, CNNs, RNNs and modern deep learning techniques.",
      level: "Advanced",
      duration: "10 Weeks"
    },
    {
      id: 3,
      title: "Large Language Models",
      description:
        "Understand LLM concepts, transformers, prompting and modern language models.",
      level: "Advanced",
      duration: "8 Weeks"
    },
    {
      id: 4,
      title: "Natural Language Processing",
      description:
        "Learn how computers process, understand and generate human language.",
      level: "Intermediate",
      duration: "8 Weeks"
    },
    {
      id: 5,
      title: "Computer Vision",
      description:
        "Study image processing, object detection and computer vision applications.",
      level: "Intermediate",
      duration: "8 Weeks"
    },
    {
      id: 6,
      title: "Generative AI",
      description:
        "Explore generative models, diffusion models, prompting and AI applications.",
      level: "Advanced",
      duration: "6 Weeks"
    },
    {
      id: 7,
      title: "Python Programming",
      description:
        "Build a strong foundation in Python programming and problem solving.",
      level: "Beginner",
      duration: "6 Weeks"
    },
    {
      id: 8,
      title: "Data Science",
      description:
        "Learn data analysis, visualization and fundamental data science workflows.",
      level: "Intermediate",
      duration: "8 Weeks"
    },
    {
      id: 9,
      title: "Cloud Computing",
      description:
        "Understand cloud platforms, services, deployment and cloud architecture.",
      level: "Intermediate",
      duration: "8 Weeks"
    },
    {
      id: 10,
      title: "Cyber Security",
      description:
        "Learn fundamental security concepts, threats, protection and best practices.",
      level: "Intermediate",
      duration: "8 Weeks"
    },
    {
      id: 11,
      title: "Blockchain",
      description:
        "Understand blockchain technology, distributed systems and smart contracts.",
      level: "Advanced",
      duration: "7 Weeks"
    },
    {
      id: 12,
      title: "Internet of Things",
      description:
        "Explore connected devices, sensors, communication and IoT applications.",
      level: "Intermediate",
      duration: "7 Weeks"
    },
    {
      id: 13,
      title: "Big Data",
      description:
        "Learn the fundamentals of large-scale data processing and analytics.",
      level: "Advanced",
      duration: "8 Weeks"
    },
    {
      id: 14,
      title: "DevOps",
      description:
        "Learn development operations, automation, CI/CD and deployment practices.",
      level: "Intermediate",
      duration: "7 Weeks"
    },
    {
      id: 15,
      title: "Data Structures & Algorithms",
      description:
        "Build problem-solving skills using important data structures and algorithms.",
      level: "Intermediate",
      duration: "10 Weeks"
    }
  ];

  function viewCourse(course) {
    navigate(`/course-details?id=${course.id}`, {
      state: { course }
    });
  }

  return (
    <PageShell>
      <main className="courses-page">

        <section className="courses-header">

          <div className="courses-header-content">
            <p className="hero-label">
              LEARNING LIBRARY
            </p>

            <h1>Explore Our Courses</h1>

            <p>
              Discover courses designed to help you build technical
              knowledge and develop practical skills.
            </p>
          </div>

          <div className="course-count">
            <strong>{courses.length}+</strong>
            <span>Courses Available</span>
          </div>

        </section>

        <section className="courses-container">

          <div className="courses-toolbar">
            <div>
              <h2>Available Courses</h2>
              <p>
                Choose a course and start your learning journey.
              </p>
            </div>
          </div>

          <div className="courses-grid">

            {courses.map((course) => (
              <article
                className="course-item"
                key={course.id}
              >

                <div className="course-item-top">
                  <span className="course-index">
                    {String(course.id).padStart(2, "0")}
                  </span>

                  <span className="course-level">
                    {course.level}
                  </span>
                </div>

                <div className="course-item-body">

                  <h3>{course.title}</h3>

                  <p>
                    {course.description}
                  </p>

                </div>

                <div className="course-item-footer">

                  <span>
                    {course.duration}
                  </span>

                  <button
                    onClick={() => viewCourse(course)}
                  >
                    View Course
                  </button>

                </div>

              </article>
            ))}

          </div>

        </section>

      </main>
    </PageShell>
  );
}

export default Courses;