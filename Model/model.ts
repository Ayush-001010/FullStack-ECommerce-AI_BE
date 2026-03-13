import UserDetails from "./Table/UserDetails";

interface IModel {
    UserDetails : typeof UserDetails;
}

const model : IModel = {
    UserDetails
}

export default model;