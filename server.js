const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const urls = require("./model");
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
	process.env.MONGO_URI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	() => console.log("DB Connected")
);

app.get("/", (req, res) => {
	res.sendFile("./index.html", { root: __dirname });
});

app.get("/all/data", async (req, res) => {
	const dataUrls = await urls.find({});
	res.json(dataUrls);
});

app.post("/new/addurl", async (req, res) => {
	const addedUrl = new urls({
		url: req.body.url,
		shortLink: req.body.shortLink,
	});
	try {
		if (req.body.shortLink.includes(" "))
			return res.status(400).json("Url Cannot contain spaces");
		const savedUrl = await addedUrl.save();
		res.status(200).json(`Your New Url Is adikg.ml/${savedUrl.shortLink}`);
	} catch (err) {
		res.status(400).json(err);
	}
});

app.get("/:link", async (req, res) => {
	const isLinkGood = await urls.find({ shortLink: req.params.link });
	try {
		if (!isLinkGood[0]) {
			res.status(404).json("Link Not Found");
		} else {
			return res.redirect(isLinkGood[0].url);
		}
	} catch (err) {
		res.status(400).json(err);
	}
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
