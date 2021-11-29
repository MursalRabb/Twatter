import React from 'react'

import './static/css/post.css'

import {Avatar, Typography, FormControlLabel, IconButton} from '@material-ui/core'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';


const Post = (props) => {

    const {data} = props
    const {content, created} = data

    const [liked, setLiked] = React.useState(false)

    const handleLike = () => {
        console.log(liked)
        setLiked(!liked)
    }

    return (
        <>
            <div className='post'>
                <div className='post-cnt'>
                    <Avatar/>
                    <div className='d-flex d-flex-clm m-l-8'>
                        <div className='d-flex'>
                            <Typography variant='subtitle2' style={{'fontWeight': 'bolder'}}>Mursal Rabb</Typography>
                            <span className='m-l-8'>
                            <Typography
                            color='primary'
                            variant='subtitle2'>@mrslrbb</Typography>
                            </span>
                            <span className='m-l-8'>
                            <Typography
                            color='default'
                            variant='subtitle2'>date</Typography>
                            </span>
                        </div>
                        <Typography variant='subtitle2'>
                            {content}
                        </Typography>
                        <div className='m-l-8 m-t-8'>
                            <FormControlLabel
                            
                            label={<Typography variant='subtitle2' >{'12'}</Typography>}
                            onClick={handleLike}
                            style={{'cursor':'default'}}
                            control=
                                
                                    {liked === true? 
                                    <FavoriteIcon color='secondary' fontSize='small' /> : 
                                    <FavoriteBorderIcon fontSize='small'/>}
                                
                            
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



export default Post