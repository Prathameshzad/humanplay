class apiResponse{
    constructor(stateusCode, data, message="Success"){
        this.stateusCode = stateusCode
        this.data = data
        this.message = message
        this.success = stateusCode < 400
    }
}