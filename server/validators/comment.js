const Validator = require('Validator')



const createCommentValidator = (data) => {

    const rules = {
        content: ['required', 'max:1000']
    }
    const messages = {
        required: ':attr field is required',
        max: 'Maximum 1000 characters are allowed',
    }

    const v = Validator.make(data, rules, messages)
    v.passes()
    errors = v.getErrors()
    return errors

}


module.exports = {createCommentValidator}