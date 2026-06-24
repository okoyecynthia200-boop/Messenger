import { useEffect, useRef, useState } from "react";
import { FaCamera, FaEnvelope, FaPen } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import { apiRequest, setSession } from "../api";

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiRequest("/auth/me")
      .then((user) => {
        setProfile(user);
        setUsername(user.username || "");
        setAvatar(user.avatar || "");
      })
      .catch((error) => setStatus(error.message));
  }, []);

  const selectAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus("Choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setStatus("");
    setSaving(true);

    try {
      const updatedUser = await apiRequest("/users/me", {
        method: "PUT",
        body: JSON.stringify({ username, avatar }),
      });
      setSession({
        token: localStorage.getItem("chat_token"),
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
        },
      });
      setProfile(updatedUser);
      setStatus("Profile saved.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="profile-page">
      <header className="profile-header">
        <button className="profile-back" type="button" onClick={() => navigate("/chat")} aria-label="Back to chats">←</button>
        <h1>Profile</h1>
        <span aria-hidden="true" />
      </header>

      <form className="profile-content" onSubmit={saveProfile}>
        <div className="profile-avatar-wrap">
          {avatar ? <img className="profile-avatar" src={avatar} alt="Your profile" /> : <span className="profile-avatar blank-profile-avatar" />}
          <button className="avatar-edit" type="button" onClick={() => fileInputRef.current?.click()} aria-label="Choose profile picture"><FaCamera /></button>
          <input ref={fileInputRef} className="avatar-file-input" type="file" accept="image/*" onChange={selectAvatar} />
        </div>

        <section className="profile-details">
          <label className="profile-field profile-field-editable">
            <span>USERNAME</span>
            <div>
              <FaPen aria-hidden="true" />
              <input value={username} onChange={(event) => setUsername(event.target.value)} required />
            </div>
          </label>

          <div className="profile-field">
            <span>EMAIL ADDRESS</span>
            <div><FaEnvelope aria-hidden="true" /><strong>{profile?.email || "—"}</strong></div>
          </div>
        </section>

        <button className="profile-save" type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
        {status && <p className="profile-status" role="status">{status}</p>}
      </form>
    </main>
  );
}

export default Profile;
