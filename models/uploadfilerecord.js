const Sequelize=require('sequelize');
const connection=require('../util/database');

const Uploadfilerecord=connection.define('uploadexpenserecord',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    filename:Sequelize.STRING,
    uploaddate:Sequelize.DATE
})

module.exports=Uploadfilerecord;