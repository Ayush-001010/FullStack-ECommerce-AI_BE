import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const Order = sequelize.define('Order',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    OrderID:{
        type:DataTypes.STRING,
        allowNull:false
    },
    Quantity : {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    UnitPrice:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    DiscountedAmount : {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    OrderDate :{
        type:DataTypes.DATE,
        allowNull:false
    },
    Status :{
        type:DataTypes.ENUM('Pending','Shipped','Delivered','Cancelled'),
        allowNull:false
    }
});

export default Order;