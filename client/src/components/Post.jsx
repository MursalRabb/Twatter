import React from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {url, timeCalc} from '../utils'
import './static/css/post.css'

import {Avatar, Typography, FormControlLabel} from '@material-ui/core'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import RepeatIcon from '@material-ui/icons/Repeat';

import Replies from './Replies'


const Post = (props) => {

    const {postData, access, handleReplyDialog} = props
    const {content, created, user, id, isLiked, _count, isReply} = postData

    const postLinkRef = React.useRef()

    const [liked, setLiked] = React.useState(isLiked)
    const [likesCount, setLikesCount] = React.useState(_count.likes)
    const [isReplying, setIsReplying] = React.useState(false)


    const styleFormatter = (type) => {
        if (type === 'connector') {
            if (isReply === false) {
                return {'display': 'none'}
            } else if (isReply === true && _count.replies === 0) {
                return {'display': 'none'}
            } else {
                return {}
            }
        } else if (type==='container') {
            if (isReply === true && _count.replies !== 0) {
                return {'margin': '0px 16px'}
            } else {
                return {}
            }
        } else {
            if ((isReply === true && _count.replies === 0) || isReply === false) {
                return {}
            } else {
                return {'borderBottom': 'none'}
            }
        }
    }

    const handleLike = () => {
        setLiked(!liked)
        
        if (liked === true) {
            setLikesCount(likesCount - 1)
        } else {
            setLikesCount(likesCount + 1)
        }

        async function fetch () {
            const data = {post: id}
            const config = {headers: {Authorization: access? `Bearer ${access}` : null}}
            try {
                const res = await axios.post(`${url}post/likeunlike`, data, config)
                return res
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    setLiked(!liked)
                }
            }
        }
        fetch()
    }


    return (
        <>
            <div className='post' style={styleFormatter('border')}>
                <div className='post-cnt' style={styleFormatter('container')}>
                    <div className='d-flex d-flex-clm aln-itm-cntr'>
                        <Avatar/>
                        <div className='rply-lnk' style={styleFormatter('connector')}></div>
                    </div>
                    <div className='d-flex d-flex-clm m-l-8 m-t-8 f-1'>
                        <div className='d-flex'>
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
                        <Typography variant='subtitle2' style={{'cursor': 'pointer'}} onClick={()=>postLinkRef.current.click()}>
                            {content}
                        </Typography>
                        <div className='m-t-8 m-l-8 d-flex jstfy-cnt-spb'>
                            <FormControlLabel
                            
                            label={<Typography variant='subtitle2' >{likesCount}</Typography>}
                            onClick={handleLike}
                            style={{'cursor':'default'}}
                            control=
                                
                                    {liked === true? 
                                    <FavoriteIcon color='secondary' fontSize='small' /> : 
                                    <FavoriteBorderIcon fontSize='small'/>}
                                
                            
                            />
                            <FormControlLabel
                            
                            label={<Typography variant='subtitle2' >{'this click'}</Typography>}
                            onClick={()=>handleReplyDialog(postData)}
                            style={{'cursor':'default'}}
                            control={<ChatBubbleOutlineIcon fontSize='small'/>}
                            />
                            <FormControlLabel
                            label={<Typography variant='subtitle2' >{likesCount}</Typography>}
                            
                            style={{'cursor':'default'}}
                            control={<RepeatIcon fontSize='small'/>}
                            />
                        </div>
                        <Link exact to={`/post/${id}`} hidden ref={postLinkRef}/>
                    </div>
                </div>
            </div>
            <Replies  isReply={isReply} repliesCount={_count.replies} id={id}/>
        </>
    )
}



export default Post