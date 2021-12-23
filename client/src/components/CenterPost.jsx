import React from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import {url} from '../utils'

import {CircularProgress} from '@material-ui/core'


import ReplyCreate from './ReplyCreate'
import PostCompiler from './PostCompiler'


const CenterPost = (props) => {

    const {id} = useParams()

    const {handleReplyDialog, access} = props

    const [loading, setLoading] = React.useState(false)
    const [post, setPost] = React.useState(null)
    const [is404, setIs404] = React.useState(false)

    const [replies, setReplies] = React.useState([])
    const [loadingReplies, setLoadingReplies] = React.useState(false)
    const [acu, setACU] = React.useState(false)

    //fetching post
    React.useEffect(()=>{
        setLoading(true)
        async function fetch() {
            try {
                const res = await axios.get(`${url}post/${id}`)
                
                if (res.status === 200) {
                    setPost(res.data)
                    setLoading(false)
                }
            } catch (e) {
                if(e.response && e.response.status === 404) {
                    setIs404(true)
                    setLoading(false)
                }
            }
        }
        fetch()
    }, [id])


    //fetching replies
    React.useEffect(()=>{
        setLoadingReplies(true)
        async function fetch() {
            try {
                const res = await axios.get(`${url}post/replies/${id}`)
                if (res.status === 200) {
                    setReplies(res.data.replies)
                    setLoadingReplies(false)
                }
            } catch (e) {
                if(e.response && e.response.status === 404) {
                    
                    setLoadingReplies(false)
                }
            }
        }
        fetch()
    },[id])

    if (post) {
        return (
            <>
                <div className='center'>
                    <div className='center-bar'>
                        <div>Tweet</div>
                    </div>
                    <div style={{'marginTop':'57px'}}>
                        
                    </div>
                    <div className='m-16'>
                        <ReplyCreate post={post} access={access}/>
                    </div>
                    <PostCompiler acu={acu} access={access} posts={replies} handleReplyDialog={handleReplyDialog} />
                </div>
            </>
        )
    }

    if (is404) {
        return <h1>404</h1>
    }

    else  {
        return <CircularProgress size={48} color='primary' />
    }

    
     
    
    
}


export default CenterPost