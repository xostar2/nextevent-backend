//Error handling in saprete file for code readability
class ApiError extends Error {
//making our own constructor

        constructor(
            statusCode,
            message= "Something went wrong",
            errors= [],
            stack= "" 
        ){
                super(message)
                this.statusCode=statusCode
                this.data=null
                this.message=message
                this.success= false //bcz error
                this.errors = errors

                if(stack){
                    this.stack= stack
                }
                else{
                    Error.captureStackTrace(this,this.constructor)
                }
        }

}

export {ApiError}