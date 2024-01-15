const floors = [];
const floorH = 2;
const sortRightLeft = (array) => {
  const groupedByX = array.reduce((acc, coord) => {
    const key = coord.x;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(coord);
    return acc;
  }, {});
  const sum = [];
  Object.values(groupedByX).forEach((array, index) =>
    index % 2 ? sum.push(...array) : sum.push(...array.reverse())
  );
  return sum;
};
const splitFloor = (floor) => {
  const groupedData = floor.reduce((result, item) => {
    const xValue = item.x;
    if (!result[xValue]) {
      result[xValue] = [];
    }
    result[xValue].push(item);
    return result;
  }, {});

  const arrayOfArrays = Object.values(groupedData);

  return arrayOfArrays;
};
const flipArray = (array) => {
  // console.log(array);
  let arrays = [];
  for (let i = 0; i < array.length; i++) {
    const el = array[i];
    if (i % 2 === 0) {
      arrays.push(...el);
    } else {
      arrays.push(...el.reverse());
    }
  }
  return arrays;
};
const sortFloors = (floors) => {
  let finalFloors = [];
  for (const floor of floors) {
    const joinedFloor = [...floor[0], ...floor[1]];
    const sortedFloor = joinedFloor.sort((a, b) =>
      a.x === b.x ? a.z - b.z : a.x - b.x
    );
    const floorSplitByX = splitFloor(sortedFloor);
    finalFloors.push(flipArray(floorSplitByX));
  }
  return finalFloors;
};
const getFloors = (array) => {
  // console.log(sortedX);
  let floorsArr = [];
  let twoArrays = [];
  //console.log(dividedArraysArray[1]);
  for (let i = 0; i < array.length; i++) {
    const el = array[i];

    // console.log(twoArrays);
    if (i % 2 === 0) {
      const sortedEl = el.sort((a, b) => (a.x !== b.x ? a.x - b.x : a.z - b.z));
      twoArrays.push(sortedEl);
    } else {
      const sortedEl = el.sort((a, b) => (a.x !== b.x ? a.x - b.x : a.z - b.z));
      twoArrays.push(sortedEl);
      floorsArr.push(twoArrays);
      twoArrays = [];
    }
  }

  return floorsArr;
};

const sortCoordinates = (sample) => {
  const sampleSortedY = sample.sort((a, b) => a.y - b.y);
  const dividedArrays = {};

  for (const item of sampleSortedY) {
    const { y } = item;
    if (!dividedArrays[y]) {
      dividedArrays[y] = [];
    }
    dividedArrays[y].push(item);
  }
  const dividedArraysArray = Object.values(dividedArrays);
  const floors = getFloors(dividedArraysArray);
  return sortFloors(floors);
};

module.exports = { sortCoordinates };
