class HashTable {
    #size
    #length
    #data

    constructor(length) {
        this.#data = new Array(length)
        this.#size = 0
        this.size = () => this.#size
        this.#length = length
        this.length = () => this.#length
    }

    size() {
        return this.#size
    }

    length() {
        return this.#length
    }

    #hash(str) {
        let value = 0
        let i = key.length
        while (i--)
            value += str.charCodeAt(i)
        return value % this.#length
    }

    set(key, value) {
        const index = this.#hash(key)
        const data = this.#data[index]
        if (data) {
            let i = this.#data[index].length
            while (i--) {
                if (data[i][0] === key) {
                    data[i][1] = value
                    return
                }
            }
            data.push([key, value])
        } else {
            this.#data[index] = [[key, value]]
        }
        this.size++
    }
  
    get(key) {
        const index = this.#hash(key)
        const data = this.#data[index]

        if (data) {
            let i = this.#length
            while (i--)
                if (data[i][0] === key)
                    return data[i][1]
        }
        return undefined
    }
  
    remove(key) {
        const index = this.#hash(key)
        const data = this.#data[index]

        if (!data || !data.length)
            return false
        
        let i = this.#length
        while (i--) {
            if (data[i][0] === key) {
                data.splice(i, 1)
                this.size--
                return true
            }
        }
    }
}