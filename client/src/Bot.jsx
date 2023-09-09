import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = "";
let apiMessages
// "Explain things like you would to a 10 year old learning how to code."
var skill_list = ["python", "Java", "JavaScript"]
var universal_skills = {
  "python": "https://www.classcentral.com/course/udemy-python-complete-bootcamp-2019-learn-by-appl-61164", 
  "Java": "https://www.classcentral.com/course/udemy-java-tutorial-27747", 
  "JavaScript":"https://www.classcentral.com/course/udemy-the-complete-javascript-course-23699", 
  "git": "https://www.classcentral.com/course/udemy-git-started-with-github-61191", 
  "node": "https://www.classcentral.com/course/udemy-the-complete-nodejs-developer-course-2-25099", 
  "react": "https://www.classcentral.com/course/udemy-react-js-basics-to-advanced-24292", 
  "flask": "https://www.classcentral.com/course/udemy-flask-framework-complete-course-for-beginne-61523"
}
var universal_skill_list = ["python", "Java", "JavaScript", "git", "node", "react", "flask"]

const getCandidateSkills = async (email) => {
  if (!email) {
    console.log("Invalid Email");
  }
  else {
    let result = await fetch(
    'http://localhost:8000/server/db/get-candidate-info', {
        method: "post",
        body: JSON.stringify({ email }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    result = await result.json();
    console.warn(result);

    return result
    
  }
}
 
const skills_list = getCandidateSkills("shash@a2z.com")

var system_prompt = "You are a technical assessment assistant, you have to judge the new employee that has recently joined.\n"+
                  "1. These are the skills that candidate must know to apply for the role:"+universal_skill_list+                  
                  "2. You ask 2 questions to the user based on each skill he already knows from :CANDIDATE SKILL LIST:"+ skill_list +"\n"
                  "\t a. First one will be a basic question to know the experience of the candidate in the particular skill\n"+
                  "\t b. Second question would be a technical question based on the skill.\n"
                  "One the basis of the response of the user on the question, YOU have to rate the user from 1 to 10\n"+
                  "\ta. If the candidate has not done relevant projects and not answers the question rate him 1.\n"+
                  "\tb. If the candidate has some limited experience rate him 2-5, based on the level of experience.\n"+
                  "\tc. If the candidate has done projects elevant to the skill and doesn't answer the question rate him 6.\n"+
                  "\td. If the candidate has done projects relevant to the skill and also answers the question rate him 9.\n"          
                  "3. Also display this score to the candidate after each skill is evaluated.\n"+
                  "4. When the assesment is done, tell the candidate which skills does he need to learn from: " + universal_skills +" and also provide links for each of them.\n";


                  
const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
  "role": "system", "content": system_prompt
}

let flag = true

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm your onboarding buddy!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);

    if(message == "####"){
      flag = false;

      const RESP_JSON = {
        "python": "medium",
        "java": "beginner",
        "DSA": "advanced"
      }
      const SYSTEM_PROMPT_GENERATE_JSON = "On the basis of this message history:.\n"+
      "On the basis of Message History you have to generate a JSON where the keys are skills and values are the rating of the skills.\n"+
      "Here is a sample JSON for your reference:\n"+
      JSON.stringify(RESP_JSON)
      const jsonSystemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
        "role": "system", "content": SYSTEM_PROMPT_GENERATE_JSON
      }
      const apiRequestBody = {
        "model": "gpt-3.5-turbo",
        "messages": [
          jsonSystemMessage,  // The system message DEFINES the logic of our chatGPT
          ...apiMessages // The messages from our chat with ChatGPT
        ],
      }

      await fetch("https://api.openai.com/v1/chat/completions", 
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      }).then((data) => {
        return data.json();
      }).then((data) => {
        console.log(data);
      });

      setMessages([...newMessages, {
        message: "Bye Bye Nice Talking to you!",
        sender: "ChatGPT"
      }])
    }

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    if(flag){
      setIsTyping(true);
      await processMessageToChatGPT(newMessages);
    }
  };

  async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "system";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });


    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act. 
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // The system message DEFINES the logic of our chatGPT
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
    });
  }

  return (
    <div className="App">
      <div style={{ position:"relative", height: "800px", width: "700px"  }}>
        <MainContainer>
          <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="Onboarding buddy is typing" /> : null}
            >
              {messages.map((message, i) => {
                // console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Start typing..." onSend={handleSend} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
