"use client";

import { Google } from "@mui/icons-material";
import { sendRequest } from "../../utils/api";
import { signIn } from "next-auth/react";

const ThirdPartyOAuth = (props: any) => {
    
    return (
        <div className="flex gap-10">
            <button onClick={() => signIn("google")}>
                <Google fontSize="large" />
            </button>
        </div>
    );
};

export default ThirdPartyOAuth
