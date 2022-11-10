const merge = (obj1, obj2) => {

    const recursiveMerge = (obj, entries) => {
      for (const [key, value] of entries) {
        if (!Array.isArray(value) && typeof value === "object" && value !== null) {
          obj[key] = obj[key] ? {...obj[key]} : {};
          recursiveMerge(obj[key], Object.entries(value))
        } else {
            obj[key] = value;
          }
        }

        return obj;
      }

    return recursiveMerge(obj1, Object.entries(obj2))
}

export default merge