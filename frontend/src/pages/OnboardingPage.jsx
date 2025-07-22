import { useState } from 'react';
import useAuthUser from '../hooks/useAuthUser.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { completeOnboarding } from '../lib/api.js';
import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from "lucide-react";
import { GENDER_OPTIONS, SEXUALITY_OPTIONS, LANGUAGES } from '../constants/index.js';

const OnboardingPage = () => {

  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: Array.isArray(authUser?.nativeLanguage) ? authUser.nativeLanguage.filter((lang) => lang && lang.trim() !== "") : [],
    age: authUser?.age || 0,
    gender: authUser?.gender || "",
    sexuality: authUser?.sexuality || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
    dob: authUser?.dob || "",
    hoobies: Array.isArray(authUser?.hoobies) ? authUser.hoobies : [],
  })

  const [hobbyInput, setHobbyInput] = useState("");

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    }
  })

  const handleDobChange = (e) => {
    const dob = e.target.value;
    const age = calculateAge(dob);
    setFormState({ ...formState, dob, age });
  };
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };


  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({...formState, profilePic: randomAvatar});
    toast.success("Avatar changed successfully");
  };

  const handleLangSelect = (lang) => {
    if (!formState.nativeLanguage.includes(lang)) {
      setFormState({
        ...formState,
        nativeLanguage: [...formState.nativeLanguage, lang],
      });
    }
  };
  const handleLangRemove = (lang) => {
    setFormState({
      ...formState,
      nativeLanguage: formState.nativeLanguage.filter((l) => l !== lang),
    });
  };

  const handleAddHobby = () => {
    const trimmed = hobbyInput.trim();
    if (!trimmed) {
      toast.error("Hobby cannot be empty.");
      return;
    }
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    const existing = formState.hoobies.map(h => h.toLowerCase());
    if (existing.includes(formatted.toLowerCase())) {
      toast.error("This hobby is already added.");
      return;
    }
    if (formState.hoobies.length >= 10) {
      toast.error("You can only add up to 10 hobbies.");
      return;
    }
    setFormState({ ...formState, hoobies: [...formState.hoobies, formatted] });
    setHobbyInput("");
  };
  const handleRemoveHobby = (hobby) => {
    setFormState({ ...formState, hoobies: formState.hoobies.filter((h) => h !== hobby) });
  };
  const handleHoobyKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddHobby();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
    toast.success("Onboarding Successfully..");
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <cameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                placeholder="Tell others about yourself and why are you here..."
                className="textarea textarea-bordered h-24"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Gender</span>
                </label>
                <select
                  name="gender"
                  value={formState.gender}
                  onChange={(e) => setFormState({ ...formState, gender: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="" disabled>Select Your Gender</option>
                  {GENDER_OPTIONS.map((gen) => (
                    <option key={`user-${gen}`} value={gen.toLowerCase()}>
                      {gen}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Sexuality</span>
                </label>
                <select
                  name="sexuality"
                  value={formState.sexuality}
                  onChange={(e) => setFormState({ ...formState, sexuality: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="" disabled>Select your Sexuality</option>
                  {SEXUALITY_OPTIONS.map((sex) => (
                    <option key={`user-${sex}`} value={sex.toLowerCase()}>
                      {sex}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Date of Birth</span>
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formState.dob}
                  onChange={handleDobChange}
                  className="input input-bordered w-full"
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Age</span>
                </label>
                <input
                  type="number"
                  value={formState.age}
                  readOnly
                  className="input input-bordered w-full bg-base-200"
                />
              </div>

            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Languages</span>
              </label>
              <select
                className="select select-bordered w-full"
                onChange={(e) => handleLangSelect(e.target.value)}
                value=""
              >
                <option value="" disabled hidden>
                  Add a language
                </option>
                {LANGUAGES.filter((lang) => !formState.nativeLanguage.includes(lang)).map(
                  (lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  )
                )}
              </select>
              <div className="flex flex-wrap gap-2 mt-2 p-2 border border-slate-700 rounded-md">
                {formState.nativeLanguage.length === 0 && (
                  <span className="text-gray-400">Select your preferred language(s)</span>
                )}
                {formState.nativeLanguage.map((lang) => (
                  <span
                    key={lang}
                    className="bg-black text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => handleLangRemove(lang)}
                      className="text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Hobbies and Likes</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hobbyInput}
                  onChange={(e) => setHobbyInput(e.target.value)}
                  onKeyDown={handleHoobyKeyDown}
                  className="input input-bordered w-full"
                  placeholder="Type your Hobbies and likes in the field and press Add"
                />
                <button
                  type="button"
                  onClick={handleAddHobby}
                  className="btn btn-accent"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 p-2 border border-slate-700 rounded-md">
                {formState.hoobies.length === 0 && (
                  <span className="text-gray-400">No Hobbies and Likes Added yet...</span>
                )}
                {formState.hoobies.map((hobby) => (
                  <span
                    key={hobby}
                    className="bg-black text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                  >
                    {hobby}
                    <button
                      type="button"
                      onClick={() => handleRemoveHobby(hobby)}
                      className="text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({...formState, location: e.target.value})}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, State, Country"
                />
              </div>
            </div>

            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
                {!isPending ? (
                  <>
                    <ShipWheelIcon className="size-5 mr-2" />
                    Complete Onboarding
                  </>
                ) : (
                  <>
                    <LoaderIcon className="animate-spin size-5 mr-2" />
                    Onboarding...
                  </>
                )}
            </button>

          </form>

        </div>
      </div>
    </div>
  )
}

export default OnboardingPage
