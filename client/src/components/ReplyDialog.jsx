import React from 'react'

import ReplyCreate  from './ReplyCreate'

import {Backdrop, Divider, IconButton} from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel'
import './static/css/reply.css'


const ReplyDialog = (props) => {

    const {open, handleClose, post, access} = props

    if (open) {
        return (
            <>
                <div className='rply-dia'>
                    <IconButton onClick={handleClose}>
                        <CancelIcon/>
                    </IconButton>
                    <Divider/>
                    <div className='rply-dia-cnt'>
                        <ReplyCreate post={post} access={access} handleClose={handleClose}/>
                    </div>
                </div>
                <Backdrop
                style={{'zIndex': '999'}}
                open={open}
                onClick={handleClose}
                />
            </>
        )
    } else {
        return <></>
    }

    
}


export default ReplyDialog