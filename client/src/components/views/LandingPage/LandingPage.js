import React, {useEffect} from 'react'
import axios from 'axios'
function LandingPage() {

    useEffect(()=> {
        axios.get('/api/hello') // 서버 요청 보내면 client port(3000)번으로 가고 있음
        .then(response => console.log(response.data))
    },[])

    return (
        <div>
            LandingPage
        </div>
    )
}

export default LandingPage
