import { HubConnection } from "@microsoft/signalr";
import React from "react";

interface IChatProps {
  hubConnection?: HubConnection;
  username: string;
}

export const getTime = (): string => {
  return `
  ${new Date(Date.now()).getHours()} : ${new Date(Date.now()).getMinutes()}
  `;
};

export const Chat: React.FC<IChatProps> = ({ hubConnection, username }) => {
  const [currentMessage, setCurrentMessage] = React.useState("");
  const [messageList, setMessageList] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (hubConnection) {
      hubConnection.on("ReceiveMessage", (author, message) => {
        console.log("author:", author);
        console.log("message:", message);

        console.log("efect messageList:", messageList);

        setMessageList([
          ...messageList,
          {
            author: author,
            message: message,
            time: getTime(),
          },
        ]);

        console.log("efect2 messageList:", messageList);
      });
    }
  }, [hubConnection, messageList]);

  const sendMessage = async () => {
    if (currentMessage !== "" && hubConnection) {
      const messageData = {
        author: username,
        message: currentMessage,
        time: getTime(),
      };

      await hubConnection.invoke(
        "SendMessage",
        messageData.author,
        messageData.message
      );
      setMessageList([...messageList, messageData]);
      setCurrentMessage("");
      console.log("sendmesage messageList:", messageList);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <div className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username !== messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};
