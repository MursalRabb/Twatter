import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import Signup from './Signup'
import Login from './Login'
import Home from './Home'
import Navbar from './Navbar'
import CommentDialog from './CommentDialog'

import './static/css/main.css'


const Main = (props) => {

    const {user, access, handleAccess} = props

    const [commentDialog, setCommentDialog] = React.useState({post: null, open: false})

    const handleCommentDialog = (id) => {
        setCommentDialog({post: id, open: true})
        console.log(commentDialog)
    }

    const commentDialogRenderer = () => {
        if (commentDialog.open === true) {
            return <CommentDialog 
            access={access}
            open={commentDialog.open} 
            post={commentDialog.post}
            handleClose={()=>setCommentDialog({post:null, open:false})}
            />

        } else {
            return <></>
        }
    }

    return (
        <>
            <div 
            className='main'
            >
                <Switch>
                    <Route exact path='/'>
                        {user? <Home user={user} access={access} handleCommentDialog={handleCommentDialog}/> : <Redirect to='/login'/>}
                    </Route>
                    <Route exact path='/signup'>
                        {user? <Redirect to='/'/> : <Signup/>}
                    </Route>
                    <Route exact path='/login'>
                        {user? <Redirect to='/'/> : <Login handleAccess={handleAccess}/>}
                    </Route>
                </Switch>
                {commentDialogRenderer()}
            </div>
            <Navbar user={user} />
        </>
    )
}



export default Main