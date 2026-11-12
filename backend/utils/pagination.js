const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

function getPagination(query) {
  const page = Number(query.page || 1);
  const limit = Math.min(Number(query.limit || DEFAULT_LIMIT), MAX_LIMIT);

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
}

module.exports = getPagination;
