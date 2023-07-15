import { readFileSync, statSync, writeFileSync } from "node:fs";
import { isAbsolute } from "node:path";
import { Reader } from "../reader";
import { Event } from "./event";

export class EBM {
    static readonly EVENT_MESSAGE_TYPE = Buffer.from([0x02, 0x00, 0x00, 0x00]);
    static readonly EVENT_NOTIFICATION_TYPE = Buffer.from([0x03, 0x00, 0x00, 0x00]);

    private _events: Event[] = [];
    private _path: string;
    private _reader: Reader;
    private _length: number;

    constructor(path: string) {
        this._path = path;

        if(!isAbsolute(path))
            throw new Error("You must provided absolute path to EBM file");
        
        const stat = statSync(path);
        if(!stat.isFile())
            throw new Error("You must provided a EBM file");

        this._reader = new Reader(readFileSync(path));
        this._length = Math.abs(this._reader.consume(4).readInt32LE());
    }

    get events() {
        return this._events;
    }

    get path() {
        return this._path;
    }

    readEvent() {
        const type = this._reader.peek(this._reader.cursor, this._reader.cursor + 4);
        if(!type.equals(EBM.EVENT_MESSAGE_TYPE) && !type.equals(EBM.EVENT_NOTIFICATION_TYPE))
            throw new Error("Invalid event type was acknowledged");

        const header = this._reader.consume(60);
        const length = this._reader.consume(4);

        this._events.push(new Event(
            Buffer.concat([header, length]),
            this._reader.consume(length.readInt32LE()),
            this._reader.consume(8)
        ));
    }

    read() {
        if(!this._length || isNaN(this._length))
            throw new Error("Invalid length of events");

        for(let i = 0; i < this._length; i++)
            this.readEvent();
    }

    save(path: string) {
        const restOfBytes = this._reader.consume(this._reader.length);
        let eventsLength = 0; for(const event of this._events)
            eventsLength += event.length;

        const buf = Buffer.alloc(4 + eventsLength + restOfBytes.length);
        buf.writeInt32LE(this._length);

        let offset = 4; for(const event of this._events) {
            event.write(buf, offset);
            offset += event.length;
        }

        restOfBytes.copy(buf, offset);
        writeFileSync(path, buf);
    }
}