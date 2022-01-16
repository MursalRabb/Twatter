import React from 'react'

import axios from 'axios'
import {union} from 'lodash'
import {url, timeCalc} from '../utils'

import {
    Divider, IconButton, 
    TextField, withStyles, DialogTitle, 
    DialogContent, DialogActions,
    CircularProgress, Avatar, Typography,
    Button, FormControlLabel
} from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel'
import SendIcon from '@material-ui/icons/Send';
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import './static/css/commentDialog.css'

import MuiDialog from '@material-ui/core/Dialog'

const Dialog = withStyles((theme) => ({
    paper: {
      height: '100%' 
    },
  }))(MuiDialog);






const CommentItem = (props) => {

    const {comment, handleReply, createReply, access, handleErrors, handleLoading, handleReset} = props
    const {user, content, _count, id, isReply, created, replyId} = comment
    
    const [loadingReplies, setLoadingReplies] = React.useState(false)
    const [viewReplies, setViewReplies] =  React.useState(false)
    const [replies, setReplies] = React.useState([])
    const [repliesCount, setRepliesCount] = React.useState(0)
    const [isLiked, setIsLiked] = React.useState(true)
    
    

   

   
    React.useEffect(
        ()=>{
            
            async function fetch () {
                const initialErrors = {
                    content: {bool: false, msg: ' '}
                }
                let config = {headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${access}`}}
                let data = createReply
                
                handleLoading(true)
                try {
                    let res = await axios.post(`${url}comment/create`, data, config)
                    if (res.status === 201) {
                        setReplies(replies=>[res.data, ...replies])
                        handleLoading(false)
                        handleReset()
                        setRepliesCount(repliesCount=>repliesCount+1)
                        
                    }
                } catch (e) {
                    if (e.response && e.response.status === 400) {
                        let errs = Object.entries(e.response.data)
                    let errorCopy = {...initialErrors}
                    errs.forEach((err)=>{
                        let entrie = err[0]
                        let value = err[1]
                        errorCopy[entrie] = {bool: true, msg: value[0]}
                        
                    })
                    handleErrors(errorCopy)
                    handleLoading(false)
                    }
                }
            }
            if (createReply && createReply.replyTo === id && isReply === false) {
                fetch()
                
            }
            
        },
        [createReply,id, access]
    )


    const handleViewReplies = () => {
        
        async function fetch () {
            setLoadingReplies(true)
            let config = {'Content-Type': 'application/json'}
            try {
                let res = await axios.get(`${url}comment/replies/?commentId=${id}`, config)
                setLoadingReplies(false)
                setViewReplies(true)
                if (res.status === 200) {
                    setReplies(res.data)
                }
            } catch (e) {
                return 
            }
        }

        if (viewReplies === false) {
           
            fetch ()
        }
        else {
            setViewReplies(false)
        }
    }
    
    const classFormatter = () => {
        if (isReply === true) {
            return 'cmt-itm m-l-46'
        } else {
            return 'cmt-itm'
        }
    }

    const repliesRenderer = () => {
        if (viewReplies === true && isReply ===  false) {
            return <Replies replies={replies} handleReply={handleReply}/>
        } else {
            return <></>
        }
    }



    const handleClick = () => {
        console.log(id)
    }

    return (
        <>
            <div className={classFormatter()}>
                <div className='cmt-itm-cnt'>
                    <Avatar
                    style={{'width': '40px', 'height': '40px'}}
                    />
                    <div className='cmt-itm-main'>
                        <div className='d-flex aln-itms-cntr'>
                            <Typography
                            style={{'fontWeight':'bold'}}
                            variant='subtitle2'
                            >{`${user.firstname} ${user.lastname}`}</Typography>
                            <div className='m-l-8'></div>
                            <Typography
                            variant='p'
                            style={{'color':'rgba(0,0,0,0.5)'}}
                            >{timeCalc(created)}</Typography>
                        </div>
                        <Typography variant='p'>
                            {content}
                        </Typography>
                        {
                            repliesCount + _count.replies  === 0?
                            <Typography
                                className='m-t-8 '
                                color='primary'
                                variant='p'
                                style={{'cursor': 'pointer'}}
                                onClick={()=>handleReply(id, isReply, user.username, replyId)}
                                >Reply</Typography>
                            :
                            <div className='d-flex m-t-8 aln-itm-cntr'>
                                
                                <Divider orientation='vertical' />
                                <Typography
                                color='primary'
                                style={{'cursor': 'pointer'}}
                                variant='p'
                                onClick={()=>handleReply(id, isReply, user.username)}
                                >Reply</Typography>
                                <div className='m-r-8'></div>
                                <Divider orientation='vertical' />
                                <div className='m-r-8'></div>
                                <Typography
                                onClick={handleViewReplies}
                                color='primary'
                                style={{'cursor': 'pointer'}}
                                variant='p'
                                >
                                    {
                                        loadingReplies === true?
                                        'Loading...'
                                        :
                                        (
                                            viewReplies === true?
                                            'Hide replies'
                                            :
                                            `View Replies (${repliesCount + _count.replies})`
                                        )
                                    }
                                </Typography>
                            </div>
                        }
                    </div>
                    <div className='f-1'></div>
                    <FormControlLabel
                    control={
                        <IconButton
                        onClick={handleClick}
                        >
                        {
                            isLiked === true?
                            <FavoriteIcon color='secondary' fontSize='small'/>
                            :
                            <FavoriteBorderIcon/>
                        }
                    </IconButton> 
                    }
                    label={13}
                    />        
                </div>
            </div>
            {repliesRenderer()}
            
        </>
    )
}




const Replies = (props) => {
    
    const {replies, handleReply} = props

    

    
        return (
            <div>
                {
                    replies.map(
                        element => {
                            return <CommentItem comment={element} handleReply={handleReply} key={element.id}/>
                        }
                    )
                }
            </div>
        )
    }



const CommentDialog = (props) => {
    const {open, handleClose, post, access} = props

    const initialErrors = {
        content: {bool: false, msg: ' '}
    }
    const initialReplying = {
        isReplying: false, 
        replyTo: null, 
        isReply: null, 
        username: null,
        replyId: null
    }
    const [errors, setErrors] = React.useState(initialErrors)
    const [commentLoading, setCommentLoading] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [comments, setComments] = React.useState([])
    const [replying, setReplying] = React.useState(initialReplying)
    const [cursor, setCursor] = React.useState(null)
    const [ACU, setACU] = React.useState(false)
    const [content, setContent] = React.useState('')
    const [createReply, setCreateReply] = React.useState(null)

    React.useEffect(
        ()=>{
            
            async function fetch ( ) {

                setLoading(true)
                try {
                    const res = await axios.get(`${url}comment/?postId=${post}&cursor=${cursor}`)
                    setLoading(false)
                    if (res.status === 200) {
                        setComments(res.data)
                        setCursor(res.data[res.data.length - 1].id)
                    }
                } catch (e) {
                    setLoading(false)
                    if (e.response && e.response.status === 404) {
                        setACU(true)
                        setComments([])
                    }
                }
            }
            fetch()
        },
        [post]
    )

    const handleFocus = (event) => {
        let name = event.target.name
        setErrors({...errors, [name]: {bool: false, msg: ' '}})
    }

    const handle_close = () => {
        handleClose()
        setCursor(null)
    }


    const handleReply = (replyTo, isReply, username, replyId) => {
        setReplying({isReplying: true, replyTo: isReply===false? replyTo : replyId, isReply, username})
        
    }

    

    const handleSubmit = (event) => {
        event.preventDefault()
        
        setErrors(initialErrors)
        let data = new FormData(event.target)
        
        data = Object.fromEntries(data)
        data = {
            ...data, 
            postId: post, 
            isReplying: replying.isReplying, 
            replyTo: replying.replyTo, 
            isReply: replying.isReply,
            replyId: replying.replyId
        }
        
        
        let config = {headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${access}`}}
        
        async function fetch () {
            setCommentLoading(true)
            try {
                
                let res = await axios.post(`${url}comment/create`, data, config)
                setCommentLoading(false)
                if (res.status === 201) {
                    setContent('')
                    setComments([res.data, ...comments])
                    
                }
            } catch (e) {
                setCommentLoading(false)
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
        if (replying.isReplying === false) {
            fetch()
        } else {
            setCreateReply(data)
            
        }
    }

    if (open) {
        return (
            <>
                <Dialog 
                open={open}
                fullWidth={true}
                onClose={handle_close}
                className='d-flex d-flex-clm'
                >
                    <DialogTitle>
                    {`All Comments`}
                    </DialogTitle>
                    <Divider/>
                    <DialogContent>
                        {
                            loading === true?
                            <CircularProgress size={48} color={'primary'} />
                            :
                            (comments.length > 0?
                            comments.map(
                                element => <CommentItem 
                                key={element.id}
                                comment={element} 
                                handleReply={handleReply} 
                                createReply={createReply}
                                access={access}
                                handleErrors={(errors)=>{setErrors(errors)}}
                                handleLoading={(bool)=>setCommentLoading(bool)}
                                handleReset={
                                    ()=>{
                                        setReplying(initialReplying)
                                        setContent('')
                                        setCreateReply(null)
                                    }
                                }
                                />
                            ):
                            <Typography>No comments to show</Typography>)
                        }
                    </DialogContent>
                    <Divider/>
                    <DialogActions>
                        
                        <form onSubmit={handleSubmit} className='f-1 d-flex d-flex-clm'>
                        <div className='d-flex' style={{'alignSelf': 'center'}}>
                            <Button
                            color='primary'
                            startIcon={<NavigateBeforeIcon/>}
                            > Back</Button>
                            <Button
                            color='primary'
                            endIcon={<NavigateNextIcon/>}
                            >Next</Button>
                        </div>
                        <FormControlLabel
                        className={
                            replying.isReplying === true?
                            'cmt-rply':
                            'cmt-rply open'
                        }
                        control={
                            <IconButton
                            onClick={()=>setReplying(initialReplying)}
                            >
                                <CancelIcon fontSize='small'/>
                            </IconButton>
                        }
                        label={<Typography>{`Replying to ${replying.username}`}</Typography>}
                        />
                            <TextField
                            InputProps={{
                                endAdornment: <IconButton type='submit' disabled={commentLoading}>
                                    {
                                        commentLoading === true? <CircularProgress size={24} color='primary' /> :
                                        <SendIcon
                                        color='primary'
                                        />
                                    }
                                </IconButton>
                            }}
                            className='wd-100'
                            error={errors.content.bool}
                            value={content}
                            onChange={event=>setContent(event.target.value)}
                            helperText={errors.content.msg}
                            name='content'
                            onFocus={handleFocus}
                            />
                        </form>
                    </DialogActions>
                </Dialog>
                
            </>
        )
    } else {
        return <></>
    }
}

export default CommentDialog