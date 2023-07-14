export class Reader {
    private _buffer: Buffer;
    private _cursor: number = 0;

    constructor(buffer: Buffer) {
        this._buffer = buffer;
    }

    get length() {
        return this._buffer.length - this._cursor;
    }

    get buffer() {
        return this._buffer;
    }

    get cursor() {
        return this._cursor;
    }

    peek(start: number, end: number) {
        if(start > end)
            return null;
        return this._buffer.subarray(start, end);
    }

    consume(n: number) {
        if (this._cursor + n > this._buffer.length)
            return null;

        const buffer = this._buffer.subarray(this._cursor, (this._cursor + n));
        this._cursor += n;

        return buffer;
    }
}