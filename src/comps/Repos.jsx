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

  const [userReps, setUserReps] = useState([]);

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
        SetSimilarUsers(data.items);
      } catch {
        console.log("Error Occured");
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

      const res = await fetch(fullURI);
      const data = await res.json();

      setSelectedUserData({ name: data.name, bio: data.bio });
    };

    const fetchRepos = async () => {
      const uri = `https://api.github.com/users/${selectedUser}/repos`;

      try {
        const res = await fetch(uri);
        const data = await res.json();
        console.log(data);
        setUserReps(data);
      } catch {
        console.log("Error Occured while fetching reps");
      }
    };

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

          {userReps && (
            <div className="repo">
              {userReps?.map((rep) => {
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
    </div>
  );
};

export default Repos;
