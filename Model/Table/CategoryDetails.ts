import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const CategoryDetails = sequelize.define('CategoryDetails',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    Name : {
        type:DataTypes.STRING,
        allowNull:false
    },
    ImageKey : {
        type:DataTypes.STRING,
        allowNull:false
    },
    RouteURL : {
        type:DataTypes.STRING,
        allowNull:false
    },
    OrderNumber:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    IsActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    }
});

export default CategoryDetails;