import {useState} from "react";
import {editQuestions} from "../../../services/Firebase/FirebaseQuestion";
import {v4 as uuidv4} from "uuid";
import {useParams} from "react-router-dom";
import { useSelector } from "react-redux";

function EditQuestion() {
  const {question} = useSelector((state) => state.questions);

const {id} = useParams();
const filteredQuestions = question.find((item) => item.id === id);
  const [questionState, setQuestionState] = useState(filteredQuestions.question);
  const [choice1, setChoice1] = useState(filteredQuestions.choices.A);
  const [choice2, setChoice2] = useState(filteredQuestions.choices.B);
  const [choice3, setChoice3] = useState(filteredQuestions.choices.C);
  const [choice4, setChoice4] = useState(filteredQuestions.choices.D);
  const [subject, setSubject] = useState(filteredQuestions.subject);
  const [correctChoice, setCorrectChoice] = useState(filteredQuestions.correctChoice);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newQuestion = {
      id: uuidv4(),
      subject: subject,
      question: questionState,
      choices: {A: choice1, B: choice2, C: choice3, D: choice4},
      correctChoice: correctChoice.toUpperCase(),
      createdDate: new Date().toLocaleDateString(),
    };
    editQuestions(filteredQuestions.id,newQuestion);
    setQuestionState("");
    setChoice1("");
    setChoice2("");
    setChoice3("");
    setChoice4("");
    setCorrectChoice("");
    setSubject("");
  };

  return (
    <div className="flex justify-center mt-10 mx-2">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <h1 className="px-4 pt-3 pb-2 text-gray-800 text-2xl font-bold">
          Soru Ekle
        </h1>
        <div className="flex flex-wrap -mx-3 mb-3">
          <h2 className="px-4 pt-3 pb-2 text-gray-800 text-lg">Konu</h2>
          <div className="w-full px-4 mb-3 md:mb-0">
            <input
              className="input w-full bg-gray-100 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              placeholder="Konu girin"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-3">
          <h2 className="px-4 pt-3 pb-2 text-gray-800 text-lg">Soru</h2>
          <div className="w-full px-4 mb-6 md:mb-0">
            <textarea
              className="textarea appearance-none block w-full bg-gray-100 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-40 resize-none"
              placeholder="Sorunuzu girin"
              value={questionState}
              onChange={(e) => setQuestionState(e.target.value)}
              required
            ></textarea>
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-3">
          <h2 className="px-4 pt-3 pb-2 text-gray-800 text-lg">Şıklar</h2>
          <div className="w-full px-4 mb-6 md:mb-0 flex items-center ">
            <span className="bg-gray-100 border border-gray-200 rounded py-3 px-4 mb-3 mr-1">
              A
            </span>
            <input
              className="input w-full bg-gray-100 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              placeholder="Şık 1"
              value={choice1}
              onChange={(e) => setChoice1(e.target.value)}
              required
            />
          </div>
          <div className="w-full px-4 mb-3 md:mb-0 flex items-center ">
            <span className="bg-gray-100 border border-gray-200 rounded py-3 px-4 mb-3 mr-1">
              B
            </span>
            <input
              className="input w-full bg-gray-100 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              placeholder="Şık 2"
              value={choice2}
              onChange={(e) => setChoice2(e.target.value)}
              required
            />
          </div>
          <div className="w-full px-4 mb-3 md:mb-0 flex items-center ">
            <span className="bg-gray-100 border border-gray-200 rounded py-3 px-4 mb-3 mr-1">
              C
            </span>
            <input
              className="input w-full bg-gray-100 border border-gray-200  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              placeholder="Şık 3"
              value={choice3}
              onChange={(e) => setChoice3(e.target.value)}
              required
            />
          </div>

          <div className="w-full px-4 mb-3 md:mb-0 flex items-center ">
            <span className="bg-gray-100 border border-gray-200 rounded py-3 px-4 mb-3 mr-1">
              D
            </span>
            <input
              className="input w-full bg-gray-100 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              placeholder="Şık 4"
              value={choice4}
              onChange={(e) => setChoice4(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-3">
          <h2 className="px-4 pt-3 pb-2 text-gray-800 text-lg">Doğru Şık</h2>
          <div className="w-full px-4 mb-6 md:mb-0">
            <input
              className="input w-full bg-gray-100 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              maxLength={1}
              placeholder="Doğru şık (Aa, Bb, Cc veya Dd)"
              value={correctChoice}
              onChange={(e) => setCorrectChoice(e.target.value)}
              onKeyPress={(e) => {
                const allowedChars = ["a", "A", "b", "B", "c", "C", "d", "D"];
                if (!allowedChars.includes(e.key)) {
                  e.preventDefault();
                }
              }}
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="bg-gray-100 p-2 w-full rounded-lg shadow-md hover:bg-gray-200"
            type="submit"
          >
            Soruyu Güncelle
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditQuestion;
