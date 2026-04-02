'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
    profileId: number;
}

export default function DeleteButton({ profileId }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this profile?")) {
            return;
        }
        setIsDeleting(true);
        setError("");
        try {
            // TODO: send a DELETE request to the profile API route
            const response = await fetch(
                `/api/profiles/${profileId}`,
                {
                    method: "DELETE",
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to delete profile");
            }
            // TODO: redirect the user back to the homepage after a successful delete

        } catch (err: any) {
            setError(err.message || "Failed to delete profile");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                style={{ backgroundColor: "red", color: "white", padding: "10px", border: "none", cursor: "pointer" }}
            >
                {isDeleting ? "Deleting..." : "Delete Profile"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}