import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";
import bcrypt from 'bcrypt';

const UserDetails = sequelize.define('UserDetails',
    {
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
}, {
    hooks:{
        beforeCreate : async (user : any) => {
            if(user.Password){
                user.Password = await bcrypt.hash(user.Password,10);
            }
        },
        beforeUpdate : async (user : any) => {
            if(user.Password){
                user.Password = await bcrypt.hash(user.Password,10);
            }
        }
    }
});

export default UserDetails;