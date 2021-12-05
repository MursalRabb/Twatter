import React from 'react'
import axios from 'axios'
import {url, timeCalc} from '../utils'
import './static/css/post.css'

import {Avatar, Typography, FormControlLabel} from '@material-ui/core'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import RepeatIcon from '@material-ui/icons/Repeat';


const Post = (props) => {

    const {postData, access} = props
    const {content, created, user, id, isLiked, _count} = postData

    const [liked, setLiked] = React.useState(isLiked)
    const [likesCount, setLikesCount] = React.useState(_count.likes)

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
            <div className='post'>
                <div className='post-cnt'>
                    <Avatar/>
                    <div className='d-flex d-flex-clm m-l-8'>
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
                        <Typography variant='subtitle2'>
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
                            
                            label={<Typography variant='subtitle2' >{likesCount}</Typography>}
                            onClick={handleLike}
                            style={{'cursor':'default'}}
                            control={<ChatBubbleOutlineIcon fontSize='small'/>}
                            />
                            <FormControlLabel
                            label={<Typography variant='subtitle2' >{likesCount}</Typography>}
                            onClick={handleLike}
                            style={{'cursor':'default'}}
                            control={<RepeatIcon fontSize='small'/>}
                            />
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}



export default Post