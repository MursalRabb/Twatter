import React from 'react'

import {Typography, CircularProgress} from '@material-ui/core'
import Post from './Post'



const PostCompiler = (props) => {

    const {acu, loading, posts, access, handleReplyDialog} = props

    if (loading && posts.length === 0) {
        return <CircularProgress size={48} color='primary' />
    }

    if (loading && posts.length > 0) {
        return (
            <>
                {posts.map(data=><Post postData={data} access={access} handleReplyDialog={handleReplyDialog}/>)}
                {<CircularProgress size={48} color='primary'/>}
            </>
        )
    }

    

   

    if (acu === true && posts.length === 0) {
        return <Typography>No posts to show</Typography>
    }

    if (acu === true && posts.length > 0) {
        return (
            <>
                {posts.map(data=><Post postData={data} access={access} handleReplyDialog={handleReplyDialog}/>)}
                <Typography>All caught up</Typography>
            </>
        )
    }

    else {
        return (
            <>{posts.map(data=><Post postData={data} access={access} handleReplyDialog={handleReplyDialog}/>)}</>
        )
    }


}


export default PostCompiler