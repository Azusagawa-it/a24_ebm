import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { EBM } from "./ebm";

const argv = process.argv.slice(2);
if(argv.includes("--extract-strings")) {
    const path = argv[argv.length - 1];
    const ebm = new EBM(path);
    ebm.read();

    const text = []; for(const event of ebm.events)
        text.push(event.data.slice(0, -1));

    writeFileSync(join(process.cwd(), "extracted-strings.txt"), text.join("\n"));
} else if(argv.includes("--replace-strings")) {
    const ebmFile = argv[argv.length - 2];
    const extractedStringsFile = argv[argv.length - 1];
    const ebm = new EBM(ebmFile);
    ebm.read();
    
    const lines = readFileSync(extractedStringsFile, "utf8").split("\n");
    for(let i = 0; i < lines.length; i++)
        ebm.events.at(i).writeEventText(lines.at(i));
    
    ebm.save(join(process.cwd(), "modified.ebm"));
}