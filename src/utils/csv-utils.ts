import { parse } from "papaparse";

export async function getCsv<T>(url: string) {
    const res = await fetch(url);
    const csv = await res.text();
    return new Promise<T[]>((resolve) => {
        parse(csv, {
            header: true,
            dynamicTyping: true,
            complete(result: any) {
                resolve(result.data);
            },
            skipEmptyLines: true
        });
    });
}
