import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { loremIpsum } from "lorem-ipsum";

function App() {
  const testDurationMin = 1; // set test duration in minute(s)
  const [string, setString] = useState("");
  // generate 200 random words each time page loads
  useEffect(() => {
    const loremIpsum = require("lorem-ipsum").loremIpsum({
      units: "words",
      count: 200,
    });
    setString(loremIpsum);
  }, []);

  const originalString = string.toLowerCase().split(" ");
  const [userInput, setUserInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [userText, setUserText] = useState([]);
  const [time, setTime] = useState(testDurationMin * 60);
  const [isStarted, setIsStarted] = useState(false);
  // set result paramaters
  const [totalTypedWords, setTotalTypedWords] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [gwpm, setGwpm] = useState(0); // Gross words per Minute (GWPM)
  const [nwpm, setNwpm] = useState(0); // Net words per Minute (NWPM)
  const [accuracy, setAccuracy] = useState(0);

  const handleComparison = (e) => {
    const userTyping = e.target.value;
    setUserInput(userTyping);
    const userTypingArray = userTyping.toLowerCase().split(" ");
    setUserText(userTypingArray);
    let correctWordsArray = [];
    originalString.map((word, index) => {
      if (word === userTypingArray[index]) {
        correctWordsArray.push(userTypingArray[index]);
        setTotalTypedWords(userTypingArray.length - 1); //-1 for space at the end
        setCorrectWords(correctWordsArray.length);
        setGwpm(Math.floor(totalTypedWords / testDurationMin));
        setNwpm(Math.floor(correctWords / testDurationMin));
        setAccuracy(Math.floor((nwpm * 100) / gwpm));
      }
    });
  };

  const handleOnClick = () => {
    let intervalId = setInterval(() => {
      setTime((prevCount) => {
        if (prevCount > 0) {
          setIsStarted(true);
          setShowResult(false);
          return prevCount - 1;
        } else {
          clearInterval(intervalId);
          setIsStarted(false);
          setShowResult(true);
          setTime(testDurationMin * 60);
          setUserInput("");
          setUserText([]);
        }
      });
    }, 1000);
  };

  return (
    <Container>
      {!isStarted && !showResult && (
        <Container className="guide mt-5 py-1 bg-dark rounded">
          <p className="text-center text-warning my-4 title">
            By pressing start button you will have 60 seconds to type as fast
            and accurate as you can! Results will show after you finish the
            test. <br /> Good luck!
          </p>
        </Container>
      )}

      {!isStarted && showResult && (
        <Container className="text-center my-5 ">
          <Col className="align-bottom ">
            <Row className="text-uppercase text-white-50 bg-dark py-3">
              <h1>Your Test Result</h1>
            </Row>
            <Row className="first-col">
              <Col className="bg-light  results">
                <Row className="py-3 ">
                  <p>Total Typed Words</p>
                  <h4>{totalTypedWords}</h4>
                </Row>
              </Col>
              <Col className="bg-light results">
                <Row className="py-3">
                  <p>Incorrect Words</p>
                  <h4>{totalTypedWords - correctWords}</h4>
                </Row>
              </Col>
              <Col className="bg-light results">
                <Row className="py-3 ">
                  <p>Gross words per Minute (GWPM)</p>
                  <h4>{gwpm}</h4>
                </Row>
              </Col>
              <Col className="bg-light results">
                <Row className="py-3 ">
                  <p>Accuracy</p>
                  <h4>{accuracy} %</h4>
                </Row>
              </Col>
            </Row>
            <Row>
              <h3 className="text-uppercase text-white-50 bg-dark py-3 m-0">
                Your Actual Typing Speed Is <br />
                <span className="text-danger">{nwpm}</span> <br /> Words Per
                Minute
              </h3>
            </Row>
          </Col>
        </Container>
      )}

      <Container className="p-0 my-4">
        {!isStarted ? (
          <Container>
            <Col>
              <Row>
                <Button size="lg" className="mb-4" onClick={handleOnClick}>
                  Start
                </Button>
              </Row>
              <Row>
                <textarea
                  placeholder="Press start button and type here."
                  disabled
                ></textarea>
              </Row>
            </Col>
          </Container>
        ) : (
          <Container>
            <Row>
              <Button disabled size="lg mb-4">
                Remining time is {time} secs
              </Button>
            </Row>
            <Row>
              <textarea
                spellCheck={false}
                value={userInput}
                onChange={handleComparison}
                autoFocus
              ></textarea>
            </Row>
          </Container>
        )}
      </Container>
      <Container className="original-text border py-2 mb-5">
        {originalString.map((word, index) =>
          word === userText[index] ? (
            <React.Fragment key={index}>
              <span className="text-success">{word}</span>
              <span> </span>
            </React.Fragment>
          ) : (
            <React.Fragment key={index}>
              <span>{word}</span>
              <span> </span>
            </React.Fragment>
          )
        )}
      </Container>
    </Container>
  );
}

export default App;
