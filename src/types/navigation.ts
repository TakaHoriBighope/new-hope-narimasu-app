import { Channel } from "./channel";
import { type Info } from "./info";
import { type Post } from "./post";

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: { info: Info };
  Information: { info: Info };
  HomeStack: { info: Info };
  InfoCreate: undefined;
  InfoDetail: { info: Info };
  InfoEdit: { id: string };
  Share: undefined;
  ShareStack: undefined;
  ShareCreate: undefined;
  ShareDetail: { post: Post };
  ShareEdit: { id: string };
  Talking: undefined;
  TalkStack: undefined;
  Group: undefined;
  SelectGroup: undefined;
  User: undefined;
  AddMem: { channel: Channel };
  Settings: undefined;
  SettingStack: undefined;
};
