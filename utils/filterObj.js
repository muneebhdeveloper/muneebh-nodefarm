const filterObj = (body, filterArray) => {
  const newFilteredObj = {};
  for (let i = 0; i < filterArray.length; i++) {
    if (body[filterArray[i]]) {
      newFilteredObj[filterArray[i]] = body[filterArray[i]];
    }
  }

  return newFilteredObj;
};

module.exports = filterObj;
