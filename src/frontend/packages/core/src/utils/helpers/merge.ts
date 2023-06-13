type Props = Record<string, any>;

export const deepMerge = (target: Props, ...sources: Props[]): Props => {
  if (!sources) {
    return target;
  }

  if (!sources.length) {
    return target;
  }

  Object.entries(sources.shift() ?? []).forEach(([key, value]) => {
    if (value) {
      if (!target[key]) {
        Object.assign(target, { [key]: {} });
      }

      if (
        value.constructor === Object ||
        (value.constructor === Array && value.find((v) => v.constructor === Object))
      ) {
        deepMerge(target[key], value);
      } else if (value.constructor === Array) {
        Object.assign(target, {
          [key]: value.find((v) => v.constructor === Array)
            ? target[key].concat(value)
            : [...new Set([...target[key], ...value])],
        });
      } else {
        Object.assign(target, { [key]: value });
      }
    }
  });

  return target;
};
