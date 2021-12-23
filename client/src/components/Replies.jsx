import React from 'react'

import axios from 'axios'
import {url} from '../utils'

import PostCompiler from './PostCompiler'

import {Button} from '@material-ui/core'
import './static/css/replies.css'



const ViewReplies = (props) => {

    const {handleViewReplies} = props

    return (
        <div style={{'borderBottom': '1px solid rgba(0,0,0,0.3)'}}>
            <div className='d-flex m-16'>
                <div className='replies'>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className='m-l-8'>
                <Button
                size='small'
                color='primary'
                onClick={handleViewReplies}
                >View Replies</Button>
                </div>
            </div>
        </div>
    )
}


const Replies = (props) => {
    const {repliesCount, isReply, id} = props

    const [repliesMounted, setRepliesMounted] = React.useState(false)
    const [replies, setReplies] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [acu, setACU] = React.useState(false)

    const handleViewReplies = () => {
        setRepliesMounted(!repliesMounted)
        async function fetch() {
            setLoading(true)
            try {
                let res = await axios.get(`${url}post/replies/${id}`)
                if (res.status === 200) {
                    setLoading(false)
                    setReplies(res.data.replies)
                }
            } catch (e) {
                if (e.response && e.response.status === 404) {
                    setLoading(false)
                    setACU(true)
                }
            }
        }
        if (replies.length === 0) {
            fetch()
        }
    }

    if (isReply === false) {
        return <></>
    } else {
        if (repliesCount === 0) {
            return <></>
        } else {
            if (repliesMounted === false) {
                return <ViewReplies handleViewReplies={handleViewReplies}/>
            } else {
                return <PostCompiler
                        acu={acu}
                        loading={loading}
                        posts={replies}
                        />
            }
        }
        
    }
}



export default Replies