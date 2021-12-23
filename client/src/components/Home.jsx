import React from 'react'


import Left from './Left'
import Center from './Center'
import Right from './Right'


const Home = (props) => {

    const {access, handleReplyDialog} = props

    React.useEffect(()=>{
        document.title = 'Home | Twatter'
    }, [])

    return (
        <>
            <Left/>  
            <Center access={access} handleReplyDialog={handleReplyDialog}/>
            <Right/>
        </>
    )
}


export default Home