import { describe, expect, it } from "vitest"
import { normalizeString } from "./string-utils"

describe("normalizeString", () => {
    it("should remove spaces of beginning and end", () => {
        expect(normalizeString(" abc ")).toEqual("abc")
    })
    it("should normalize german characters", () => {
        expect(normalizeString("äöüßÄÖÜ")).toEqual("aoussaou")
    })
    it("should lower case", () => {
        expect(normalizeString("ABC")).toEqual("abc")
    })
})
