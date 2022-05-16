
export const parseContent = (val, defaultVal = '[{"type": "paragraph","children": [{ "text": "" }]}]') => {
  if (!val) {
    return JSON.parse(defaultVal)
  }

  try {
    return JSON.parse(val)
  } catch (err) {
    return JSON.parse(defaultVal)
  }
}

export const stringify = val => {
  return JSON.stringify(val)
}
