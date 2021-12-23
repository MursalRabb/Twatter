import React from 'react'
import {useParams} from 'react-router-dom'

import Left from './Left'
import Right from './Right'
import CenterPost from './CenterPost'




const PostDetail = (props) => {

    const {handleReplyDialog, access} = props

    return (
        <>
            <Left/>
            <CenterPost handleReplyDialog={handleReplyDialog} access={access}/>
            <Right/>
        </>
    )
}


export default PostDetail