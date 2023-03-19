import { parse } from 'papaparse'

export const getCsv = async <T>(url: string): Promise<T[]> => {
  const res = await fetch(url)
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