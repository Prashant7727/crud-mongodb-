import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SignUp() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUser, setEditingUser] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:5000/users", { name, age })
      .then((response) => {
        console.log("User added:", response.data);
        setName("");
        setAge("");
      })
      .catch((error) => {
        console.log("Failed to add user", error);
      });
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/deleteData/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // handle success
        console.log("Data deleted successfully");
        setUsers(users.filter((item) => item._id !== id));
      } else {
        // handle error
        console.error("Failed to delete data");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const handleEditUser = async (user) => {
    setEditingUser(user);
    setEditingUserId(user._id);
  };

  const handleSaveUser = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/updateData/${editingUser._id}`,
        editingUser
      );
      if (response.status === 200) {
        console.log("User updated successfully");
        setEditingUser({});
        setEditingUserId(null);
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  useEffect(() => {
    axios
      .get("http://localhost:5000/getUsers")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <div>
        <h1>Add User</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              className="form-control mb-3"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <br />
          <label>
            Age:
            <input
              className="form-control"
              type="text"
              value={age}
              onChange={(event) => setAge(event.target.value)}
            />
          </label>
          <br />
          <button type="submit" className="btn btn-success">
            Add User
          </button>
        </form>
      </div>
      <div className="table-responsive">
        <table className="table  table-hover table-bordered table caption-top">
          <caption>List of users</caption>
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody className="">
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {editingUserId === user._id ? (
                    <input
                      className="form-control"
                      type="text"
                      value={editingUser.name}
                      onChange={(event) =>
                        setEditingUser({
                          ...editingUser,
                          name: event.target.value,
                        })
                      }
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUserId === user._id ? (
                    <input
                      className="form-control"
                      type="text"
                      value={editingUser.age}
                      onChange={(event) =>
                        setEditingUser({
                          ...editingUser,
                          age: event.target.value,
                        })
                      }
                    />
                  ) : (
                    user.age
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  {editingUserId === user._id ? (
                    <button onClick={handleSaveUser}>Save</button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
