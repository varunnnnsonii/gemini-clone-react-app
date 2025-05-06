
// import { createContext, useState } from "react";
// import runChat from "../config/gemini";

// export const Context = createContext();

// const ContextProvider = (props) => {
//   const [input, setInput] = useState("");
//   const [recentPrompt, setRecentPrompt] = useState("");
//   const [prevPrompts, setPrevPrompts] = useState([]);
//   const [showResult, setShowResult] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [resultData, setResultData] = useState("");


//     const delayPara=(index,nextWord)=>{
//         setTimeout(function(){
//             setResultData(prev=>prev+nextWord);
//         },75*index);
//     }
//     const onSent = async (prompt) => {
//         setResultData("");
//         setLoading(true);
//         setShowResult(true);
//         setRecentPrompt(input);

//         const response = await runChat(input);
//         let responseArray = response.split("**");
//         let newResponse = "";

//         for (let i = 0; i < responseArray.length; i++) {
//             if (i === 0 || i % 2 !== 1) {
//                 newResponse += responseArray[i];
//             } else {
//                 newResponse += "</br><b>" + responseArray[i] + "</b>";
//             }
//         }
//         let newResponse2=newResponse.split("*").join("</br>");
//         let newResponseArray = newResponse2.split(" ");
//         for (let i = 0; i < newResponseArray.length; i++) {
//             const nextWord=newResponseArray[i];
//             delayPara(i,nextWord+ " ")
//         }

//         setLoading(false);
//         setInput("");
//     };


//   const contextValue = {
//     prevPrompts,
//     setPrevPrompts,
//     setRecentPrompt,
//     onSent,
//     recentPrompt,
//     showResult,
//     loading,
//     resultData,
//     setInput,
//     input,
//   };

//   return (
//     <Context.Provider value={contextValue}>
//       {props.children}
//     </Context.Provider>
//   );
// };

// export default ContextProvider;
import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // Word-by-word display with delay
  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };
  const newChat=()=>{
    setLoading(false)
    setShowResult(false)
  }

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if(prompt!==undefined ){
        response=await runChat(prompt);
        setRecentPrompt(prompt);
    }else{
        setPrevPrompts(prev=>[...prev,input])
        setRecentPrompt(input);
        response=await runChat(input)
    }
  
    try {
      const response = await runChat(input);
      let formatted = response;

      // Convert **text** to <b>text</b>
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

      // Convert *text* to <b>text</b>, avoiding conflict with bullet points
      formatted = formatted.replace(/\*(?!\s)([^*]+?)\*/g, "<b>$1</b>");

      // Convert * bullet lines to <br>• text
      formatted = formatted.replace(/(^|\n)\s*\*\s+(.*)/g, "$1<br><b>•</b> $2");


      // Word-by-word delayed rendering
      const words = formatted.split(" ");
      words.forEach((word, index) => {
        delayPara(index, word + " ");
      });

    } catch (error) {
      console.error("Chat error:", error);
      setResultData("Error generating response.");
    }

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    setRecentPrompt,
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
