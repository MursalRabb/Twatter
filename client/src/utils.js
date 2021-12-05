import moment from 'moment'

export const url = 'http://localhost:8000/api/'

export const emailSplitter = (email) => {
    let uri = email.split('@')
    uri = uri[1]
    return uri
}

export const timeCalc = (value) => {
    return moment(value).fromNow()
}