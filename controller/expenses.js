const Expense = require('../models/expenses');
const AWS = require('aws-sdk');
const tbldownloadFile=require('../models/downloadfilerecord');
const Sequelize=require('../util/database');
const sequelize=require('sequelize');
const user=require('../models/users');
const { where, INTEGER } = require('sequelize');


const downloadexpenses = async (req, res) => {
    try{
        const expenses= await Expense.findAll({where:{userId:req.user.id}});
        const  stringifyExpenses = JSON.stringify(expenses);
        const userId= req.user.id;
        const filename=`Expense${userId}/${new Date()}.txt`;
        const fileURL= await uploadToS3(stringifyExpenses, filename);
        await tbldownloadFile.create({url:fileURL,userId:req.user.id});
        console.log(fileURL);
        res.status(200).json({fileURL, success:true})
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileURL:'', success:false, err: err});
    }
}

function uploadToS3(data,filename) {

    const BUCKET_NAME= 'swathiapp1992';
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


const getexpenses = (req, res)=> {
    
    Expense.findAll({ where : { userId: req.user.id}}).then(expenses => {
        return res.status(200).json({expenses, success: true})
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({ error: err, success: false})
    })
}

const downloadexpensedataAllFile=((req,res)=>{
    try {
        const downloadFileData = tbldownloadFile.findAll({where:{userId: req.user.id}});
        res.status(200).json({success:true,downloadFileData});
    } catch (error) {
        res.status(500).json({success:false,error:error});
    }

});



const  ispremiumuser = async(req,res)=>{
    try {
        const  ispremiumuser= await userDetails.findAll({where:{id:req.user.id}});
        console.log("is----------"+ispremiumuser[0]. ispremiumuser);
        res.json({ ispremiumuser: ispremiumuser[0]. ispremiumuser});
    } catch (error) {
        console.log('something went wrong');
    }
} 

module.exports = {
    getexpenses,
    downloadexpenses,
    downloadexpensedataAllFile,
    ispremiumuser
}