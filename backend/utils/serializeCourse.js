function serializeCourse(course) {
  if (!course) return course;

  const data = { ...course };
  delete data.__v;
  return {
    ...data,
    id: String(course._id)
  };
}

module.exports = serializeCourse;
