"use client";

import { Google } from "@mui/icons-material";
import { sendRequest } from "../../../ultils/api";

const ThirdPartyOAuth = (props: any) => {
    const handleGoogle = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_SERVER}/auth/google`,
            method: "POST",
        });
        return res;
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
