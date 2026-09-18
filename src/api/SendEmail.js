import React, { useState } from "react";
import api from "../api/AxiosConfig";

function SendEmail() {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSendEmail = async (e) => {

        e.preventDefault();

        if (!email) {
            setMessage("Please enter an email address");
            return;
        }

        try {

            const response = await api.post("/email/send", {
                email: email
            });

            setMessage(response.data);

            setEmail("");

        } catch (error) {

            console.error(error);

            setMessage(
                error.response?.data ||
                "Failed to send email"
            );
        }
    };

    return (
        <div>

            <h2>Send Test Email</h2>

            <form onSubmit={handleSendEmail}>

                <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button type="submit">
                    Send Email
                </button>

            </form>

            {message && (
                <p>{message}</p>
            )}

        </div>
    );
}

export default SendEmail;