import { parse } from 'papaparse'
import { appConfig } from '../config'

/**
 * Fetches and parses a CSV file from a specified path,
 * returning the parsed data as an array of objects of type T.
 *
 * @template T The type of the parsed CSV data objects.
 * @param path The path to the CSV file.
 * @returns A promise with an array of objects of type T.
 * @throws If the fetch request fails, an error is thrown.
 */
export const getCsv = async <T>(path: string): Promise<T[]> => {
  const url = `${appConfig.BASE_URL}${path}`
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
