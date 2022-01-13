import React from 'react'

import axios from 'axios'
import {url} from '../utils'

import Left from './Left'
import Center from './Center'
import Right from './Right'


const Home = (props) => {

    const {access, handleCommentDialog} = props

    React.useEffect(()=>{
        document.title = 'Home | Twatter'
    }, [])

    return (
        <>
            <Left/>  
            <Center access={access} handleCommentDialog={handleCommentDialog}/>
            <Right/>
        </>
    )
}


export default Home