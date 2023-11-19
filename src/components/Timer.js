import { useEffect } from "react"

function Timer({dispatch,secondsRemaining}) {
    const mints=Math.floor(secondsRemaining/60);
    const seconds=Math.floor(secondsRemaining%60);
    useEffect(function(){
    const id=setInterval(function(){
    dispatch({type:'tick'})
    },1000)

    return function(){
        clearInterval(id)
    }
    },[dispatch])


    return (
        <div className="timer">
       
          {mints<10 && "0"}  {mints} : {seconds<10 && "0"} {seconds}
        </div>
    )
}

export default Timer;
