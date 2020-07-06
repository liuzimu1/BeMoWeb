'use strict';
const log = console.log;

const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser') // middleware for parsing HTTP body from client
const session = require('express-session')
const hbs = require('hbs')
const mainRouter = express.Router();
const loginRouter = express.Router();
const contactRouter = express.Router();

const { ObjectID } = require('mongodb')

// Import our mongoose connection
const { mongoose } = require('./database/mongoose');
const { PageInfo } = require('./database/PageInfoSchema.js');

// express
const app = express();
// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({ extended:true }))


app.use(session({
	secret: 'oursecret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000,
		httpOnly: true
	}
}));

// middlewares
// static files
app.use(express.static(`${__dirname}/frontend`));
// session checker
const sessionChecker = (req, res, next) => {
	// redirect to login page if not loged in
	if (req.session.user) {
		res.redirect('/main')
	} else {
		next();
	}
};

// route for root; redirect to login
app.get('/', sessionChecker, (req, res) => {
	res.redirect('/login')
})


app.use('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/login');
})



/*
Log in existing account
Expect req body
{
	adminId: 
	password:
}
*/
loginRouter.post('/login', (req, res) => {
	const id = req.body.adminId;
	const password = req.body.password;

	if (id === "admin01" && password === "bemoadmin") {
		req.session.user = "admin01";
		res.redirect('/main');
	} else {
		res.status(400).redirect("/login");
	}
})

loginRouter.all('/', (req, res) => {
	log('get to loginPage');

	res.sendFile(__dirname + '/frontend/view/adminLoginPage.html');//{root: `${__dirname}/../../frontend/view`});
});

// Middleware for authentication for resources
const authenticate = (req, res, next) => {
	if (req.session.user) {
		if (req.session.user === "admin01") {
			req.user = user
			next()
		} else {
			return Promise.reject()
		}
	} else {
		res.redirect('/login')
	}
}

mainRouter.all('/', (req, res) => {
	log('get to main page');

	res.sendFile(__dirname + '/frontend/view/mainPage.html');//{root: `${__dirname}/../../frontend/view`});
});

// post a new page info
app.post('/newPage', authenticate, (req, res) => {
	const query = {};
	query["name"] = req.body.name;

	PageInfo.find(query).then((page) => {
		if (page.length != 0) {
			res.status(505).send();
		}
	})

	// Create a new page
	const page = new PageInfo({
		name: req.body.name,
		metaTitle: req.body.title,
		bannerImg: req.body.banner // from the authenticate middleware
	})

	// save student to database
	page.save().then((result) => {
		// Save and send object that was saved
		res.send(result)
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})

})

// GET main page info
app.get('/mainInfo', (req, res) => {
	const query = {};
	query["name"] = "Main";

	PageInfo.find(query).then((page) => {
		if (!page) {
			res.status(404).send()
		} else {
			res.send(page);
		}		
	}, (error) => {
		res.status(500).send(error);
	})
})

app.get('/currAdminUser', (req, res) => {
	res.json(req.session.user);
})

contactRouter.all('/', (req, res) => {
	log('get to contact page');

	res.sendFile(__dirname + '/frontend/view/contactPage.html');//{root: `${__dirname}/../../frontend/view`});
});

app.get('/contact', (req, res) => {

})

app.use('/login', loginRouter);
app.use('/main', mainRouter);
app.use('/contact', contactRouter);

app.listen(port, () => {
	//log(__dirname);
	log(`Listening on port ${port}...`)
});

