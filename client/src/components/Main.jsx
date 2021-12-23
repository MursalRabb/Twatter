import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import Signup from './Signup'
import Login from './Login'
import Home from './Home'
import Navbar from './Navbar'
import ReplyDialog from './ReplyDialog'
import PostDetail from './PostDetail'

import './static/css/main.css'


const Main = (props) => {

    const {user, access, handleAccess} = props

    const [commentDialog, setReplyDialog] = React.useState({open: false, post: null})

    const handleReplyDialog = (data) => {
        setReplyDialog({open: true, post: data})
    }

    return (
        <>
            <div 
            className='main'
            >
                <Switch>
                    <Route exact path='/'>
                        {user? <Home user={user} access={access} handleReplyDialog={handleReplyDialog}/> : <Redirect to='/login'/>}
                    </Route>
                    <Route exact path='/signup'>
                        {user? <Redirect to='/'/> : <Signup/>}
                    </Route>
                    <Route exact path='/login'>
                        {user? <Redirect to='/'/> : <Login handleAccess={handleAccess}/>}
                    </Route>
                    <Route exact path='/post/:id' >
                        <PostDetail handleReplyDialog={handleReplyDialog} access={access}/>
                    </Route>
                </Switch>
                <ReplyDialog
                access={access}
                post={commentDialog.post}
                handleClose={()=>setReplyDialog({open: false, post: null})}
                open={commentDialog.open} />
            </div>
            <Navbar user={user} />
            
        </>
    )
}



export default Main