'use server'

import { ICategory } from "../../types/entities";
import { sendRequest } from "../../utils/api";

export const getCategories = async () => {
    const res = await sendRequest<IModelPaginate<ICategory>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/categories`,
    });
    if (!res?.data) {
        throw new Error(res.message);
    }
    return res;
};
