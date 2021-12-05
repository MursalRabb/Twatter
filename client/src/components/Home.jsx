import React from 'react'

import axios from 'axios'
import {url} from '../utils'

import Left from './Left'
import Center from './Center'
import Right from './Right'


const Home = (props) => {

    const {access} = props

    React.useEffect(()=>{
        document.title = 'Home | Twatter'
    }, [])

    return (
        <>
            <Left/>  
            <Center access={access} />
            <Right/>
        </>
    )
}


export default Home