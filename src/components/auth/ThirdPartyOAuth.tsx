"use client";

import { Google } from "@mui/icons-material";
import { sendRequest } from "../../../ultils/api";

const ThirdPartyOAuth = (props: any) => {
    const handleGoogle = async () => {
        window.location.href = `${process.env.NEXT_PUBLIC_SERVER}/auth/google`;

    };
    return (
        <div className="flex gap-10">
            <button onClick={handleGoogle}>
                <Google fontSize="large" />
            </button>
        </div>
    );
};

export default ThirdPartyOAuth
