import {get} from "@/apis/http";

export const getHomeVideoRecommendations = async () => {
  return get<Data>("/x/web-interface/wbi/index/top/feed/rcmd");
}
