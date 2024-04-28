export type Data = Array<Record<string, string>>;

export type ApiResponse = {
    data: Data;
    message: string;
};

export type ApiSearchResponse = {
    data: Data;
};