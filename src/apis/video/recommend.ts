import {get} from "@/apis/http";
import { Data, RecommendRequest } from "@/apis/video/types";

export const getHomeVideoRecommendations = async (params: RecommendRequest) => {
  return await get<RecommendRequest, Data>("/x/web-interface/wbi/index/top/feed/rcmd", params);
}
