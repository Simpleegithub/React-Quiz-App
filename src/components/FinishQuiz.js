function FinishQuiz({ points, maxpossibepoints,highscore,dispatch }) {
  const percentage = (points / maxpossibepoints) * 100;
  let emoji;
  if(percentage===100) emoji="🥇";
  if(percentage>=80 && percentage<100) emoji="🎉";
  if(percentage>=50 && percentage<80) emoji="🙃";
  if(percentage>=0 && percentage<50) emoji="😐";
  if(percentage===0) emoji="🤦‍♂️";


  return (
    <div>
      <p className="result">
       <span>{emoji}</span> You scored <strong>{points}</strong> out of {maxpossibepoints} (
        {Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(Highscore:{highscore})</p>
      <button className="btn btn-ui" onClick={()=>dispatch({type:'restart'})}>Restart quiz</button>

    </div>
  );
}

export default FinishQuiz;
