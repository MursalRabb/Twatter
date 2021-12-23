import React from 'react'
import axios from 'axios'

import {timeCalc, url} from '../utils'

import {Avatar, Typography, TextField,
  Button, IconButton, CircularProgress,
  Snackbar
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import SendIcon from '@material-ui/icons/Send'

import './static/css/reply.css'




const ReplyCreate = (props) => {

    const {handleClose, post, access} = props

    const {user, content, created} = post

    const initialErrors = {
      content: {bool: false, msg: ' '}
  }
    const [errors, setErrors] = React.useState(initialErrors)
    const [loading,setLoading] = React.useState(false)
    const [isCreated, setIsCreated] = React.useState(false)
    

    const handleSubmit = (event) => {
      event.preventDefault()
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': access? `Bearer ${access}` : null
        }
      }
      let data = new FormData(event.target)
      data.append('replyTo', post.id)
      data = Object.fromEntries(data)
      async function fetch () {
        setLoading(true)
        try {
          let res = await axios.post(`${url}post/reply`, data, config)
          if (res.status === 201) {
            setLoading(false)
            handleClose()
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
      fetch ()
    }

    return (
      <>
        <div className='rply'>
            <div className='rply-av'>
                <Avatar/><div className='rply-lnk'></div><Avatar/>
            </div>
            <div className='d-flex d-flex-clm m-l-8 f-1'>
                <div className='d-flex' style={{'flexWrap': 'wrap'}}>
                  <Typography variant='subtitle2' style={{'fontWeight': 'bolder'}}>{`${user.firstname} ${user.lastname}`}</Typography>
                  <span className='m-l-8'>
                  <Typography
                  color='primary'
                  variant='subtitle2'>{`@${user.username}`}</Typography>
                  </span>
                  <span className='m-l-8'>
                  <Typography
                  style={{'color': 'rgba(0, 0, 0, 0.5)'}}
                  variant='subtitle2'>{timeCalc(created)}</Typography>
                  </span>
                </div>
                <div style={{'marginBottom': '16px'}}>{content}</div>
                <form className='d-flex d-flex-clm' onSubmit={handleSubmit}>
                  <TextField
                  name='content'
                  multiline
                  rows={4}
                  placeholder={`Replying to @${user.username}`}
                  InputProps=
                  {{endAdornment: 
                    (
                    loading === false?
                    <IconButton
                    type='submit'
                    ><SendIcon color='primary'/></IconButton>:
                    <CircularProgress color='primary' size={24} />
                    )
                  }}
                  />
                  
                </form>
                
            </div>
            
        </div>
        <Snackbar 
                open={isCreated} 
                onClose={()=>setIsCreated(false)}
                message='Reply added successfully'
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
        
      </>
    )
}

export default ReplyCreate