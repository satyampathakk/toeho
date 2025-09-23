// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useUser } from "../components/UserContext";
import Login from "./Login";
import { LogOut, Star, Edit, Save, Upload, X } from "lucide-react";

export default function Profile() {
  const { user, loading, logout, updateUser } = useUser();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);

  // Sync form with user from context
  useEffect(() => {
    if (user) setForm(user);
  }, [user]);

  if (loading) return <div className="flex items-center justify-center h-full text-white"><p>Loading profile...</p></div>;
  if (!user) return <Login />;

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => setForm(prev => ({ ...prev, avatar: null }));

  const handleSave = async () => {
    const updated = await updateUser(form);
    if (updated) setEditing(false);
  };

  return (
    <div className="flex flex-col items-center justify-start h-full text-white">
      {/* Profile Card */}
      <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center w-full shadow mb-4">
        <div className="relative">
          <img src={form?.avatar || "https://i.pravatar.cc/150"} alt="Profile" className="w-24 h-24 rounded-full border-4 border-purple-500 mb-3 object-cover"/>
          {editing && form?.avatar && (
            <button onClick={handleRemoveImage} className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 rounded-full p-1 text-white">
              <X size={14}/>
            </button>
          )}
        </div>

        {editing && (
          <label className="cursor-pointer flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg text-sm mb-2 hover:bg-white/30">
            <Upload size={16}/> Upload
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload}/>
          </label>
        )}

        <h2 className="text-xl font-bold">{form?.name || user.name}</h2>

        {!editing ? (
          <p className="text-sm text-gray-300">{form?.classLevel || user.classLevel} · Level {form?.level || user.level}</p>
        ) : (
          <div className="space-y-2 w-full text-sm text-gray-800 mt-3">
            <label className="block">Class:
              <select name="classLevel" value={form.classLevel || ""} onChange={handleChange} className="w-full px-2 py-1 rounded mt-1">
                <option>Class 1</option><option>Class 2</option><option>Class 3</option>
                <option>Class 4</option><option>Class 5</option><option>Above Class 5</option>
              </select>
            </label>
            <label className="block">Level:
              <input type="number" name="level" value={form.level || ""} onChange={handleChange} className="w-full px-2 py-1 rounded mt-1"/>
            </label>
            <label className="block">Email:
              <input type="email" name="email" value={form.email || ""} onChange={handleChange} className="w-full px-2 py-1 rounded mt-1"/>
            </label>
            <label className="block">Age:
              <input type="number" name="age" value={form.age || ""} onChange={handleChange} className="w-full px-2 py-1 rounded mt-1"/>
            </label>
            <label className="block">School:
              <input type="text" name="school" value={form.school || ""} onChange={handleChange} className="w-full px-2 py-1 rounded mt-1"/>
            </label>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="bg-white/10 rounded-xl p-4 w-full shadow mb-4">
        <h3 className="font-semibold mb-2 flex items-center gap-2"><Star className="text-yellow-400"/> Progress</h3>
        <div className="flex justify-between text-sm">
          <span>Points: <b>250</b></span>
          <span>Level: <b>{form?.level || user.level}</b></span>
          <span>Stars: ⭐⭐⭐</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        {!editing ? (
          <button onClick={() => setEditing(true)} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2">
            <Edit size={18}/> Edit Profile
          </button>
        ) : (
          <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg flex items-center gap-2">
            <Save size={18}/> Save
          </button>
        )}
        <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2">
          <LogOut size={18}/> Logout
        </button>
      </div>
    </div>
  );
}
