const path = require('path');

const express = require('express');
var cors = require('cors')

const app = express();
const dotenv = require('dotenv');

// get config vars
dotenv.config();

const sequelize = require('./util/database');
const User = require('./models/users');
const AdminUser= require('./models/user');
const Expenses = require('./models/expenses');
const Expense = require('./models/expense');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');
const Downloadfilerecord = require('./models/downloadfilerecord');
const Uploadfilerecord = require('./models/uploadfilerecord');



const userRoutes = require('./routes/user')
const usersRoutes = require('./routes/users')
const expenseRoutes = require('./routes/expense')
const expensesRoutes = require('./routes/expenses')
const purchaseRoutes = require('./routes/purchase')
const premiumFeatureRoutes = require('./routes/premiumFeature')
const resetPasswordRoutes = require('./routes/resetpassword')




app.use(cors());

// app.use(bodyParser.urlencoded());  ////this is for handling forms
app.use(express.json());  //this is for handling jsons

app.use('/user', userRoutes)
app.use('/expense', expenseRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/premium', premiumFeatureRoutes)
app.use('/password', resetPasswordRoutes);

//app.use((req, res) => {
  //  console.log('urlll', req.url);
//res.sendFile(path.join(__dirname, 'Login/login.html'));
//})

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(Downloadfilerecord);
Downloadfilerecord.belongsTo(User);


sequelize.sync()
    .then(() => {
        app.listen(process.env.PORT||3000);
    })
    .catch(err => {
        console.log(err);
    })


