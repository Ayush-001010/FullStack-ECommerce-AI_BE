import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const ProductDetails = sequelize.define('ProductDetails',{
    id : {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    Name : {
        type:DataTypes.STRING,
        allowNull:false
    },
    Description : {
        type:DataTypes.STRING,
        allowNull:false
    },
    Price : {
        type:DataTypes.FLOAT,
        allowNull:false
    },
    ImageKey : {
        type:DataTypes.STRING,
        allowNull:false
    },
    IsDiscounted : {
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    DiscountPercentage : {
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    Rating:{
        type:DataTypes.FLOAT,
        defaultValue:0
    },
    NoOfRatings:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    IsBestSeller:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    Quantity :{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    IsActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    }
});


export default ProductDetails;