const Expense = require('../models/expenses');
const AWS = require('aws-sdk');
const tbluploadFile=require('../models/uploadfilerecord');
const Sequelize=require('../util/database');
const sequelize=require('sequelize');
const user=require('../models/user');
const { where, INTEGER } = require('sequelize');


const uploadexpense = async (req, res) => {
    try{
        const expenses= await Expense.findAll({where:{userId:req.user.id}});
        const  stringifyExpenses = JSON.stringify(expenses);
        const userId= req.user.id;
        const filename=`Expense${userId}/${new Date()}.txt`;
        const fileURL= await uploadToS3(stringifyExpenses, filename);
        await tbluploadFile.create({url:fileURL,userId:req.user.id});
        console.log(fileURL);
        res.status(200).json({fileURL, success:true})
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileURL:'', success:false, err: err});
    }
}

function uploadToS3(data,filename) {

    const BUCKET_NAME= 'expenseapp1992';
    const IAM_USER_KEY= 'AKIAVA5DVWXK3Y5AQY5N';
    const  IAM_USER_SECRET= '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';

    let s3bucket=new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })
     var params={
            Bucket:BUCKET_NAME,
            Key:filename,
            Body:data,
            ACL:'public-read'
        }
       return new Promise((resolve, reject) => {
            s3bucket.upload(params,(err,s3response)=>{
                if(err){
                    console.log("SOMETHING WENT WRONG",err)
                    reject(err);
                } 
                else{
                   // console.log('success',s3response)
                   // return s3response.location;
                    resolve(s3response.Location)
                    }
                })
       })     
}



const addexpense = (req, res) => {
    const { expenseamount, description, category } = req.body;

    if(expenseamount == undefined || expenseamount.length === 0 ){
        return res.status(400).json({success: false, message: 'Parameters missing'})
    }
    
    Expense.create({ expenseamount, description, category, userId: req.user.id}).then(expense => {
        return res.status(201).json({expense, success: true } );
    }).catch(err => {
        return res.status(500).json({success : false, error: err})
    })
}

const getexpenses = (req, res)=> {
    
    Expense.findAll({ where : { userId: req.user.id}}).then(expenses => {
        return res.status(200).json({expenses, success: true})
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({ error: err, success: false})
    })
}

const deleteexpense = (req, res) => {
    const expenseid = req.params.expenseid;
    if(expenseid == undefined || expenseid.length === 0){
        return res.status(400).json({success: false, })
    }
    Expense.destroy({where: { id: expenseid, userId: req.user.id }}).then((noofrows) => {
        if(noofrows === 0){
            return res.status(404).json({success: false, message: 'Expense doenst belong to the user'})
        }
        return res.status(200).json({ success: true, message: "Deleted Successfuly"})
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ success: true, message: "Failed"})
    })
}

const uploadexpensedataAllFile=((req,res)=>{
    try {
        const uploaFileData = tbluploadFile.findAll({where:{userId: req.user.id}});
        res.status(200).json({success:true,uploaFileData});
    } catch (error) {
        res.status(500).json({success:false,error:error});
    }

});



module.exports = {
    deleteexpense,
    getexpenses,
    addexpense,
    uploadexpense,
    uploadexpensedataAllFile
}