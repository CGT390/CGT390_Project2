"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./add-profile.css";

const stripTags = (s: string) => String(s ?? "").replace(/<\/?[^>]+>/g, "");
const trimCollapse = (s: string) =>
    String(s ?? "")
        .trim()
        .replace(/\s+/g, " ");

interface ProfileValues {
    name: string;
    title: string;
    email: string;
    bio: string;
    img: File | null;
    imgPreview: string;
}

interface AddProfileProps {
    existingProfile?: Partial<ProfileValues & { id?: number; image_url?: string }>;
}

export default function AddProfile({ existingProfile = {} }: AddProfileProps) {
    const router = useRouter();
    const nameRef = useRef<HTMLInputElement>(null);
    const isEditMode = Object.keys(existingProfile).length > 0;

    const [values, setValues] = useState<ProfileValues>({
        name: existingProfile.name ?? "",
        title: existingProfile.title ?? "",
        email: existingProfile.email ?? "",
        bio: existingProfile.bio ?? "",
        img: null,
        imgPreview: existingProfile.image_url ?? "",
    });
    const [errors, setErrors] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { name, title, email, bio, img, imgPreview } = values;

    useEffect(() => {
        if (nameRef.current) {
            nameRef.current.focus();
        }
    }, []);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "img") {
            const files = (e.target as HTMLInputElement).files;
            const file = files?.[0];
            if (file && file.size < 1024 * 1024) {
                setValues((prev) => ({ ...prev, img: file }));
                setErrors("");
            } else {
                setErrors("Image size should be less than 1MB");
            }
        } else {
            setValues((prev) => ({ ...prev, [name]: value }));
            setErrors("");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors("");

        try {
            const formData = new FormData();
            formData.append("name", stripTags(trimCollapse(name)));
            formData.append("title", stripTags(trimCollapse(title)));
            formData.append("email", stripTags(trimCollapse(email)));
            formData.append("bio", stripTags(bio).trim());

            if (img) {
                formData.append("img", img);
            } else if (imgPreview) {
                formData.append("image_url", imgPreview);
            }

            const endpoint = isEditMode ? `/api/profiles/${existingProfile.id}` : "/api/profiles";
            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(endpoint, {
                method,
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to submit form");
            }

            setSuccess(isEditMode ? "Profile updated successfully!" : "Profile added successfully!");

            if (!isEditMode) {
                setValues({
                    name: "",
                    title: "",
                    email: "",
                    bio: "",
                    img: null,
                    imgPreview: "",
                });
            }

            const fileInput = document.getElementById("img") as HTMLInputElement | null;
            if (fileInput) fileInput.value = "";

            setTimeout(() => {
                setSuccess("");
                router.push("/");
            }, 2000);
        } catch (error: any) {
            setErrors(error.message || "Failed to submit form");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main>
            <div className="section">
                <div className="container">
                    <h1>{isEditMode ? "Edit Profile" : "Add Profile"}</h1>
                    <div className="add-profile">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="name">Name:</label>
                            <input ref={nameRef} type="text" name="name" id="name" required value={name} onChange={onChange} />

                            <label htmlFor="title">Title:</label>
                            <input type="text" name="title" id="title" required value={title} onChange={onChange} />

                            <label htmlFor="email">Email:</label>
                            <input type="email" name="email" id="email" required value={email} onChange={onChange} />

                            <label htmlFor="bio">Bio:</label>
                            <textarea name="bio" id="bio" placeholder="Add Bio..." required value={bio} onChange={onChange}></textarea>

                            <label htmlFor="img">Image:</label>
                            <input
                                type="file"
                                name="img"
                                id="img"
                                required={!isEditMode}
                                accept="image/png, image/jpeg, image/jpg, image/gif"
                                onChange={onChange}
                            />

                            {imgPreview && (
                                <figure style={{ display: "flex", justifyContent: "center" }}>
                                    <img src={imgPreview} alt="Preview" style={{ maxWidth: "100%", height: "auto" }} />
                                </figure>
                            )}

                            {errors && <p className="error-message">{errors}</p>}

                            <button
                                type="submit"
                                disabled={
                                    isSubmitting ||
                                    !stripTags(trimCollapse(name)) ||
                                    !stripTags(trimCollapse(title)) ||
                                    !stripTags(trimCollapse(email)) ||
                                    !stripTags(bio).trim() ||
                                    (!img && !imgPreview)
                                }
                            >
                                {isSubmitting ? "Submitting..." : isEditMode ? "Update Profile" : "Add Profile"}
                            </button>

                            {success && <p className="success-message">{success}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}