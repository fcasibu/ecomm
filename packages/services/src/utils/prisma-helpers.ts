export function createTextSearchCondition(query: string, fields: string[]) {
  return {
    OR: fields.map((field) => ({
      [field]: { contains: query, mode: 'insensitive' },
    })),
  };
}

export function createNestedTextSearchCondition(
  query: string,
  nestedFields: Array<{ model: string; field: string }>,
) {
  return {
    OR: nestedFields.map(({ model, field }) => ({
      [model]: {
        some: { [field]: { contains: query, mode: 'insensitive' } },
      },
    })),
  };
}

export function combineSearchConditions(...conditions: object[]) {
  return {
    OR: conditions,
  };
}
