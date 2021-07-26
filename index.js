const express = require("express");
const morgan = require("morgan");
const cors = require("cors"); //to aviod CROS
const nodemailer = require("nodemailer");
const app = express();
const port = process.env.PORT || "3333";
//payment
var Secret_Key = 'sk_test_51JEgToCAlmE8w7N11DCcDSmxEBqQokJjTnnkg9dV2f6RCoJXsFJo06Uhf4KH8iCyzXh8jggFbnKGXqp0ueeYoLRY00us8VPnDz'
const stripe = require('stripe')(Secret_Key) 
//
const user_Router = require("./routers/user.js");
const product_Router = require("./routers/product.js");
const category_Router = require("./routers/category.js");
const renting_operation_Router = require("./routers/renting_operation.js");


app.use(express.json());
app.use(cors());

app.use(morgan("tiny"));

app.use("/assets/images", express.static("./public/images"));
app.use("/frontend", express.static("frontend"));
//routes
app.use("/api/user", user_Router);
app.use("/api/product", product_Router);
app.use("/api/category", category_Router);
app.use("/api/renting-operation", renting_operation_Router);

app.post("/sendMail", (req, res, next) => {
  console.log("new email request");
  let user = req.body;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "renterific.2021@gmail.com",
      pass: "Abdo123456#",
    },
  });

  var mailOptions = {
    from: "renterific.2021@gmail.com",
    to: user.email,
    subject: "New Password",
    html: `<h1>New Password Message</h1>
    <br> 
    <p>Your new password is <span style="color:blue"> ${user.password}</span>. Please do not share it with others</p>`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(400);
      res.send({ error: "Failed to send email" });
    } else {
      console.log("Email sent: " + info.response);
      res.send(info);
    }
  });
});

//error message
app.use((err, req, res, next) => {
  res.status(404).json({ msg: err });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
// card: {
//   number: '4242424242424242',
//   exp_month: 2,
//   exp_year: 2024,
//   cvc: '1111',
// },
app.post('/payment', async(req, res)=>{ 
  
	const token = await stripe.tokens.create({
		card: {
		  number: req.body.c_number,
		  exp_month: req.body.exp_number ,
		  exp_year:  req.body.exp_year,
		  cvc:  req.body.cvc,
		},
	  });
	stripe.customers.create({ 
		email: req.body.email, 
		source: token.id, 
		name: 'Basel Osama', 
		address: { 
			line1: 'Menofia', 
			postal_code: '32849', 
			city: 'menof', 
			state: 'Cairo', 
			country: 'Egypt', 
		} 
	}) 
	.then((customer) => { 
		return stripe.charges.create({ 
			amount: req.body.price,
			description: 'test', 
			currency: 'USD', 
			customer: customer.id 
		}); 
	}) 
	.then((charge) => { 
		res.status(200).json({'status':"success"}) // If no error occurs 
	}) 
	.catch((err) => { 
		res.status(400).json({'status':"failed"}) 	 // If some error occurs 
	}); 
}) 
