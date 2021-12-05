import React from 'react'
import axios from 'axios'

import './static/css/create.css'
import {url} from '../utils'

import {TextField, Button, CircularProgress, Avatar, Snackbar} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'

const Create = (props) => {

    const {access} = props 

    const initialErrors = {
        content: {bool: false, msg: ' '}
    }
    const [errors, setErrors] = React.useState(initialErrors)
    const [loading, setLoading] = React.useState(false)
    const [content, setContent] = React.useState('')
    const [isCreated, setIsCreated] = React.useState(false)

    const handleFocus = (event) => {
        let name = event.target.name
        setErrors({...errors, [name]: {bool: false, msg: ' '}})
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setLoading(true)
        let data = new FormData(event.target)
        data = Object.fromEntries(data)
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            }
        }
        async function fetch() {
            try {
                let res = await axios.post(`${url}post/create`, data, config)
                if (res.status === 201) {
                    setLoading(false)
                    setContent('')
                    setIsCreated(true)
                }
            } catch (e) {
                setLoading(false)
                if (e.response && e.response.status === 400) {
                    let errs = Object.entries(e.response.data)
                    let errorCopy = {...initialErrors}
                    errs.forEach((err)=>{
                        let entrie = err[0]
                        let value = err[1]
                        errorCopy[entrie] = {bool: true, msg: value[0]}
                        
                    })
                    setErrors(errorCopy)
                }
            }
        }
        fetch()
    }


    return (
        <>
            <div className='create'>
                <form className='create-cnt' onSubmit={handleSubmit}>
                    <TextField
                    rows={4}
                    multiline
                    color='primary'
                    InputProps={{startAdornment: <Avatar/>}}
                    placeholder='Your thoughts...'
                    name='content'
                    helperText={errors.content.msg}
                    error={errors.content.bool}
                    onFocus={handleFocus}
                    value={content}
                    onChange={(event)=>{setContent(event.target.value)}}
                    />
                    <Button
                    variant='contained'
                    disableElevation
                    color='primary'
                    type='submit'
                    disabled={loading}
                    >
                        {
                            loading === true?
                            <CircularProgress size={24} color='primary'/>:
                            'Post'
                        }
                    </Button>
                </form>
                <Snackbar 
                open={isCreated} 
                onClose={()=>setIsCreated(false)}
                message='Tweet added successfully'
                autoHideDuration={6000}
                >
                    <Alert
                    variant='filled'
                    severtiy='success'
                    open={isCreated}
                    onClose={()=>setIsCreated(false)}
                    >
                        Twaat added successfully
                    </Alert>
                </Snackbar>
            </div>
        </>
    )
}


export default Create