import { parse } from 'papaparse'

/**
 * Fetches and parses a CSV file from a URL,
 * returning the parsed data as an array of objects of type T.
 *
 * @template T The type of the parsed CSV data objects.
 * @param url The URL to fetch the CSV file from.
 * @returns A promise with an array of objects of type T.
 * @throws If the fetch request fails, an error is thrown.
 */
export const getCsv = async <T>(url: string): Promise<T[]> => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch CSV from ${url}: ${res.statusText}`)
  }
  const csv = await res.text()
  return await new Promise<T[]>((resolve) => {
    parse(csv, {
      header: true,
      dynamicTyping: true,
      complete(result: any) {
        resolve(result.data)
      },
      skipEmptyLines: true,
    })
  })
}
