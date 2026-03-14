import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const BannerDetails = sequelize.define('BannerDetails',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    ImageKey : {
        type:DataTypes.STRING,
        allowNull:false
    },
    RouteURL : {
        type:DataTypes.STRING,
        allowNull:false
    },
    Text:{
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
},
{
    hooks:{
        beforeCreate : async (banner : any) => {
            banner.IsActive = true;
            banner.OrderNumber = await BannerDetails.count() + 1;
        }
    }
});

export default BannerDetails;