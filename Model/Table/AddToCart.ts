import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const AddToCart = sequelize.define('AddToCart',{
    id : {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    UserId : {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    ProductId : {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    Quantity : {
        type:DataTypes.INTEGER,
        allowNull:false
    }
});

export default AddToCart;