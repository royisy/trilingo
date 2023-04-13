import { parse } from 'papaparse'

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
