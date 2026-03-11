import { Sequelize } from "sequelize";

const sequelize = new Sequelize('ecommerce','root','Ayush@10',{
    host:"localhost",
    dialect:"mysql",
})



export default sequelize;