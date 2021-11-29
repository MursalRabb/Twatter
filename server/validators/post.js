const Validator = require('Validator')



const createPostValidator = (data) => {

    const rules = {
        content: 'required'
    }
    const messages = {
        required: ':attr field is required'
    }

    const v = Validator.make(data, rules, messages)
    v.passes()
    errors = v.getErrors()
    return errors
 
}


module.exports = {createPostValidator}