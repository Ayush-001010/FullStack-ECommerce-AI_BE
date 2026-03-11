import { DataTypes } from "sequelize";
import sequelize from "../DBConfig";

const UserDetails = sequelize.define('UserDetails',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    FirstName : {
        type:DataTypes.STRING,
        allowNull:false
    },
    LastName : {
        type:DataTypes.STRING,
        allowNull:false
    },
    Email : {
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    Password : {
        type:DataTypes.STRING,
        allowNull:false
    },
    isAdmin : {
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
});

export default UserDetails;