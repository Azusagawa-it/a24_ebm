# a24_ebm
Simple tool for extracting/repacking text from Ryza 3 (A24) EBM files

## Usage
### Build:
```bash
npm i
npm run build
```

### Extracting Text:
```bash
node dist/index.js --extract-strings <ABSOLUTE_PATH_TO_EBM_FILE>
```

### Repacking Text:
```bash
node dist/index.js --replace-strings <ABSOLUTE_PATH_TO_EBM_FILE> <ABSOLUTE_PATH_TO_EXTRACTED_STRINGS_FILE>
```