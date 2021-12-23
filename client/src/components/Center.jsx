import React from 'react'
import axios from 'axios'

import  './static/css/center.css'
import {url} from '../utils'
import {Typography} from '@material-ui/core'

import PostCompiler from './PostCompiler'


import Create from './Create'

const Center = (props) => {

    const {access, handleReplyDialog} = props

    const [posts, setPosts] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [ACU, setACU] = React.useState(false)
    const [cursor, setCursor] = React.useState(null)
    const [page, setPage] = React.useState(1)

    const postsRef = React.useRef()
    const createRef = React.useRef()

    React.useEffect(()=>{
        setLoading(true)
        async function fetch () {

            const config = {headers: {Authorization: access?  `Bearer ${access}` : null}}

            try {
                let res  = await axios.get(`${url}post/home/?cursor=${cursor}`, config)
                if (res.status === 200) {
                    let newPosts = res.data
                    setPosts([...posts, ...newPosts])
                    setCursor(newPosts[newPosts.length-1].id)
                    setLoading(false)
                }
            } catch (e) {
                if (e.response && e.response.status === 404) {
                    setACU(true)
                    setLoading(false)
                }
            }
        }
        fetch ()
    },
    [page])

    window.onscroll = () => {
        const windowHeight = window.innerHeight
        const scrollPosition = window.scrollY
        const lhs = windowHeight + scrollPosition
        
        if (postsRef.current) {
            let rhs =  postsRef.current.offsetHeight + createRef.current.offsetHeight + 72
        

        if (lhs === rhs) {
            const newPage = page + 1
            
            if (ACU === false) {
                setPage(newPage)
            }
            
        }
        }
        
    }

    return (
        <>
            <div className='center'>
                <div className='center-bar'>
                    <div>Home</div>
                </div>
                <div
                ref={createRef}
                >
                    <Create access={access} />
                </div>
                <div
                ref={postsRef}
                >
                    <PostCompiler
                    handleReplyDialog={handleReplyDialog}
                    acu={ACU}
                    loading={loading}
                    posts={posts}
                    access={access}
                    />
                </div>
            </div>
        </>
    )
}



export default Center