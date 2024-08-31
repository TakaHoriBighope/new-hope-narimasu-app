import "react-native-gesture-handler";
import React, { useState } from "react";
import { UserContext } from "./src/contexts/userContext";
import { InfosContext } from "./src/contexts/infosContext";
import { InfoContext } from "./src/contexts/infoContext";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { PostsContext } from "./src/contexts/postContext";
import { ChannelContext } from "./src/contexts/channelContext";
import { ChannelMemContext } from "./src/contexts/channelMemContext";
import { MessageContext } from "./src/contexts/messageContext";
import { UsersContext } from "./src/contexts/usersContext";
import { type User } from "./src/types/user";
import { type Info } from "./src/types/info";
import { type Post } from "./src/types/post";
import { type Channel } from "./src/types/channel";
import { type Message } from "./src/types/message";
import { LogBox } from "react-native";

export default function App() {
  const [users, setUsers] = useState<string[]>([]);
  const [user, setUser] = useState<User | null | undefined>();
  const [infos, setInfos] = useState<Info[]>([]);
  const [info, setInfo] = useState<Info | null | undefined>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [channel, setChannel] = useState<Channel | null>();
  const [channelMems, setChannelMems] = useState<string[]>([]);
  const [message, setMessage] = useState<Message | null | undefined>();
  LogBox.ignoreAllLogs();
  // const [infoReadCount, setInfoReadCount] = useState<number>(0);
  return (
    <UsersContext.Provider value={{ users, setUsers }}>
      <UserContext.Provider value={{ user, setUser }}>
        <MessageContext.Provider value={{ message, setMessage }}>
          <ChannelMemContext.Provider value={{ channelMems, setChannelMems }}>
            <ChannelContext.Provider value={{ channel, setChannel }}>
              <InfosContext.Provider value={{ infos, setInfos }}>
                <PostsContext.Provider value={{ posts, setPosts }}>
                  <InfoContext.Provider value={{ info, setInfo }}>
                    <AppNavigator />
                  </InfoContext.Provider>
                </PostsContext.Provider>
              </InfosContext.Provider>
            </ChannelContext.Provider>
          </ChannelMemContext.Provider>
        </MessageContext.Provider>
      </UserContext.Provider>
    </UsersContext.Provider>
  );
}
