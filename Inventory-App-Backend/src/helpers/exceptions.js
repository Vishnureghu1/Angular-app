class CustomError extends Error { 
    constructor(message) { 
        super(message)
    }
}

module.exports = {
    invalidCredentials: new CustomError("User and password doesn't match"),
    userNotfound: new CustomError("User does not exists"),
    invalidcId: new CustomError("Invalid Category Id")

}
