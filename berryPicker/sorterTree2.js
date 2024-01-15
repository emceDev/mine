const sample = [
  { x: 101, y: -60, z: 102 },
  { x: 101, y: -60, z: 101 },
  { x: 101, y: -60, z: 103 },
  { x: 101, y: -60, z: 104 },
  { x: 102, y: -60, z: 102 },
  { x: 102, y: -60, z: 101 },
  { x: 102, y: -60, z: 103 },
  { x: 101, y: -60, z: 105 },
  { x: 102, y: -60, z: 104 },
  { x: 101, y: -60, z: 106 },
  { x: 102, y: -60, z: 105 },
  { x: 103, y: -60, z: 102 },
  { x: 103, y: -60, z: 101 },
  { x: 103, y: -60, z: 103 },
  { x: 103, y: -60, z: 104 },
  { x: 102, y: -60, z: 106 },
  { x: 103, y: -60, z: 105 },
  { x: 103, y: -60, z: 106 },
  { x: 101, y: -59, z: 102 },
  { x: 101, y: -59, z: 101 },
  { x: 101, y: -59, z: 103 },
  { x: 101, y: -59, z: 104 },
  { x: 102, y: -59, z: 102 },
  { x: 102, y: -59, z: 101 },
  { x: 102, y: -59, z: 103 },
  { x: 101, y: -59, z: 105 },
  { x: 102, y: -59, z: 104 },
  { x: 101, y: -59, z: 106 },
  { x: 102, y: -59, z: 105 },
  { x: 103, y: -59, z: 102 },
  { x: 103, y: -59, z: 101 },
  { x: 103, y: -59, z: 103 },
  { x: 103, y: -59, z: 104 },
  { x: 102, y: -59, z: 106 },
  { x: 103, y: -59, z: 105 },
  { x: 103, y: -59, z: 106 },
  { x: 101, y: -58, z: 102 },
  { x: 101, y: -58, z: 101 },
  { x: 101, y: -58, z: 103 },
  { x: 101, y: -58, z: 104 },
  { x: 102, y: -58, z: 102 },
  { x: 102, y: -58, z: 101 },
  { x: 102, y: -58, z: 103 },
  { x: 101, y: -58, z: 105 },
  { x: 102, y: -58, z: 104 },
  { x: 101, y: -58, z: 106 },
  { x: 102, y: -58, z: 105 },
  { x: 103, y: -58, z: 102 },
  { x: 103, y: -58, z: 101 },
  { x: 103, y: -58, z: 103 },
  { x: 103, y: -58, z: 104 },
  { x: 102, y: -58, z: 106 },
  { x: 103, y: -58, z: 105 },
  { x: 103, y: -58, z: 106 },
  { x: 101, y: -57, z: 102 },
  { x: 101, y: -57, z: 101 },
  { x: 101, y: -57, z: 103 },
  { x: 101, y: -57, z: 104 },
  { x: 102, y: -57, z: 102 },
  { x: 102, y: -57, z: 101 },
  { x: 102, y: -57, z: 103 },
  { x: 101, y: -57, z: 105 },
  { x: 102, y: -57, z: 104 },
  { x: 101, y: -57, z: 106 },
  { x: 102, y: -57, z: 105 },
  { x: 103, y: -57, z: 102 },
  { x: 103, y: -57, z: 101 },
  { x: 103, y: -57, z: 103 },
  { x: 103, y: -57, z: 104 },
  { x: 102, y: -57, z: 106 },
  { x: 103, y: -57, z: 105 },
  { x: 103, y: -57, z: 106 },
  { x: 104, y: -60, z: 106 },
  { x: 104, y: -60, z: 105 },
  { x: 104, y: -60, z: 104 },
  { x: 104, y: -60, z: 103 },
  { x: 105, y: -60, z: 106 },
  { x: 104, y: -60, z: 102 },
  { x: 105, y: -60, z: 105 },
  { x: 105, y: -60, z: 104 },
  { x: 105, y: -60, z: 103 },
  { x: 104, y: -60, z: 101 },
  { x: 105, y: -60, z: 102 },
  { x: 106, y: -60, z: 106 },
  { x: 106, y: -60, z: 105 },
  { x: 106, y: -60, z: 104 },
  { x: 105, y: -60, z: 101 },
  { x: 106, y: -60, z: 103 },
  { x: 106, y: -60, z: 102 },
  { x: 106, y: -60, z: 101 },
  { x: 104, y: -59, z: 106 },
  { x: 104, y: -59, z: 105 },
  { x: 104, y: -59, z: 104 },
  { x: 104, y: -59, z: 103 },
  { x: 105, y: -59, z: 106 },
  { x: 104, y: -59, z: 102 },
  { x: 105, y: -59, z: 105 },
  { x: 105, y: -59, z: 104 },
  { x: 105, y: -59, z: 103 },
  { x: 104, y: -59, z: 101 },
  { x: 105, y: -59, z: 102 },
  { x: 106, y: -59, z: 106 },
  { x: 106, y: -59, z: 105 },
  { x: 106, y: -59, z: 104 },
  { x: 105, y: -59, z: 101 },
  { x: 106, y: -59, z: 103 },
  { x: 106, y: -59, z: 102 },
  { x: 106, y: -59, z: 101 },
  { x: 104, y: -58, z: 106 },
  { x: 104, y: -58, z: 105 },
  { x: 104, y: -58, z: 104 },
  { x: 104, y: -58, z: 103 },
  { x: 105, y: -58, z: 106 },
  { x: 104, y: -58, z: 102 },
  { x: 105, y: -58, z: 105 },
  { x: 105, y: -58, z: 104 },
  { x: 105, y: -58, z: 103 },
  { x: 104, y: -58, z: 101 },
  { x: 105, y: -58, z: 102 },
  { x: 106, y: -58, z: 106 },
  { x: 106, y: -58, z: 105 },
  { x: 106, y: -58, z: 104 },
  { x: 105, y: -58, z: 101 },
  { x: 106, y: -58, z: 103 },
  { x: 106, y: -58, z: 102 },
  { x: 106, y: -58, z: 101 },
  { x: 104, y: -57, z: 106 },
  { x: 104, y: -57, z: 105 },
  { x: 104, y: -57, z: 104 },
  { x: 104, y: -57, z: 103 },
  { x: 105, y: -57, z: 106 },
  { x: 104, y: -57, z: 102 },
  { x: 105, y: -57, z: 105 },
  { x: 105, y: -57, z: 104 },
  { x: 105, y: -57, z: 103 },
  { x: 104, y: -57, z: 101 },
  { x: 105, y: -57, z: 102 },
  { x: 106, y: -57, z: 106 },
  { x: 106, y: -57, z: 105 },
  { x: 106, y: -57, z: 104 },
  { x: 105, y: -57, z: 101 },
  { x: 106, y: -57, z: 103 },
  { x: 106, y: -57, z: 102 },
  { x: 106, y: -57, z: 101 },
];
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
  const hY = sampleSortedY[0].y;
  const lY = sampleSortedY[sampleSortedY.length - 1].y;
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
