import { useEffect, useState } from "react";
import api from "../services/api";
import PageShell from "../components/PageShell";

function ProgressUpdater({ item, onUpdate }) {
  const [completed, setCompleted] = useState(String(item.completedLessons));

  function handleSubmit(event) {
    event.preventDefault();
    const value = Number(completed);
    if (!Number.isInteger(value) || value < 0 || value > item.totalLessons) {
      alert("Enter a valid number of completed lessons");
      return;
    }
    onUpdate(item.course._id, value, item.totalLessons);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Completed lessons:{" "}
        <input
          type="number"
          min="0"
          max={item.totalLessons}
          value={completed}
          onChange={(e) => setCompleted(e.target.value)}
          required
        />
      </label>{" "}
      <button type="submit" className="primary-button">
        Update Progress
      </button>
    </form>
  );
}

function LearningProgress() {
  const [progress, setProgress] = useState([]);
  const [notStarted, setNotStarted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      const [p, e] = await Promise.all([
        api.get("/progress/my-progress"),
        api.get("/enrollments/my-courses")
      ]);
      const tracked = p.data.progress || [];
      setProgress(tracked);

      const trackedIds = new Set(tracked.map((t) => t.course?._id));
      setNotStarted(
        (e.data.enrollments || []).filter(
          (en) => en.course && !trackedIds.has(en.course._id)
        )
      );
      setError("");
    } catch {
      setError("Unable to load learning progress");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpdate(courseId, completedLessons, totalLessons) {
    try {
      await api.put("/progress", { courseId, completedLessons, totalLessons });
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update progress");
    }
  }

  const total = progress.length;
  const done = progress.filter((p) => p.progressPercentage === 100).length;
  const average = total
    ? Math.round(progress.reduce((s, p) => s + p.progressPercentage, 0) / total)
    : 0;

  return (
    <PageShell>
      <main className="container">
        <h1>My Learning Progress</h1>

        {loading && <p>Loading learning progress...</p>}
        {error && <p className="form-error">{error}</p>}

        {!loading && !error && (
          <>
            <div
              style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: "24px 0" }}
            >
              <div className="summary-card"><h3>Total Courses</h3><h2>{total}</h2></div>
              <div className="summary-card"><h3>Completed</h3><h2>{done}</h2></div>
              <div className="summary-card"><h3>Average Progress</h3><h2>{average}%</h2></div>
            </div>

            {progress.map((item) => (
              <div key={item._id} className="details-card" style={{ marginBottom: 16 }}>
                <h3>{item.course?.courseName || "Course unavailable"}</h3>
                <p>
                  {item.completedLessons} / {item.totalLessons} lessons
                </p>
                <progress
                  value={item.progressPercentage}
                  max="100"
                  style={{ width: "100%" }}
                />
                <p>
                  {item.progressPercentage}% ·{" "}
                  {item.progressPercentage === 100 ? "Completed" : "In Progress"}
                </p>
                {item.course && item.progressPercentage < 100 && (
                  <ProgressUpdater item={item} onUpdate={handleUpdate} />
                )}
              </div>
            ))}

            {notStarted.map((en) => (
              <div key={en._id} className="details-card" style={{ marginBottom: 16 }}>
                <h3>{en.course.courseName}</h3>
                <p>No progress recorded yet.</p>
                <button
                  className="primary-button"
                  onClick={() => handleUpdate(en.course._id, 0, 10)}
                >
                  Start tracking (10 lessons)
                </button>
              </div>
            ))}

            {progress.length === 0 && notStarted.length === 0 && (
              <p>Enroll in a course to start tracking progress.</p>
            )}
          </>
        )}
      </main>
    </PageShell>
  );
}

export default LearningProgress;