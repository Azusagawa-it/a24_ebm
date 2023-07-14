export class Event {
    constructor(
        private _header: Buffer, 
        private _data: Buffer, 
        private _footer: Buffer
    ) {
        this._header = _header;
        this._data = _data;
        this._footer = _footer;
    }

    get header() {
        return this._header;
    }

    get data() {
        return this._data.toString("utf8");
    }

    get footer() {
        return this._footer;
    }

    get length() {
        const dataLength = Buffer.alloc(4);
        this._header.copy(dataLength, 0, 60);

        return (this._header.length + dataLength.readInt32LE() + this._footer.length);
    }

    writeEventText(text: string) {
        const length = Buffer.byteLength(text) + 1;
        this._header.writeInt32LE(length, (this._header.length - 4));
        this._data = Buffer.alloc(length);
        this._data.write(text);
    }

    write(dest: Buffer, offset?: number) {
        Buffer.concat([
            this._header, 
            this._data, 
            this._footer
        ]).copy(dest, offset);
    }

    clone() {
        return new Event(
            Buffer.concat([this._header]),
            Buffer.concat([this._data]),
            Buffer.concat([this._footer])
        )
    }
}