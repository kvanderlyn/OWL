import { Router } from "express";
import {
      addFriend,
      findFriend,
      getFriendList,
      getPendingFriends,
      removeFriend,
      updateFriend,
} from "../handlers/friendsHanders";
import { validateIdInBody, validateNameQuery, validateUsernameQuery } from "../middleware/validator-functions";

const friendRouter = Router();

friendRouter.get("/", (_req, res) => {
      res.status(200).json({ status: "OK!" });
});
friendRouter.post("/add-friend", validateIdInBody(), addFriend);
friendRouter.get("/find-friends", validateNameQuery(), validateUsernameQuery(), findFriend);
friendRouter.get("/get-friends", getFriendList);
friendRouter.get("/get-friend-requests", getPendingFriends);
friendRouter.put("/update-friend-request", validateIdInBody(), updateFriend);
friendRouter.delete("/remove-friend", validateIdInBody(), removeFriend);

export default friendRouter;
