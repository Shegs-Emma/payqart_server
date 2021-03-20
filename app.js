const   express     = require('express'),
        app         = express(),
        cors        = require('cors');

const whitelist = ['http://localhost:3000', 'http://localhost:3001', 'https://payqart-task.herokuapp.com/'];
const corsOptions = {
    origin: function (origin, callback) {
        // console.log("** Origin of request " + origin);
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            // console.log("Origin accepted")
            callback(null, true)
        } else {
            callback(new Error('Not allowed by cors'))
        }
    }
}

app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
    
app.use(express.json());

//========================================MY ROUTES==========================================
// app.get('/', (req, res, next) => {
//     console.log('route hit..')
// })

app.post('/', (req, res, next) => {
    // This route wasn't neccessary afterall. It doesn't do anything
    const payDetails = req.body;
    const totalCartValue = 80500;
    const minDownPayment = (30 / 100) * totalCartValue;
    const shoppingCredit = totalCartValue - minDownPayment;

    const breakdownDetails = {
        totalCartValue,
        minDownPayment,
        shoppingCredit
    }

    res.status(200).json(breakdownDetails);
})

app.post('/break', (req, res, next) => {
    const payDetails = req.body;

    const totalCartValue = 80500;
    const minDownPayment = (30 / 100) * totalCartValue;
    const shoppingCredit = totalCartValue - Number(payDetails.breakDetails.minDownPayment);
    const interestRate = shoppingCredit * 0.04;
    const totalInterestPayable = interestRate * payDetails.month;

    const monthlyRepayment = (shoppingCredit + Math.round(totalInterestPayable)) / payDetails.month

    const roundedMonthlyrepayment = Math.round(monthlyRepayment);

    res.status(200).json(roundedMonthlyrepayment);

})
//================================LISTENER===========================================================


module.exports = app;