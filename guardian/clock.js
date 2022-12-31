const { beGuardian } = require("./guard");

beGuardian()
	.then((x) => {
		console.log("reoslved", x);
	})
	.catch((err) => console.log(err));
