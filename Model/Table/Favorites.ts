import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const Favorites = sequelize.define('Favorites',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    }
});

export default Favorites;