export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: {
            meta: {
                page: number;
                take: number;
                itemCount: number;
                pageCount: number;
                hasPreviousPage: boolean;
                hasNextPage: boolean;
            };
            result: T[];
        };
    }

    interface ILogin {
        email: string;
        name: string;
        id: number;
        role?: string;
        access_token: string;
    }
}
