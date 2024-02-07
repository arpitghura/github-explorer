import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const Repos = () => {
  const [username, setUsername] = useState("");
  const [similarUsers, SetSimilarUsers] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserData, setSelectedUserData] = useState({
    name: "",
    bio: "",
  });

  const [userRepo, setUserRepo] = useState([]);
  const [apiError, setApiError] = useState("");
  const [bookmarks, setBookmarks] = useState([]);

  const handleSearchUsername = (e) => {
    const currUsername = e.target.value;
    setUsername(currUsername);
  };

  useEffect(() => {
    const searchUserByUsername = async () => {
      const url = `https://api.github.com/search/users?q=`;
      const searchURI = url + username;

      try {
        const res = await fetch(searchURI);
        const data = await res.json();
        if (data.message) {
          throw data.message;
        }
        SetSimilarUsers(data.items);
      } catch (error) {
        console.log("Error Occured:", error);
        setApiError(error);
      }
    };
    searchUserByUsername();
  }, [username]);

  const handleUsernameClick = (login) => {
    setSelectedUser(login);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const uri = "https://api.github.com/users/";
      const fullURI = uri + selectedUser;
      try {
        const res = await fetch(fullURI);
        const data = await res.json();

        if (data.message) {
          throw data.message;
        }

        setSelectedUserData({ name: data.name, bio: data.bio });
      } catch (error) {
        console.log("Error Occured: ", error);
        setApiError(error);
      }
    };

    const fetchRepos = async () => {
      try {
        const uri = `https://api.github.com/users/${selectedUser}/repos`;
        const res = await fetch(uri);
        const data = await res.json();
        console.log({ data });
        if (data.message) {
          throw data.message;
        }
        setUserRepo(data);
      } catch (error) {
        console.log("Error Occured while fetching reps", error);
        setApiError(error);
      }
    };
    setApiError("");
    fetchUserData();
    fetchRepos();
  }, [selectedUser]);

  const handleBookmark = (repoId) => {
    setBookmarks((prev) => [...prev, repoId]);
  };

  useEffect(() => {
    localStorage.setItem("bookmarkRepo", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    try {
      const res = localStorage.getItem("bookmarkRepo");
      const bookmarkArr = JSON.parse(res);
      console.log({ bookmarkArr });
    } catch {
      localStorage.setItem("bookmarkRepo", JSON.stringify(bookmarks));
    }
  }, []);

  return (
    <div>
      {!selectedUser && (
        <div>
          <input
            type="text"
            value={username}
            placeholder="Search username"
            onChange={handleSearchUsername}
          />
          {similarUsers && (
            <ul id="autoCompleteUsernames">
              {similarUsers.map((user) => {
                return (
                  <li
                    key={user.login}
                    onClick={() => handleUsernameClick(user.login)}
                  >
                    <img
                      src={user.avatar_url}
                      alt={`user-${user.login} image`}
                      height="50"
                      width="50"
                    />{" "}
                    {user.login}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {selectedUser && (
        <div>
          <h1>{selectedUserData.name}</h1>
          <p>{selectedUserData.bio}</p>

          {userRepo && (
            <div className="repo">
              {userRepo?.map((rep) => {
                return (
                  <div>
                    <p>{rep.name}</p>
                    <button onClick={() => handleBookmark(rep.id)}>
                      Bookmark
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {apiError && (
        <div>
          <p>Error Occured: {apiError}</p>
        </div>
      )}
    </div>
  );
};

export default Repos;
