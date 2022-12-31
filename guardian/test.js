let loop = 0;

const goNext = () => {
	console.log("going...", loop);
	return new Promise(async (resolve, reject) => {
		return await pick().then((x) => resolve("finished"));
	});
};
const pick = () => {
	console.log("picking...", loop);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve("picked");
		}, 1000);
	});
};
const tossItems = () => {
	console.log("tosssing");
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve("tossed");
		}, 2000);
	});
};

let fullL = false;
const checkIfFull = () => {
	return new Promise((resolve, reject) => {
		console.log("checking...");
		setTimeout(() => {
			console.log("checked", fullL);
			resolve(fullL);
			fullL = loop === 2 ? true : false;
		}, 100);
	});
};
const toss = async () => {
	return new Promise((resolve, reject) => {
		console.log("tossing...");
		setTimeout(() => {
			return resolve("tossed");
		}, 2000);
	});
};
const toGo = () => {
	return new Promise(async (resolve, reject) => {
		const full = await checkIfFull();
		for (loop; loop <= 5; ) {
			if (loop === 5) {
				console.log("done", loop);
				return resolve("done");
			} else {
				await checkIfFull()
					.then((isFull) => (isFull ? toss().then((x) => goNext()) : goNext()))
					.then((x) => loop++)
					.catch((err) => {
						reject(err);
						loop = 6;
					});
			}
		}
	});
};

toGo()
	.then((x) => console.log("finitlial ", x))
	.catch((err) => console.log("err", err));
