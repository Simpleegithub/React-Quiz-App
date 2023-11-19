import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import "./index.css";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishQuiz from "./components/FinishQuiz";
import Timer from "./components/Timer";
import Footer from "./components/Footer";

const initialstate = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining:null
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "datafailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active",secondsRemaining:state.questions.length*30 };
    case "newAnswer":
      const question = state.questions[state.index];
      console.log(question);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    case "finish":
      return {
        ...state,
        status: "finish",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };

    case "restart":
      return {
        ...state,
        index: 0,
        points: 0,
        status: "active",
        answer: null,
        highscore: 0,
        secondsRemaining:state.questions.length*30
      };

    case 'tick':
      return{...state,secondsRemaining:state.secondsRemaining-1,status:state.secondsRemaining === 0 ? "finish":state.status}
    default:
      throw new Error("Action not Found");
  }
}

export default function App() {
  console.log("rerender");
  const [state, dispatch] = useReducer(reducer, initialstate);
  const { questions, status, index, answer, points, highscore,secondsRemaining } = state;

  const numQuestions = questions.length;
  const maxpossibepoints = questions.reduce(
    (acc, question) => acc + question.points,
    0
  );

  useEffect(function () {
    async function fetchdata() {
      try {
        let resp = await fetch(" http://localhost:3001/questions");
        let data = await resp.json();
        if (!data) throw new Error("Data not found");
        console.log(data);
        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        dispatch({ type: "datafailed" });
        console.log(err);
      }
    }
    fetchdata();
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              numQuestions={numQuestions}
              index={index}
              points={points}
              maxpossibepoints={maxpossibepoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}

        {status === "finish" && (
          <FinishQuiz
            points={points}
            maxpossibepoints={maxpossibepoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
